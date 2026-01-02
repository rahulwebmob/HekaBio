/**
 * Japan Market Screening Types
 * Structures for Japan-specific market assessment
 */

export type JapanMarketFit =
  | 'NOT_ASSESSED'
  | 'EXCELLENT_FIT'
  | 'GOOD_FIT'
  | 'MODERATE_FIT'
  | 'POOR_FIT';

export interface JapanScreeningSection {
  id: string;
  title: string;
  content: string;
  completedAt?: string;
  completedBy?: string;
}

export interface JapanScreening {
  id: string;
  projectId: string;

  // Section 1: Executive Summary
  executiveSummary: JapanScreeningSection;

  // Section 2: Unmet Medical Need
  unmetMedicalNeed: JapanScreeningSection;

  // Section 3: Current Treatment Landscape
  currentTreatmentLandscape: JapanScreeningSection;

  // Section 4: Development Details
  developmentDetails: JapanScreeningSection;

  // Section 5: Positioning & Potential
  positioningAndPotential: JapanScreeningSection;

  // Section 6: Regulatory Considerations
  regulatoryConsiderations: JapanScreeningSection;

  // Section 7: Risk Assessment
  riskAssessment: JapanScreeningSection;

  // Overall Assessment
  japanMarketFit: JapanMarketFit;
  japanFitScore: number; // 0-100
  recommendation: string;

  // Metadata
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JapanMarketAnalysis {
  // Market Size
  prevalence: string;
  incidence: string;
  targetPatientPopulation: string;
  marketSizeEstimate: string;

  // Competition
  currentTreatments: string[];
  competitiveLandscape: string;
  marketLeaders: string[];

  // Regulatory
  regulatoryPathway: string;
  approvalTimeline: string;
  pricingReimbursement: string;

  // Strategic
  partnerOpportunities: string[];
  marketEntry: string;
  keySuccess: string[];
  keyRisks: string[];

  // AI Generated Insights
  aiInsights: {
    marketAttractiveness: number; // 0-100
    competitivePosition: number; // 0-100
    regulatoryComplexity: number; // 0-100
    strategicFit: number; // 0-100
    overallRecommendation: string;
    confidence: number; // 0-100
  };
}

export const JAPAN_SCREENING_SECTIONS = [
  {
    id: 'executive_summary',
    title: 'Executive Summary',
    description: 'High-level overview of the innovation and Japan market opportunity',
    fields: [
      'Innovation overview',
      'Target indication(s)',
      'Development stage',
      'Japan market opportunity summary',
      'Key value proposition for Japan',
    ],
  },
  {
    id: 'unmet_medical_need',
    title: 'Unmet Medical Need',
    description: 'Analysis of unmet medical needs in Japan',
    fields: [
      'Disease burden in Japan (prevalence, incidence)',
      'Current standard of care limitations',
      'Patient/physician unmet needs',
      'Healthcare system gaps',
      'Economic burden',
    ],
  },
  {
    id: 'current_treatment_landscape',
    title: 'Current Treatment Landscape',
    description: 'Overview of existing treatments in Japan',
    fields: [
      'Approved treatments in Japan',
      'Treatment guidelines (JSH, JCS, etc.)',
      'Market leaders and market share',
      'Pricing and reimbursement',
      'Access and availability',
    ],
  },
  {
    id: 'development_details',
    title: 'Development Details',
    description: 'Innovation development status and data',
    fields: [
      'Mechanism of action',
      'Clinical development status globally',
      'Clinical development status in Japan/Asia',
      'Key efficacy data',
      'Key safety data',
      'Differentiation vs. competitors',
    ],
  },
  {
    id: 'positioning_and_potential',
    title: 'Positioning & Potential',
    description: 'Market positioning and commercial potential',
    fields: [
      'Target patient population in Japan',
      'Market size estimate (patients, yen)',
      'Positioning strategy',
      'Peak sales forecast',
      'Competitive advantages',
    ],
  },
  {
    id: 'regulatory_considerations',
    title: 'Regulatory Considerations',
    description: 'PMDA pathway and regulatory strategy',
    fields: [
      'PMDA regulatory pathway',
      'Orphan drug designation potential',
      'SAKIGAKE designation potential',
      'Timeline to approval',
      'Regulatory risks/challenges',
      'Required Japan-specific studies',
    ],
  },
  {
    id: 'risk_assessment',
    title: 'Risk Assessment',
    description: 'Key risks and mitigation strategies',
    fields: [
      'Clinical development risks',
      'Regulatory risks',
      'Commercial risks',
      'Competitive risks',
      'Partnership risks',
      'Mitigation strategies',
    ],
  },
] as const;
