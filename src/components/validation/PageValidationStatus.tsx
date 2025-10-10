"use client";

import React from 'react';
import { usePageValidation, PageValidationResult } from '@/lib/page-validator';
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface PageValidationStatusProps {
  pageType: string;
  showDetails?: boolean;
  onValidationComplete?: (result: PageValidationResult) => void;
}

export function PageValidationStatus({ 
  pageType, 
  showDetails = false, 
  onValidationComplete 
}: PageValidationStatusProps) {
  const { result, isValidating, validate } = usePageValidation(pageType);

  React.useEffect(() => {
    if (result && onValidationComplete) {
      onValidationComplete(result);
    }
  }, [result, onValidationComplete]);

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (isValidating) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">Validating page...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const criticalErrors = result.errors.filter(e => e.severity === 'critical' || e.severity === 'high');
  const hasIssues = !result.isValid || criticalErrors.length > 0;

  return (
    <div className={`fixed bottom-4 right-4 rounded-lg p-3 shadow-lg z-50 max-w-md ${
      hasIssues ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
    }`}>
      <div className="flex items-start space-x-2">
        {hasIssues ? (
          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              hasIssues ? 'text-red-700' : 'text-green-700'
            }`}>
              {hasIssues ? 'Page Issues Detected' : 'Page Valid'}
            </span>
            
            <button
              onClick={validate}
              className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Re-validate page"
            >
              <RefreshCw className="h-3 w-3 text-gray-600" />
            </button>
          </div>
          
          <div className={`text-xs mt-1 ${
            hasIssues ? 'text-red-600' : 'text-green-600'
          }`}>
            Load time: {Math.round(result.loadTime)}ms
          </div>

          {hasIssues && (
            <div className="mt-2 space-y-1">
              {result.missingElements.length > 0 && (
                <div className="text-xs text-red-600">
                  Missing: {result.missingElements.length} elements
                </div>
              )}
              
              {criticalErrors.length > 0 && (
                <div className="text-xs text-red-600">
                  Critical: {criticalErrors.length} errors
                </div>
              )}
            </div>
          )}

          {showDetails && hasIssues && (
            <details className="mt-2">
              <summary className="text-xs text-red-700 cursor-pointer hover:text-red-800">
                Show Details
              </summary>
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="text-xs">
                    <span className={`inline-block w-16 ${
                      error.severity === 'critical' ? 'text-red-700' :
                      error.severity === 'high' ? 'text-orange-700' :
                      error.severity === 'medium' ? 'text-yellow-700' :
                      'text-gray-700'
                    }`}>
                      {error.severity}:
                    </span>
                    <span className="text-red-600">{error.error}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for monitoring page validation across the app
export function usePageValidationMonitoring() {
  const [validationHistory, setValidationHistory] = React.useState<
    Map<string, PageValidationResult>
  >(new Map());

  const recordValidation = React.useCallback((pageType: string, result: PageValidationResult) => {
    setValidationHistory(prev => {
      const updated = new Map(prev);
      updated.set(pageType, result);
      return updated;
    });
  }, []);

  const getPageHealth = React.useCallback((pageType: string) => {
    const result = validationHistory.get(pageType);
    if (!result) return 'unknown';
    
    const criticalErrors = result.errors.filter(e => e.severity === 'critical' || e.severity === 'high');
    if (criticalErrors.length > 0) return 'critical';
    if (!result.isValid) return 'warning';
    return 'healthy';
  }, [validationHistory]);

  const getAllPageHealth = React.useCallback(() => {
    const health: Record<string, string> = {};
    validationHistory.forEach((result, pageType) => {
      health[pageType] = getPageHealth(pageType);
    });
    return health;
  }, [validationHistory, getPageHealth]);

  return {
    validationHistory,
    recordValidation,
    getPageHealth,
    getAllPageHealth,
  };
}

// Component for showing overall app health status
export function AppHealthStatus() {
  const { getAllPageHealth } = usePageValidationMonitoring();
  
  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const health = getAllPageHealth();
  const healthEntries = Object.entries(health);
  
  if (healthEntries.length === 0) {
    return null;
  }

  const criticalCount = healthEntries.filter(([, status]) => status === 'critical').length;
  const warningCount = healthEntries.filter(([, status]) => status === 'warning').length;
  const healthyCount = healthEntries.filter(([, status]) => status === 'healthy').length;

  const overallStatus = criticalCount > 0 ? 'critical' : 
                       warningCount > 0 ? 'warning' : 'healthy';

  return (
    <div className={`fixed top-4 right-4 rounded-lg p-2 shadow-lg z-50 ${
      overallStatus === 'critical' ? 'bg-red-100 border border-red-300' :
      overallStatus === 'warning' ? 'bg-yellow-100 border border-yellow-300' :
      'bg-green-100 border border-green-300'
    }`}>
      <div className="flex items-center space-x-2">
        {overallStatus === 'critical' ? (
          <AlertTriangle className="h-4 w-4 text-red-600" />
        ) : overallStatus === 'warning' ? (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-600" />
        )}
        
        <span className={`text-xs font-medium ${
          overallStatus === 'critical' ? 'text-red-700' :
          overallStatus === 'warning' ? 'text-yellow-700' :
          'text-green-700'
        }`}>
          App Health
        </span>
        
        <div className="text-xs space-x-1">
          {healthyCount > 0 && (
            <span className="text-green-600">{healthyCount}✓</span>
          )}
          {warningCount > 0 && (
            <span className="text-yellow-600">{warningCount}⚠</span>
          )}
          {criticalCount > 0 && (
            <span className="text-red-600">{criticalCount}✗</span>
          )}
        </div>
      </div>
    </div>
  );
}