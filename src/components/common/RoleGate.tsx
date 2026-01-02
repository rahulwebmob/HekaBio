/**
 * RoleGate Component
 * Conditional rendering based on user permissions
 */

import type { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission } from '../../config/permissions';

interface RoleGateProps {
  children: ReactNode;
  permissions?: Permission | Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export const RoleGate = ({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}: RoleGateProps) => {
  const { can, canAny, canAll } = usePermissions();

  if (!permissions) {
    // No permissions specified, show children
    return <>{children}</>;
  }

  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];

  const hasAccess = requireAll
    ? canAll(permissionArray)
    : Array.isArray(permissions)
    ? canAny(permissionArray)
    : can(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
