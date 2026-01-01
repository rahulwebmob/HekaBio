/**
 * Authentication & Authorization Types
 */

import type { ID, Timestamp, Email } from './common.types';

// ===== User Roles =====
export const UserRole = {
  // System Admin
  SUPER_ADMIN: 'super_admin',

  // Phase 1 Roles - CRM & Pipeline
  CRM_OWNER: 'crm_owner',
  GATE_1_ANALYST: 'gate_1_analyst',
  GATE_2_ANALYST: 'gate_2_analyst',
  GATE_3_DECISION_MAKER: 'gate_3_decision_maker',
  DD_SPECIALIST_SCIENTIFIC: 'dd_specialist_scientific',
  DD_SPECIALIST_REGULATORY: 'dd_specialist_regulatory',
  DD_SPECIALIST_COMMERCIAL: 'dd_specialist_commercial',
  DD_SPECIALIST_FINANCIAL: 'dd_specialist_financial',
  PRODUCT_OWNER: 'product_owner',

  // Phase 2 Roles - Supply Chain
  HOSPITAL_STAFF: 'hospital_staff',
  DISTRIBUTOR_STAFF: 'distributor_staff',
  LICENSE_HOLDER_STAFF: 'license_holder_staff',
  MANUFACTURING_STAFF: 'manufacturing_staff',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ===== Role Labels (for display) =====
export const RoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrator',
  [UserRole.CRM_OWNER]: 'CRM Owner',
  [UserRole.GATE_1_ANALYST]: 'Gate 1 Analyst (Data Gathering)',
  [UserRole.GATE_2_ANALYST]: 'Gate 2 Analyst (1-on-1)',
  [UserRole.GATE_3_DECISION_MAKER]: 'Gate 3 Decision Maker',
  [UserRole.DD_SPECIALIST_SCIENTIFIC]: 'DD Specialist - Scientific',
  [UserRole.DD_SPECIALIST_REGULATORY]: 'DD Specialist - Regulatory',
  [UserRole.DD_SPECIALIST_COMMERCIAL]: 'DD Specialist - Commercial',
  [UserRole.DD_SPECIALIST_FINANCIAL]: 'DD Specialist - Financial',
  [UserRole.PRODUCT_OWNER]: 'Product Owner / Innovator',
  [UserRole.HOSPITAL_STAFF]: 'Hospital Staff',
  [UserRole.DISTRIBUTOR_STAFF]: 'Distributor Staff',
  [UserRole.LICENSE_HOLDER_STAFF]: 'License Holder Staff (HekaBio)',
  [UserRole.MANUFACTURING_STAFF]: 'Manufacturing Staff',
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

// Example permission structure (to be expanded):
export const defaultPermissions: PermissionMatrix = {
  [UserRole.SUPER_ADMIN]: {
    projects: ['view', 'create', 'edit', 'delete'],
    companies: ['view', 'create', 'edit', 'delete'],
    users: ['view', 'create', 'edit', 'delete', 'manage_users'],
    settings: ['view', 'edit', 'configure_system'],
  },
  [UserRole.CRM_OWNER]: {
    projects: ['view', 'create', 'edit', 'delete'],
    companies: ['view', 'create', 'edit', 'delete'],
    contacts: ['view', 'create', 'edit', 'delete'],
    surveys: ['view', 'create', 'edit', 'delete'],
    lead_scoring: ['view', 'edit', 'configure_system'],
    dashboard: ['view'],
  },
  [UserRole.GATE_1_ANALYST]: {
    projects: ['view', 'edit', 'approve_gate_1'],
    companies: ['view'],
    surveys: ['view'],
    lead_scoring: ['view'],
    japan_screening: ['view', 'create'],
    dashboard: ['view'],
  },
  [UserRole.GATE_2_ANALYST]: {
    projects: ['view', 'edit', 'approve_gate_2'],
    companies: ['view'],
    japan_screening: ['view', 'edit'],
    communications: ['view', 'create'],
    dashboard: ['view'],
  },
  [UserRole.GATE_3_DECISION_MAKER]: {
    projects: ['view', 'approve_gate_3'],
    japan_screening: ['view'],
    due_diligence: ['view'],
    contracts: ['view', 'create', 'edit'],
    dashboard: ['view'],
  },
  [UserRole.DD_SPECIALIST_SCIENTIFIC]: {
    projects: ['view'],
    due_diligence: ['view', 'edit', 'review_dd'],
    documents: ['view', 'create'],
  },
  [UserRole.DD_SPECIALIST_REGULATORY]: {
    projects: ['view'],
    due_diligence: ['view', 'edit', 'review_dd'],
    documents: ['view', 'create'],
  },
  [UserRole.DD_SPECIALIST_COMMERCIAL]: {
    projects: ['view'],
    due_diligence: ['view', 'edit', 'review_dd'],
    documents: ['view', 'create'],
  },
  [UserRole.DD_SPECIALIST_FINANCIAL]: {
    projects: ['view'],
    due_diligence: ['view', 'edit', 'review_dd'],
    documents: ['view', 'create'],
  },
  [UserRole.PRODUCT_OWNER]: {
    projects: ['view'],
    surveys: ['view', 'create'],
    nda: ['view', 'sign_nda'],
    documents: ['view', 'create'],
  },
  [UserRole.HOSPITAL_STAFF]: {
    orders: ['view', 'create'],
    transportation: ['view'],
    documents: ['view', 'create'],
  },
  [UserRole.DISTRIBUTOR_STAFF]: {
    orders: ['view', 'edit', 'approve_gate_1'],
    transportation: ['view', 'edit'],
    inventory: ['view'],
    documents: ['view', 'create'],
  },
  [UserRole.LICENSE_HOLDER_STAFF]: {
    orders: ['view', 'edit', 'approve_gate_2'],
    transportation: ['view', 'edit', 'create'],
    inventory: ['view', 'edit'],
    collection: ['view', 'create', 'edit'],
    documents: ['view', 'create'],
  },
  [UserRole.MANUFACTURING_STAFF]: {
    orders: ['view', 'approve_gate_3'],
    manufacturing: ['view', 'edit'],
    transportation: ['view', 'create'],
    inventory: ['view', 'edit'],
    documents: ['view', 'create'],
  },
};
