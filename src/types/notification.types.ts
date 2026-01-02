/**
 * Notification Types
 * System notifications and alerts
 */

import type { ID, Timestamp } from './common.types';

// ===== Notification Types =====
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_DUE'
  | 'TASK_COMPLETED'
  | 'SURVEY_SUBMITTED'
  | 'SURVEY_DUE'
  | 'PROJECT_UPDATED'
  | 'COMMUNICATION_RECEIVED'
  | 'FOLLOW_UP_REMINDER'
  | 'SYSTEM'
  | 'MENTION';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// ===== Notification =====
export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;

  // Recipient
  userId: ID;

  // Related entity
  entityType?: 'TASK' | 'PROJECT' | 'SURVEY' | 'COMMUNICATION' | 'COMPANY';
  entityId?: ID;
  actionUrl?: string; // URL to navigate to when clicked

  // Status
  isRead: boolean;
  readAt?: Timestamp;
  isArchived: boolean;
  archivedAt?: Timestamp;

  // Metadata
  icon?: string; // Icon name or emoji
  color?: string; // Badge color
  createdAt: Timestamp;
  expiresAt?: Timestamp; // Auto-archive after this date
}

// ===== Notification Preferences =====
export interface NotificationPreferences {
  userId: ID;

  // Channel preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;

  // Type preferences
  taskAssigned: boolean;
  taskDue: boolean;
  surveySubmitted: boolean;
  surveyDue: boolean;
  projectUpdated: boolean;
  communicationReceived: boolean;
  followUpReminder: boolean;
  mentions: boolean;

  // Timing
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // e.g., "22:00"
  quietHoursEnd?: string; // e.g., "08:00"

  // Digest
  dailyDigestEnabled: boolean;
  dailyDigestTime?: string; // e.g., "09:00"

  updatedAt: Timestamp;
}
