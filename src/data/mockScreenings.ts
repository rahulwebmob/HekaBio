/**
 * Mock Screening Data
 * Sample screening assessments for development
 */

import type {
  ScreeningAssessment,
  TherapeuticAreaFit,
  MarketAssessmentMatrix,
  PreScreeningChecklist,
} from '../types/screening.types';
import {
  PRE_SCREENING_TEMPLATE,
  calculatePreScreeningScore,
  calculateMarketAssessmentScores,
  calculateOverallScreeningScore,
} from '../types/screening.types';
import { mockCompanies } from './mockCompanies';

// Helper to create a pre-screening checklist with answers
function createAnsweredChecklist(
  answers: Record<string, boolean | null>
): PreScreeningChecklist {
  const checklist: PreScreeningChecklist = JSON.parse(
    JSON.stringify(PRE_SCREENING_TEMPLATE)
  );

  // Apply answers
  Object.keys(answers).forEach((id) => {
    const allItems = [
      ...checklist.strategicFit,
      ...checklist.technicalFeasibility,
      ...checklist.commercialViability,
      ...checklist.regulatoryAndIP,
      ...checklist.teamAndResources,
      ...checklist.redFlags,
    ];

    const item = allItems.find((i) => i.id === id);
    if (item) {
      item.answer = answers[id];
    }
  });

  // Calculate scores
  const mustHaves = [
    ...checklist.strategicFit,
    ...checklist.technicalFeasibility,
    ...checklist.commercialViability,
    ...checklist.regulatoryAndIP,
    ...checklist.teamAndResources,
  ].filter((item) => item.category === 'MUST_HAVE');

  checklist.mustHavesMet = mustHaves.filter((item) => item.answer === true).length;
  checklist.mustHavesTotal = mustHaves.length;

  checklist.redFlagsCount = checklist.redFlags.filter((item) => item.answer === true).length;

  checklist.totalScore = calculatePreScreeningScore(checklist);
  checklist.passesMinimumThreshold =
    checklist.totalScore >= 60 && checklist.redFlagsCount === 0;

  return checklist;
}

// ===== Screening Assessment 1: CAR-T Therapy (Excellent) =====
const screening1Checklist = createAnsweredChecklist({
  'sf-1': true,
  'sf-2': true,
  'sf-3': true,
  'sf-4': true,
  'tf-1': true,
  'tf-2': true,
  'tf-3': true,
  'tf-4': true,
  'tf-5': true,
  'cv-1': true,
  'cv-2': true,
  'cv-3': true,
  'cv-4': true,
  'cv-5': true,
  'rip-1': true,
  'rip-2': true,
  'rip-3': true,
  'rip-4': true,
  'rip-5': false,
  'tr-1': true,
  'tr-2': true,
  'tr-3': true,
  'tr-4': false,
  'rf-1': false,
  'rf-2': false,
  'rf-3': false,
  'rf-4': false,
  'rf-5': false,
});

const screening1TherapeuticFit: TherapeuticAreaFit = {
  area: 'ONCOLOGY',
  fitScore: 'EXCELLENT',
  scoreValue: 92,
  rationale:
    'Perfect alignment with our oncology focus. CAR-T represents next-generation cell therapy with strong clinical validation.',
  strategicAlignment: 95,
  technicalCapability: 88,
  marketOpportunity: 90,
  competitivePosition: 95,
};

const screening1Market: MarketAssessmentMatrix = {
  marketSize: 90,
  marketGrowthRate: 85,
  profitability: 88,
  patientNeed: 95,
  accessBarriers: 65,
  productDifferentiation: 90,
  ipStrength: 92,
  regulatoryPathway: 78,
  clinicalEvidence: 88,
  teamCapability: 85,
  ...calculateMarketAssessmentScores({
    marketSize: 90,
    marketGrowthRate: 85,
    profitability: 88,
    patientNeed: 95,
    accessBarriers: 65,
    productDifferentiation: 90,
    ipStrength: 92,
    regulatoryPathway: 78,
    clinicalEvidence: 88,
    teamCapability: 85,
  } as MarketAssessmentMatrix),
};

