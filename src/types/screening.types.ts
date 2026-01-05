/**
 * General Screening Types (Phase 1)
 * Pre-project screening system with TRL, therapeutic fit, and market assessment
 */

import type { ID, Timestamp } from './common.types';
import type { Company } from './addressBook.types';

// ===== Technology Readiness Level (TRL) =====
export type TRL =
  | 'TRL_1'
  | 'TRL_2'
  | 'TRL_3'
  | 'TRL_4'
  | 'TRL_5'
  | 'TRL_6'
  | 'TRL_7'
  | 'TRL_8'
  | 'TRL_9';

export interface TRLDefinition {
  level: TRL;
  number: number;
  name: string;
  description: string;
  examples: string[];
}

export const TRL_DEFINITIONS: TRLDefinition[] = [
  {
    level: 'TRL_1',
    number: 1,
    name: 'Basic Principles Observed',
    description: 'Scientific research beginning; basic principles observed and reported',
    examples: [
      'Initial target identification',
      'Literature review of mechanism',
      'Preliminary hypothesis formation',
    ],
  },
  {
    level: 'TRL_2',
    number: 2,
    name: 'Technology Concept Formulated',
    description: 'Technology concept and application formulated',
    examples: [
      'Target validation in vitro',
      'Proof-of-concept studies',
      'Initial compound screening',
    ],
  },
  {
    level: 'TRL_3',
    number: 3,
    name: 'Proof of Concept',
    description: 'Analytical and experimental critical function/characteristic proof of concept',
    examples: [
      'Hit identification and validation',
      'Lead compound selection',
      'In vitro efficacy demonstrated',
    ],
  },
  {
    level: 'TRL_4',
    number: 4,
    name: 'Technology Validated in Lab',
    description: 'Component validation in laboratory environment',
    examples: [
      'Lead optimization',
      'In vivo proof of concept (animal models)',
      'Initial safety/toxicology studies',
    ],
  },
  {
    level: 'TRL_5',
    number: 5,
    name: 'Technology Validated in Relevant Environment',
    description: 'Component validation in relevant environment',
    examples: [
      'IND-enabling studies',
      'GLP toxicology',
      'CMC development',
      'Manufacturing process development',
    ],
  },
  {
    level: 'TRL_6',
    number: 6,
    name: 'Technology Demonstrated in Relevant Environment',
    description: 'System/subsystem model or prototype demonstration in a relevant environment',
    examples: ['Phase 1 clinical trials', 'First-in-human studies', 'Initial safety in humans'],
  },
  {
    level: 'TRL_7',
    number: 7,
    name: 'System Prototype in Operational Environment',
    description: 'System prototype demonstration in an operational environment',
    examples: [
      'Phase 2 clinical trials',
      'Proof-of-concept in patients',
      'Dose-finding studies',
      'Initial efficacy signals',
    ],
  },
  {
    level: 'TRL_8',
    number: 8,
    name: 'System Complete and Qualified',
    description: 'Actual system completed and qualified through test and demonstration',
    examples: [
      'Phase 3 clinical trials',
      'Pivotal studies',
      'Registration package preparation',
      'Commercial-scale manufacturing',
    ],
  },
  {
    level: 'TRL_9',
    number: 9,
    name: 'System Proven in Operational Environment',
    description: 'Actual system proven through successful mission operations',
    examples: [
      'Regulatory approval (FDA/EMA/PMDA)',
      'Commercial launch',
      'Post-market surveillance',
    ],
  },
];

// ===== Therapeutic Area Fit =====
export type TherapeuticArea =
  | 'ONCOLOGY'
  | 'IMMUNOLOGY'
  | 'NEUROLOGY'
  | 'CARDIOVASCULAR'
  | 'RARE_DISEASES'
  | 'INFECTIOUS_DISEASES'
  | 'METABOLIC'
  | 'RESPIRATORY'
  | 'OPHTHALMOLOGY'
  | 'DERMATOLOGY'
  | 'GASTROENTEROLOGY'
  | 'HEMATOLOGY'
  | 'OTHER';

export type TherapeuticFitScore = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'NOT_A_FIT';

export interface TherapeuticAreaFit {
  area: TherapeuticArea;
  fitScore: TherapeuticFitScore;
  scoreValue: number; // 0-100
  rationale: string;
  strategicAlignment: number; // 0-100
  technicalCapability: number; // 0-100
  marketOpportunity: number; // 0-100
  competitivePosition: number; // 0-100
}

