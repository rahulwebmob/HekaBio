/**
 * Project & Pipeline Types (Phase 1)
 */

import type { ID, Timestamp } from './common.types';
import type { Company } from './addressBook.types';

// ===== Reach Type =====
// How the project originated (Cold/Warm/Hot Reach)
export type ReachType = 'COLD' | 'WARM' | 'HOT';

export const ReachTypeLabels: Record<ReachType, string> = {
  COLD: 'Cold Reach',
  WARM: 'Warm Reach',
  HOT: 'Hot Reach',
};

// ===== Project Status =====
// Whether project is active business or monitoring
export type ProjectStatus = 'ACTIVE' | 'MONITORING' | 'COMPLETED' | 'ARCHIVED';

// ===== Stage Types =====
// Simplified linear workflow matching client requirements
export type Stage =
  | 'NEW' // Just created from survey/intro deck
  | 'DATA_GATHERING' // Collecting survey/introduction deck data
  | 'SCREENING' // AI analysis + Japanese market analysis
  | 'INTERNAL_REVIEW' // Decision point: Proceed or Monitor
  | 'MONITORING' // In monitoring bucket
  | 'NDA_REQUESTED' // NDA requested from originator
  | 'DUE_DILIGENCE' // Full DD in progress
  | 'PARTNER_MATCHING' // AI matching with potential partners
  | 'OUTREACH' // Reaching out to matched partners
  | 'CONTRACT_NEGOTIATION' // Negotiating contracts
  | 'COMPLETED'; // Successfully closed

export const StageLabels: Record<Stage, string> = {
  NEW: 'New',
  DATA_GATHERING: 'Data Gathering',
  SCREENING: 'Screening',
  INTERNAL_REVIEW: 'Internal Review',
  MONITORING: 'Monitoring',
  NDA_REQUESTED: 'NDA Requested',
  DUE_DILIGENCE: 'Due Diligence',
  PARTNER_MATCHING: 'Partner Matching',
  OUTREACH: 'Partner Outreach',
  CONTRACT_NEGOTIATION: 'Contract Negotiation',
  COMPLETED: 'Completed',
};

// Standard workflow progression
export const STANDARD_WORKFLOW: Stage[] = [
  'NEW',
  'DATA_GATHERING',
  'SCREENING',
  'INTERNAL_REVIEW',
  // Branch 1: MONITORING (stays here until reactivated)
  // Branch 2: Continue with NDA_REQUESTED → DUE_DILIGENCE → etc.
  'NDA_REQUESTED',
  'DUE_DILIGENCE',
  'PARTNER_MATCHING',
  'OUTREACH',
  'CONTRACT_NEGOTIATION',
  'COMPLETED',
];

// ===== Japan Market Fit =====
export type JapanMarketFit = 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_ASSESSED';

// ===== NDA Status =====
export type NDAStatus = 'NOT_REQUIRED' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

// ===== Contract Status =====
export type ContractStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'RENEGOTIATE';

// ===== Project =====
export interface Project {
  id: ID;

  // Basic Info
  name: string; // Format: "CompanyName_DiseaseArea"
  company: Company;
  description?: string;
  diseaseArea?: string; // Disease area for the project

  // Origin & Type
  reachType: ReachType; // COLD, WARM, or HOT reach
  projectStatus: ProjectStatus; // ACTIVE, MONITORING, COMPLETED, ARCHIVED

  // Stage & Workflow
  currentStage: Stage;
  stageHistory: StageChange[];

  // Scoring & Assessment
  score: number; // 0-100, AI-based scoring
  scoreBreakdown?: ScoreBreakdown;
  lastScoredAt?: Timestamp;
  autoScoredBy?: 'AI' | 'MANUAL'; // How score was generated

  // Missing Data Tracking
  missingDataItems?: string[]; // List of missing information
  missingDataFromScreening?: string[]; // Missing items identified during screening
  missingDataLastUpdated?: Timestamp;

  // Japan Market Analysis
  japanInterest: boolean;
  japanMarketFit?: JapanMarketFit;
  japanMarketAnalysis?: string; // AI-generated Japanese market analysis brief
  japanScreeningCompletedAt?: Timestamp;

  // Partner Matching
  matchedPartners?: ID[]; // IDs of matched partner companies
  partnerMatchingCompletedAt?: Timestamp;
  partnerOutreachStatus?: PartnerOutreachStatus[]; // Track outreach to each partner

  // NDA
  ndaStatus: NDAStatus;
  ndaRequestedAt?: Timestamp;
  ndaCompletedAt?: Timestamp;

  // Due Diligence
  ddProgress?: number; // 0-100 percentage
  ddStartedAt?: Timestamp;
  ddCompletedAt?: Timestamp;
  ddWorkspaceId?: ID; // Reference to DD workspace

  // Contract
  contractStatus?: ContractStatus;
  contractDecisionAt?: Timestamp;
  contractIds?: ID[]; // References to Contract records

  // Internal Review Decision
  internalReviewDecision?: 'PROCEED' | 'MONITOR' | 'REJECT' | 'PENDING';
  internalReviewDate?: Timestamp;
  internalReviewNotes?: string;
  internalReviewBy?: ID;