export const mockScreening1: ScreeningAssessment = {
  id: 'screening-001',
  companyId: mockCompanies[0].id,
  company: mockCompanies[0],
  innovationName: 'Next-Gen CAR-T Therapy for B-Cell Lymphoma',
  innovationDescription:
    'Novel CAR-T cell therapy targeting CD19+ B-cell malignancies with enhanced persistence and reduced cytokine release syndrome.',
  therapeuticArea: 'ONCOLOGY',
  trl: 'TRL_7',
  trlJustification:
    'Phase 2 clinical trial ongoing with positive interim data. Manufacturing process established.',
  therapeuticAreaFit: screening1TherapeuticFit,
  marketAssessment: screening1Market,
  preScreeningChecklist: screening1Checklist,
  overallScore: 87,
  recommendation:
    'Strong candidate for investment. Excellent strategic fit, robust clinical data, clear regulatory pathway. Recommend proceeding to Gate 1.',
  decision: 'PROCEED_TO_GATE_1',
  decisionRationale:
    'Exceeds all minimum thresholds. No red flags identified. Strong alignment with portfolio strategy.',
  status: 'COMPLETED',
  assignedTo: 'user-001',
  completedBy: 'user-001',
  completedAt: '2025-12-15T14:30:00Z',
  reviewedBy: 'user-002',
  reviewedAt: '2025-12-16T10:00:00Z',
  createdAt: '2025-12-10T09:00:00Z',
  updatedAt: '2025-12-16T10:00:00Z',
};

// Recalculate overall score
mockScreening1.overallScore = calculateOverallScreeningScore(mockScreening1);

// ===== Screening Assessment 2: Small Molecule (Good) =====
const screening2Checklist = createAnsweredChecklist({
  'sf-1': true,
  'sf-2': true,
  'sf-3': false,
  'sf-4': false,
  'tf-1': true,
  'tf-2': true,
  'tf-3': true,
  'tf-4': false,
  'tf-5': false,
  'cv-1': true,
  'cv-2': true,
  'cv-3': true,
  'cv-4': false,
  'cv-5': true,
  'rip-1': true,
  'rip-2': true,
  'rip-3': false,
  'rip-4': false,
  'rip-5': false,
  'tr-1': true,
  'tr-2': true,
  'tr-3': false,
  'tr-4': true,
  'rf-1': false,
  'rf-2': false,
  'rf-3': false,
  'rf-4': false,
  'rf-5': false,
});

const screening2TherapeuticFit: TherapeuticAreaFit = {
  area: 'NEUROLOGY',
  fitScore: 'GOOD',
  scoreValue: 75,
  rationale:
    'Good fit with neurology portfolio. Novel mechanism but competitive landscape is crowded.',
  strategicAlignment: 80,
  technicalCapability: 75,
  marketOpportunity: 78,
  competitivePosition: 67,
};

const screening2Market: MarketAssessmentMatrix = {
  marketSize: 75,
  marketGrowthRate: 70,
  profitability: 72,
  patientNeed: 85,
  accessBarriers: 70,
  productDifferentiation: 68,
  ipStrength: 80,
  regulatoryPathway: 65,
  clinicalEvidence: 70,
  teamCapability: 75,
  ...calculateMarketAssessmentScores({
    marketSize: 75,
    marketGrowthRate: 70,
    profitability: 72,
    patientNeed: 85,
    accessBarriers: 70,
    productDifferentiation: 68,
    ipStrength: 80,
    regulatoryPathway: 65,
    clinicalEvidence: 70,
    teamCapability: 75,
  } as MarketAssessmentMatrix),
};

