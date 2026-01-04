/**
 * NDA (Non-Disclosure Agreement) Types
 * Types for managing NDAs and signature workflows
 */

import type { ID, Timestamp } from './common.types';

// NDA Types
export type NDAType = 'MUTUAL' | 'ONE_WAY_INCOMING' | 'ONE_WAY_OUTGOING';

// NDA Status
export type NDAStatus =
  | 'DRAFT' // Being prepared
  | 'PENDING_REVIEW' // Sent for internal review
  | 'PENDING_SIGNATURES' // Sent to parties for signature
  | 'PARTIALLY_SIGNED' // Some parties have signed
  | 'FULLY_SIGNED' // All parties have signed
  | 'EXPIRED' // Past expiry date
  | 'DECLINED' // Declined by one or more parties
  | 'TERMINATED' // Terminated early
  | 'SUPERSEDED'; // Replaced by newer NDA

// Signatory Status
export type SignatoryStatus =
  | 'PENDING' // Awaiting signature
  | 'SIGNED' // Signed
  | 'DECLINED' // Declined to sign
  | 'WITHDRAWN'; // Signature request withdrawn

// Signatory
export interface NDASignatory {
  id: ID;
  ndaId: ID;

  // Signatory details
  name: string;
  email: string;
  role: string;
  organization: string;

  // Signature status
  status: SignatoryStatus;
  signedAt?: Timestamp;
  declinedAt?: Timestamp;
  declinedReason?: string;

  // Signature data
  signatureMethod?: 'DIGITAL' | 'WET_INK' | 'ELECTRONIC';
  signatureData?: string; // Could be base64 signature image, DocuSign ID, etc.
  ipAddress?: string;

  // Order (for sequential signing)
  signingOrder?: number;

  // Notifications
  lastReminderSent?: Timestamp;
  reminderCount?: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// NDA Document
export interface NDADocument {
  id: ID;
  ndaId: ID;

  // Document details
  name: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  version: string;

  // Status
  isFinal: boolean;
  isTemplate: boolean;

  // Metadata
  uploadedAt: Timestamp;
  uploadedBy: ID;
}

// NDA Main Entity
export interface NDA {
  id: ID;

  // Relationships
  projectId?: ID;
  projectName?: string;
  companyId: ID;
  companyName: string;

  // NDA Details
  title: string;
  type: NDAType;
  status: NDAStatus;

  // Dates
  draftedDate?: Timestamp;
  sentDate?: Timestamp;
  signedDate?: Timestamp; // Date when fully signed
  effectiveDate?: Timestamp; // When NDA becomes effective
  expiryDate?: Timestamp;
  terminatedDate?: Timestamp;

  // Terms
  purpose: string; // Purpose of the NDA
  disclosingParty?: string;
  receivingParty?: string;
  jurisdiction?: string;
  governingLaw?: string;
  termYears?: number; // Duration in years

  // Special terms
  exclusions?: string[]; // Exclusions from confidentiality
  permittedDisclosures?: string[]; // Who can receive info
  returnOfMaterials?: boolean;
  returnDeadlineDays?: number;

  // Documents
  documents: NDADocument[];

  // Signatories
  signatories: NDASignatory[];

  // Workflow
  requiresSequentialSigning?: boolean;
  internalApprovalRequired?: boolean;
  internalApprovedBy?: ID;
  internalApprovedAt?: Timestamp;
  legalReviewRequired?: boolean;
  legalReviewedBy?: ID;
  legalReviewedAt?: Timestamp;

  // Notifications
  reminderSchedule?: 'DAILY' | 'WEEKLY' | 'BIWEEKLY';
  lastReminderSent?: Timestamp;

  // Notes and comments
  internalNotes?: string;
  publicNotes?: string;

  // Related items
  relatedNDAIds?: ID[]; // Superseded NDAs, amendments, etc.

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
  updatedBy?: ID;
}

// NDA Activity Log
export interface NDAActivity {
  id: ID;
  ndaId: ID;

  // Activity details
  type:
    | 'CREATED'
    | 'SENT'
    | 'VIEWED'
    | 'SIGNED'
    | 'DECLINED'
    | 'REMINDED'
    | 'EXPIRED'
    | 'TERMINATED'
    | 'DOCUMENT_UPLOADED'
    | 'STATUS_CHANGED'
    | 'COMMENT_ADDED'
    | 'APPROVED';
  description: string;

  // Actor
  actorId?: ID;
  actorName: string;
  actorEmail?: string;

  // Details - flexible metadata for custom audit fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;

  // Timestamp
  occurredAt: Timestamp;
}

// NDA Template (for quick NDA creation)
export interface NDATemplate {
  id: ID;

  // Template details
  name: string;
  description: string;
  type: NDAType;

  // Default terms
  defaultTermYears: number;
  defaultPurpose?: string;
  defaultJurisdiction?: string;
  defaultGoverningLaw?: string;

  // Template document
  templateDocumentUrl?: string;

  // Usage
  isActive: boolean;
  usageCount: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// Filter and search types
export interface NDAFilters {
  status?: NDAStatus[];
  type?: NDAType[];
  companyId?: ID;
  projectId?: ID;
  dateRange?: {
    field: 'sentDate' | 'signedDate' | 'expiryDate';
    start?: Timestamp;
    end?: Timestamp;
  };
  search?: string;
}

// Helper functions
export const NDA_TYPE_LABELS: Record<NDAType, string> = {
  MUTUAL: 'Mutual NDA',
  ONE_WAY_INCOMING: 'One-Way (Incoming)',
  ONE_WAY_OUTGOING: 'One-Way (Outgoing)',
};

export const NDA_STATUS_LABELS: Record<NDAStatus, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  PENDING_SIGNATURES: 'Pending Signatures',
  PARTIALLY_SIGNED: 'Partially Signed',
  FULLY_SIGNED: 'Fully Signed',
  EXPIRED: 'Expired',
  DECLINED: 'Declined',
  TERMINATED: 'Terminated',
  SUPERSEDED: 'Superseded',
};

export const SIGNATORY_STATUS_LABELS: Record<SignatoryStatus, string> = {
  PENDING: 'Pending',
  SIGNED: 'Signed',
  DECLINED: 'Declined',
  WITHDRAWN: 'Withdrawn',
};

// Get NDA status color variant for Badge component
export function getNDAStatusVariant(
  status: NDAStatus
): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'FULLY_SIGNED':
      return 'success';
    case 'PENDING_SIGNATURES':
    case 'PARTIALLY_SIGNED':
    case 'PENDING_REVIEW':
      return 'info';
    case 'DRAFT':
      return 'default';
    case 'EXPIRED':
    case 'DECLINED':
    case 'TERMINATED':
      return 'error';
    case 'SUPERSEDED':
      return 'warning';
    default:
      return 'default';
  }
}

// Check if NDA is expired
export function isNDAExpired(nda: NDA): boolean {
  if (!nda.expiryDate) return false;
  return new Date(nda.expiryDate) < new Date();
}

// Check if NDA is pending action
export function isNDAPendingAction(nda: NDA): boolean {
  return ['PENDING_REVIEW', 'PENDING_SIGNATURES', 'PARTIALLY_SIGNED'].includes(nda.status);
}

// Get signing progress
export function getNDASigningProgress(nda: NDA): {
  signed: number;
  total: number;
  percentage: number;
} {
  const total = nda.signatories.length;
  const signed = nda.signatories.filter((s) => s.status === 'SIGNED').length;
  const percentage = total > 0 ? Math.round((signed / total) * 100) : 0;

  return { signed, total, percentage };
}