  // Automation & Email Tracking
  thankYouEmailSent?: boolean;
  thankYouEmailSentAt?: Timestamp;
  autoCreatedFrom?: 'SURVEY' | 'INTRO_DECK' | 'MANUAL';

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
  assignedTo?: ID[];

  // Flags
  isStalled?: boolean; // No activity > 30 days
  isHot?: boolean; // Score > threshold (e.g., 80)
  isPriority?: boolean; // High priority project
}

// ===== Partner Outreach Status =====
export interface PartnerOutreachStatus {
  partnerId: ID; // Reference to Company in address book
  partnerName: string;
  status: 'NOT_CONTACTED' | 'CONTACTED' | 'INTERESTED' | 'NOT_INTERESTED' | 'NEGOTIATING' | 'CLOSED';
  contactedAt?: Timestamp;
  contactedBy?: ID;
  responseReceived?: boolean;
  responseDate?: Timestamp;
  interestLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  actionItems?: string[]; // Follow-up tasks
  notes?: string;
  lastUpdated: Timestamp;
}

// ===== Stage Change History =====
export interface StageChange {
  id: ID;
  projectId: ID;
  fromStage: Stage | null;
  toStage: Stage;
  changedBy: ID;
  changedByName: string;
  changedAt: Timestamp;
  reason?: string;
  notes?: string;
}

// ===== Score Breakdown =====
export interface ScoreBreakdown {
  clinicalEvidence: number; // 0-20
  ipStatus: number; // 0-15
  marketTraction: number; // 0-15
  strategicFit: number; // 0-20
  regulatoryClarity: number; // 0-15
  financialHealth: number; // 0-15
  total: number; // sum of above
}

// ===== Scoring Model =====
export interface ScoringModel {
  id: ID;
  version: string; // e.g., "Q1 2025"
  isActive: boolean;
  factors: ScoringFactor[];
  createdAt: Timestamp;
  createdBy: ID;
}

export interface ScoringFactor {
  id: string;
  name: string;
  description: string;
  weight: number; // max points
  criteria: ScoringCriterion[];
}

export interface ScoringCriterion {
  label: string;
  points: number;
  condition: string;
}

// ===== Internal Review Decision (replacing complex gates) =====
export type InternalReviewDecision = 'PROCEED' | 'MONITOR' | 'REJECT' | 'PENDING';

export interface InternalReviewRecord {
  id: ID;
  projectId: ID;
  decision: InternalReviewDecision;
  reviewer: ID;
  reviewerName: string;
  reviewedAt: Timestamp;
  reasoning: string;
  nextSteps?: string;
  conditions?: string[]; // If conditional proceed
}

// ===== Project Filters =====
export interface ProjectFilters {
  reachType?: ReachType[]; // COLD, WARM, HOT
  projectStatus?: ProjectStatus[]; // ACTIVE, MONITORING, COMPLETED, ARCHIVED
  stages?: Stage[];
  scoreMin?: number;
  scoreMax?: number;
  japanInterest?: boolean;
  japanMarketFit?: JapanMarketFit[];
  ndaStatus?: NDAStatus[];
  contractStatus?: ContractStatus[];
  internalReviewDecision?: InternalReviewDecision[];
  assignedTo?: ID[];
  diseaseArea?: string[];
  isHot?: boolean;
  isPriority?: boolean;
  isStalled?: boolean;
  hasMissingData?: boolean;
  search?: string;
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
}

// ===== Saved Filters =====
export interface SavedFilter {
  id: ID;
  name: string;
  description?: string;
  filters: ProjectFilters;
  isPublic: boolean; // Can other users see this filter?
  isDefault?: boolean; // Load this filter by default?
  createdBy: ID;
  createdByName: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  usageCount?: number; // Track how often it's used
}

// ===== Filter Presets =====
export type FilterPresetType =
  | 'HOT_PROSPECTS'
  | 'JAPAN_HIGH_FIT'
  | 'STALLED_PROJECTS'
  | 'PENDING_NDA'
  | 'IN_DD'
  | 'AWAITING_CONTRACT'
  | 'INTERNAL_REVIEW_PENDING'
  | 'MONITORING_BUCKET'
  | 'ACTIVE_BUSINESS'
  | 'PARTNER_MATCHING'
  | 'MISSING_DATA';

export interface FilterPreset {
  type: FilterPresetType;
  name: string;
  description: string;
  icon: string; // Icon name from Tabler Icons
  filters: ProjectFilters;
  badgeColor?: string; // Tailwind color class
}

// ===== Project Statistics =====
export interface ProjectStats {
  total: number;
  byStage: Record<Stage, number>;
  byReachType: Record<ReachType, number>;
  byProjectStatus: Record<ProjectStatus, number>;
  byJapanFit: Record<JapanMarketFit, number>;
  byInternalReview: Record<InternalReviewDecision | 'NOT_REVIEWED', number>;
  averageScore: number;
  hotCount: number;
  priorityCount: number;
  stalledCount: number;
  monitoringCount: number;
  activeBusinessCount: number;
}
