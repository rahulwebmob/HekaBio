/**
 * Permissions Configuration
 * Defines what each role can do in the system
 */

import { UserRole } from '../types/auth.types';

export const Permission = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',

  // Innovations
  VIEW_INNOVATIONS: 'view_innovations',
  CREATE_INNOVATION: 'create_innovation',
  EDIT_OWN_INNOVATION: 'edit_own_innovation',
  EDIT_ANY_INNOVATION: 'edit_any_innovation',
  DELETE_INNOVATION: 'delete_innovation',

  // Evaluations
  VIEW_EVALUATIONS: 'view_evaluations',
  EVALUATE_GATE_1: 'evaluate_gate_1',
  EVALUATE_GATE_2: 'evaluate_gate_2',
  EVALUATE_GATE_3: 'evaluate_gate_3',
  CONDUCT_DUE_DILIGENCE: 'conduct_due_diligence',

  // Users
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',

  // Partners
  VIEW_PARTNERS: 'view_partners',
  CREATE_PARTNER: 'create_partner',
  EDIT_PARTNER: 'edit_partner',
  DELETE_PARTNER: 'delete_partner',

  // Reports
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',

  // Documents
  VIEW_DOCUMENTS: 'view_documents',
  UPLOAD_DOCUMENTS: 'upload_documents',
  DELETE_DOCUMENTS: 'delete_documents',

  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',

  // Admin
  ACCESS_ADMIN: 'access_admin',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

// Permission sets for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Super Admin has all permissions
    ...Object.values(Permission),
  ],

  [UserRole.CRM_OWNER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.EDIT_ANY_INNOVATION,
    Permission.DELETE_INNOVATION,
    Permission.VIEW_EVALUATIONS,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.VIEW_PARTNERS,
    Permission.CREATE_PARTNER,
    Permission.EDIT_PARTNER,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.VIEW_SETTINGS,
  ],

  [UserRole.GATE_1_ANALYST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.EVALUATE_GATE_1,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.GATE_2_ANALYST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.EVALUATE_GATE_2,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.GATE_3_DECISION_MAKER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.EVALUATE_GATE_3,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_DOCUMENTS,
  ],

  [UserRole.DD_SPECIALIST_SCIENTIFIC]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.CONDUCT_DUE_DILIGENCE,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.DD_SPECIALIST_REGULATORY]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.CONDUCT_DUE_DILIGENCE,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.DD_SPECIALIST_COMMERCIAL]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.CONDUCT_DUE_DILIGENCE,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.DD_SPECIALIST_FINANCIAL]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_EVALUATIONS,
    Permission.CONDUCT_DUE_DILIGENCE,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.PRODUCT_OWNER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.CREATE_INNOVATION,
    Permission.EDIT_OWN_INNOVATION,
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
  ],

  [UserRole.HOSPITAL_STAFF]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_DOCUMENTS,
  ],

  [UserRole.DISTRIBUTOR_STAFF]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_DOCUMENTS,
  ],

  [UserRole.LICENSE_HOLDER_STAFF]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_DOCUMENTS,
  ],

  [UserRole.MANUFACTURING_STAFF]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INNOVATIONS,
    Permission.VIEW_DOCUMENTS,
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Check if a role has ANY of the specified permissions
 */
export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has ALL of the specified permissions
 */
export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};
