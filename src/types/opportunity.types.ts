/**
 * Opportunity Types
 * Pre-project lightweight tracking for lead qualification
 */

import type { ID, Timestamp } from './common.types';
import type { Company } from './addressBook.types';
import type { ProjectTag } from './project.types';

// ===== Opportunity Source =====
export type OpportunitySource =
  | 'INBOUND_INQUIRY'
  | 'CONFERENCE'
  | 'REFERRAL'
  | 'COLD_OUTREACH'
  | 'PARTNERSHIP'
  | 'INVESTOR_INTRO'
  | 'WEB_FORM'
  | 'LINKEDIN'
  | 'OTHER';

// ===== Opportunity Status =====
export type OpportunityStatus =
  | 'NEW' // Just received
  | 'REVIEWING' // Under initial review
  | 'ASSESSING' // Quick assessment in progress
  | 'AWAITING_DECISION' // Assessment complete, awaiting go/no-go
  | 'APPROVED' // Go decision made, ready to convert
  | 'CONVERTED' // Converted to full project
  | 'DECLINED' // No-go decision made
  | 'ON_HOLD' // Temporarily paused
  | 'ARCHIVED'; // Archived

// ===== Opportunity Priority =====
export type OpportunityPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// ===== Strategic Fit Rating =====
export type StrategicFitRating = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NOT_ASSESSED';

// ===== Technology Readiness Level (TRL) =====
export type TechnologyReadinessLevel =
  | 'TRL_1' // Basic principles observed
  | 'TRL_2' // Technology concept formulated
  | 'TRL_3' // Experimental proof of concept
  | 'TRL_4' // Technology validated in lab
  | 'TRL_5' // Technology validated in relevant environment
  | 'TRL_6' // Technology demonstrated in relevant environment
  | 'TRL_7' // System prototype demonstration
  | 'TRL_8' // System complete and qualified
  | 'TRL_9'; // Actual system proven

// ===== Quick Assessment =====
export interface QuickAssessment {
  id: ID;
  opportunityId: ID;

  // Basic Evaluation
  technologyDescription: string;
  therapeuticArea?: string[];
  indication?: string;
  trl?: TechnologyReadinessLevel;
  developmentStage?: string;

  // Strategic Fit
  strategicFit: StrategicFitRating;
  strategicFitNotes?: string;
  alignsWithFocus: boolean; // Does it align with our focus areas?
  japanMarketPotential?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

  // Market Assessment
  marketSizeEstimate?: string; // e.g., "$5B", "500k patients"
  competitiveLandscape?: string; // Brief competitive overview
  unmetNeed?: string; // Description of unmet medical need

  // Team & Organization
  teamStrength?: 'STRONG' | 'ADEQUATE' | 'WEAK' | 'UNKNOWN';
  teamNotes?: string;
  previousExperience?: string; // Prior exits, drug development experience

  // Financial
  currentFundingStatus?: string; // e.g., "Seed funded $2M", "Bootstrapped"
  fundingNeeds?: string;
  runway?: string; // e.g., "12 months", "Unknown"

  // IP Assessment
  ipStatus?: 'STRONG' | 'ADEQUATE' | 'WEAK' | 'UNKNOWN';
  ipNotes?: string;

  // Key Strengths (positive signals)
  keyStrengths: string[];

  // Red Flags (concerns)
  redFlags: string[];

  // Overall Recommendation
  recommendation: 'STRONG_GO' | 'GO' | 'MAYBE' | 'NO_GO' | 'NEEDS_MORE_INFO';
  recommendationRationale: string;

  // Assessor
  assessedBy: ID;
  assessedByName: string;
  assessedAt: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ===== Go/No-Go Decision =====
export type DecisionType = 'GO' | 'NO_GO' | 'DEFER' | 'REQUEST_MORE_INFO';

export interface GoNoGoDecision {
  id: ID;
  opportunityId: ID;

  // Decision
  decision: DecisionType;
  decisionRationale: string;
  decisionDate: Timestamp;

  // Decision Maker
  decidedBy: ID;
  decidedByName: string;

  // If GO
  suggestedProjectTag?: ProjectTag; // What type of project should it become?
  nextSteps?: string[];
  estimatedTimeline?: string;

  // If NO_GO
  declineReason?: string;
  declineCategory?:
    | 'NOT_STRATEGIC_FIT'
    | 'TOO_EARLY_STAGE'
    | 'INSUFFICIENT_DATA'
    | 'IP_CONCERNS'
    | 'MARKET_CONCERNS'
    | 'TEAM_CONCERNS'
    | 'COMPETITIVE_LANDSCAPE'
    | 'OTHER';

  // If DEFER
  deferUntil?: Timestamp;
  deferReason?: string;

  // If REQUEST_MORE_INFO
  informationNeeded?: string[];

  // Metadata
  createdAt: Timestamp;
}

// ===== Opportunity =====
export interface Opportunity {
  id: ID;

  // Basic Information
  name: string;
  company: Company;
  description?: string;
  tags: ProjectTag[]; // Potential project type(s)

  // Status & Priority
  status: OpportunityStatus;
  priority: OpportunityPriority;

  // Source
  source: OpportunitySource;
  sourceDetails?: string; // e.g., "Met at JP Morgan 2024", "Referred by John Doe"
  referredBy?: string;

  // Contact Information
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;

  // Assessment
  quickAssessment?: QuickAssessment;
  assessmentCompletedAt?: Timestamp;

  // Decision
  goNoGoDecision?: GoNoGoDecision;
  decisionMadeAt?: Timestamp;