// ===== Market Assessment Matrix =====
export type MarketAttractiveness = 'HIGH' | 'MEDIUM' | 'LOW';
export type CompetitiveStrength = 'STRONG' | 'MODERATE' | 'WEAK';

export interface MarketAssessmentMatrix {
  // Market Attractiveness Factors (0-100 each)
  marketSize: number; // Large, growing market = high score
  marketGrowthRate: number; // CAGR %
  profitability: number; // Pricing & margins potential
  patientNeed: number; // Unmet medical need severity
  accessBarriers: number; // Low barriers = high score

  // Competitive Strength Factors (0-100 each)
  productDifferentiation: number; // Unique value proposition
  ipStrength: number; // Patent position
  regulatoryPathway: number; // Clear, favorable path = high score
  clinicalEvidence: number; // Strength of data
  teamCapability: number; // Execution capability

  // Calculated Scores
  overallMarketAttractiveness: MarketAttractiveness;
  overallCompetitiveStrength: CompetitiveStrength;
  marketAttractivenessScore: number; // 0-100 average
  competitiveStrengthScore: number; // 0-100 average

  // Strategic Recommendation
  recommendation:
    | 'INVEST_HEAVILY' // High attractiveness + Strong competitive position
    | 'SELECTIVE_INVESTMENT' // Mixed position
    | 'HARVEST_DIVEST' // Low attractiveness or Weak position
    | 'MONITOR'; // Wait and see
}

// ===== Pre-Screening Checklist =====
export interface PreScreeningItem {
  id: string;
  category: 'MUST_HAVE' | 'NICE_TO_HAVE' | 'RED_FLAG';
  question: string;
  answer: boolean | null;
  notes?: string;
  weight: number; // 0-10 importance
}

export interface PreScreeningChecklist {
  // Strategic Fit
  strategicFit: PreScreeningItem[];

  // Technical Feasibility
  technicalFeasibility: PreScreeningItem[];

  // Commercial Viability
  commercialViability: PreScreeningItem[];

  // Regulatory & IP
  regulatoryAndIP: PreScreeningItem[];

  // Team & Resources
  teamAndResources: PreScreeningItem[];

  // Red Flags
  redFlags: PreScreeningItem[];

  // Calculated Scores
  totalScore: number; // 0-100
  mustHavesMet: number; // count
  mustHavesTotal: number; // count
  redFlagsCount: number;
  passesMinimumThreshold: boolean; // true if >= 60% and no critical red flags
}

// ===== Screening Assessment =====
export type ScreeningStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';

export type ScreeningDecision = 'PROCEED_TO_GATE_1' | 'REQUEST_MORE_INFO' | 'REJECT' | 'DEFER';

export interface ScreeningAssessment {
  id: ID;
  companyId: ID;
  company: Company;
  opportunityId?: ID; // If created from opportunity

  // Basic Info
  innovationName: string;
  innovationDescription: string;
  therapeuticArea: TherapeuticArea;

  // Assessment Components
  trl: TRL;
  trlJustification?: string;

  therapeuticAreaFit: TherapeuticAreaFit;

  marketAssessment: MarketAssessmentMatrix;

  preScreeningChecklist: PreScreeningChecklist;

  // Overall Scoring
  overallScore: number; // 0-100 weighted average
  recommendation: string;
  decision?: ScreeningDecision;
  decisionRationale?: string;

