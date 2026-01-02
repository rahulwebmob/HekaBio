/**
 * Document Types
 * Document and file management system
 */

import type { ID, Timestamp, URL } from './common.types';
import type { Company } from './addressBook.types';
import type { Project } from './project.types';

/**
 * Document Category
 */
export type DocumentCategory =
  | 'CONTRACT'
  | 'PROPOSAL'
  | 'PRESENTATION'
  | 'REPORT'
  | 'PROTOCOL'
  | 'REGULATORY'
  | 'FINANCIAL'
  | 'TECHNICAL'
  | 'MARKETING'
  | 'LEGAL'
  | 'NDA'
  | 'OTHER';

/**
 * Document Status
 */
export type DocumentStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'ACTIVE'
  | 'EXPIRED';

/**
 * Document Access Level
 */
export type AccessLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

/**
 * File Type
 */
export type FileType = 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'IMAGE' | 'VIDEO' | 'OTHER';

/**
 * Document Version
 */
export interface DocumentVersion {
  id: ID;
  versionNumber: string; // e.g., "1.0", "2.1"
  fileName: string;
  fileSize: number; // bytes
  fileUrl: URL;
  uploadedBy: ID;
  uploadedByName: string;
  uploadedAt: Timestamp;
  changeNotes?: string;
  isCurrent: boolean;
}

/**
 * Document Permission
 */
export interface DocumentPermission {
  userId: ID;
  userName: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

/**
 * Document Comment
 */
export interface DocumentComment {
  id: ID;
  content: string;
  userId: ID;
  userName: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  mentions?: ID[];
}

/**
 * Document
 */
export interface Document {
  id: ID;
  name: string;
  description?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  accessLevel: AccessLevel;

  // File details
  fileType: FileType;
  mimeType: string;
  fileSize: number; // bytes
  fileUrl: URL;
  thumbnailUrl?: URL;

  // Version control
  currentVersion: string;
  versions: DocumentVersion[];

  // Related entities
  companyId?: ID;
  company?: Company;
  projectId?: ID;
  project?: Project;
  taskId?: ID;
  communicationId?: ID;

  // Ownership and permissions
  ownerId: ID;
  ownerName: string;
  permissions: DocumentPermission[];
  isPublic: boolean;

  // Metadata
  tags: string[];
  keywords?: string[];

  // Dates
  createdAt: Timestamp;
  createdBy: ID;
  updatedAt: Timestamp;
  updatedBy?: ID;
  expiryDate?: Timestamp;

  // Approval workflow
  requiresApproval: boolean;
  approvedBy?: ID;
  approvedByName?: string;
  approvedAt?: Timestamp;
  rejectedBy?: ID;
  rejectedByName?: string;
  rejectedAt?: Timestamp;
  rejectionReason?: string;

  // Engagement
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: Timestamp;
  lastDownloadedAt?: Timestamp;

  // Comments and collaboration
  comments: DocumentComment[];

  // Security
  isEncrypted: boolean;
  isPasswordProtected: boolean;

  // Additional metadata
  customFields?: Record<string, unknown>;
}

/**
 * Document Folder
 */
export interface DocumentFolder {
  id: ID;
  name: string;
  description?: string;
  parentFolderId?: ID;
  path: string; // e.g., "/root/contracts/2025"
  documentCount: number;
  subfolderCount: number;
  createdAt: Timestamp;
  createdBy: ID;
  updatedAt: Timestamp;
}

/**
 * Document Filters
 */
export interface DocumentFilters {
  categories?: DocumentCategory[];
  statuses?: DocumentStatus[];
  accessLevels?: AccessLevel[];
  fileTypes?: FileType[];
  companyId?: ID;
  projectId?: ID;
  ownerId?: ID;
  tags?: string[];
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  searchQuery?: string;
}

/**
 * Document Statistics
 */
export interface DocumentStats {
  totalDocuments: number;
  totalSize: number; // bytes
  byCategory: Record<DocumentCategory, number>;
  byStatus: Record<DocumentStatus, number>;
  byFileType: Record<FileType, number>;
  recentlyUploaded: number; // last 7 days
  pendingApproval: number;
  expired: number;
}

/**
 * Document Category Configuration
 */
export interface DocumentCategoryConfig {
  category: DocumentCategory;
  label: string;
  color: string;
  icon: string;
  requiresApproval: boolean;
}

export const DOCUMENT_CATEGORY_CONFIG: Record<DocumentCategory, DocumentCategoryConfig> = {
  CONTRACT: {
    category: 'CONTRACT',
    label: 'Contract',
    color: 'blue',
    icon: 'file-text',
    requiresApproval: true,
  },
  PROPOSAL: {
    category: 'PROPOSAL',
    label: 'Proposal',
    color: 'purple',
    icon: 'file-description',
    requiresApproval: true,
  },
  PRESENTATION: {
    category: 'PRESENTATION',
    label: 'Presentation',
    color: 'orange',
    icon: 'presentation',
    requiresApproval: false,
  },
  REPORT: {
    category: 'REPORT',
    label: 'Report',
    color: 'green',
    icon: 'report',
    requiresApproval: true,
  },
  PROTOCOL: {
    category: 'PROTOCOL',
    label: 'Protocol',
    color: 'teal',
    icon: 'clipboard',
    requiresApproval: true,
  },
  REGULATORY: {
    category: 'REGULATORY',
    label: 'Regulatory',
    color: 'red',
    icon: 'shield',
    requiresApproval: true,
  },
  FINANCIAL: {
    category: 'FINANCIAL',
    label: 'Financial',
    color: 'yellow',
    icon: 'currency-dollar',
    requiresApproval: true,
  },
  TECHNICAL: {
    category: 'TECHNICAL',
    label: 'Technical',
    color: 'indigo',
    icon: 'settings',
    requiresApproval: false,
  },
  MARKETING: {
    category: 'MARKETING',
    label: 'Marketing',
    color: 'pink',
    icon: 'speakerphone',
    requiresApproval: false,
  },
  LEGAL: {
    category: 'LEGAL',
    label: 'Legal',
    color: 'gray',
    icon: 'scale',
    requiresApproval: true,
  },
  NDA: {
    category: 'NDA',
    label: 'NDA',
    color: 'red',
    icon: 'lock',
    requiresApproval: true,
  },
  OTHER: {
    category: 'OTHER',
    label: 'Other',
    color: 'gray',
    icon: 'file',
    requiresApproval: false,
  },
};

/**
 * Get document category color classes
 */
export const getDocumentCategoryColor = (category: DocumentCategory): string => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    teal: 'bg-teal-100 text-teal-700 border-teal-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    pink: 'bg-pink-100 text-pink-700 border-pink-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
  };
  const config = DOCUMENT_CATEGORY_CONFIG[category];
  return colorMap[config.color] || colorMap.gray;
};

/**
 * Format file size to human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file type from mime type
 */
export const getFileTypeFromMime = (mimeType: string): FileType => {
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'DOCX';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'XLSX';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PPTX';
  if (mimeType.includes('image')) return 'IMAGE';
  if (mimeType.includes('video')) return 'VIDEO';
  return 'OTHER';
};
