/**
 * Communication Types
 * Email tracking, calls, and communication history
 */

import type { ID, Timestamp, Email } from './common.types';
import type { Company } from './addressBook.types';
import type { Project } from './project.types';

// ===== Communication Types =====
export type CommunicationType = 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE';

export type CommunicationStatus = 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'REPLIED' | 'FAILED';

export type CommunicationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// ===== Communication Record =====
export interface Communication {
  id: ID;
  type: CommunicationType;
  subject: string;
  body: string;

  // Participants
  from: Email;
  to: Email[];
  cc?: Email[];
  bcc?: Email[];

  // Related entities
  companyId: ID;
  company: Company;
  projectId?: ID;
  project?: Project;
  contactIds?: ID[];

  // Status & tracking
  status: CommunicationStatus;
  priority: CommunicationPriority;

  // Email specific
  messageId?: string; // Email message ID
  threadId?: string; // Email thread ID
  inReplyTo?: ID; // Parent communication ID

  // Call/Meeting specific
  duration?: number; // Duration in minutes
  callNotes?: string;

  // Attachments
  attachments?: {
    id: ID;
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
  }[];

  // Tracking
  sentAt?: Timestamp;
  deliveredAt?: Timestamp;
  readAt?: Timestamp;
  repliedAt?: Timestamp;

  // Follow-up
  needsFollowUp: boolean;
  followUpDate?: Timestamp;
  followUpCompleted: boolean;

  // Metadata
  tags: string[];
  isArchived: boolean;
  isPinned: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

// ===== Email Template =====
export interface EmailTemplate {
  id: ID;
  name: string;
  subject: string;
  body: string;
  category: 'SURVEY' | 'FOLLOW_UP' | 'INTRODUCTION' | 'PROPOSAL' | 'GENERAL';
  variables: string[]; // e.g., ['companyName', 'contactName', 'projectName']
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

// ===== Communication Thread =====
export interface CommunicationThread {
  threadId: ID;
  subject: string;
  participants: Email[];
  companyId: ID;
  company: Company;
  projectId?: ID;
  project?: Project;
  communications: Communication[];
  lastMessageAt: Timestamp;
  messageCount: number;
  isArchived: boolean;
}
