import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AdminRole = Database['public']['Tables']['admin_roles']['Row'];

interface AdminAuthState {
  isAdmin: boolean;
  adminRole: AdminRole | null;
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
        const { data: adminRole, error } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          setAdminState({
            isAdmin: false,
            adminRole: null,
            isLoading: false,
            permissions: [],
          });
          return;
        }

        const isAdmin = !!adminRole;
        const permissions = adminRole?.permissions ? 
          Object.keys(adminRole.permissions).filter(key => adminRole.permissions[key] === true) : 
          [];

        setAdminState({
          isAdmin,
          adminRole,
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
    if (adminState.adminRole?.role === 'super_admin') return true;
    return adminState.permissions.includes(permission);
  };

  const isSuperAdmin = (): boolean => {
    return adminState.adminRole?.role === 'super_admin';
  };

  return {
    ...adminState,
    hasPermission,
    isSuperAdmin,
  };
};

export default useAdminAuth;
