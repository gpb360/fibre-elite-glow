'use client'

import React, { ErrorInfo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  eventId: string | null
  onRetry: () => void
  onReload: () => void
}

export function ErrorFallback({ 
  error, 
  errorInfo, 
  eventId, 
  onRetry, 
  onReload 
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Small delay
      onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  const getErrorMessage = (error: Error | null): string => {
    if (!error) return 'An unexpected error occurred'
    
    // Check for common error types and provide user-friendly messages
    if (error.message.includes('Network Error') || error.message.includes('fetch')) {
      return 'Unable to connect to our servers. Please check your internet connection and try again.'
    }
    
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'There was an issue loading part of the application. Please refresh the page.'
    }
    
    if (error.message.includes('Permission denied') || error.message.includes('Unauthorized')) {
      return 'You don\'t have permission to access this resource. Please log in and try again.'
    }
    
    if (error.message.includes('Not found') || error.message.includes('404')) {
      return 'The requested page or resource could not be found.'
    }
    
    // For other errors, provide a generic message
    return 'Something went wrong while loading this page. Our team has been notified.'
  }

  const getRecoveryActions = (error: Error | null) => {
    const actions = []
    
    // Always show retry option
    actions.push(
      <Button 
        key="retry"
        onClick={handleRetry} 
        disabled={isRetrying}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? 'Retrying...' : 'Try Again'}
      </Button>
    )
    
    // Show reload for chunk loading errors
    if (error?.message.includes('ChunkLoadError') || error?.message.includes('Loading chunk')) {
      actions.push(
        <Button 
          key="reload"
          onClick={onReload} 
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reload Page
        </Button>
      )
    }
    
    // Always show home link
    actions.push(
      <Button key="home" asChild variant="outline" className="gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </Button>
    )
    
    return actions
  }

  const copyErrorToClipboard = () => {
    const errorDetails = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      eventId,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }
    
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        // Could show a toast notification here
        console.log('Error details copied to clipboard')
      })
      .catch(() => {
        console.log('Failed to copy error details')
      })
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg">Oops! Something went wrong</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {getErrorMessage(error)}
          </p>
          
          {eventId && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm text-muted-foreground">
                Error ID: <code className="font-mono">{eventId}</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please include this ID when reporting the issue
              </p>
            </div>
          )}
          
          {/* Error details (collapsible) */}
          {(error || errorInfo) && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full gap-2 text-muted-foreground"
              >
                <Bug className="h-4 w-4" />
                Technical Details
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {showDetails && (
                <div className="rounded-lg bg-muted p-3 text-left">
                  <div className="space-y-2">
                    {error && (
                      <div>
                        <p className="font-mono text-xs font-semibold">Error Message:</p>
                        <p className="font-mono text-xs text-red-600 break-all">
                          {error.message}
                        </p>
                      </div>
                    )}
                    
                    {error?.stack && (
                      <div>
                        <p className="font-mono text-xs font-semibold">Stack Trace:</p>
                        <pre className="font-mono text-xs overflow-auto max-h-32 whitespace-pre-wrap break-all">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyErrorToClipboard}
                      className="w-full"
                    >
                      Copy Error Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {getRecoveryActions(error)}
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            If the problem persists, please{' '}
            <Link href="/contact" className="underline hover:text-foreground">
              contact support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}