  // Status & Metadata
  status: ScreeningStatus;
  assignedTo?: ID;
  completedBy?: ID;
  completedAt?: Timestamp;
  reviewedBy?: ID;
  reviewedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ===== Pre-Screening Checklist Templates =====
export const PRE_SCREENING_TEMPLATE: PreScreeningChecklist = {
  strategicFit: [
    {
      id: 'sf-1',
      category: 'MUST_HAVE',
      question: 'Does this innovation align with our core therapeutic focus areas?',
      answer: null,
      weight: 10,
    },
    {
      id: 'sf-2',
      category: 'MUST_HAVE',
      question: 'Is there strategic value in Japan market entry?',
      answer: null,
      weight: 9,
    },
    {
      id: 'sf-3',
      category: 'NICE_TO_HAVE',
      question: 'Does this complement our existing portfolio?',
      answer: null,
      weight: 6,
    },
    {
      id: 'sf-4',
      category: 'NICE_TO_HAVE',
      question: 'Is there potential for platform expansion?',
      answer: null,
      weight: 5,
    },
  ],
  technicalFeasibility: [
    {
      id: 'tf-1',
      category: 'MUST_HAVE',
      question: 'Is there proof-of-concept data (in vitro or in vivo)?',
      answer: null,
      weight: 10,
    },
    {
      id: 'tf-2',
      category: 'MUST_HAVE',
      question: 'Is the mechanism of action scientifically sound?',
      answer: null,
      weight: 9,
    },
    {
      id: 'tf-3',
      category: 'MUST_HAVE',
      question: 'Is the technology scalable for commercial manufacturing?',
      answer: null,
      weight: 8,
    },
    {
      id: 'tf-4',
      category: 'NICE_TO_HAVE',
      question: 'Are there clear biomarkers for patient selection?',
      answer: null,
      weight: 6,
    },
    {
      id: 'tf-5',
      category: 'NICE_TO_HAVE',
      question: 'Has CMC development been initiated?',
      answer: null,
      weight: 5,
    },
  ],
  commercialViability: [
    {
      id: 'cv-1',
      category: 'MUST_HAVE',
      question: 'Is the target market size >$500M annually?',
      answer: null,
      weight: 9,
    },
    {
      id: 'cv-2',
      category: 'MUST_HAVE',
      question: 'Is there a clear unmet medical need?',
      answer: null,
      weight: 10,
    },
    {
      id: 'cv-3',
      category: 'MUST_HAVE',
      question: 'Is the pricing/reimbursement pathway clear?',
      answer: null,
      weight: 8,
    },
    {
      id: 'cv-4',
      category: 'NICE_TO_HAVE',
      question: 'Are there orphan drug or breakthrough therapy opportunities?',
      answer: null,
      weight: 7,
    },
    {
      id: 'cv-5',
      category: 'NICE_TO_HAVE',
      question: 'Is the competitive landscape favorable?',
      answer: null,
      weight: 6,
    },
  ],
  regulatoryAndIP: [
    {
      id: 'rip-1',
      category: 'MUST_HAVE',
      question: 'Is there patent protection (granted or pending)?',
      answer: null,
      weight: 10,
    },
    {
      id: 'rip-2',
      category: 'MUST_HAVE',
      question: 'Is freedom-to-operate (FTO) clear?',
      answer: null,
      weight: 9,
    },
    {
      id: 'rip-3',
      category: 'MUST_HAVE',
      question: 'Is the regulatory pathway defined (IND/CTA ready)?',
      answer: null,
      weight: 8,
    },
    {
      id: 'rip-4',
      category: 'NICE_TO_HAVE',
      question: 'Are there multiple patent families?',
      answer: null,
      weight: 6,
    },
    {
      id: 'rip-5',
      category: 'NICE_TO_HAVE',
      question: 'Has regulatory feedback been obtained (pre-IND, etc.)?',
      answer: null,
      weight: 7,
    },
  ],
  teamAndResources: [
    {
      id: 'tr-1',
      category: 'MUST_HAVE',
      question: 'Does the team have drug development experience?',
      answer: null,
      weight: 8,
    },
    {
      id: 'tr-2',
      category: 'MUST_HAVE',
      question: 'Is there sufficient funding for next 12-18 months?',
      answer: null,
      weight: 9,
    },
    {
      id: 'tr-3',
      category: 'NICE_TO_HAVE',
      question: 'Are key opinion leaders (KOLs) engaged?',
      answer: null,
      weight: 6,
    },
    {
      id: 'tr-4',
      category: 'NICE_TO_HAVE',
      question: 'Is there established CRO/CMO infrastructure?',
      answer: null,
      weight: 5,
    },
  ],
  redFlags: [
    {
      id: 'rf-1',
      category: 'RED_FLAG',
      question: 'Are there unresolved IP disputes or litigation?',
      answer: null,
      weight: 10,
    },
    {
      id: 'rf-2',
      category: 'RED_FLAG',
      question: 'Have previous clinical trials failed for safety reasons?',
      answer: null,
      weight: 10,
    },
    {
      id: 'rf-3',
      category: 'RED_FLAG',
      question: 'Is the company financially distressed (< 6 months runway)?',
      answer: null,
      weight: 9,
    },
    {
      id: 'rf-4',
      category: 'RED_FLAG',
      question: 'Are there ethical or compliance concerns?',
      answer: null,
      weight: 10,
    },
    {
      id: 'rf-5',
      category: 'RED_FLAG',
      question: 'Is the mechanism of action scientifically questionable?',
      answer: null,
      weight: 9,
    },
  ],
  totalScore: 0,
  mustHavesMet: 0,
  mustHavesTotal: 14,
  redFlagsCount: 0,
  passesMinimumThreshold: false,
};

// ===== Utility Functions =====
export function calculatePreScreeningScore(checklist: PreScreeningChecklist): number {
  const allItems = [
    ...checklist.strategicFit,
    ...checklist.technicalFeasibility,
    ...checklist.commercialViability,
    ...checklist.regulatoryAndIP,
    ...checklist.teamAndResources,
  ];

  const answeredItems = allItems.filter((item) => item.answer !== null);
  if (answeredItems.length === 0) return 0;

  const totalPossiblePoints = answeredItems.reduce((sum, item) => sum + item.weight, 0);
  const earnedPoints = answeredItems
    .filter((item) => item.answer === true)
    .reduce((sum, item) => sum + item.weight, 0);

  return Math.round((earnedPoints / totalPossiblePoints) * 100);
}

export function calculateTherapeuticFitScore(fit: TherapeuticAreaFit): number {
  return Math.round(
    (fit.strategicAlignment +
      fit.technicalCapability +
      fit.marketOpportunity +
      fit.competitivePosition) /
      4
  );
}

export function calculateMarketAssessmentScores(
  matrix: MarketAssessmentMatrix
): Pick<
  MarketAssessmentMatrix,
  'marketAttractivenessScore' | 'competitiveStrengthScore' | 'overallMarketAttractiveness' | 'overallCompetitiveStrength' | 'recommendation'
> {
  // Calculate average scores
  const marketScore = Math.round(
    (matrix.marketSize +
      matrix.marketGrowthRate +
      matrix.profitability +
      matrix.patientNeed +
      matrix.accessBarriers) /
      5
  );

  const competitiveScore = Math.round(
    (matrix.productDifferentiation +
      matrix.ipStrength +
      matrix.regulatoryPathway +
      matrix.clinicalEvidence +
      matrix.teamCapability) /
      5
  );

  // Determine categories
  const marketAttractiveness: MarketAttractiveness =
    marketScore >= 70 ? 'HIGH' : marketScore >= 40 ? 'MEDIUM' : 'LOW';

  const competitiveStrength: CompetitiveStrength =
    competitiveScore >= 70 ? 'STRONG' : competitiveScore >= 40 ? 'MODERATE' : 'WEAK';

  // Determine recommendation
  let recommendation: MarketAssessmentMatrix['recommendation'];
  if (marketAttractiveness === 'HIGH' && competitiveStrength === 'STRONG') {
    recommendation = 'INVEST_HEAVILY';
  } else if (marketAttractiveness === 'LOW' || competitiveStrength === 'WEAK') {
    recommendation = 'HARVEST_DIVEST';
  } else if (
    (marketAttractiveness === 'HIGH' && competitiveStrength === 'MODERATE') ||
    (marketAttractiveness === 'MEDIUM' && competitiveStrength === 'STRONG')
  ) {
    recommendation = 'SELECTIVE_INVESTMENT';
  } else {
    recommendation = 'MONITOR';
  }

  return {
    marketAttractivenessScore: marketScore,
    competitiveStrengthScore: competitiveScore,
    overallMarketAttractiveness: marketAttractiveness,
    overallCompetitiveStrength: competitiveStrength,
    recommendation,
  };
}

export function calculateOverallScreeningScore(assessment: Partial<ScreeningAssessment>): number {
  const weights = {
    trl: 0.15,
    therapeuticFit: 0.25,
    marketAssessment: 0.35,
    preScreening: 0.25,
  };

  let totalScore = 0;
  let totalWeight = 0;

  // TRL Score (map 1-9 to 0-100)
  if (assessment.trl) {
    const trlNumber = TRL_DEFINITIONS.find((d) => d.level === assessment.trl)?.number || 1;
    const trlScore = ((trlNumber - 1) / 8) * 100;
    totalScore += trlScore * weights.trl;
    totalWeight += weights.trl;
  }

  // Therapeutic Fit Score
  if (assessment.therapeuticAreaFit) {
    totalScore += assessment.therapeuticAreaFit.scoreValue * weights.therapeuticFit;
    totalWeight += weights.therapeuticFit;
  }

  // Market Assessment Score (average of both dimensions)
  if (assessment.marketAssessment) {
    const marketScore =
      (assessment.marketAssessment.marketAttractivenessScore +
        assessment.marketAssessment.competitiveStrengthScore) /
      2;
    totalScore += marketScore * weights.marketAssessment;
    totalWeight += weights.marketAssessment;
  }

  // Pre-Screening Score
  if (assessment.preScreeningChecklist) {
    totalScore += assessment.preScreeningChecklist.totalScore * weights.preScreening;
    totalWeight += weights.preScreening;
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}
