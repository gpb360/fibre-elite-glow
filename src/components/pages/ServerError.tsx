"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Server, 
  RefreshCw, 
  Home, 
  Clock,
  AlertTriangle,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ServerErrorProps {
  statusCode?: number;
  message?: string;
  hasGetInitialPropsRun?: boolean;
  retry?: () => void;
}

const ServerError: React.FC<ServerErrorProps> = ({ 
  statusCode = 500, 
  message,
  hasGetInitialPropsRun,
  retry 
}) => {
  const [retryCount, setRetryCount] = React.useState(0);
  const [timeUntilRetry, setTimeUntilRetry] = React.useState(0);

  React.useEffect(() => {
    // Log server error for monitoring
    console.error('Server Error:', {
      statusCode,
      message,
      hasGetInitialPropsRun,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }, [statusCode, message, hasGetInitialPropsRun]);

  React.useEffect(() => {
    if (timeUntilRetry > 0) {
      const timer = setTimeout(() => {
        setTimeUntilRetry(timeUntilRetry - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeUntilRetry]);

  const getErrorInfo = () => {
    switch (statusCode) {
      case 500:
        return {
          title: 'Internal Server Error',
          description: 'Something went wrong on our servers. We\'re working to fix this issue.',
          suggestion: 'Please try again in a few moments, or contact support if the problem persists.',
          color: 'red'
        };
      case 502:
        return {
          title: 'Bad Gateway',
          description: 'Our servers are temporarily unavailable due to maintenance or overload.',
          suggestion: 'This is usually temporary. Please try again in a few minutes.',
          color: 'orange'
        };
      case 503:
        return {
          title: 'Service Unavailable',
          description: 'Our service is temporarily unavailable. This might be due to scheduled maintenance.',
          suggestion: 'Please check back in a few minutes.',
          color: 'yellow'
        };
      case 504:
        return {
          title: 'Gateway Timeout',
          description: 'The server took too long to respond. This might be due to high traffic.',
          suggestion: 'Please wait a moment and try again.',
          color: 'blue'
        };
      default:
        return {
          title: 'Server Error',
          description: message || 'An unexpected server error occurred.',
          suggestion: 'Please try again or contact our support team.',
          color: 'red'
        };
    }
  };

  const errorInfo = getErrorInfo();

  const handleRetry = () => {
    if (retry) {
      setRetryCount(prev => prev + 1);
      setTimeUntilRetry(Math.min(30, Math.pow(2, retryCount))); // Exponential backoff, max 30s
      retry();
    } else {
      window.location.reload();
    }
  };

  const canRetry = retryCount < 3 && timeUntilRetry === 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-red-50 py-12" data-testid="server-error-main">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            {/* Error Icon and Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Server className={`h-20 w-20 text-${errorInfo.color}-500`} />
                  <div className="absolute -bottom-2 -right-2 bg-red-100 rounded-full p-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-400 mb-2" data-testid="error-code">
                {statusCode}
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {errorInfo.title}
              </h2>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                {errorInfo.description}
              </p>
              
              <p className="text-sm text-gray-500 mb-8">
                💡 {errorInfo.suggestion}
              </p>
            </motion.div>

            {/* Status and Retry Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              {retryCount > 0 && (
                <Card className="bg-blue-50 border-blue-200 mb-6">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-800">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Attempt {retryCount} of 3
                      {timeUntilRetry > 0 && (
                        <span className="ml-2">
                          • Next retry available in {timeUntilRetry}s
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                onClick={handleRetry}
                size="lg" 
                disabled={!canRetry}
                className="flex items-center"
                data-testid="retry-button"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${!canRetry && timeUntilRetry > 0 ? 'animate-spin' : ''}`} />
                {timeUntilRetry > 0 ? `Retry in ${timeUntilRetry}s` : 'Try Again'}
              </Button>
              
              <Button variant="outline" size="lg" asChild className="flex items-center">
                <Link href="/" data-testid="home-button">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={() => window.history.back()}
                className="flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </motion.div>

            {/* Server Status Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    What's happening?
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <h4 className="font-medium text-gray-800 mb-2">Possible causes:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Server maintenance or updates</li>
                        <li>• High traffic volume</li>
                        <li>• Temporary technical issues</li>
                        <li>• Database connectivity problems</li>
                      </ul>
                    </div>
                    
                    <div className="text-left">
                      <h4 className="font-medium text-gray-800 mb-2">What we're doing:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Monitoring server health</li>
                        <li>• Automatically scaling resources</li>
                        <li>• Investigating the issue</li>
                        <li>• Working on a solution</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Alternative Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <Card className="hover:shadow-md transition-shadow">
                <Link href="/products">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Browse Products</h3>
                    <p className="text-sm text-gray-600">Explore our fiber supplements</p>
                  </CardContent>
                </Link>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <Link href="/faq">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
                    <p className="text-sm text-gray-600">Find answers while we fix this</p>
                  </CardContent>
                </Link>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <Link href="/contact">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-sm text-gray-600">Report this issue to our team</p>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>

            {/* Footer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center border-t pt-6"
            >
              <p className="text-sm text-gray-500 mb-2">
                Error occurred at {new Date().toLocaleString()}
              </p>
              
              {statusCode >= 500 && statusCode < 600 && (
                <p className="text-xs text-gray-400">
                  Our technical team has been automatically notified of this issue.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServerError;