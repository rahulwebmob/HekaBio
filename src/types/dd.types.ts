/**
 * Due Diligence (DD) Workspace Types
 * Types for managing due diligence processes
 */

import type { ID, Timestamp } from './common.types';

// DD Section Types
export type DDSectionType =
  | 'TECHNOLOGY'
  | 'MARKET'
  | 'TEAM'
  | 'LEGAL'
  | 'FINANCIAL'
  | 'REGULATORY'
  | 'OPERATIONAL'
  | 'IP'
  | 'COMMERCIAL'
  | 'OTHER';

// DD Item Status
export type DDItemStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PENDING_REVIEW'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'NOT_APPLICABLE';

// DD Assessment Rating
export type DDAssessmentRating =
  | 'EXCELLENT'     // 5 - No issues, exceeds expectations
  | 'GOOD'          // 4 - Minor issues, meets expectations
  | 'ACCEPTABLE'    // 3 - Some concerns, acceptable
  | 'CONCERNING'    // 2 - Significant concerns
  | 'CRITICAL';     // 1 - Critical issues, deal-breaker

// DD Risk Level
export type DDRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// DD Document/File
export interface DDDocument {
  id: ID;
  ddItemId: ID;

  // Document details
  name: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;

  // Classification
  category: string;
  isConfidential: boolean;
  accessLevel: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL';

  // Status
  reviewStatus?: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
  reviewedBy?: ID;
  reviewedAt?: Timestamp;
  reviewNotes?: string;

  // Metadata
  uploadedAt: Timestamp;
  uploadedBy: ID;
  version: string;
}

// DD Item (Question/Checklist Item)
export interface DDItem {
  id: ID;
  ddSectionId: ID;

  // Item details
  question: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: DDItemStatus;

  // Assignment
  assignedTo?: ID;
  assignedToName?: string;
  dueDate?: Timestamp;

  // Response
  response?: string;
  rating?: DDAssessmentRating;
  riskLevel?: DDRiskLevel;
  issues?: string[];
  mitigations?: string[];

  // Documents
  documents: DDDocument[];
  requiredDocuments?: string[]; // List of required document types

  // Dependencies
  dependsOn?: ID[]; // Other DD items that must be completed first
  blockedReason?: string;

  // Review
  reviewRequired: boolean;
  reviewedBy?: ID;
  reviewedAt?: Timestamp;
  reviewNotes?: string;

  // Order
  order: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
  completedAt?: Timestamp;
  completedBy?: ID;
}

// DD Section
export interface DDSection {
  id: ID;
  ddWorkspaceId: ID;

  // Section details
  name: string;
  type: DDSectionType;
  description?: string;
  icon?: string;

  // Items
  items: DDItem[];

  // Status and progress
  completionPercentage: number;
  totalItems: number;
  completedItems: number;
  blockedItems: number;

  // Assessment
  overallRating?: DDAssessmentRating;
  overallRiskLevel?: DDRiskLevel;
  keyFindings?: string[];
  recommendations?: string[];

  // Assignment
  leadAssignee?: ID;
  leadAssigneeName?: string;

  // Order
  order: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// DD Workspace (for a specific project)
export interface DDWorkspace {
  id: ID;

  // Relationship
  projectId: ID;
  projectName: string;
  companyId: ID;
  companyName: string;

  // Workspace details
  title: string;
  description?: string;

  // Status
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD';
  startDate?: Timestamp;
  targetCompletionDate?: Timestamp;
  actualCompletionDate?: Timestamp;

  // Sections
  sections: DDSection[];

  // Progress
  overallCompletionPercentage: number;
  totalItems: number;
  completedItems: number;
  blockedItems: number;

  // Assessment
  overallRating?: DDAssessmentRating;
  overallRiskLevel?: DDRiskLevel;
  executiveSummary?: string;
  majorRisks?: Array<{
    category: string;
    description: string;
    severity: DDRiskLevel;
    mitigation?: string;
  }>;
  keyOpportunities?: string[];

  // Team
  leadAssignee?: ID;
  leadAssigneeName?: string;
  teamMembers?: Array<{
    userId: ID;
    name: string;
    role: string;
  }>;

  // Data room
  dataRoomUrl?: string;
  documentCount?: number;

  // Workflow
  approvalRequired: boolean;
  approvedBy?: ID;
  approvedAt?: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// DD Activity Log
export interface DDActivity {
  id: ID;
  ddWorkspaceId: ID;
  ddSectionId?: ID;
  ddItemId?: ID;

  // Activity details
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'ASSIGNED' | 'DOCUMENT_UPLOADED' |
        'COMPLETED' | 'REVIEWED' | 'COMMENT_ADDED' | 'RATING_CHANGED' |
        'BLOCKED' | 'UNBLOCKED';
  description: string;

  // Actor
  actorId: ID;
  actorName: string;

  // Details - flexible metadata for custom audit fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;

  // Timestamp
  occurredAt: Timestamp;
}

// DD Template (for quick DD workspace creation)
export interface DDTemplate {
  id: ID;

  // Template details
  name: string;
  description: string;
  category: 'BIOTECH' | 'PHARMA' | 'MEDTECH' | 'DIAGNOSTIC' | 'GENERAL';

  // Sections template
  sections: Array<{
    name: string;
    type: DDSectionType;
    description?: string;
    items: Array<{
      question: string;
      description?: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      reviewRequired: boolean;
      requiredDocuments?: string[];
    }>;
  }>;

  // Usage
  isActive: boolean;
  usageCount: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// Helper labels
export const DD_SECTION_TYPE_LABELS: Record<DDSectionType, string> = {
  TECHNOLOGY: 'Technology & R&D',
  MARKET: 'Market & Competition',
  TEAM: 'Team & Management',
  LEGAL: 'Legal',
  FINANCIAL: 'Financial',
  REGULATORY: 'Regulatory',
  OPERATIONAL: 'Operations',
  IP: 'Intellectual Property',
  COMMERCIAL: 'Commercial',
  OTHER: 'Other',
};

export const DD_ITEM_STATUS_LABELS: Record<DDItemStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  PENDING_REVIEW: 'Pending Review',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
  NOT_APPLICABLE: 'Not Applicable',
};

export const DD_ASSESSMENT_RATING_LABELS: Record<DDAssessmentRating, string> = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  ACCEPTABLE: 'Acceptable',
  CONCERNING: 'Concerning',
  CRITICAL: 'Critical',
};

export const DD_RISK_LEVEL_LABELS: Record<DDRiskLevel, string> = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk',
  CRITICAL: 'Critical Risk',
};

// Get status variant for Badge component
export function getDDItemStatusVariant(status: DDItemStatus): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
    case 'PENDING_REVIEW':
      return 'info';
    case 'BLOCKED':
      return 'error';
    case 'NOT_APPLICABLE':
      return 'default';
    case 'NOT_STARTED':
      return 'warning';
    default:
      return 'default';
  }
}

// Get rating variant for Badge component
export function getDDRatingVariant(rating: DDAssessmentRating): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (rating) {
    case 'EXCELLENT':
      return 'success';
    case 'GOOD':
      return 'info';
    case 'ACCEPTABLE':
      return 'default';
    case 'CONCERNING':
      return 'warning';
    case 'CRITICAL':
      return 'error';
    default:
      return 'default';
  }
}

// Get risk level variant for Badge component
export function getDDRiskLevelVariant(risk: DDRiskLevel): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (risk) {
    case 'LOW':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    case 'HIGH':
      return 'error';
    case 'CRITICAL':
      return 'error';
    default:
      return 'default';
  }
}

// Calculate completion percentage
export function calculateDDCompletion(items: DDItem[]): number {
  if (items.length === 0) return 0;
  const completed = items.filter((item) =>
    item.status === 'COMPLETED' || item.status === 'NOT_APPLICABLE'
  ).length;
  return Math.round((completed / items.length) * 100);
}

// Get section icon
export function getDDSectionIcon(type: DDSectionType): string {
  const icons: Record<DDSectionType, string> = {
    TECHNOLOGY: '🔬',
    MARKET: '📊',
    TEAM: '👥',
    LEGAL: '⚖️',
    FINANCIAL: '💰',
    REGULATORY: '📋',
    OPERATIONAL: '⚙️',
    IP: '💡',
    COMMERCIAL: '🤝',
    OTHER: '📁',
  };
  return icons[type] || '📁';
}
