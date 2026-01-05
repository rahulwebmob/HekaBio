/**
 * Authentication & Authorization Types
 */

import type { ID, Timestamp, Email } from './common.types';

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrator',
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.USER]: 'User',
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
  | 'dashboard'
  | 'users'
  | 'settings';

// ===== Permission Action =====
export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'manage_users'
  | 'configure_system';

// ===== Permission Matrix =====
export type PermissionMatrix = Record<
  UserRole,
  Partial<Record<PermissionResource, PermissionAction[]>>
>;

export const defaultPermissions: PermissionMatrix = {
  [UserRole.SUPER_ADMIN]: {
    dashboard: ['view'],
    users: ['view', 'create', 'edit', 'delete', 'manage_users'],
    settings: ['view', 'edit', 'configure_system'],
  },
  [UserRole.ADMIN]: {
    dashboard: ['view'],
    users: ['view', 'create', 'edit', 'delete'],
    settings: ['view', 'edit'],
  },
  [UserRole.MANAGER]: {
    dashboard: ['view'],
    users: ['view'],
    settings: ['view'],
  },
  [UserRole.USER]: {
    dashboard: ['view'],
  },
};
