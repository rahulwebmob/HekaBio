/**
 * Survey Types (Phase 1)
 * Survey capture and submission system
 */

import type { ID, Timestamp } from './common.types';
import type { Company } from './addressBook.types';
import type { Project } from './project.types';

// ===== Survey Template Types =====
export type SurveyType = 'SURVEY_1' | 'SURVEY_2' | 'SURVEY_3' | 'JAPAN_ASSESSMENT' | 'CUSTOM';

export type QuestionType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'RATING'
  | 'DATE'
  | 'FILE_UPLOAD'
  | 'EMAIL'
  | 'URL'
  | 'PHONE'
  | 'CURRENCY'
  | 'PERCENTAGE'
  | 'RANGE' // Min-max range
  | 'CHECKBOX' // Single checkbox (yes/no)
  | 'SCALE' // 1-10 scale
  | 'MATRIX' // Grid of options
  | 'DROPDOWN'; // Select dropdown

export type SurveyStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type SubmissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED';

// ===== Survey Template =====
export interface SurveyTemplate {
  id: ID;
  name: string;
  type: SurveyType;
  description?: string;
  version: string; // e.g., "1.0", "2.0"
  isActive: boolean;
  sections: SurveySection[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// ===== Survey Section =====
export interface SurveySection {
  id: ID;
  title: string;
  description?: string;
  order: number;
  questions: SurveyQuestion[];
}

// ===== Survey Question =====
export interface SurveyQuestion {
  id: ID;
  sectionId: ID;
  questionText: string;
  helpText?: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  options?: QuestionOption[]; // For single/multiple choice
  validation?: QuestionValidation;
  conditionalLogic?: ConditionalLogic; // Show question based on previous answers
}

export interface QuestionOption {
  id: ID;
  label: string;
  value: string;
  order: number;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string; // Regex pattern
  errorMessage?: string;
}

export interface ConditionalLogic {
  dependsOnQuestionId: ID;
  showWhen: {
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';
    value: string | number;
  };
}

// ===== Survey Instance =====
// An instance of a survey sent to a specific company/project
export interface SurveyInstance {
  id: ID;
  templateId: ID;
  template: SurveyTemplate;

  // Target
  companyId: ID;
  company: Company;
  projectId?: ID;
  project?: Project;

  // Status
  status: SubmissionStatus;

  // Assignments
  assignedTo: ID; // Contact ID who should fill the survey
  assignedBy: ID; // User who assigned the survey

  // Dates
  sentAt: Timestamp;
  dueDate?: Timestamp;
  startedAt?: Timestamp;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;

  // Responses
  responses: SurveyResponse[];
  completionPercentage: number; // 0-100

  // Review
  reviewedBy?: ID;
  reviewNotes?: string;
  flaggedQuestions?: ID[]; // Questions that need follow-up

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ===== Survey Response =====
export interface SurveyResponse {
  id: ID;
  surveyInstanceId: ID;
  questionId: ID;
  question: SurveyQuestion;

  // Answer data
  textAnswer?: string;
  numberAnswer?: number;
  dateAnswer?: Timestamp;
  choiceAnswers?: string[]; // For single/multiple choice (store option IDs)
  fileUrls?: string[]; // For file uploads

  // Metadata
  answeredAt: Timestamp;
  answeredBy?: ID; // May differ from assignedTo if delegated
  skipped?: boolean;
  notes?: string;
}

// ===== Survey Analytics =====
export interface SurveyAnalytics {
  templateId: ID;
  totalSent: number;
  totalStarted: number;
  totalCompleted: number;
  avgCompletionTime: number; // in minutes
  avgCompletionPercentage: number;
  responseRates: ResponseRate[];
  commonGaps: DataGap[]; // Questions commonly left unanswered
}

export interface ResponseRate {
  questionId: ID;
  questionText: string;
  totalResponses: number;
  responseRate: number; // percentage
  avgRating?: number; // for rating questions
}

export interface DataGap {
  questionId: ID;
  questionText: string;
  sectionId: ID;
  sectionTitle: string;
  gapRate: number; // percentage of surveys where this wasn't answered
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ===== Survey Filters =====
export interface SurveyFilters {
  type?: SurveyType[];
  status?: SubmissionStatus[];
  companyId?: ID[];
  projectId?: ID[];
  assignedTo?: ID[];
  sentDateFrom?: Timestamp;
  sentDateTo?: Timestamp;
  dueDateFrom?: Timestamp;
  dueDateTo?: Timestamp;
  completionMin?: number; // 0-100
  completionMax?: number; // 0-100
  search?: string;
}

// ===== Pre-defined Survey Types =====
// These will be used to create the standard survey templates

export interface Survey1Data {
  // Basic Company Info (from address book)
  companyOverview: string;

  // Product/Technology
  productDescription: string;
  technologyPlatform: string;
  clinicalIndication: string;
  developmentStage: string;

  // Intellectual Property
  ipStatus: string;
  patentNumbers?: string;
  exclusivityPeriod?: string;

  // Regulatory
  regulatoryStatus: string;
  fdaDesignation?: string;
  clinicalTrials?: string;

  // Market
  targetMarket: string;
  competitiveLandscape: string;
  marketSize?: string;
}

export interface Survey2Data extends Survey1Data {
  // Deeper dive after initial screening
  clinicalData: string;
  clinicalEndpoints: string;
  safetyProfile: string;

  // Manufacturing
  manufacturingCapability: string;
  supplyChain: string;

  // Commercial
  pricingStrategy?: string;
  reimbursementPath?: string;
  keyOpinionLeaders?: string;
}

export interface Survey3Data extends Survey2Data {
  // Final deep dive before partnership
  financialProjections: string;
  fundingHistory: string;

  // Partnership
  partnershipObjectives: string;
  exclusivityRequirements?: string;
  geographicRights?: string;

  // Operations
  managementTeam: string;
  advisoryBoard?: string;
}

export interface JapanAssessmentData {
  // Japan-specific questions
  japanMarketInterest: boolean;
  japanRegulatoryExperience?: string;
  japanClinicalTrials?: string;
  japanPartnerships?: string;
  japanReimbursement?: string;
  culturalConsiderations?: string;
  languageCapabilities?: string;
}
