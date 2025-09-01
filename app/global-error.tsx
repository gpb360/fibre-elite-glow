'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle,
  ExternalLink,
  Bug
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    // Log error for monitoring
    console.error('Global Error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }, [error]);

  const getErrorCategory = () => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'Network Error',
        description: 'There seems to be a connection issue. Please check your internet connection and try again.',
        suggestion: 'Check your internet connection'
      };
    }
    
    if (message.includes('chunk') || message.includes('loading')) {
      return {
        type: 'Loading Error',
        description: 'Some parts of the application failed to load. This might be due to a temporary issue.',
        suggestion: 'Refresh the page to reload all components'
      };
    }
    
    if (message.includes('timeout')) {
      return {
        type: 'Timeout Error',
        description: 'The request took too long to complete. This might be due to high server load.',
        suggestion: 'Wait a moment and try again'
      };
    }
    
    return {
      type: 'Application Error',
      description: 'An unexpected error occurred in the application. Our team has been notified.',
      suggestion: 'Try refreshing the page or contact support if the issue persists'
    };
  };

  const errorInfo = getErrorCategory();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon and Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <AlertTriangle className="h-20 w-20 text-red-500" />
                  <div className="absolute -bottom-2 -right-2 bg-red-100 rounded-full p-2">
                    <Bug className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              
              <h2 className="text-xl text-red-600 font-semibold mb-4">
                {errorInfo.type}
              </h2>
              
              <p className="text-gray-600 text-lg mb-2">
                {errorInfo.description}
              </p>
              
              <p className="text-sm text-gray-500 mb-8">
                💡 {errorInfo.suggestion}
              </p>
            </motion.div>

            {/* Error Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-white border-red-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Bug className="h-5 w-5 mr-2 text-red-500" />
                    Error Details
                  </h3>
                  
                  <div className="text-left space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Error Message:</p>
                      <code className="text-sm text-red-600 font-mono break-words">
                        {error.message}
                      </code>
                    </div>
                    
                    {error.digest && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Error ID:</p>
                        <code className="text-sm text-gray-800 font-mono">
                          {error.digest}
                        </code>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Time:</p>
                      <span className="text-sm text-gray-800">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button 
                onClick={reset} 
                size="lg" 
                className="flex items-center bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </Button>
              
              <Button variant="outline" size="lg" asChild className="flex items-center">
                <Link href="/">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
            </motion.div>

            {/* Help Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border-t pt-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                  <Link href="/contact">
                    <CardContent className="p-4 text-center">
                      <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Contact Support</p>
                      <p className="text-sm text-gray-600">Get help from our team</p>
                    </CardContent>
                  </Link>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <Link href="/faq">
                    <CardContent className="p-4 text-center">
                      <ExternalLink className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Help Center</p>
                      <p className="text-sm text-gray-600">Find answers to common questions</p>
                    </CardContent>
                  </Link>
                </Card>
              </div>
              
              <p className="text-sm text-gray-500">
                If this problem persists, please contact our support team with the error ID above.
              </p>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}