import { useState, useCallback } from 'react';

// Types for payment recovery
export interface PaymentTransaction {
  id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
  paymentIntentId?: string;
  customerId?: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface PaymentRecoveryResult {
  success: boolean;
  transaction?: PaymentTransaction;
  error?: string;
  requiresAction?: boolean;
  actionUrl?: string;
  nextSteps?: string[];
}

export interface TransactionVerificationResult {
  isValid: boolean;
  status: PaymentTransaction['status'];
  transaction?: PaymentTransaction;
  discrepancies?: string[];
  error?: string;
}

export interface PaymentRecoveryOptions {
  sessionId: string;
  customerEmail: string;
  expectedAmount: number;
  retryCount?: number;
  timeout?: number;
}

// Recovery status tracking
export interface RecoveryAttempt {
  timestamp: number;
  sessionId: string;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  error?: string;
  retryCount: number;
}

class PaymentRecoveryService {
  private static instance: PaymentRecoveryService;
  private recoveryAttempts: Map<string, RecoveryAttempt> = new Map();
  private verificationCache: Map<string, TransactionVerificationResult> = new Map();

  public static getInstance(): PaymentRecoveryService {
    if (!PaymentRecoveryService.instance) {
      PaymentRecoveryService.instance = new PaymentRecoveryService();
    }
    return PaymentRecoveryService.instance;
  }