export const mockScreening2: ScreeningAssessment = {
  id: 'screening-002',
  companyId: mockCompanies[1].id,
  company: mockCompanies[1],
  innovationName: 'Novel NMDA Receptor Modulator for Alzheimer\'s Disease',
  innovationDescription:
    'Small molecule targeting NMDA receptors with improved safety profile compared to memantine.',
  therapeuticArea: 'NEUROLOGY',
  trl: 'TRL_5',
  trlJustification: 'IND-enabling studies in progress. GLP toxicology completed successfully.',
  therapeuticAreaFit: screening2TherapeuticFit,
  marketAssessment: screening2Market,
  preScreeningChecklist: screening2Checklist,
  overallScore: 72,
  recommendation:
    'Moderate candidate. Good scientific rationale but competitive landscape requires careful consideration. Recommend gathering more competitive intelligence before Gate 1.',
  decision: 'REQUEST_MORE_INFO',
  decisionRationale:
    'Need more clarity on differentiation vs. existing treatments. Request detailed competitive analysis and health economics data.',
  status: 'COMPLETED',
  assignedTo: 'user-001',
  completedBy: 'user-001',
  completedAt: '2025-12-18T16:45:00Z',
  createdAt: '2025-12-12T11:00:00Z',
  updatedAt: '2025-12-18T16:45:00Z',
};

mockScreening2.overallScore = calculateOverallScreeningScore(mockScreening2);

// ===== Screening Assessment 3: Biologics (Moderate) =====
const screening3Checklist = createAnsweredChecklist({
  'sf-1': true,
  'sf-2': false,
  'sf-3': true,
  'sf-4': false,
  'tf-1': true,
  'tf-2': true,
  'tf-3': false,
  'tf-4': false,
  'tf-5': false,
  'cv-1': false,
  'cv-2': true,
  'cv-3': false,
  'cv-4': false,
  'cv-5': false,
  'rip-1': true,
  'rip-2': false,
  'rip-3': false,
  'rip-4': false,
  'rip-5': false,
  'tr-1': false,
  'tr-2': true,
  'tr-3': false,
  'tr-4': false,
  'rf-1': false,
  'rf-2': false,
  'rf-3': false,
  'rf-4': false,
  'rf-5': false,
});

const screening3TherapeuticFit: TherapeuticAreaFit = {
  area: 'RARE_DISEASES',
  fitScore: 'MODERATE',
  scoreValue: 58,
  rationale:
    'Moderate fit. Rare disease focus is interesting but market size concerns and manufacturing complexity are significant challenges.',
  strategicAlignment: 65,
  technicalCapability: 55,
  marketOpportunity: 50,
  competitivePosition: 62,
};

const screening3Market: MarketAssessmentMatrix = {
  marketSize: 45,
  marketGrowthRate: 60,
  profitability: 65,
  patientNeed: 90,
  accessBarriers: 55,
  productDifferentiation: 70,
  ipStrength: 65,
  regulatoryPathway: 72,
  clinicalEvidence: 50,
  teamCapability: 48,
  ...calculateMarketAssessmentScores({
    marketSize: 45,
    marketGrowthRate: 60,
    profitability: 65,
    patientNeed: 90,
    accessBarriers: 55,
    productDifferentiation: 70,
    ipStrength: 65,
    regulatoryPathway: 72,
    clinicalEvidence: 50,
    teamCapability: 48,
  } as MarketAssessmentMatrix),
};