  // Conversion
  convertedToProjectId?: ID; // If converted, reference to project
  convertedAt?: Timestamp;

  // Assignment
  assignedTo?: ID;
  assignedToName?: string;

  // Timeline
  estimatedDecisionDate?: Timestamp; // When do we need to decide?
  followUpDate?: Timestamp; // When to follow up

  // Notes & Documents
  notes?: string;
  documentUrls?: string[];

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
  createdByName: string;
}

// ===== Opportunity Filters =====
export interface OpportunityFilters {
  status?: OpportunityStatus[];
  priority?: OpportunityPriority[];
  tags?: ProjectTag[];
  source?: OpportunitySource[];
  assignedTo?: ID[];
  strategicFit?: StrategicFitRating[];
  search?: string;
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
}

// ===== Helper Labels =====
export const OPPORTUNITY_SOURCE_LABELS: Record<OpportunitySource, string> = {
  INBOUND_INQUIRY: 'Inbound Inquiry',
  CONFERENCE: 'Conference',
  REFERRAL: 'Referral',
  COLD_OUTREACH: 'Cold Outreach',
  PARTNERSHIP: 'Partnership',
  INVESTOR_INTRO: 'Investor Introduction',
  WEB_FORM: 'Web Form',
  LINKEDIN: 'LinkedIn',
  OTHER: 'Other',
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  NEW: 'New',
  REVIEWING: 'Reviewing',
  ASSESSING: 'Assessing',
  AWAITING_DECISION: 'Awaiting Decision',
  APPROVED: 'Approved',
  CONVERTED: 'Converted',
  DECLINED: 'Declined',
  ON_HOLD: 'On Hold',
  ARCHIVED: 'Archived',
};

export const OPPORTUNITY_PRIORITY_LABELS: Record<OpportunityPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const STRATEGIC_FIT_LABELS: Record<StrategicFitRating, string> = {
  EXCELLENT: 'Excellent Fit',
  GOOD: 'Good Fit',
  FAIR: 'Fair Fit',
  POOR: 'Poor Fit',
  NOT_ASSESSED: 'Not Assessed',
};

export const TRL_LABELS: Record<TechnologyReadinessLevel, string> = {
  TRL_1: 'TRL 1: Basic Principles',
  TRL_2: 'TRL 2: Concept Formulated',
  TRL_3: 'TRL 3: Proof of Concept',
  TRL_4: 'TRL 4: Lab Validation',
  TRL_5: 'TRL 5: Relevant Environment Validation',
  TRL_6: 'TRL 6: Relevant Environment Demo',
  TRL_7: 'TRL 7: Prototype Demo',
  TRL_8: 'TRL 8: System Complete',
  TRL_9: 'TRL 9: System Proven',
};

export const DECISION_TYPE_LABELS: Record<DecisionType, string> = {
  GO: 'Go - Proceed',
  NO_GO: 'No Go - Decline',
  DEFER: 'Defer - Revisit Later',
  REQUEST_MORE_INFO: 'Request More Information',
};

// ===== Helper Functions =====

// Get status variant for Badge component
export function getOpportunityStatusVariant(
  status: OpportunityStatus
): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'NEW':
      return 'info';
    case 'REVIEWING':
    case 'ASSESSING':
      return 'default';
    case 'AWAITING_DECISION':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'CONVERTED':
      return 'success';
    case 'DECLINED':
      return 'error';
    case 'ON_HOLD':
      return 'warning';
    case 'ARCHIVED':
      return 'default';
    default:
      return 'default';
  }
}

// Get priority variant
export function getOpportunityPriorityVariant(
  priority: OpportunityPriority
): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (priority) {
    case 'LOW':
      return 'default';
    case 'MEDIUM':
      return 'info';
    case 'HIGH':
      return 'warning';
    case 'URGENT':
      return 'error';
    default:
      return 'default';
  }
}

// Get strategic fit variant
export function getStrategicFitVariant(
  fit: StrategicFitRating
): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (fit) {
    case 'EXCELLENT':
      return 'success';
    case 'GOOD':
      return 'info';
    case 'FAIR':
      return 'warning';
    case 'POOR':
      return 'error';
    case 'NOT_ASSESSED':
      return 'default';
    default:
      return 'default';
  }
}

// Check if opportunity needs attention
export function needsAttention(opportunity: Opportunity): boolean {
  // Needs attention if:
  // 1. Status is NEW or REVIEWING for more than 7 days
  // 2. Status is AWAITING_DECISION
  // 3. Priority is URGENT
  // 4. Follow-up date is past

  if (opportunity.priority === 'URGENT') return true;
  if (opportunity.status === 'AWAITING_DECISION') return true;

  const now = new Date();

  if (opportunity.followUpDate) {
    const followUp = new Date(opportunity.followUpDate);
    if (followUp < now) return true;
  }

  if (opportunity.status === 'NEW' || opportunity.status === 'REVIEWING') {
    const created = new Date(opportunity.createdAt);
    const daysSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated > 7) return true;
  }

  return false;
}

// Get recommended action for opportunity
export function getRecommendedAction(opportunity: Opportunity): string {
  if (opportunity.status === 'NEW') {
    return 'Start initial review';
  }
  if (opportunity.status === 'REVIEWING') {
    return 'Complete quick assessment';
  }
  if (opportunity.status === 'ASSESSING' && !opportunity.quickAssessment) {
    return 'Submit assessment';
  }
  if (opportunity.status === 'AWAITING_DECISION') {
    return 'Make go/no-go decision';
  }
  if (opportunity.status === 'APPROVED') {
    return 'Convert to project';
  }
  return 'Review opportunity';
}
