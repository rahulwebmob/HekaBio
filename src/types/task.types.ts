/**
 * Task Types
 * Task management and tracking
 */

import type { ID, Timestamp } from './common.types';
import type { Company } from './addressBook.types';
import type { Project } from './project.types';

// ===== Task Types =====
export type TaskType = 'FOLLOW_UP' | 'CALL' | 'MEETING' | 'REVIEW' | 'RESEARCH' | 'GENERAL';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// ===== Task =====
export interface Task {
  id: ID;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;

  // Assignment
  assignedTo: ID; // User ID
  assignedBy: ID; // User ID
  assignedAt: Timestamp;

  // Related entities
  companyId?: ID;
  company?: Company;
  projectId?: ID;
  project?: Project;
  surveyId?: ID;

  // Timing
  dueDate?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;

  // Progress
  progress: number; // 0-100
  estimatedHours?: number;
  actualHours?: number;

  // Checklist
  checklist?: {
    id: ID;
    text: string;
    completed: boolean;
  }[];

  // Dependencies
  dependsOn?: ID[]; // Other task IDs
  blockedBy?: ID[]; // Other task IDs

  // Tracking
  tags: string[];
  notes?: string;
  attachments?: {
    id: ID;
    fileName: string;
    fileSize: number;
    url: string;
  }[];

  // Reminders
  reminderDate?: Timestamp;
  reminderSent: boolean;

  // Metadata
  isRecurring: boolean;
  recurrenceRule?: string; // e.g., "DAILY", "WEEKLY", "MONTHLY"
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== Task Comment =====
export interface TaskComment {
  id: ID;
  taskId: ID;
  userId: ID;
  userName: string;
  comment: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ===== Task Activity =====
export interface TaskActivity {
  id: ID;
  taskId: ID;
  userId: ID;
  userName: string;
  action: 'CREATED' | 'UPDATED' | 'ASSIGNED' | 'COMPLETED' | 'COMMENTED';
  field?: string; // Field that was changed
  oldValue?: string;
  newValue?: string;
  timestamp: Timestamp;
}
