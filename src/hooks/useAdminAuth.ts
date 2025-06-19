
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminAuthState {
  isAdmin: boolean;
  adminRole: any | null;
  isLoading: boolean;
  permissions: string[];
}

export const useAdminAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [adminState, setAdminState] = useState<AdminAuthState>({
    isAdmin: false,
    adminRole: null,
    isLoading: true,
    permissions: [],
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        setAdminState({
          isAdmin: false,
          adminRole: null,
          isLoading: false,
          permissions: [],
        });
        return;
      }

      try {
        // For now, we'll just check if user exists and set them as admin
        // This should be replaced with proper admin role checking when admin_roles table is created
        const isAdmin = !!user;
        const permissions: string[] = [];

        setAdminState({
          isAdmin,
          adminRole: null,
          isLoading: false,
          permissions,
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminState({
          isAdmin: false,
          adminRole: null,
          isLoading: false,
          permissions: [],
        });
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  const hasPermission = (permission: string): boolean => {
    if (!adminState.isAdmin) return false;
    return adminState.permissions.includes(permission);
  };

  const isSuperAdmin = (): boolean => {
    return adminState.isAdmin; // Simplified for now
  };

  return {
    ...adminState,
    hasPermission,
    isSuperAdmin,
  };
};

export default useAdminAuth;