export const mockScreening3: ScreeningAssessment = {
  id: 'screening-003',
  companyId: mockCompanies[2].id,
  company: mockCompanies[2],
  innovationName: 'Enzyme Replacement Therapy for Lysosomal Storage Disorder',
  innovationDescription:
    'Recombinant enzyme therapy for ultra-rare lysosomal storage disease affecting ~1,500 patients globally.',
  therapeuticArea: 'RARE_DISEASES',
  trl: 'TRL_4',
  trlJustification:
    'In vivo proof of concept established in animal models. Lead optimization ongoing.',
  therapeuticAreaFit: screening3TherapeuticFit,
  marketAssessment: screening3Market,
  preScreeningChecklist: screening3Checklist,
  overallScore: 56,
  recommendation:
    'Borderline candidate. High unmet need but significant market size and execution risks. Recommend deferring until team capabilities improve.',
  decision: 'DEFER',
  decisionRationale:
    'Below threshold for immediate advancement. Team lacks biologics manufacturing experience. Market size too small for current portfolio priorities.',
  status: 'COMPLETED',
  assignedTo: 'user-002',
  completedBy: 'user-002',
  completedAt: '2025-12-20T13:30:00Z',
  createdAt: '2025-12-14T08:00:00Z',
  updatedAt: '2025-12-20T13:30:00Z',
};

mockScreening3.overallScore = calculateOverallScreeningScore(mockScreening3);

// ===== Screening Assessment 4: Gene Therapy (Early Stage - In Progress) =====
const screening4Checklist = createAnsweredChecklist({
  'sf-1': true,
  'sf-2': true,
  'sf-3': null,
  'sf-4': null,
  'tf-1': true,
  'tf-2': true,
  'tf-3': null,
  'tf-4': null,
  'tf-5': null,
  'cv-1': null,
  'cv-2': true,
  'cv-3': null,
  'cv-4': null,
  'cv-5': null,
  'rip-1': true,
  'rip-2': null,
  'rip-3': null,
  'rip-4': null,
  'rip-5': null,
  'tr-1': null,
  'tr-2': null,
  'tr-3': null,
  'tr-4': null,
  'rf-1': false,
  'rf-2': false,
  'rf-3': false,
  'rf-4': false,
  'rf-5': false,
});

const screening4TherapeuticFit: TherapeuticAreaFit = {
  area: 'OPHTHALMOLOGY',
  fitScore: 'GOOD',
  scoreValue: 78,
  rationale:
    'Strong fit with ophthalmology gene therapy trend. AAV platform is proven. Awaiting more clinical data.',
  strategicAlignment: 85,
  technicalCapability: 72,
  marketOpportunity: 80,
  competitivePosition: 75,
};

const screening4Market: MarketAssessmentMatrix = {
  marketSize: 80,
  marketGrowthRate: 88,
  profitability: 75,
  patientNeed: 85,
  accessBarriers: 70,
  productDifferentiation: 75,
  ipStrength: 78,
  regulatoryPathway: 72,
  clinicalEvidence: 68,
  teamCapability: 70,
  ...calculateMarketAssessmentScores({
    marketSize: 80,
    marketGrowthRate: 88,
    profitability: 75,
    patientNeed: 85,
    accessBarriers: 70,
    productDifferentiation: 75,
    ipStrength: 78,
    regulatoryPathway: 72,
    clinicalEvidence: 68,
    teamCapability: 70,
  } as MarketAssessmentMatrix),
};

export const mockScreening4: ScreeningAssessment = {
  id: 'screening-004',
  companyId: mockCompanies[3].id,
  company: mockCompanies[3],
  innovationName: 'AAV Gene Therapy for Inherited Retinal Dystrophy',
  innovationDescription:
    'Adeno-associated virus (AAV) vector delivering functional gene copy for rare inherited blindness.',
  therapeuticArea: 'OPHTHALMOLOGY',
  trl: 'TRL_6',
  trlJustification: 'Phase 1 trial ongoing. Early safety data looks promising.',
  therapeuticAreaFit: screening4TherapeuticFit,
  marketAssessment: screening4Market,
  preScreeningChecklist: screening4Checklist,
  overallScore: 73,
  recommendation: 'Assessment in progress. Preliminary data is encouraging. Complete checklist and await Phase 1 readout.',
  status: 'IN_PROGRESS',
  assignedTo: 'user-001',
  createdAt: '2025-12-22T10:00:00Z',
  updatedAt: '2025-12-23T15:00:00Z',
};

