/**
 * Pipeline Types
 * Business development pipeline and opportunity tracking
 */

import type { ID, Timestamp, Currency } from './common.types';
import type { Company } from './addressBook.types';
import type { Project } from './project.types';

/**
 * Pipeline Stage
 * Represents different stages in the business development funnel
 */
export type PipelineStage =
  | 'LEAD' // Initial contact/inquiry
  | 'QUALIFIED' // Lead has been qualified
  | 'PROPOSAL' // Proposal/quote sent
  | 'NEGOTIATION' // In contract negotiation
  | 'VERBAL_COMMIT' // Verbal commitment received
  | 'WON' // Deal closed successfully
  | 'LOST'; // Deal lost

/**
 * Win/Loss Reason
 */
export type WinReason = 'BEST_PRICE' | 'BEST_TECHNOLOGY' | 'RELATIONSHIP' | 'TIMELINE' | 'OTHER';

export type LossReason =
  | 'PRICE_TOO_HIGH'
  | 'TIMELINE_MISMATCH'
  | 'COMPETITOR_CHOSEN'
  | 'PROJECT_CANCELLED'
  | 'NO_RESPONSE'
  | 'NOT_QUALIFIED'
  | 'OTHER';

/**
 * Opportunity Probability
 * Estimated likelihood of closing the deal
 */
export type OpportunityProbability = 0 | 10 | 25 | 50 | 75 | 90 | 100;

/**
 * Pipeline Opportunity
 * Represents a business opportunity in the pipeline
 */
export interface PipelineOpportunity {
  id: ID;
  title: string;
  description?: string;

  // Associated entities
  companyId: ID;
  company: Company;
  projectId?: ID;
  project?: Project;

  // Pipeline status
  stage: PipelineStage;
  probability: OpportunityProbability;

  // Financial details
  estimatedValue: number;
  currency: Currency;
  estimatedCloseDate?: Timestamp;
  actualCloseDate?: Timestamp;

  // Ownership and assignment
  ownerId: ID;
  ownerName: string;
  teamMembers?: ID[];

  // Stage history
  stageHistory: {
    stage: PipelineStage;
    enteredAt: Timestamp;
    exitedAt?: Timestamp;
    durationDays?: number;
  }[];

  // Win/Loss tracking
  outcome?: 'WON' | 'LOST';
  winReason?: WinReason;
  lossReason?: LossReason;
  competitorInfo?: string;

  // Engagement tracking
  lastContactDate?: Timestamp;
  nextFollowUpDate?: Timestamp;
  contactCount: number;

  // Additional metadata
  tags: string[];
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  // System fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

/**
 * Pipeline Stage Statistics
 */
export interface PipelineStageStats {
  stage: PipelineStage;
  count: number;
  totalValue: number;
  averageValue: number;
  averageProbability: number;
  averageDaysInStage: number;
  weightedValue: number; // total value * average probability
}

/**
 * Pipeline Metrics
 */
export interface PipelineMetrics {
  totalOpportunities: number;
  totalValue: number;
  weightedValue: number;
  averageDealSize: number;
  winRate: number; // percentage of won deals
  averageSalesCycle: number; // days from lead to close
  conversionRateByStage: Record<PipelineStage, number>;
  stageStats: PipelineStageStats[];
}

/**
 * Pipeline Filters
 */
export interface PipelineFilters {
  stages?: PipelineStage[];
  ownerId?: ID;
  companyId?: ID;
  minValue?: number;
  maxValue?: number;
  probability?: OpportunityProbability[];
  tags?: string[];
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
}

/**
 * Stage configuration
 */
export interface StageConfig {
  stage: PipelineStage;
  label: string;
  color: string;
  defaultProbability: OpportunityProbability;
  order: number;
  isActive: boolean; // Won/Lost are terminal stages
}

export const PIPELINE_STAGE_CONFIG: Record<PipelineStage, StageConfig> = {
  LEAD: {
    stage: 'LEAD',
    label: 'Lead',
    color: 'gray',
    defaultProbability: 10,
    order: 1,
    isActive: true,
  },
  QUALIFIED: {
    stage: 'QUALIFIED',
    label: 'Qualified',
    color: 'blue',
    defaultProbability: 25,
    order: 2,
    isActive: true,
  },
  PROPOSAL: {
    stage: 'PROPOSAL',
    label: 'Proposal',
    color: 'purple',
    defaultProbability: 50,
    order: 3,
    isActive: true,
  },
  NEGOTIATION: {
    stage: 'NEGOTIATION',
    label: 'Negotiation',
    color: 'orange',
    defaultProbability: 75,
    order: 4,
    isActive: true,
  },
  VERBAL_COMMIT: {
    stage: 'VERBAL_COMMIT',
    label: 'Verbal Commit',
    color: 'yellow',
    defaultProbability: 90,
    order: 5,
    isActive: true,
  },
  WON: {
    stage: 'WON',
    label: 'Won',
    color: 'green',
    defaultProbability: 100,
    order: 6,
    isActive: false,
  },
  LOST: {
    stage: 'LOST',
    label: 'Lost',
    color: 'red',
    defaultProbability: 0,
    order: 7,
    isActive: false,
  },
};

/**
 * Get active pipeline stages (excludes Won/Lost)
 */
export const getActiveStages = (): PipelineStage[] => {
  return Object.values(PIPELINE_STAGE_CONFIG)
    .filter((config) => config.isActive)
    .sort((a, b) => a.order - b.order)
    .map((config) => config.stage);
};

/**
 * Get all pipeline stages in order
 */
export const getAllStages = (): PipelineStage[] => {
  return Object.values(PIPELINE_STAGE_CONFIG)
    .sort((a, b) => a.order - b.order)
    .map((config) => config.stage);
};
