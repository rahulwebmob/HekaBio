/**
 * AI Data Extraction Types (Phase 6)
 */

import type { ID, Timestamp } from './common.types';

// ===== Extracted Field =====
export interface ExtractedField {
  fieldName: string;
  value: string | number | boolean | string[];
  confidence: number; // 0-100
  source: string; // e.g., "Page 3", "Slide 5"
  isVerified: boolean;
  editedValue?: string | number | boolean | string[];
}

// ===== Extraction Result =====
export interface ExtractionResult {
  id: ID;
  projectId?: ID;
  fileName: string;
  fileSize: number;
  uploadedAt: Timestamp;
  processedAt?: Timestamp;
  status: ExtractionStatus;
  extractedFields: ExtractedField[];
  processingError?: string;
  processingTimeMs?: number;
}

export type ExtractionStatus = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'VERIFIED';

// ===== Gap Analysis =====
export interface FieldGap {
  fieldName: string;
  label: string;
  category: GapCategory;
  isMissing: boolean;
  currentValue?: string | number | boolean | string[];
  expectedFormat?: string;
  importance: GapImportance;
}

export type GapCategory =
  | 'BASIC_INFO'
  | 'CLINICAL'
  | 'REGULATORY'
  | 'IP'
  | 'COMMERCIAL'
  | 'FINANCIAL';

export type GapImportance = 'CRITICAL' | 'IMPORTANT' | 'OPTIONAL';

export interface GapAnalysisResult {
  projectId: ID;
  totalFields: number;
  completedFields: number;
  missingFields: number;
  completionPercentage: number;
  gaps: FieldGap[];
  criticalGaps: number;
  importantGaps: number;
  optionalGaps: number;
  analyzedAt: Timestamp;
}

// ===== Field Mappings =====
export const EXTRACTABLE_FIELDS = {
  // Basic Info
  productName: {
    label: 'Product Name',
    category: 'BASIC_INFO' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  therapeuticArea: {
    label: 'Therapeutic Area',
    category: 'BASIC_INFO' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  indication: {
    label: 'Indication',
    category: 'BASIC_INFO' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  modality: {
    label: 'Modality',
    category: 'BASIC_INFO' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  moa: {
    label: 'Mechanism of Action',
    category: 'BASIC_INFO' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },

  // Clinical
  developmentStage: {
    label: 'Development Stage',
    category: 'CLINICAL' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  clinicalTrials: {
    label: 'Clinical Trials',
    category: 'CLINICAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  patientPopulation: {
    label: 'Patient Population',
    category: 'CLINICAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  primaryEndpoint: {
    label: 'Primary Endpoint',
    category: 'CLINICAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  clinicalData: {
    label: 'Clinical Data Summary',
    category: 'CLINICAL' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },

  // Regulatory
  regulatoryStatus: {
    label: 'Regulatory Status',
    category: 'REGULATORY' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  orphanDesignation: {
    label: 'Orphan Designation',
    category: 'REGULATORY' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  fastTrack: {
    label: 'Fast Track Status',
    category: 'REGULATORY' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  approvedRegions: {
    label: 'Approved Regions',
    category: 'REGULATORY' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },

  // IP
  patentStatus: {
    label: 'Patent Status',
    category: 'IP' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  patentExpiry: {
    label: 'Patent Expiry',
    category: 'IP' as GapCategory,
    importance: 'CRITICAL' as GapImportance,
  },
  exclusivity: {
    label: 'Market Exclusivity',
    category: 'IP' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },

  // Commercial
  marketSize: {
    label: 'Market Size',
    category: 'COMMERCIAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  competition: {
    label: 'Competitive Landscape',
    category: 'COMMERCIAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  pricing: {
    label: 'Pricing Strategy',
    category: 'COMMERCIAL' as GapCategory,
    importance: 'OPTIONAL' as GapImportance,
  },
  reimbursement: {
    label: 'Reimbursement Status',
    category: 'COMMERCIAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },

  // Financial
  fundingRaised: {
    label: 'Funding Raised',
    category: 'FINANCIAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
  valuation: {
    label: 'Company Valuation',
    category: 'FINANCIAL' as GapCategory,
    importance: 'OPTIONAL' as GapImportance,
  },
  partnershipDeals: {
    label: 'Partnership Deals',
    category: 'FINANCIAL' as GapCategory,
    importance: 'IMPORTANT' as GapImportance,
  },
};

// Helper functions
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-success-600';
  if (confidence >= 70) return 'text-warning-600';
  return 'text-error-600';
};

export const getConfidenceBadgeVariant = (confidence: number): 'success' | 'warning' | 'error' => {
  if (confidence >= 90) return 'success';
  if (confidence >= 70) return 'warning';
  return 'error';
};

export const getGapImportanceColor = (importance: GapImportance): string => {
  switch (importance) {
    case 'CRITICAL':
      return 'text-error-600';
    case 'IMPORTANT':
      return 'text-warning-600';
    case 'OPTIONAL':
      return 'text-gray-600';
  }
};

export const getGapImportanceBadge = (
  importance: GapImportance
): 'error' | 'warning' | 'default' => {
  switch (importance) {
    case 'CRITICAL':
      return 'error';
    case 'IMPORTANT':
      return 'warning';
    case 'OPTIONAL':
      return 'default';
  }
};
