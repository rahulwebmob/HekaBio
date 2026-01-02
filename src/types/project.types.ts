/**
 * Project & Pipeline Types (Phase 1)
 */

import type { ID, Timestamp } from './common.types';
import type { Company } from './addressBook.types';

// ===== Project Tag =====
export type ProjectTag = 'Strategic Portfolio' | 'Finders' | 'Development Services';

// ===== Stage Types =====
export type Stage =
  // Strategic Portfolio Stages
  | 'LOBBY'
  | 'SURVEY_1'
  | 'SURVEY_2'
  | 'JAPAN_EARLY_ASSESSMENT'
  | 'NDA'
  | 'SURVEY_3'
  | 'DUE_DILIGENCE'
  | 'CONTRACT_DECISION'
  // Finders Stages
  | 'DATA_ANALYSIS'
  | 'CONTRACT_DECISION_FINDERS'
  | 'OUTREACH_LIST'
  | 'MAKE_INTRODUCTIONS'
  | 'REVENUE_GENERATED';

export const StageLabels: Record<Stage, string> = {
  LOBBY: 'Lobby',
  SURVEY_1: 'Survey 1',
  SURVEY_2: 'Survey 2',
  JAPAN_EARLY_ASSESSMENT: 'Japan Early Assessment',
  NDA: 'NDA',
  SURVEY_3: 'Survey 3',
  DUE_DILIGENCE: 'Due Diligence',
  CONTRACT_DECISION: 'Contract Decision',
  DATA_ANALYSIS: 'Data Analysis',
  CONTRACT_DECISION_FINDERS: 'Contract Decision (Finders)',
  OUTREACH_LIST: 'Outreach List',
  MAKE_INTRODUCTIONS: 'Make Introductions',
  REVENUE_GENERATED: 'Revenue Generated',
};

// Stage workflows by project tag
export const StageWorkflows: Record<ProjectTag, Stage[]> = {
  'Strategic Portfolio': [
    'LOBBY',
    'SURVEY_1',
    'SURVEY_2',
    'JAPAN_EARLY_ASSESSMENT',
    'NDA',
    'SURVEY_3',
    'DUE_DILIGENCE',
    'CONTRACT_DECISION',
  ],
  Finders: [
    'LOBBY',
    'DATA_ANALYSIS',
    'CONTRACT_DECISION_FINDERS',
    'OUTREACH_LIST',
    'MAKE_INTRODUCTIONS',
    'REVENUE_GENERATED',
  ],
  'Development Services': ['LOBBY', 'DATA_ANALYSIS', 'CONTRACT_DECISION'],
};

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
  name: string;
  company: Company;
  tags: ProjectTag[];
  description?: string;

  // Stage & Workflow
  currentStage: Stage;
  stageHistory: StageChange[];

  // Scoring & Assessment
  score: number; // 0-100
  scoreBreakdown?: ScoreBreakdown;
  lastScoredAt?: Timestamp;

  // Japan Market
  japanInterest: boolean;
  japanMarketFit?: JapanMarketFit;
  japanSummary?: string;
  japanScreeningCompletedAt?: Timestamp;

  // Partner Network
  partnerTags: string[]; // Internal tags for potential partners

  // NDA
  ndaStatus: NDAStatus;
  ndaRequestedAt?: Timestamp;
  ndaCompletedAt?: Timestamp;

  // Due Diligence
  ddProgress?: number; // 0-100 percentage
  ddStartedAt?: Timestamp;
  ddCompletedAt?: Timestamp;

  // Contract
  contractStatus?: ContractStatus;
  contractDecisionAt?: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
  assignedTo?: ID[];

  // Flags
  isStalled?: boolean; // No activity > 30 days
  isHot?: boolean; // Score > 80 && Japan interest
  isDiamond?: boolean; // Strategic + High potential
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

// ===== Gate Decision =====
export type GateType = 'GATE_1' | 'GATE_2' | 'GATE_3';
export type GateDecisionType = 'APPROVE' | 'HOLD' | 'CLOSE' | 'REQUEST_INFO';

export interface GateDecision {
  id: ID;
  projectId: ID;
  gate: GateType;
  decision: GateDecisionType;
  reviewer: ID;
  reviewerName: string;
  reviewedAt: Timestamp;
  reasoning: string;
  nextSteps?: string;
}

// ===== Project Filters =====
export interface ProjectFilters {
  tags?: ProjectTag[];
  stages?: Stage[];
  scoreMin?: number;
  scoreMax?: number;
  japanInterest?: boolean;
  japanMarketFit?: JapanMarketFit[];
  ndaStatus?: NDAStatus[];
  contractStatus?: ContractStatus[];
  assignedTo?: ID[];
  partnerTags?: string[];
  isHot?: boolean;
  isDiamond?: boolean;
  isStalled?: boolean;
  search?: string;
  dateFrom?: Timestamp;
  dateTo?: Timestamp;
}

// ===== Project Statistics =====
export interface ProjectStats {
  total: number;
  byStage: Record<Stage, number>;
  byTag: Record<ProjectTag, number>;
  byJapanFit: Record<JapanMarketFit, number>;
  averageScore: number;
  hotCount: number;
  diamondCount: number;
  stalledCount: number;
}
