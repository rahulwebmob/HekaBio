/**
 * Contract Management Types
 * Types for managing contracts and agreements
 */

import type { ID, Timestamp } from './common.types';

// Contract Types
export type ContractType =
  | 'LICENSING'
  | 'PARTNERSHIP'
  | 'COLLABORATION'
  | 'SERVICE'
  | 'SUPPLY'
  | 'CONSULTING'
  | 'EMPLOYMENT'
  | 'NDA'
  | 'MTA'  // Material Transfer Agreement
  | 'CDA'  // Confidential Disclosure Agreement
  | 'OTHER';

// Contract Status
export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PENDING_APPROVAL'
  | 'PENDING_SIGNATURES'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'TERMINATED'
  | 'EXPIRED'
  | 'COMPLETED';

// Payment Status
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

// Milestone Status
export type MilestoneStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DELAYED'
  | 'CANCELLED';

// Contract Party
export interface ContractParty {
  id: ID;
  contractId: ID;

  // Party details
  name: string;
  role: 'CLIENT' | 'PROVIDER' | 'LICENSOR' | 'LICENSEE' | 'PARTNER' | 'OTHER';
  entityType: 'COMPANY' | 'INDIVIDUAL' | 'INSTITUTION';

  // Contact
  companyId?: ID;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;

  // Address
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  // Signature
  signatureRequired: boolean;
  signedDate?: Timestamp;
  signedBy?: string;

  // Metadata
  createdAt: Timestamp;
}

// Payment Schedule
export interface ContractPayment {
  id: ID;
  contractId: ID;

  // Payment details
  description: string;
  amount: number;
  currency: string;

  // Status and dates
  status: PaymentStatus;
  dueDate: Timestamp;
  paidDate?: Timestamp;

  // Links
  invoiceNumber?: string;
  invoiceUrl?: string;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Milestone
export interface ContractMilestone {
  id: ID;
  contractId: ID;

  // Milestone details
  title: string;
  description?: string;
  deliverables?: string[];

  // Status and dates
  status: MilestoneStatus;
  targetDate?: Timestamp;
  completedDate?: Timestamp;

  // Payment link
  paymentId?: ID; // Link to payment triggered by this milestone

  // Progress
  completionPercentage?: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Contract Document
export interface ContractDocument {
  id: ID;
  contractId: ID;

  // Document details
  name: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  category: 'MAIN_CONTRACT' | 'AMENDMENT' | 'APPENDIX' | 'SUPPORTING' | 'INVOICE' | 'OTHER';

  // Version
  version: string;
  isFinal: boolean;

  // Status
  isExecuted: boolean; // Signed/executed version
  executedDate?: Timestamp;

  // Metadata
  uploadedAt: Timestamp;
  uploadedBy: ID;
}

// Contract Main Entity
export interface Contract {
  id: ID;

  // Relationships
  projectId?: ID;
  projectName?: string;
  companyId?: ID;
  companyName?: string;

  // Contract details
  title: string;
  type: ContractType;
  status: ContractStatus;
  description?: string;

  // Parties
  parties: ContractParty[];

  // Key terms
  startDate?: Timestamp;
  endDate?: Timestamp;
  effectiveDate?: Timestamp;
  terminationDate?: Timestamp;

  // Financial
  totalValue?: number;
  currency?: string;
  payments: ContractPayment[];
  paymentTerms?: string;

  // Milestones and deliverables
  milestones: ContractMilestone[];

  // Legal terms
  jurisdiction?: string;
  governingLaw?: string;
  disputeResolution?: string;

  // Renewal and termination
  autoRenew?: boolean;
  renewalTermMonths?: number;
  noticePeriodDays?: number;
  terminationClauses?: string[];

  // Confidentiality
  confidentialityPeriodYears?: number;

  // IP and ownership
  ipOwnership?: string;
  backgroundIP?: string;
  foregroundIP?: string;

  // Performance and reporting
  kpis?: string[];
  reportingFrequency?: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';

  // Documents
  documents: ContractDocument[];

  // Notifications and reminders
  renewalReminderDays?: number;
  nextReminderDate?: Timestamp;

  // Approval workflow
  requiresLegalReview: boolean;
  legalReviewedBy?: ID;
  legalReviewedAt?: Timestamp;
  legalReviewNotes?: string;

  requiresFinanceApproval: boolean;
  financeApprovedBy?: ID;
  financeApprovedAt?: Timestamp;

