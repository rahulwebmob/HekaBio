/**
 * Task Templates
 * Predefined task templates for common workflows
 */

import type { TaskType, TaskPriority } from '../types/task.types';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  estimatedHours?: number;
  category: 'GATE_REVIEW' | 'DD' | 'COMMUNICATION' | 'FOLLOW_UP' | 'GENERAL';
  checklist?: {
    text: string;
  }[];
  tags: string[];
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // Gate Review Templates
  {
    id: 'gate-1-review',
    name: 'Conduct Gate 1 Review',
    description: 'Review project for Gate 1 approval (Data Gathering)',
    type: 'REVIEW',
    priority: 'HIGH',
    estimatedHours: 2,
    category: 'GATE_REVIEW',
    checklist: [
      { text: 'Review survey responses for completeness' },
      { text: 'Check data extraction results' },
      { text: 'Verify lead score calculation' },
      { text: 'Identify missing critical information' },
      { text: 'Document decision and reasoning' },
    ],
    tags: ['gate-review', 'gate-1'],
  },
  {
    id: 'gate-2-review',
    name: 'Conduct Gate 2 Review',
    description: 'Review project for Gate 2 approval (1-on-1 Meeting)',
    type: 'REVIEW',
    priority: 'HIGH',
    estimatedHours: 3,
    category: 'GATE_REVIEW',
    checklist: [
      { text: 'Review Japan screening summary' },
      { text: 'Analyze lead score details' },
      { text: 'Schedule 1-on-1 meeting with product owner' },
      { text: 'Conduct meeting and gather additional insights' },
      { text: 'Assess partner fit' },
      { text: 'Make decision and document reasoning' },
    ],
    tags: ['gate-review', 'gate-2', 'meeting'],
  },
  {
    id: 'gate-3-review',
    name: 'Conduct Gate 3 Review',
    description: 'Senior decision maker review for final approval',
    type: 'REVIEW',
    priority: 'URGENT',
    estimatedHours: 4,
    category: 'GATE_REVIEW',
    checklist: [
      { text: 'Review complete DD report' },
      { text: 'Assess executive summary and key findings' },
      { text: 'Evaluate risks and mitigation strategies' },
      { text: 'Review financial projections' },
      { text: 'Make final proceed/renegotiate/decline decision' },
      { text: 'Allocate budget and resources if approved' },
    ],
    tags: ['gate-review', 'gate-3', 'senior-decision'],
  },

  // Due Diligence Templates
  {
    id: 'dd-scientific-review',
    name: 'Complete Scientific DD Section',
    description: 'Conduct scientific due diligence analysis',
    type: 'RESEARCH',
    priority: 'HIGH',
    estimatedHours: 8,
    category: 'DD',
    checklist: [
      { text: 'Review preclinical data' },
      { text: 'Analyze mechanism of action' },
      { text: 'Evaluate scientific publications' },
      { text: 'Assess competitive landscape' },
      { text: 'Document findings and risks' },
      { text: 'Provide recommendation' },
    ],
    tags: ['due-diligence', 'scientific'],
  },
  {
    id: 'dd-clinical-review',
    name: 'Complete Clinical DD Section',
    description: 'Conduct clinical due diligence analysis',
    type: 'RESEARCH',
    priority: 'HIGH',
    estimatedHours: 8,
    category: 'DD',
    checklist: [
      { text: 'Review clinical trial data and results' },
      { text: 'Analyze endpoint selection and rationale' },
      { text: 'Evaluate patient population' },
      { text: 'Assess safety profile' },
      { text: 'Review investigator qualifications' },
      { text: 'Document findings and recommendations' },
    ],
    tags: ['due-diligence', 'clinical'],
  },
  {
    id: 'dd-regulatory-review',
    name: 'Complete Regulatory DD Section',
    description: 'Conduct regulatory due diligence analysis',
    type: 'RESEARCH',
    priority: 'HIGH',
    estimatedHours: 6,
    category: 'DD',
    checklist: [
      { text: 'Review regulatory pathway and strategy' },
      { text: 'Assess FDA/EMA interactions' },
      { text: 'Evaluate orphan drug designation status' },
      { text: 'Review manufacturing and quality compliance' },
      { text: 'Identify regulatory risks' },
      { text: 'Document recommendations' },
    ],
    tags: ['due-diligence', 'regulatory'],
  },
  {
    id: 'dd-ip-review',
    name: 'Complete IP DD Section',
    description: 'Conduct intellectual property due diligence',
    type: 'RESEARCH',
    priority: 'HIGH',
    estimatedHours: 6,
    category: 'DD',
    checklist: [
      { text: 'Review patent portfolio' },
      { text: 'Assess patent expiration dates' },
      { text: 'Evaluate freedom to operate' },
      { text: 'Identify potential IP conflicts' },
      { text: 'Review licensing agreements' },
      { text: 'Document IP risks and recommendations' },
    ],
    tags: ['due-diligence', 'intellectual-property'],
  },

  // Communication Templates
  {
    id: 'send-survey-invitation',
    name: 'Send Survey Invitation',
    description: 'Send survey invitation email to product owner',
    type: 'FOLLOW_UP',
    priority: 'MEDIUM',
    estimatedHours: 0.5,
    category: 'COMMUNICATION',
    checklist: [
      { text: 'Prepare personalized email' },
      { text: 'Include survey link' },
      { text: 'Set expectations for timeline' },
      { text: 'Send email' },
      { text: 'Track response' },
    ],
    tags: ['email', 'survey', 'outreach'],
  },
  {
    id: 'follow-up-missing-info',
    name: 'Follow Up on Missing Information',
    description: 'Request missing information from product owner',
    type: 'FOLLOW_UP',
    priority: 'HIGH',
    estimatedHours: 1,
    category: 'COMMUNICATION',
    checklist: [
      { text: 'Identify specific missing fields' },
      { text: 'Draft focused follow-up email' },
      { text: 'Set clear deadline for response' },
      { text: 'Send email' },
      { text: 'Schedule reminder if no response' },
    ],
    tags: ['email', 'follow-up', 'data-gathering'],
  },
  {
    id: 'schedule-review-meeting',
    name: 'Schedule Review Meeting',
    description: 'Schedule and conduct review meeting with stakeholders',
    type: 'MEETING',
    priority: 'MEDIUM',
    estimatedHours: 2,
    category: 'COMMUNICATION',
    checklist: [
      { text: 'Identify participants' },
      { text: 'Find suitable time slot' },
      { text: 'Send calendar invitation' },
      { text: 'Prepare meeting agenda' },
      { text: 'Conduct meeting' },
      { text: 'Document meeting notes and action items' },
    ],
    tags: ['meeting', 'collaboration'],
  },

  // Follow-up Templates
  {
    id: 'nda-initiation',
    name: 'Initiate NDA Process',
    description: 'Start NDA process with product owner',
    type: 'FOLLOW_UP',
    priority: 'HIGH',
    estimatedHours: 2,
    category: 'FOLLOW_UP',
    checklist: [
      { text: 'Determine NDA type (mutual/one-way)' },
      { text: 'Prepare NDA document' },
      { text: 'Send NDA for internal review' },
      { text: 'Send NDA to product owner' },
      { text: 'Track signature status' },
      { text: 'File signed NDA' },
    ],
    tags: ['nda', 'legal', 'contract'],
  },
  {
    id: 'nda-renewal',
    name: 'Renew Expiring NDA',
    description: 'Renew NDA before expiration',
    type: 'FOLLOW_UP',
    priority: 'HIGH',
    estimatedHours: 1.5,
    category: 'FOLLOW_UP',
    checklist: [
      { text: 'Review existing NDA terms' },
      { text: 'Determine if renewal is needed' },
      { text: 'Prepare renewal document' },
      { text: 'Send to product owner' },
      { text: 'Track signature' },
      { text: 'Update records' },
    ],
    tags: ['nda', 'renewal', 'legal'],
  },

  // General Templates
  {
    id: 'update-project-status',
    name: 'Update Project Status',
    description: 'Update project information and stage',
    type: 'GENERAL',
    priority: 'MEDIUM',
    estimatedHours: 0.5,
    category: 'GENERAL',
    checklist: [
      { text: 'Review current project status' },
      { text: 'Update project fields' },
      { text: 'Move to appropriate stage if needed' },
      { text: 'Add status notes' },
      { text: 'Notify stakeholders' },
    ],
    tags: ['project-management', 'status-update'],
  },
  {
    id: 'prepare-contract',
    name: 'Prepare Contract Documentation',
    description: 'Prepare contract documentation after Gate 3 approval',
    type: 'GENERAL',
    priority: 'URGENT',
    estimatedHours: 8,
    category: 'GENERAL',
    checklist: [
      { text: 'Review DD recommendations' },
      { text: 'Draft contract terms based on findings' },
      { text: 'Prepare exhibits and schedules' },
      { text: 'Internal legal review' },
      { text: 'Send to counterparty' },
      { text: 'Negotiate terms' },
      { text: 'Finalize and execute' },
    ],
    tags: ['contract', 'legal', 'negotiation'],
  },
  {
    id: 'review-stalled-project',
    name: 'Review Stalled Project',
    description: 'Review and update project with no recent activity',
    type: 'REVIEW',
    priority: 'MEDIUM',
    estimatedHours: 1,
    category: 'GENERAL',
    checklist: [
      { text: 'Review project history' },
      { text: 'Identify reasons for stalling' },
      { text: 'Contact stakeholders for update' },
      { text: 'Decide on next steps' },
      { text: 'Update project status or close if no longer relevant' },
    ],
    tags: ['project-management', 'review'],
  },
];

/**
 * Get template by ID
 */
export function getTaskTemplate(id: string): TaskTemplate | undefined {
  return TASK_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTaskTemplatesByCategory(category: TaskTemplate['category']): TaskTemplate[] {
  return TASK_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get all template categories
 */
export function getTaskTemplateCategories(): TaskTemplate['category'][] {
  return ['GATE_REVIEW', 'DD', 'COMMUNICATION', 'FOLLOW_UP', 'GENERAL'];
}
