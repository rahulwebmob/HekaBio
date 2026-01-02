/**
 * usePermissions Hook
 * Provides permission checking functionality based on current user's role
 */

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions, rolePermissions } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user?.role) return [];
    return rolePermissions[user.role] || [];
  }, [user?.role]);

  const can = (permission: Permission): boolean => {
    if (!user?.role) return false;
    return hasPermission(user.role, permission);
  };

  const canAny = (permissionList: Permission[]): boolean => {
    if (!user?.role) return false;
    return hasAnyPermission(user.role, permissionList);
  };

  const canAll = (permissionList: Permission[]): boolean => {
    if (!user?.role) return false;
    return hasAllPermissions(user.role, permissionList);
  };

  return {
    permissions,
    can,
    canAny,
    canAll,
  };
};
