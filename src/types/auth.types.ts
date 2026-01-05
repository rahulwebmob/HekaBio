/**
 * Authentication & Authorization Types
 */

import type { ID, Timestamp, Email } from './common.types';

// ===== User Roles =====
// Simplified role structure for new workflow
export const UserRole = {
  // System Admin
  SUPER_ADMIN: 'super_admin',

  // Core Business Roles
  CRM_OWNER: 'crm_owner', // Full access to all features
  ANALYST: 'analyst', // Can perform screening, internal review, DD
  DD_SPECIALIST: 'dd_specialist', // Due diligence specialist
  VIEWER: 'viewer', // Read-only access

  // Product/Company Representatives
  PRODUCT_OWNER: 'product_owner', // External company representative
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ===== Role Labels (for display) =====
export const RoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrator',
  [UserRole.CRM_OWNER]: 'CRM Owner',
  [UserRole.ANALYST]: 'Analyst',
  [UserRole.DD_SPECIALIST]: 'Due Diligence Specialist',
  [UserRole.VIEWER]: 'Viewer',
  [UserRole.PRODUCT_OWNER]: 'Product Owner / Innovator',
};

// ===== User Interface =====
export interface User {
  id: ID;
  email: Email;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  organization?: string;
  department?: string;
}

// ===== Auth State =====
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== Login Credentials =====
export interface LoginCredentials {
  email: Email;
  password: string;
  remember?: boolean;
}

// ===== Registration Data =====
export interface RegistrationData {
  email: Email;
  password: string;
  firstName: string;
  lastName: string;
  organization: string;
  phone?: string;
}

// ===== Auth Response =====
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

// ===== Permission Resources =====
export type PermissionResource =
  // Phase 1 Resources
  | 'projects'
  | 'companies'
  | 'contacts'
  | 'surveys'
  | 'lead_scoring'
  | 'japan_screening'
  | 'nda'
  | 'due_diligence'
  | 'contracts'
  | 'communications'
  | 'tasks'
  | 'dashboard'
  // Phase 2 Resources
  | 'orders'
  | 'manufacturing'
  | 'transportation'
  | 'inventory'
  | 'collection'
  | 'documents'
  | 'reports'
  // Admin
  | 'users'
  | 'settings';

// ===== Permission Action =====
export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve_gate_1'
  | 'approve_gate_2'
  | 'approve_gate_3'
  | 'review_dd'
  | 'sign_nda'
  | 'manage_users'
  | 'configure_system';

// ===== Permission Matrix =====
export type PermissionMatrix = Record<
  UserRole,
  Partial<Record<PermissionResource, PermissionAction[]>>
>;

// Simplified permission structure for new workflow:
export const defaultPermissions: PermissionMatrix = {
  [UserRole.SUPER_ADMIN]: {
    projects: ['view', 'create', 'edit', 'delete'],
    companies: ['view', 'create', 'edit', 'delete'],
    contacts: ['view', 'create', 'edit', 'delete'],
    surveys: ['view', 'create', 'edit', 'delete'],
    lead_scoring: ['view', 'edit', 'configure_system'],
    japan_screening: ['view', 'create', 'edit'],
    due_diligence: ['view', 'edit', 'review_dd'],
    contracts: ['view', 'create', 'edit', 'delete'],
    nda: ['view', 'create', 'edit', 'sign_nda'],
    documents: ['view', 'create', 'edit', 'delete'],
    users: ['view', 'create', 'edit', 'delete', 'manage_users'],
    settings: ['view', 'edit', 'configure_system'],
    dashboard: ['view'],
  },
  [UserRole.CRM_OWNER]: {
    projects: ['view', 'create', 'edit', 'delete'],
    companies: ['view', 'create', 'edit', 'delete'],
    contacts: ['view', 'create', 'edit', 'delete'],
    surveys: ['view', 'create', 'edit', 'delete'],
    lead_scoring: ['view', 'edit', 'configure_system'],
    japan_screening: ['view', 'create', 'edit'],
    due_diligence: ['view', 'edit'],
    contracts: ['view', 'create', 'edit'],
    nda: ['view', 'create', 'edit'],
    documents: ['view', 'create', 'edit'],
    settings: ['view', 'edit'],
    dashboard: ['view'],
  },
  [UserRole.ANALYST]: {
    projects: ['view', 'edit'],
    companies: ['view', 'create', 'edit'],
    contacts: ['view', 'create', 'edit'],
    surveys: ['view', 'create'],
    lead_scoring: ['view'],
    japan_screening: ['view', 'create', 'edit'],
    due_diligence: ['view', 'edit'],
    contracts: ['view'],
    nda: ['view'],
    documents: ['view', 'create'],
    dashboard: ['view'],
  },
  [UserRole.DD_SPECIALIST]: {
    projects: ['view'],
    companies: ['view'],
    due_diligence: ['view', 'edit', 'review_dd'],
    documents: ['view', 'create', 'edit'],
    dashboard: ['view'],
  },
  [UserRole.VIEWER]: {
    projects: ['view'],
    companies: ['view'],
    contacts: ['view'],
    surveys: ['view'],
    documents: ['view'],
    dashboard: ['view'],
  },
  [UserRole.PRODUCT_OWNER]: {
    projects: ['view'],
    surveys: ['view', 'create'],
    nda: ['view', 'sign_nda'],
    documents: ['view', 'create'],
  },
};
