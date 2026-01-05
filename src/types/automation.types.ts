/**
 * Automation Types (Phase 1)
 * Workflow automation rules and actions
 */

import type { ID, Timestamp } from './common.types';
import type { Stage, ProjectTag } from './project.types';
import type { TaskPriority } from './task.types';

// ===== Trigger Types =====
export type AutomationTriggerType =
  | 'SURVEY_SUBMITTED'
  | 'SURVEY_STARTED'
  | 'PROJECT_CREATED'
  | 'PROJECT_STAGE_CHANGED'
  | 'PROJECT_SCORE_CHANGED'
  | 'OPPORTUNITY_CREATED'
  | 'OPPORTUNITY_DECISION_MADE'
  | 'GATE_APPROVED'
  | 'GATE_REJECTED'
  | 'NDA_SIGNED'
  | 'NDA_EXPIRING'
  | 'CONTRACT_SIGNED'
  | 'DD_COMPLETED'
  | 'TASK_OVERDUE'
  | 'DATE_REACHED'
  | 'FIELD_CHANGED';

export interface AutomationTrigger {
  type: AutomationTriggerType;

  // Trigger-specific configuration
  config?: {
    // For PROJECT_STAGE_CHANGED
    fromStage?: Stage;
    toStage?: Stage;

    // For PROJECT_SCORE_CHANGED
    scoreThreshold?: number;
    scoreComparison?: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS';

    // For SURVEY_SUBMITTED
    surveyType?: string;

    // For DATE_REACHED (recurring reminders)
    daysBeforeDue?: number;
    daysAfterCreation?: number;

    // For FIELD_CHANGED
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
  };
}

// ===== Condition Types =====
export type ConditionOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'IN'
  | 'NOT_IN'
  | 'IS_EMPTY'
  | 'IS_NOT_EMPTY';

export interface AutomationCondition {
  field: string; // e.g., "project.tag", "project.score", "survey.completionPercentage"
  operator: ConditionOperator;
  value?: any;
  logicalOperator?: 'AND' | 'OR'; // How to combine with next condition
}

// ===== Action Types =====
export type AutomationActionType =
  | 'CREATE_TASK'
  | 'SEND_EMAIL'
  | 'SEND_NOTIFICATION'
  | 'UPDATE_PROJECT_STAGE'
  | 'UPDATE_PROJECT_FIELD'
  | 'ASSIGN_USER'
  | 'ADD_TAG'
  | 'CREATE_DOCUMENT'
  | 'TRIGGER_WEBHOOK'
  | 'WAIT'
  | 'RUN_SCRIPT';

export interface AutomationAction {
  type: AutomationActionType;
  order: number; // Execution order (1, 2, 3...)

  // Action-specific configuration
  config: {
    // For CREATE_TASK
    taskTitle?: string;
    taskDescription?: string;
    taskPriority?: TaskPriority;
    taskAssignee?: ID | 'PROJECT_OWNER' | 'SURVEY_ASSIGNEE' | 'CURRENT_USER';
    taskDueInDays?: number;

    // For SEND_EMAIL
    emailTo?: ID[] | 'PROJECT_OWNER' | 'SURVEY_ASSIGNEE' | 'ALL_STAKEHOLDERS' | 'CURRENT_USER';
    emailTemplateId?: ID;
    emailSubject?: string;
    emailBody?: string;
    emailCc?: ID[];

    // For SEND_NOTIFICATION
    notificationTo?: ID[] | 'PROJECT_OWNER' | 'SURVEY_ASSIGNEE' | 'ALL_STAKEHOLDERS';
    notificationTitle?: string;
    notificationMessage?: string;
    notificationLink?: string;

    // For UPDATE_PROJECT_STAGE
    newStage?: Stage;

    // For UPDATE_PROJECT_FIELD
    fieldName?: string;
    fieldValue?: any;

    // For ASSIGN_USER
    userId?: ID;
    assignmentType?: 'PROJECT_OWNER' | 'DD_LEAD' | 'GATE_REVIEWER';

    // For ADD_TAG
    tag?: ProjectTag;

    // For WAIT
    waitDays?: number;
    waitUntilDate?: Timestamp;

    // For TRIGGER_WEBHOOK
    webhookUrl?: string;
    webhookMethod?: 'GET' | 'POST' | 'PUT';
    webhookPayload?: Record<string, any>;
  };
}

