/**
 * Task Automation Service
 * Automatically creates tasks from various events
 */

import type { Task, TaskPriority } from '../types/task.types';
import type { GateDecision, GateNumber } from '../types/gate.types';

interface AutoTaskConfig {
  title: string;
  description: string;
  type: Task['type'];
  priority: TaskPriority;
  assignedTo: string;
  dueDate?: string;
  projectId?: string;
  companyId?: string;
}

interface GateDecisionInfo {
  gate: GateNumber;
  decision: GateDecision;
  reasoning?: string;
}

/**
 * Create task from gate decision
 */
export function createTaskFromGateDecision(
  decisionInfo: GateDecisionInfo,
  projectId: string,
  companyId?: string
): AutoTaskConfig | null {
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // For decisions that need follow-up actions
  if (decisionInfo.decision === 'CONDITIONAL') {
    return {
      title: `Follow up on ${decisionInfo.gate} conditional approval`,
      description: `Conditional approval requires action: ${decisionInfo.reasoning || 'See gate review for details'}\n\nPlease address the conditions before proceeding.`,
      type: 'FOLLOW_UP',
      priority: 'HIGH',
      assignedTo: 'user-1',
      dueDate: threeDaysLater.toISOString(),
      projectId,
      companyId,
    };
  }

  if (decisionInfo.decision === 'APPROVED' && decisionInfo.gate === 1) {
    return {
      title: 'Schedule Gate 2 review meeting',
      description: `Project passed Gate 1. Schedule a 1-on-1 meeting with the product owner to discuss details.`,
      type: 'MEETING',
      priority: 'MEDIUM',
      assignedTo: 'user-1',
      dueDate: threeDaysLater.toISOString(),
      projectId,
      companyId,
    };
  }

  if (decisionInfo.decision === 'APPROVED' && decisionInfo.gate === 2) {
    return {
      title: 'Initiate NDA process',
      description: `Project passed Gate 2. Initiate NDA with the product owner before proceeding to due diligence.`,
      type: 'FOLLOW_UP',
      priority: 'HIGH',
      assignedTo: 'user-1',
      dueDate: threeDaysLater.toISOString(),
      projectId,
      companyId,
    };
  }

  if (decisionInfo.decision === 'APPROVED' && decisionInfo.gate === 3) {
    return {
      title: 'Prepare contract documentation',
      description: `Project approved at Gate 3. Begin contract preparation and negotiations.`,
      type: 'GENERAL',
      priority: 'URGENT',
      assignedTo: 'user-1',
      dueDate: threeDaysLater.toISOString(),
      projectId,
      companyId,
    };
  }

  if (decisionInfo.decision === 'DEFERRED') {
    return {
      title: `Review and address Gate ${decisionInfo.gate} concerns`,
      description: `Project deferred. Concerns: ${decisionInfo.reasoning || 'See review for details'}\n\nPlease address these concerns before resubmitting.`,
      type: 'REVIEW',
      priority: 'MEDIUM',
      assignedTo: 'user-1',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      projectId,
      companyId,
    };
  }

  return null;
}

/**
 * Create task from DD section assignment
 */
export function createTaskFromDDSection(
  sectionTitle: string,
  sectionStatus: string,
  assignedTo: string | undefined,
  targetDate: string | undefined,
  projectId: string,
  companyId?: string
): AutoTaskConfig | null {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (sectionStatus === 'NOT_STARTED' || sectionStatus === 'IN_PROGRESS') {
    return {
      title: `Complete DD section: ${sectionTitle}`,
      description: `Please complete the due diligence section "${sectionTitle}".\n\nThis section requires thorough analysis and documentation of findings.`,
      type: 'REVIEW',
      priority: 'HIGH',
      assignedTo: assignedTo || 'user-1',
      dueDate: targetDate || sevenDaysLater.toISOString(),
      projectId,
      companyId,
    };
  }

  return null;
}

/**
 * Create task from unanswered communication
 */
export function createTaskFromCommunication(
  subject: string,
  sentAt: string,
  recipientNames: string[],
  senderId: string,
  projectId?: string,
  companyId?: string
): AutoTaskConfig | null {
  const now = new Date();
  const emailDate = new Date(sentAt);
  const daysSinceEmail = Math.floor((now.getTime() - emailDate.getTime()) / (24 * 60 * 60 * 1000));

  // Create follow-up task if email hasn't been replied to in 7 days
  if (daysSinceEmail >= 7) {
    return {
      title: `Follow up on: ${subject}`,
      description: `No response received for ${daysSinceEmail} days.\n\nOriginal sent to: ${recipientNames.join(', ')}\n\nPlease follow up.`,
      type: 'FOLLOW_UP',
      priority: daysSinceEmail >= 14 ? 'HIGH' : 'MEDIUM',
      assignedTo: senderId,
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      projectId,
      companyId,
    };
  }

  return null;
}

/**
 * Create task from stalled project
 */
export function createTaskFromStalledProject(
  projectId: string,
  projectName: string,
  companyId: string,
  lastActivityDate: string,
  ownerId: string
): AutoTaskConfig {
  const now = new Date();
  const lastActivity = new Date(lastActivityDate);
  const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000));

  return {
    title: `Review stalled project: ${projectName}`,
    description: `This project has had no activity for ${daysSinceActivity} days.\n\nPlease review the project status and take appropriate action:\n- Follow up with stakeholders\n- Update project stage\n- Close if no longer relevant`,
    type: 'REVIEW',
    priority: daysSinceActivity >= 60 ? 'HIGH' : 'MEDIUM',
    assignedTo: ownerId,
    dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    projectId,
    companyId,
  };
}

/**
 * Create task from NDA expiration
 */
export function createTaskFromNDAExpiration(
  companyName: string,
  projectId: string,
  expirationDate: string
): AutoTaskConfig {
  return {
    title: `Renew NDA with ${companyName}`,
    description: `The NDA is expiring soon (${new Date(expirationDate).toLocaleDateString()}).\n\nPlease initiate renewal process if needed.`,
    type: 'FOLLOW_UP',
    priority: 'HIGH',
    assignedTo: 'user-1',
    dueDate: expirationDate,
    projectId,
  };
}

/**
 * Create task from missing survey data
 */
export function createTaskFromMissingData(
  projectId: string,
  projectName: string,
  companyId: string,
  missingFields: string[]
): AutoTaskConfig {
  return {
    title: `Request missing information for ${projectName}`,
    description: `The following required information is missing:\n\n${missingFields.map(f => `- ${f}`).join('\n')}\n\nPlease send a follow-up email requesting this information.`,
    type: 'FOLLOW_UP',
    priority: 'MEDIUM',
    assignedTo: 'user-1',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    projectId,
    companyId,
  };
}

/**
 * Generate full task object from config
 */
export function generateTaskFromConfig(config: AutoTaskConfig): Task {
  const now = new Date().toISOString();

  return {
    id: `task-auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: config.title,
    description: config.description,
    type: config.type,
    status: 'TODO',
    priority: config.priority,
    assignedTo: config.assignedTo,
    assignedBy: 'system',
    assignedAt: now,
    companyId: config.companyId,
    projectId: config.projectId,
    dueDate: config.dueDate,
    progress: 0,
    tags: ['auto-generated'],
    reminderSent: false,
    isRecurring: false,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };
}