  /**
   * Verify a transaction status and details
   */
  async verifyTransaction(
    sessionId: string,
    expectedAmount: number,
    customerEmail: string
  ): Promise<TransactionVerificationResult> {
    const cacheKey = `${sessionId}_${expectedAmount}_${customerEmail}`;
    
    // Check cache first (valid for 30 seconds)
    const cached = this.verificationCache.get(cacheKey);
    if (cached && Date.now() - (cached as any).timestamp < 30000) {
      return cached;
    }

    try {
      console.log('🔍 Verifying transaction:', { sessionId, expectedAmount, customerEmail });
      
      const response = await fetch(`/api/verify-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          expectedAmount,
          customerEmail,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Verification failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      const result: TransactionVerificationResult = {
        isValid: data.isValid,
        status: data.status,
        transaction: data.transaction,
        discrepancies: data.discrepancies || [],
        error: data.error
      };

      // Cache the result
      (result as any).timestamp = Date.now();
      this.verificationCache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('❌ Transaction verification error:', error);
      return {
        isValid: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  /**
   * Attempt to recover a failed payment
   */
  async recoverPayment(options: PaymentRecoveryOptions): Promise<PaymentRecoveryResult> {
    const { sessionId, customerEmail, expectedAmount, retryCount = 0, timeout = 30000 } = options;
    
    // Track recovery attempt
    const attemptKey = `${sessionId}_${Date.now()}`;
    this.recoveryAttempts.set(attemptKey, {
      timestamp: Date.now(),
      sessionId,
      status: 'started',
      retryCount
    });

    try {
      console.log('🔄 Starting payment recovery:', options);

      // First, verify the current transaction status
      const verification = await this.verifyTransaction(sessionId, expectedAmount, customerEmail);
      
      if (!verification.isValid) {
        throw new Error(verification.error || 'Transaction verification failed');
      }

      // If transaction is already succeeded, no recovery needed
      if (verification.status === 'succeeded') {
        this.updateRecoveryAttempt(attemptKey, 'completed');
        return {
          success: true,
          transaction: verification.transaction,
          nextSteps: ['Transaction already completed successfully']
        };
      }

      // Update attempt status
      this.updateRecoveryAttempt(attemptKey, 'in_progress');

      // Attempt recovery based on transaction status
      const response = await Promise.race([
        fetch('/api/recover-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            customerEmail,
            expectedAmount,
            currentStatus: verification.status,
            retryCount,
            timestamp: Date.now()
          })
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Recovery timeout')), timeout)
        )
      ]);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Recovery failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      this.updateRecoveryAttempt(attemptKey, data.success ? 'completed' : 'failed', data.error);

      return {
        success: data.success,
        transaction: data.transaction,
        error: data.error,
        requiresAction: data.requiresAction,
        actionUrl: data.actionUrl,
        nextSteps: data.nextSteps || []
      };

    } catch (error) {
      console.error('❌ Payment recovery error:', error);
      this.updateRecoveryAttempt(attemptKey, 'failed', error instanceof Error ? error.message : 'Unknown error');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Recovery failed',
        nextSteps: [
          'Contact customer support for assistance',
          'Try using a different payment method',
          'Check with your bank if the transaction was processed'
        ]
      };
    }
  }

  /**
   * Get recovery attempt history for a session
   */
  getRecoveryHistory(sessionId: string): RecoveryAttempt[] {
    return Array.from(this.recoveryAttempts.values())
      .filter(attempt => attempt.sessionId === sessionId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Check if recovery is in progress for a session
   */
  isRecoveryInProgress(sessionId: string): boolean {
    return Array.from(this.recoveryAttempts.values())
      .some(attempt => 
        attempt.sessionId === sessionId && 
        (attempt.status === 'started' || attempt.status === 'in_progress') &&
        Date.now() - attempt.timestamp < 60000 // Within last minute
      );
  }

  private updateRecoveryAttempt(attemptKey: string, status: RecoveryAttempt['status'], error?: string) {
    const attempt = this.recoveryAttempts.get(attemptKey);
    if (attempt) {
      attempt.status = status;
      if (error) {
        attempt.error = error;
      }
      this.recoveryAttempts.set(attemptKey, attempt);
    }
  }

  /**
   * Clear old recovery attempts and verification cache
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    // Clear old recovery attempts
    for (const [key, attempt] of this.recoveryAttempts.entries()) {
      if (now - attempt.timestamp > maxAge) {
        this.recoveryAttempts.delete(key);
      }
    }

    // Clear old verification cache
    for (const [key, result] of this.verificationCache.entries()) {
      if (now - (result as any).timestamp > 300000) { // 5 minutes
        this.verificationCache.delete(key);
      }
    }
  }
}

// React hooks for payment recovery
export function usePaymentRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<PaymentRecoveryResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<TransactionVerificationResult | null>(null);

  const recoveryService = PaymentRecoveryService.getInstance();

  const recoverPayment = useCallback(async (options: PaymentRecoveryOptions) => {
    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      const result = await recoveryService.recoverPayment(options);
      setRecoveryResult(result);
      return result;
    } catch (error) {
      const errorResult: PaymentRecoveryResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Recovery failed'
      };
      setRecoveryResult(errorResult);
      return errorResult;
    } finally {
      setIsRecovering(false);
    }
  }, [recoveryService]);

  const verifyTransaction = useCallback(async (
    sessionId: string,
    expectedAmount: number,
    customerEmail: string
  ) => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await recoveryService.verifyTransaction(sessionId, expectedAmount, customerEmail);
      setVerificationResult(result);
      return result;
    } catch (error) {
      const errorResult: TransactionVerificationResult = {
        isValid: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Verification failed'
      };
      setVerificationResult(errorResult);
      return errorResult;
    } finally {
      setIsVerifying(false);
    }
  }, [recoveryService]);

  const getRecoveryHistory = useCallback((sessionId: string) => {
    return recoveryService.getRecoveryHistory(sessionId);
  }, [recoveryService]);

  const isRecoveryInProgress = useCallback((sessionId: string) => {
    return recoveryService.isRecoveryInProgress(sessionId);
  }, [recoveryService]);

  return {
    recoverPayment,
    verifyTransaction,
    getRecoveryHistory,
    isRecoveryInProgress,
    isRecovering,
    recoveryResult,
    isVerifying,
    verificationResult,
    clearResults: useCallback(() => {
      setRecoveryResult(null);
      setVerificationResult(null);
    }, [])
  };
}

// Utility functions
export const PaymentRecoveryUtils = {
  /**
   * Determine if a payment status indicates failure
   */
  isPaymentFailed: (status: PaymentTransaction['status']): boolean => {
    return ['failed', 'canceled'].includes(status);
  },

  /**
   * Determine if a payment requires user action
   */
  requiresUserAction: (status: PaymentTransaction['status']): boolean => {
    return status === 'requires_action';
  },

  /**
   * Get user-friendly status message
   */
  getStatusMessage: (status: PaymentTransaction['status']): string => {
    switch (status) {
      case 'pending':
        return 'Payment is being processed';
      case 'succeeded':
        return 'Payment completed successfully';
      case 'failed':
        return 'Payment failed';
      case 'canceled':
        return 'Payment was canceled';
      case 'requires_action':
        return 'Additional verification required';
      default:
        return 'Unknown payment status';
    }
  },

  /**
   * Get recommended next steps based on status
   */
  getNextSteps: (status: PaymentTransaction['status']): string[] => {
    switch (status) {
      case 'failed':
        return [
          'Try a different payment method',
          'Check your card details',
          'Contact your bank',
          'Contact customer support'
        ];
      case 'canceled':
        return [
          'Return to checkout to try again',
          'Use a different payment method',
          'Contact support if you need help'
        ];
      case 'requires_action':
        return [
          'Complete the required verification',
          'Check your bank app or SMS',
          'Contact your bank if needed'
        ];
      case 'pending':
        return [
          'Please wait for processing to complete',
          'Do not close this page',
          'Contact support if this takes too long'
        ];
      default:
        return ['Contact customer support for assistance'];
    }
  }
};

export default PaymentRecoveryService;