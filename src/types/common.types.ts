/**
 * Common TypeScript types used across the HekaBio platform
 */

// ===== Base Types =====
export type ID = string;
export type Timestamp = string; // ISO 8601 format
export type Email = string;
export type URL = string;
export type PhoneNumber = string;

// ===== Loading & Error States =====
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

// ===== Filter & Sort =====
export interface FilterOption {
  label: string;
  value: string | number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ===== File Upload =====
export interface UploadedFile {
  id: ID;
  name: string;
  size: number;
  type: string;
  url: URL;
  uploadedAt: Timestamp;
  uploadedBy: ID;
}

export type FileUploadStatus = 'pending' | 'uploading' | 'success' | 'error';

// ===== Document =====
export interface Document {
  id: ID;
  name: string;
  type: string;
  size: number;
  url: URL;
  category?: string;
  version?: number;
  uploadedAt: Timestamp;
  uploadedBy: ID;
  description?: string;
}

// ===== Activity Log =====
export type ActivityType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'stage_changed'
  | 'approved'
  | 'rejected'
  | 'commented'
  | 'uploaded'
  | 'downloaded'
  | 'email_sent'
  | 'meeting_scheduled';

export interface Activity {
  id: ID;
  type: ActivityType;
  description: string;
  userId: ID;
  userName: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
}

// ===== Comment =====
export interface Comment {
  id: ID;
  content: string;
  userId: ID;
  userName: string;
  userAvatar?: URL;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  mentions?: ID[];
  attachments?: Document[];
}

// ===== Tag =====
export interface Tag {
  id: ID;
  label: string;
  color: string;
  category?: string;
}

// ===== Status Badge =====
export type BadgeStatus = 'success' | 'processing' | 'error' | 'default' | 'warning';

// ===== Country =====
export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag?: string;
}

// ===== Address =====
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  full?: string;
}

// ===== Contact Info =====
export interface ContactInfo {
  email?: Email;
  phone?: PhoneNumber;
  mobile?: PhoneNumber;
  fax?: PhoneNumber;
  website?: URL;
}

// ===== Audit Fields =====
export interface AuditFields {
  createdAt: Timestamp;
  createdBy: ID;
  updatedAt?: Timestamp;
  updatedBy?: ID;
}

// ===== Search & Filter =====
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  sort?: SortConfig;
  pagination?: {
    page: number;
    pageSize: number;
  };
}

// ===== Notification =====
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: NotificationPriority;
  isRead: boolean;
  link?: URL;
  createdAt: Timestamp;
  data?: Record<string, unknown>;
}

// ===== Permission =====
export type Permission =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'admin';

export interface PermissionConfig {
  resource: string;
  permissions: Permission[];
}