// ===== Automation Rule =====
export type AutomationStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface AutomationRule {
  id: ID;
  name: string;
  description?: string;

  // Rule configuration
  trigger: AutomationTrigger;
  conditions: AutomationCondition[]; // All conditions must be true (AND logic)
  actions: AutomationAction[]; // Executed in order

  // Rule metadata
  status: AutomationStatus;
  isActive: boolean;

  // Execution settings
  executionDelay?: number; // Delay in minutes before executing
  maxExecutionsPerDay?: number; // Rate limiting
  notifyOnError?: boolean;
  retryOnFailure?: boolean;

  // Statistics
  executionCount: number;
  lastExecutedAt?: Timestamp;
  successCount: number;
  failureCount: number;

  // Ownership
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  lastModifiedBy?: ID;
}

// ===== Automation Execution Log =====
export type ExecutionStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

export interface AutomationExecutionLog {
  id: ID;
  ruleId: ID;
  ruleName: string;

  // Execution context
  triggeredBy: AutomationTriggerType;
  triggerData: Record<string, any>; // The event data that triggered this

  // Execution details
  status: ExecutionStatus;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  duration?: number; // milliseconds

  // Results
  conditionsMet: boolean;
  conditionsEvaluated: {
    condition: AutomationCondition;
    result: boolean;
    actualValue?: any;
  }[];

  actionsExecuted: {
    action: AutomationAction;
    status: ExecutionStatus;
    result?: any;
    error?: string;
  }[];

  // Error handling
  error?: string;
  errorStack?: string;
  retryCount: number;
}

// ===== Automation Templates =====
export interface AutomationTemplate {
  id: ID;
  name: string;
  description: string;
  category: 'PROJECT_MANAGEMENT' | 'SURVEYS' | 'GATE_REVIEWS' | 'DD' | 'NOTIFICATIONS' | 'REMINDERS';
  icon?: string;
  isBuiltIn: boolean;

  // Template rule (without IDs and stats)
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];

  // Usage
  usageCount: number;
  isPopular: boolean;
}

