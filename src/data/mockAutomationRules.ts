/**
 * Mock Automation Rules
 * Pre-configured automation rules for development
 */

import type { AutomationRule } from '../types/automation.types';

export const mockAutomationRules: AutomationRule[] = [
  // Rule 1: Auto-create DD Task on Survey Submit
  {
    id: 'rule-001',
    name: 'Auto-create DD Task on Survey Submit',
    description:
      'Automatically create a due diligence review task when any survey is submitted',
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
          taskDescription:
            'Review and analyze the submitted survey for {{company.name}}. Check for completeness and follow up on any gaps.',
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
    status: 'ACTIVE',
    isActive: true,
    executionCount: 12,
    successCount: 12,
    failureCount: 0,
    lastExecutedAt: '2025-12-20T14:30:00Z',
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-001',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-12-20T14:30:00Z',
  },

  // Rule 2: Stage Progression Notification
  {
    id: 'rule-002',
    name: 'Stage Progression Notification',
    description: 'Notify all stakeholders when a project moves to a new stage',
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
          emailBody:
            'The project "{{project.name}}" has successfully moved from {{oldStage}} to {{newStage}}. Please review any new requirements for this stage.',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Complete {{newStage}} Stage Requirements',
          taskDescription:
            'Review and complete all checklist items and requirements for the {{newStage}} stage',
          taskPriority: 'MEDIUM',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 7,
        },
      },
    ],
    status: 'ACTIVE',
    isActive: true,
    executionCount: 28,
    successCount: 28,
    failureCount: 0,
    lastExecutedAt: '2025-12-19T09:15:00Z',
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-001',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-12-19T09:15:00Z',
  },

  // Rule 3: High Score Project - Auto Advance
  {
    id: 'rule-003',
    name: 'High Score Project - Auto Advance to Gate 1',
    description: 'Automatically advance projects with score > 80 from Screening to Gate 1',
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
          notificationMessage:
            '{{project.name}} scored {{project.score}} and has been automatically advanced to Gate 1 Review',
          notificationLink: '/projects/{{project.id}}',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 3,
        config: {
          taskTitle: 'Prepare Gate 1 Review for {{project.name}}',
          taskDescription:
            'Project has been auto-advanced due to high score ({{project.score}}). Prepare all Gate 1 review materials and schedule the review meeting.',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 5,
        },
      },
    ],
    status: 'ACTIVE',
    isActive: true,
    executionCount: 5,
    successCount: 5,
    failureCount: 0,
    lastExecutedAt: '2025-12-15T16:20:00Z',
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-001',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-12-15T16:20:00Z',
  },

  // Rule 4: Survey Reminder - 3 Days Before Due
  {
    id: 'rule-004',
    name: 'Survey Reminder - 3 Days Before Due',
    description: 'Send reminder email 3 days before survey due date if not yet submitted',
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
          emailSubject: 'Reminder: Survey Due in 3 Days - {{survey.name}}',
          emailBody:
            'This is a friendly reminder that your survey "{{survey.name}}" for {{company.name}} is due in 3 days. Please complete it at your earliest convenience.\n\nClick here to continue: [Survey Link]',
        },
      },
      {
        type: 'SEND_NOTIFICATION',
        order: 2,
        config: {
          notificationTo: 'SURVEY_ASSIGNEE',
          notificationTitle: 'Survey Due Soon',
          notificationMessage: '{{survey.name}} is due in 3 days',
          notificationLink: '/surveys/{{survey.id}}',
        },
      },
    ],
    status: 'ACTIVE',
    isActive: true,
    executionDelay: 0,
    maxExecutionsPerDay: 1,
    executionCount: 18,
    successCount: 18,
    failureCount: 0,
    lastExecutedAt: '2025-12-21T08:00:00Z',
    notifyOnError: false,
    retryOnFailure: true,
    createdBy: 'user-001',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-12-21T08:00:00Z',
  },

  // Rule 5: Opportunity GO Decision - Auto Convert to Project
  {
    id: 'rule-005',
    name: 'Opportunity Approved - Convert to Project',
    description:
      'When opportunity receives GO decision, automatically convert to project and send Survey 1',
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
          notificationMessage:
            '{{opportunity.name}} has been approved and converted to a project. Time to gather detailed information!',
          notificationLink: '/projects/{{project.id}}',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Send Survey 1 to {{company.name}}',
          taskDescription:
            'Opportunity approved! Send the comprehensive Survey 1 (130+ fields) to {{company.name}} to gather detailed information for Gate 1 review.',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 2,
        },
      },
      {
        type: 'ADD_TAG',
        order: 3,
        config: {
          tag: 'Strategic Portfolio',
        },
      },
    ],
    status: 'ACTIVE',
    isActive: true,
    executionCount: 8,
    successCount: 8,
    failureCount: 0,
    lastExecutedAt: '2025-12-18T11:45:00Z',
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-001',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-12-18T11:45:00Z',
  },

  // Rule 6: Gate Approval - Notify and Advance
  {
    id: 'rule-006',
    name: 'Gate Approval - Notify and Advance',
    description: 'When gate is approved, notify team and advance to next stage',
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
          emailBody:
            'Excellent news! The {{gateName}} for {{project.name}} has been approved by the review committee. The project will now advance to the next stage.\n\nNext steps will be assigned shortly.',
        },
      },
      {
        type: 'SEND_NOTIFICATION',
        order: 2,
        config: {
          notificationTo: 'ALL_STAKEHOLDERS',
          notificationTitle: 'Gate Approved!',
          notificationMessage: '{{gateName}} approved for {{project.name}}',
          notificationLink: '/projects/{{project.id}}',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 3,
        config: {
          taskTitle: 'Plan {{nextStage}} Activities',
          taskDescription:
            'Gate approved! Plan and initiate {{nextStage}} stage activities for {{project.name}}',
          taskPriority: 'HIGH',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 2,
        },
      },
    ],
    status: 'ACTIVE',
    isActive: true,
    executionCount: 14,
    successCount: 14,
    failureCount: 0,
    lastExecutedAt: '2025-12-17T15:30:00Z',
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-001',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-12-17T15:30:00Z',
  },

  // Rule 7: NDA Expiring - Alert 30 Days Before (INACTIVE)
  {
    id: 'rule-007',
    name: 'NDA Expiring - Alert 30 Days Before',
    description: 'Alert stakeholders when NDA is expiring in 30 days',
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
          emailBody:
            'The NDA with {{company.name}} will expire in 30 days ({{nda.expiryDate}}). Please review the partnership status and determine if renewal is needed.',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Review NDA Renewal for {{company.name}}',
          taskDescription:
            'NDA expires on {{nda.expiryDate}}. Review partnership status and initiate renewal process if needed.',
          taskPriority: 'MEDIUM',
          taskAssignee: 'PROJECT_OWNER',
          taskDueInDays: 15,
        },
      },
    ],
    status: 'INACTIVE',
    isActive: false,
    executionCount: 0,
    successCount: 0,
    failureCount: 0,
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-002',
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-12-01T09:00:00Z',
    lastModifiedBy: 'user-001',
  },

  // Rule 8: Japan-Tagged Projects - Special Notification (DRAFT)
  {
    id: 'rule-008',
    name: 'Japan-Tagged Projects - Notify Japan Team',
    description: 'When a project is tagged with Japan interest, notify Japan market team',
    trigger: {
      type: 'PROJECT_CREATED',
    },
    conditions: [
      {
        field: 'project.japanInterest',
        operator: 'EQUALS',
        value: true,
      },
    ],
    actions: [
      {
        type: 'SEND_EMAIL',
        order: 1,
        config: {
          emailTo: ['user-japan-001', 'user-japan-002'],
          emailSubject: 'New Japan Market Opportunity: {{project.name}}',
          emailBody:
            'A new project with Japan market interest has been created: {{project.name}} ({{company.name}}). Please review and provide Japan market assessment.',
        },
      },
      {
        type: 'CREATE_TASK',
        order: 2,
        config: {
          taskTitle: 'Japan Market Assessment for {{project.name}}',
          taskDescription:
            'Complete Japan market screening assessment for {{project.name}}',
          taskPriority: 'MEDIUM',
          taskAssignee: 'user-japan-001',
          taskDueInDays: 7,
        },
      },
    ],
    status: 'DRAFT',
    isActive: false,
    executionCount: 0,
    successCount: 0,
    failureCount: 0,
    notifyOnError: true,
    retryOnFailure: true,
    createdBy: 'user-002',
    createdAt: '2025-12-10T14:00:00Z',
    updatedAt: '2025-12-10T14:00:00Z',
  },
];