mockScreening4.overallScore = calculateOverallScreeningScore(mockScreening4);

// ===== Screening Assessment 5: Failed (Red Flags) =====
const screening5Checklist = createAnsweredChecklist({
  'sf-1': false,
  'sf-2': false,
  'sf-3': false,
  'sf-4': false,
  'tf-1': true,
  'tf-2': false,
  'tf-3': false,
  'tf-4': false,
  'tf-5': false,
  'cv-1': false,
  'cv-2': false,
  'cv-3': false,
  'cv-4': false,
  'cv-5': false,
  'rip-1': false,
  'rip-2': false,
  'rip-3': false,
  'rip-4': false,
  'rip-5': false,
  'tr-1': false,
  'tr-2': false,
  'tr-3': false,
  'tr-4': false,
  'rf-1': true, // IP disputes
  'rf-2': true, // Safety failures
  'rf-3': false,
  'rf-4': false,
  'rf-5': false,
});

const screening5TherapeuticFit: TherapeuticAreaFit = {
  area: 'CARDIOVASCULAR',
  fitScore: 'POOR',
  scoreValue: 32,
  rationale:
    'Poor fit. Not aligned with core focus areas. Technical and commercial risks are too high.',
  strategicAlignment: 25,
  technicalCapability: 30,
  marketOpportunity: 40,
  competitivePosition: 33,
};

const screening5Market: MarketAssessmentMatrix = {
  marketSize: 35,
  marketGrowthRate: 30,
  profitability: 40,
  patientNeed: 55,
  accessBarriers: 25,
  productDifferentiation: 20,
  ipStrength: 15,
  regulatoryPathway: 30,
  clinicalEvidence: 25,
  teamCapability: 28,
  ...calculateMarketAssessmentScores({
    marketSize: 35,
    marketGrowthRate: 30,
    profitability: 40,
    patientNeed: 55,
    accessBarriers: 25,
    productDifferentiation: 20,
    ipStrength: 15,
    regulatoryPathway: 30,
    clinicalEvidence: 25,
    teamCapability: 28,
  } as MarketAssessmentMatrix),
};

export const mockScreening5: ScreeningAssessment = {
  id: 'screening-005',
  companyId: mockCompanies[4].id,
  company: mockCompanies[4],
  innovationName: 'Generic ACE Inhibitor Combination',
  innovationDescription:
    'Fixed-dose combination of existing ACE inhibitor with diuretic. Limited differentiation.',
  therapeuticArea: 'CARDIOVASCULAR',
  trl: 'TRL_3',
  trlJustification: 'Early proof of concept only. No novel mechanism.',
  therapeuticAreaFit: screening5TherapeuticFit,
  marketAssessment: screening5Market,
  preScreeningChecklist: screening5Checklist,
  overallScore: 28,
  recommendation:
    'Not recommended. Multiple red flags including unresolved IP litigation and previous safety issues. Does not meet minimum criteria.',
  decision: 'REJECT',
  decisionRationale:
    'Critical red flags: ongoing patent litigation with major pharma company, previous Phase 2 trial halted for safety. Company has <3 months cash runway. No strategic fit.',
  status: 'REJECTED',
  assignedTo: 'user-002',
  completedBy: 'user-002',
  completedAt: '2025-12-17T11:00:00Z',
  reviewedBy: 'user-001',
  reviewedAt: '2025-12-17T14:30:00Z',
  createdAt: '2025-12-15T13:00:00Z',
  updatedAt: '2025-12-17T14:30:00Z',
};

mockScreening5.overallScore = calculateOverallScreeningScore(mockScreening5);

// ===== Export All Screenings =====
export const mockScreenings: ScreeningAssessment[] = [
  mockScreening1,
  mockScreening2,
  mockScreening3,
  mockScreening4,
  mockScreening5,
];