// ===== Pre-built Automation Templates =====
export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'template-001',
    name: 'Auto-create DD Task on Survey Submit',
    description: 'Automatically create a due diligence task when a survey is submitted',
    category: 'SURVEYS',
    icon: '📋',
    isBuiltIn: true,
    trigger: {
      type: 'SURVEY_SUBMITTED',
    },
    conditions: [],
    actions: [
      {
        type: 'CREATE_TASK',
        order: 1,
        config: {
          taskTitle: 'Review Survey Submission: {{survey.name}}',
          taskDescription: 'Review and analyze the submitted survey for {{company.name}}',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 3,
        },
      },
      {
        type: 'SEND_NOTIFICATION',
        order: 2,
        config: {
          notificationTo: 'PROJECT_OWNER',
          notificationTitle: 'New Survey Submitted',
          notificationMessage: '{{company.name}} has submitted {{survey.name}}',
          notificationLink: '/surveys/{{survey.id}}',
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-002',
    name: 'Stage Progression Notification',
    description: 'Notify stakeholders when a project moves to a new stage',
    category: 'PROJECT_MANAGEMENT',
    icon: '🚀',
    isBuiltIn: true,
    trigger: {
      type: 'PROJECT_STAGE_CHANGED',
    },
    conditions: [],
    actions: [
      {
        type: 'SEND_EMAIL',
        order: 1,
        config: {
          emailTo: 'ALL_STAKEHOLDERS',
          emailSubject: 'Project Stage Update: {{project.name}}',
          emailBody: 'The project "{{project.name}}" has moved from {{oldStage}} to {{newStage}}.',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Complete {{newStage}} requirements',
          taskDescription: 'Review and complete all requirements for {{newStage}} stage',
          taskPriority: 'MEDIUM',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 7,
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-003',
    name: 'Survey Reminder - 3 Days Before Due',
    description: 'Send reminder email 3 days before survey due date',
    category: 'REMINDERS',
    icon: '⏰',
    isBuiltIn: true,
    trigger: {
      type: 'DATE_REACHED',
      config: {
        daysBeforeDue: 3,
      },
    },
    conditions: [
      {
        field: 'survey.status',
        operator: 'NOT_EQUALS',
        value: 'SUBMITTED',
      },
    ],
    actions: [
      {
        type: 'SEND_EMAIL',
        order: 1,
        config: {
          emailTo: 'SURVEY_ASSIGNEE',
          emailSubject: 'Reminder: Survey Due in 3 Days',
          emailBody: 'This is a reminder that your survey "{{survey.name}}" is due in 3 days. Please complete it at your earliest convenience.',
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-004',
    name: 'High Score Project - Auto Advance',
    description: 'Automatically advance projects with score > 80 to Gate 1',
    category: 'PROJECT_MANAGEMENT',
    icon: '⭐',
    isBuiltIn: true,
    trigger: {
      type: 'PROJECT_SCORE_CHANGED',
      config: {
        scoreThreshold: 80,
        scoreComparison: 'GREATER_THAN',
      },
    },
    conditions: [
      {
        field: 'project.currentStage',
        operator: 'EQUALS',
        value: 'SCREENING',
      },
    ],
    actions: [
      {
        type: 'UPDATE_PROJECT_STAGE',
        order: 1,
        config: {
          newStage: 'SURVEY_1',
        },
      },
      {
        type: 'SEND_NOTIFICATION',
        order: 2,
        config: {
          notificationTo: 'PROJECT_OWNER',
          notificationTitle: 'Project Auto-Advanced to Gate 1',
          notificationMessage: '{{project.name}} scored {{project.score}} and has been advanced to Gate 1 Review',
          notificationLink: '/projects/{{project.id}}',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 3,
        config: {
          taskTitle: 'Prepare Gate 1 Review for {{project.name}}',
          taskDescription: 'Project has been auto-advanced due to high score. Prepare Gate 1 review materials.',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 5,
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-005',
    name: 'Gate Approval - Notify and Create Tasks',
    description: 'When gate is approved, notify team and create next steps tasks',
    category: 'GATE_REVIEWS',
    icon: '✅',
    isBuiltIn: true,
    trigger: {
      type: 'GATE_APPROVED',
    },
    conditions: [],
    actions: [
      {
        type: 'SEND_EMAIL',
        order: 1,
        config: {
          emailTo: 'ALL_STAKEHOLDERS',
          emailSubject: '🎉 Gate Approved: {{project.name}}',
          emailBody: 'Great news! The {{gateName}} for {{project.name}} has been approved. Next steps will be assigned shortly.',
        },
      },
      {
        type: 'UPDATE_PROJECT_STAGE',
        order: 2,
        config: {
          newStage: 'SURVEY_2', // This would be dynamic based on current gate
        },
      },
      {
        type: 'CREATE_TASK',
        order: 3,
        config: {
          taskTitle: 'Begin {{nextStage}} activities',
          taskDescription: 'Start work on {{nextStage}} stage activities',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 1,
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-006',
    name: 'NDA Expiring - Alert 30 Days Before',
    description: 'Alert stakeholders when NDA is expiring in 30 days',
    category: 'NOTIFICATIONS',
    icon: '📄',
    isBuiltIn: true,
    trigger: {
      type: 'NDA_EXPIRING',
      config: {
        daysBeforeDue: 30,
      },
    },
    conditions: [],
    actions: [
      {
        type: 'SEND_EMAIL',
        order: 1,
        config: {
          emailTo: 'PROJECT_OWNER',
          emailSubject: 'NDA Expiring Soon: {{company.name}}',
          emailBody: 'The NDA with {{company.name}} will expire in 30 days. Please review and renew if needed.',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Review NDA Renewal for {{company.name}}',
          taskDescription: 'NDA expires on {{nda.expiryDate}}. Determine if renewal is needed.',
          taskPriority: 'MEDIUM',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 15,
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-007',
    name: 'Opportunity Decision - Create Project',
    description: 'When opportunity is approved (GO decision), automatically convert to project',
    category: 'PROJECT_MANAGEMENT',
    icon: '💡',
    isBuiltIn: true,
    trigger: {
      type: 'OPPORTUNITY_DECISION_MADE',
    },
    conditions: [
      {
        field: 'opportunity.decision',
        operator: 'EQUALS',
        value: 'PROCEED_TO_GATE_1',
      },
    ],
    actions: [
      {
        type: 'SEND_NOTIFICATION',
        order: 1,
        config: {
          notificationTo: 'PROJECT_OWNER',
          notificationTitle: 'Opportunity Approved - Project Created',
          notificationMessage: '{{opportunity.name}} has been approved and converted to a project',
          notificationLink: '/projects/{{project.id}}',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Send Survey 1 to {{company.name}}',
          taskDescription: 'Opportunity approved. Send initial survey to gather detailed information.',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 2,
        },
      },
    ],
    usageCount: 0,
    isPopular: true,
  },
  {
    id: 'template-008',
    name: 'Task Overdue - Daily Reminder',
    description: 'Send daily reminder for overdue tasks',
    category: 'REMINDERS',
    icon: '🔔',
    isBuiltIn: true,
    trigger: {
      type: 'TASK_OVERDUE',
    },
    conditions: [],
    actions: [
      {
        type: 'SEND_EMAIL',
        order: 1,
        config: {
          emailTo: 'CURRENT_USER',
          emailSubject: 'Overdue Task Reminder: {{task.title}}',
          emailBody: 'Your task "{{task.title}}" was due on {{task.dueDate}}. Please complete it as soon as possible.',
        },
      },
      {
        type: 'SEND_NOTIFICATION',
        order: 2,
        config: {
          notificationTo: 'PROJECT_OWNER',
          notificationTitle: 'Overdue Task',
          notificationMessage: '{{assignee.name}} has an overdue task: {{task.title}}',
          notificationLink: '/tasks/{{task.id}}',
        },
      },
    ],
    usageCount: 0,
    isPopular: false,
  },
];

// ===== Automation Filters =====
export interface AutomationFilters {
  status?: AutomationStatus[];
  trigger?: AutomationTriggerType[];
  category?: AutomationTemplate['category'][];
  search?: string;
  isActive?: boolean;
}

// ===== Helper Functions =====
export function getActionTypeLabel(type: AutomationActionType): string {
  const labels: Record<AutomationActionType, string> = {
    CREATE_TASK: 'Create Task',
    SEND_EMAIL: 'Send Email',
    SEND_NOTIFICATION: 'Send Notification',
    UPDATE_PROJECT_STAGE: 'Update Project Stage',
    UPDATE_PROJECT_FIELD: 'Update Field',
    ASSIGN_USER: 'Assign User',
    ADD_TAG: 'Add Tag',
    CREATE_DOCUMENT: 'Create Document',
    TRIGGER_WEBHOOK: 'Trigger Webhook',
    WAIT: 'Wait',
    RUN_SCRIPT: 'Run Script',
  };
  return labels[type];
}

export function getTriggerTypeLabel(type: AutomationTriggerType): string {
  const labels: Record<AutomationTriggerType, string> = {
    SURVEY_SUBMITTED: 'Survey Submitted',
    SURVEY_STARTED: 'Survey Started',
    PROJECT_CREATED: 'Project Created',
    PROJECT_STAGE_CHANGED: 'Project Stage Changed',
    PROJECT_SCORE_CHANGED: 'Project Score Changed',
    OPPORTUNITY_CREATED: 'Opportunity Created',
    OPPORTUNITY_DECISION_MADE: 'Opportunity Decision Made',
    GATE_APPROVED: 'Gate Approved',
    GATE_REJECTED: 'Gate Rejected',
    NDA_SIGNED: 'NDA Signed',
    NDA_EXPIRING: 'NDA Expiring',
    CONTRACT_SIGNED: 'Contract Signed',
    DD_COMPLETED: 'Due Diligence Completed',
    TASK_OVERDUE: 'Task Overdue',
    DATE_REACHED: 'Date Reached',
    FIELD_CHANGED: 'Field Changed',
  };
  return labels[type];
}