  approvedBy?: ID;
  approvedAt?: Timestamp;

  // Notes
  internalNotes?: string;
  keyTermsSummary?: string;

  // Related contracts
  parentContractId?: ID; // For amendments
  relatedContractIds?: ID[];

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
  lastReviewedAt?: Timestamp;
}

// Contract Activity Log
export interface ContractActivity {
  id: ID;
  contractId: ID;

  // Activity details
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'SIGNED' | 'PAYMENT_MADE' |
        'MILESTONE_COMPLETED' | 'RENEWED' | 'TERMINATED' | 'DOCUMENT_UPLOADED' |
        'REVIEWED' | 'APPROVED' | 'REMINDER_SENT';
  description: string;

  // Actor
  actorId?: ID;
  actorName: string;

  // Details
  metadata?: Record<string, any>;

  // Timestamp
  occurredAt: Timestamp;
}

// Contract Template
export interface ContractTemplate {
  id: ID;

  // Template details
  name: string;
  description: string;
  type: ContractType;

  // Template content
  templateUrl?: string;
  defaultTerms?: string;

  // Default values
  defaultCurrency?: string;
  defaultJurisdiction?: string;
  defaultGoverningLaw?: string;
  defaultTermMonths?: number;

  // Usage
  isActive: boolean;
  usageCount: number;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// Helper labels
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  LICENSING: 'Licensing Agreement',
  PARTNERSHIP: 'Partnership Agreement',
  COLLABORATION: 'Collaboration Agreement',
  SERVICE: 'Service Agreement',
  SUPPLY: 'Supply Agreement',
  CONSULTING: 'Consulting Agreement',
  EMPLOYMENT: 'Employment Agreement',
  NDA: 'Non-Disclosure Agreement',
  MTA: 'Material Transfer Agreement',
  CDA: 'Confidential Disclosure Agreement',
  OTHER: 'Other',
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  PENDING_APPROVAL: 'Pending Approval',
  PENDING_SIGNATURES: 'Pending Signatures',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated',
  EXPIRED: 'Expired',
  COMPLETED: 'Completed',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
};

export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed',
  CANCELLED: 'Cancelled',
};

// Get status variant for Badge component
export function getContractStatusVariant(status: ContractStatus): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING_REVIEW':
    case 'PENDING_APPROVAL':
    case 'PENDING_SIGNATURES':
      return 'info';
    case 'DRAFT':
      return 'default';
    case 'SUSPENDED':
    case 'EXPIRED':
      return 'warning';
    case 'TERMINATED':
      return 'error';
    case 'COMPLETED':
      return 'success';
    default:
      return 'default';
  }
}

// Get payment status variant
export function getPaymentStatusVariant(status: PaymentStatus): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'PAID':
      return 'success';
    case 'PENDING':
      return 'info';
    case 'OVERDUE':
      return 'error';
    case 'CANCELLED':
      return 'default';
    default:
      return 'default';
  }
}

// Get milestone status variant
export function getMilestoneStatusVariant(status: MilestoneStatus): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'info';
    case 'DELAYED':
      return 'warning';
    case 'NOT_STARTED':
      return 'default';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

// Check if contract is expiring soon (within 30 days)
export function isContractExpiringSoon(contract: Contract): boolean {
  if (!contract.endDate) return false;
  const endDate = new Date(contract.endDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return endDate <= thirtyDaysFromNow && endDate > new Date();
}

// Check if contract is expired
export function isContractExpired(contract: Contract): boolean {
  if (!contract.endDate) return false;
  return new Date(contract.endDate) < new Date();
}

// Calculate payment completion percentage
export function getPaymentCompletionPercentage(contract: Contract): number {
  if (contract.payments.length === 0) return 0;
  const paid = contract.payments.filter((p) => p.status === 'PAID').length;
  return Math.round((paid / contract.payments.length) * 100);
}

// Calculate milestone completion percentage
export function getMilestoneCompletionPercentage(contract: Contract): number {
  if (contract.milestones.length === 0) return 0;
  const completed = contract.milestones.filter((m) => m.status === 'COMPLETED').length;
  return Math.round((completed / contract.milestones.length) * 100);
}

// Get overdue payments
export function getOverduePayments(contract: Contract): ContractPayment[] {
  const now = new Date();
  return contract.payments.filter(
    (p) => p.status === 'PENDING' && new Date(p.dueDate) < now
  );
}
