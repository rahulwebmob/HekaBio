/**
 * Gate Review Types
 * Multi-gate vetting workflow for projects
 */

import type { ID, Timestamp } from './common.types';
import type { Project } from './project.types';

/**
 * Gate Numbers
 * Represents different vetting gates in the workflow
 */
export type GateNumber = 1 | 2 | 3;

/**
 * Gate Decision
 * The outcome of a gate review
 */
export type GateDecision = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL' | 'DEFERRED';

/**
 * Gate Status
 * Current status of a gate for a project
 */
export interface GateStatus {
  gateNumber: GateNumber;
  status: GateDecision;
  reviewedAt?: Timestamp;
  reviewedBy?: ID;
  reviewerName?: string;
  reviewerRole?: string;
  decision: GateDecision;
  comments?: string;
  conditions?: string[]; // If conditional approval
  nextReviewDate?: Timestamp; // If deferred
}

/**
 * Gate Checklist Item
 * Items to verify during gate review
 */
export interface GateChecklistItem {
  id: ID;
  text: string;
  category: string;
  required: boolean;
  completed: boolean;
  completedBy?: ID;
  completedAt?: Timestamp;
  notes?: string;
}

/**
 * Gate Review
 * Complete gate review record
 */
export interface GateReview {
  id: ID;
  projectId: ID;
  project?: Project;
  gateNumber: GateNumber;

  // Review details
  decision: GateDecision;
  reviewDate: Timestamp;
  reviewedBy: ID;
  reviewerName: string;
  reviewerRole: string;

  // Checklist
  checklist: GateChecklistItem[];
  checklistCompletionRate: number; // 0-100

  // Decision details
  comments: string;
  strengths?: string[];
  concerns?: string[];
  recommendations?: string[];
  conditions?: string[]; // If conditional approval

  // Scoring (optional)
  technicalScore?: number; // 0-10
  marketScore?: number; // 0-10
  teamScore?: number; // 0-10
  fitScore?: number; // 0-10
  overallScore?: number; // 0-10

