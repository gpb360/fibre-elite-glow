import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Shield,
  CreditCard,
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { usePaymentRecovery, PaymentRecoveryUtils } from '@/lib/payment-recovery';
import Link from 'next/link';

interface PaymentRecoveryDialogProps {
  sessionId: string;
  customerEmail: string;
  expectedAmount: number;
  initialStatus?: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
  onRecoveryComplete?: (success: boolean, transaction?: any) => void;
  onClose?: () => void;
}

export function PaymentRecoveryDialog({
  sessionId,
  customerEmail, 
  expectedAmount,
  initialStatus = 'failed',
  onRecoveryComplete,
  onClose
}: PaymentRecoveryDialogProps) {
  const {
    recoverPayment,
    verifyTransaction,
    getRecoveryHistory,
    isRecoveryInProgress,
    isRecovering,
    recoveryResult,
    isVerifying,
    verificationResult,
    clearResults
  } = usePaymentRecovery();

  const [currentStep, setCurrentStep] = useState<'verify' | 'recover' | 'complete'>('verify');
  const [retryCount, setRetryCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // Auto-verify on mount
  useEffect(() => {
    if (sessionId && customerEmail && expectedAmount > 0) {
      handleVerifyTransaction();
    }
  }, [sessionId, customerEmail, expectedAmount]);

  const handleVerifyTransaction = async () => {
    try {
      const result = await verifyTransaction(sessionId, expectedAmount, customerEmail);
      
      if (result.isValid && result.status === 'succeeded') {
        setCurrentStep('complete');
        onRecoveryComplete?.(true, result.transaction);
      } else if (result.isValid && PaymentRecoveryUtils.isPaymentFailed(result.status)) {
        setCurrentStep('recover');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleRecoverPayment = async () => {
    try {
      const result = await recoverPayment({
        sessionId,
        customerEmail,
        expectedAmount,
        retryCount
      });

      setRetryCount(prev => prev + 1);

      if (result.success) {
        setCurrentStep('complete');
        onRecoveryComplete?.(true, result.transaction);
      } else if (result.requiresAction && result.actionUrl) {
        // Open action URL in new tab
        window.open(result.actionUrl, '_blank');
      }
    } catch (error) {
      console.error('Recovery failed:', error);
    }
  };

  const handleRetry = () => {
    clearResults();
    setCurrentStep('verify');
    handleVerifyTransaction();
  };

  const recoveryHistory = getRecoveryHistory(sessionId);
  const isInProgress = isRecoveryInProgress(sessionId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'requires_action':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'requires_action':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Recovery
        </h2>
        <p className="text-gray-600">
          We're helping you recover your payment and complete your order
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 ${currentStep === 'verify' ? 'text-blue-600' : currentStep === 'recover' || currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'verify' ? 'bg-blue-100' : currentStep === 'recover' || currentStep === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {currentStep === 'verify' && isVerifying ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <span className="text-sm font-medium">1</span>
            )}
          </div>
          <span className="text-sm font-medium">Verify</span>
        </div>
        
        <ArrowRight className="h-4 w-4 text-gray-400" />
        
        <div className={`flex items-center space-x-2 ${currentStep === 'recover' ? 'text-blue-600' : currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'recover' ? 'bg-blue-100' : currentStep === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {currentStep === 'recover' && isRecovering ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <span className="text-sm font-medium">2</span>
            )}
          </div>
          <span className="text-sm font-medium">Recover</span>
        </div>
        
        <ArrowRight className="h-4 w-4 text-gray-400" />
        
        <div className={`flex items-center space-x-2 ${currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {currentStep === 'complete' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="text-sm font-medium">3</span>
            )}
          </div>
          <span className="text-sm font-medium">Complete</span>
        </div>
      </div>

      {/* Verification Step */}
      {currentStep === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verifying Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isVerifying ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Verifying your payment status...</p>
              </div>
            ) : verificationResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Transaction Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationResult.status)}
                    <Badge className={getStatusColor(verificationResult.status)}>
                      {PaymentRecoveryUtils.getStatusMessage(verificationResult.status)}
                    </Badge>
                  </div>
                </div>
                
                {verificationResult.discrepancies && verificationResult.discrepancies.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Issues found:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {verificationResult.discrepancies.map((issue, index) => (
                          <li key={index} className="text-sm">{issue}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {verificationResult.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{verificationResult.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Button onClick={handleVerifyTransaction} disabled={isVerifying}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Verification
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recovery Step */}
      {currentStep === 'recover' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Payment Recovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recoveryResult && (
              <div className="space-y-4">
                {recoveryResult.success ? (
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Payment recovery successful! Your order has been completed.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {recoveryResult.error || 'Payment recovery failed'}
                    </AlertDescription>
                  </Alert>
                )}

                {recoveryResult.requiresAction && recoveryResult.actionUrl && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>Additional verification is required to complete your payment.</p>
                        <Button size="sm" asChild>
                          <a href={recoveryResult.actionUrl} target="_blank" rel="noopener noreferrer">
                            Complete Verification
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {recoveryResult.nextSteps && recoveryResult.nextSteps.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Next Steps:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {recoveryResult.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleRecoverPayment} 
                disabled={isRecovering || isInProgress}
                className="flex-1"
              >
                {isRecovering ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isRecovering ? 'Recovering...' : `Attempt Recovery ${retryCount > 0 ? `(${retryCount + 1})` : ''}`}
              </Button>
              
              <Button variant="outline" onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {currentStep === 'complete' && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Recovery Complete!
            </h3>
            <p className="text-green-800 mb-4">
              Your payment has been successfully recovered and your order is complete.
            </p>
            <div className="flex justify-center gap-2">
              <Button asChild>
                <Link href="/account/orders">
                  View Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery History */}
      {recoveryHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recovery History
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
            </CardTitle>
          </CardHeader>
          {showHistory && (
            <CardContent>
              <div className="space-y-2">
                {recoveryHistory.map((attempt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attempt.status)}
                      <span className="text-sm font-medium capitalize">{attempt.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </div>
                      {attempt.error && (
                        <div className="text-xs text-red-600">{attempt.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            If the automatic recovery doesn't work, our support team is here to help.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/cart">Return to Cart</Link>
            </Button>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Session ID:</strong> {sessionId.substring(0, 20)}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentRecoveryDialog;