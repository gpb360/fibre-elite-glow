import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Shield, AlertTriangle, Lock } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function AdminRoute({ children, requiredPermission, fallback }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, hasPermission } = useAdminAuth();
  const router = useRouter();

  // Show loading state while checking authentication and admin status
  if (authLoading || adminLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying Access</h3>
          <p className="text-gray-600 text-center">
            Checking your authentication and permissions...
          </p>
        </CardContent>
      </Card>
    );
  }

  // User not authenticated
  if (!user) {
    return fallback || (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Lock className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 text-center mb-4">
            You must be signed in to access this area.
          </p>
          <Button onClick={() => router.push('/auth')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  // User authenticated but not admin
  if (!isAdmin) {
    return fallback || (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 text-center mb-4">
            You don't have permission to access this admin area.
          </p>
          <Button variant="outline" onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Admin but lacks specific permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Insufficient Permissions</h3>
          <p className="text-gray-600 text-center mb-4">
            You don't have the required permission: <code className="bg-gray-100 px-2 py-1 rounded">{requiredPermission}</code>
          </p>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Return to Admin Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

export default AdminRoute;
