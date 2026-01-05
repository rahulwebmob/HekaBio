/**
 * Authorization Hook
 * Provides role-based access control utilities
 */

import { useAuth } from './useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../config/permissions';
import type { Permission } from '../config/permissions';
import type { UserRole } from '../types/auth.types';

export function useAuthorization() {
  const { user } = useAuth();

  /**
   * Check if current user has a specific permission
   */
  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  /**
   * Check if current user has ANY of the specified permissions
   */
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAnyPermission(user.role, permissions);
  };

  /**
   * Check if current user has ALL of the specified permissions
   */
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAllPermissions(user.role, permissions);
  };

  /**
   * Check if current user has one of the allowed roles
   */
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  /**
   * Check if current user is an admin (super_admin or crm_owner)
   */
  const isAdmin = (): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'crm_owner';
  };

  /**
   * Check if current user is a gate analyst (any gate level)
   */
  const isGateAnalyst = (): boolean => {
    if (!user) return false;
    return (
      user.role === 'gate_1_analyst' ||
      user.role === 'gate_2_analyst' ||
      user.role === 'gate_3_decision_maker'
    );
  };

  /**
   * Check if current user is a DD specialist (any type)
   */
  const isDDSpecialist = (): boolean => {
    if (!user) return false;
    return (
      user.role === 'dd_specialist_scientific' ||
      user.role === 'dd_specialist_regulatory' ||
      user.role === 'dd_specialist_commercial' ||
      user.role === 'dd_specialist_financial'
    );
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    hasRole,
    isAdmin,
    isGateAnalyst,
    isDDSpecialist,
    currentRole: user?.role || null,
  };
}