  // Follow-up
  nextReviewDate?: Timestamp;
  followUpRequired: boolean;
  followUpTasks?: string[];

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

/**
 * Gate 1 Checklist (Initial Screening)
 * Basic qualification criteria
 */
export const GATE_1_CHECKLIST: Omit<GateChecklistItem, 'id' | 'completed' | 'completedBy' | 'completedAt' | 'notes'>[] = [
  {
    text: 'Company information verified (name, location, website)',
    category: 'Company Details',
    required: true,
  },
  {
    text: 'Primary contact information confirmed',
    category: 'Company Details',
    required: true,
  },
  {
    text: 'Technology/product description is clear',
    category: 'Technology',
    required: true,
  },
  {
    text: 'Disease area/therapeutic focus identified',
    category: 'Technology',
    required: true,
  },
  {
    text: 'Development stage confirmed (preclinical, clinical, etc.)',
    category: 'Technology',
    required: true,
  },
  {
    text: 'Basic market opportunity identified',
    category: 'Market',
    required: false,
  },
  {
    text: 'No obvious red flags or conflicts of interest',
    category: 'Compliance',
    required: true,
  },
  {
    text: 'Introduction deck received and reviewed',
    category: 'Documentation',
    required: true,
  },
  {
    text: 'Survey/initial screening form completed',
    category: 'Documentation',
    required: true,
  },
];

/**
 * Gate 2 Checklist (Detailed Evaluation)
 * In-depth technical and market assessment
 */
export const GATE_2_CHECKLIST: Omit<GateChecklistItem, 'id' | 'completed' | 'completedBy' | 'completedAt' | 'notes'>[] = [
  {
    text: 'Technology/science validated by experts',
    category: 'Technology',
    required: true,
  },
  {
    text: 'Competitive landscape analyzed',
    category: 'Market',
    required: true,
  },
  {
    text: 'Intellectual property status reviewed',
    category: 'Legal',
    required: true,
  },
  {
    text: 'Regulatory pathway identified',
    category: 'Regulatory',
    required: true,
  },
  {
    text: 'Clinical/preclinical data reviewed',
    category: 'Technology',
    required: false,
  },
  {
    text: 'Team capabilities assessed',
    category: 'Team',
    required: true,
  },
  {
    text: 'Financial needs estimated',
    category: 'Business',
    required: false,
  },
  {
    text: 'Partnership model discussed',
    category: 'Business',
    required: true,
  },
  {
    text: 'Japan market fit evaluated',
    category: 'Market',
    required: true,
  },
  {
    text: 'Initial due diligence completed',
    category: 'Due Diligence',
    required: false,
  },
  {
    text: 'Key risks identified and documented',
    category: 'Risk',
    required: true,
  },
  {
    text: 'NDA signed (if applicable)',
    category: 'Legal',
    required: false,
  },
];

/**
 * Gate 3 Checklist (Final Decision)
 * Comprehensive review before partnership decision
 */
export const GATE_3_CHECKLIST: Omit<GateChecklistItem, 'id' | 'completed' | 'completedBy' | 'completedAt' | 'notes'>[] = [
  {
    text: 'Full due diligence completed',
    category: 'Due Diligence',
    required: true,
  },
  {
    text: 'Legal review completed (IP, contracts, compliance)',
    category: 'Legal',
    required: true,
  },
  {
    text: 'Financial model validated',
    category: 'Financial',
    required: true,
  },
  {
    text: 'Executive team interviewed',
    category: 'Team',
    required: true,
  },
  {
    text: 'Strategic fit confirmed with portfolio',
    category: 'Strategy',
    required: true,
  },
  {
    text: 'Partnership terms negotiated',
    category: 'Business',
    required: true,
  },
  {
    text: 'Budget and resource allocation approved',
    category: 'Financial',
    required: true,
  },
  {
    text: 'Risk mitigation plan developed',
    category: 'Risk',
    required: true,
  },
  {
    text: 'Japan partner identified (if applicable)',
    category: 'Partnerships',
    required: false,
  },
  {
    text: 'Regulatory pathway validated',
    category: 'Regulatory',
    required: true,
  },
  {
    text: 'Go-to-market strategy defined',
    category: 'Market',
    required: false,
  },
  {
    text: 'Senior leadership approval obtained',
    category: 'Governance',
    required: true,
  },
  {
    text: 'Contract terms finalized',
    category: 'Legal',
    required: false,
  },
];

/**
 * Get checklist template for a specific gate
 */
export const getGateChecklistTemplate = (gateNumber: GateNumber): Omit<GateChecklistItem, 'id' | 'completed' | 'completedBy' | 'completedAt' | 'notes'>[] => {
  switch (gateNumber) {
    case 1:
      return GATE_1_CHECKLIST;
    case 2:
      return GATE_2_CHECKLIST;
    case 3:
      return GATE_3_CHECKLIST;
  }
};

/**
 * Gate Configuration
 */
export interface GateConfig {
  gateNumber: GateNumber;
  name: string;
  description: string;
  requiredRole: string[]; // Roles that can approve this gate
  color: string;
}

export const GATE_CONFIGS: Record<GateNumber, GateConfig> = {
  1: {
    gateNumber: 1,
    name: 'Gate 1: Initial Screening',
    description: 'Basic qualification and initial assessment',
    requiredRole: ['BUSINESS_DEVELOPMENT', 'ADMIN'],
    color: 'blue',
  },
  2: {
    gateNumber: 2,
    name: 'Gate 2: Detailed Evaluation',
    description: 'In-depth technical and market assessment',
    requiredRole: ['BUSINESS_DEVELOPMENT', 'PARTNERSHIP_MANAGER', 'ADMIN'],
    color: 'purple',
  },
  3: {
    gateNumber: 3,
    name: 'Gate 3: Final Decision',
    description: 'Comprehensive review and partnership decision',
    requiredRole: ['PARTNERSHIP_MANAGER', 'ADMIN'],
    color: 'green',
  },
};

/**
 * Gate Progression Rules
 */
export const canProgressToGate = (currentGate: GateNumber | null, targetGate: GateNumber): boolean => {
  if (currentGate === null) return targetGate === 1;
  return targetGate === currentGate + 1;
};

/**
 * Gate Metrics
 */
export interface GateMetrics {
  totalReviews: number;
  approvedCount: number;
  rejectedCount: number;
  conditionalCount: number;
  deferredCount: number;
  pendingCount: number;
  averageScores: {
    technical: number;
    market: number;
    team: number;
    fit: number;
    overall: number;
  };
  averageReviewTime: number; // in days
}
