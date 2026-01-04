/**
 * Mock AI Data Extraction Service
 * Simulates extracting data from uploaded documents (PDF/PPT)
 */

import type {
  ExtractionResult,
  ExtractedField,
  GapAnalysisResult,
  FieldGap,
} from '../types/extraction.types';
import { EXTRACTABLE_FIELDS } from '../types/extraction.types';

/**
 * Simulate AI processing delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate mock extracted data from a document
 */
export const extractDataFromDocument = async (
  file: File,
  projectId?: string
): Promise<ExtractionResult> => {
  const startTime = Date.now();

  // Simulate upload and processing
  await delay(2000 + Math.random() * 2000); // 2-4 seconds

  // Mock extracted fields with varying confidence
  const extractedFields: ExtractedField[] = [
    {
      fieldName: 'productName',
      value: 'NeoTherapy-101',
      confidence: 95,
      source: 'Page 1',
      isVerified: false,
    },
    {
      fieldName: 'therapeuticArea',
      value: 'Oncology',
      confidence: 98,
      source: 'Page 1',
      isVerified: false,
    },
    {
      fieldName: 'indication',
      value: 'Advanced Non-Small Cell Lung Cancer (NSCLC)',
      confidence: 92,
      source: 'Page 2',
      isVerified: false,
    },
    {
      fieldName: 'modality',
      value: 'Small Molecule',
      confidence: 88,
      source: 'Page 2',
      isVerified: false,
    },
    {
      fieldName: 'moa',
      value: 'EGFR Tyrosine Kinase Inhibitor',
      confidence: 85,
      source: 'Page 3',
      isVerified: false,
    },
    {
      fieldName: 'developmentStage',
      value: 'Phase 2',
      confidence: 96,
      source: 'Page 4',
      isVerified: false,
    },
    {
      fieldName: 'clinicalTrials',
      value: '2 Phase 1 trials completed, 1 Phase 2 ongoing',
      confidence: 90,
      source: 'Page 5',
      isVerified: false,
    },
    {
      fieldName: 'patientPopulation',
      value: 'Adult patients with EGFR-mutant NSCLC',
      confidence: 87,
      source: 'Page 5',
      isVerified: false,
    },
    {
      fieldName: 'primaryEndpoint',
      value: 'Objective Response Rate (ORR)',
      confidence: 91,
      source: 'Page 6',
      isVerified: false,
    },
    {
      fieldName: 'clinicalData',
      value: 'Phase 1: ORR 45%, DCR 78%, median PFS 8.2 months',
      confidence: 83,
      source: 'Page 6-7',
      isVerified: false,
    },
    {
      fieldName: 'regulatoryStatus',
      value: 'IND approved (USA), CTA approved (EU)',
      confidence: 94,
      source: 'Page 8',
      isVerified: false,
    },
    {
      fieldName: 'orphanDesignation',
      value: 'Applied for Orphan Drug Designation',
      confidence: 72,
      source: 'Page 8',
      isVerified: false,
    },
    {
      fieldName: 'patentStatus',
      value: 'Granted in US, EU, Japan',
      confidence: 89,
      source: 'Page 10',
      isVerified: false,
    },
    {
      fieldName: 'patentExpiry',
      value: '2038',
      confidence: 93,
      source: 'Page 10',
      isVerified: false,
    },
    {
      fieldName: 'marketSize',
      value: 'Global NSCLC market: $15.2B (2023)',
      confidence: 86,
      source: 'Page 12',
      isVerified: false,
    },
    {
      fieldName: 'competition',
      value: 'Competing with Tagrisso (AstraZeneca), Rybrevant (JNJ)',
      confidence: 81,
      source: 'Page 13',
      isVerified: false,
    },
    {
      fieldName: 'fundingRaised',
      value: '$45M Series B',
      confidence: 95,
      source: 'Page 15',
      isVerified: false,
    },
  ];

  const processingTime = Date.now() - startTime;

  return {
    id: `extraction-${Date.now()}`,
    projectId,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
    status: 'COMPLETED',
    extractedFields,
    processingTimeMs: processingTime,
  };
};

/**
 * Analyze gaps between extracted data and required fields
 */
export const analyzeDataGaps = (
  extractedFields: ExtractedField[],
  projectId: string
): GapAnalysisResult => {
  const allFieldNames = Object.keys(EXTRACTABLE_FIELDS);

  const gaps: FieldGap[] = allFieldNames.map((fieldName) => {
    const fieldConfig = EXTRACTABLE_FIELDS[fieldName as keyof typeof EXTRACTABLE_FIELDS];
    const extracted = extractedFields.find((f) => f.fieldName === fieldName);

    return {
      fieldName,
      label: fieldConfig.label,
      category: fieldConfig.category,
      isMissing: !extracted,
      currentValue: extracted?.editedValue || extracted?.value,
      importance: fieldConfig.importance,
    };
  });

  const missingFields = gaps.filter((g) => g.isMissing).length;
  const completedFields = allFieldNames.length - missingFields;
  const completionPercentage = Math.round((completedFields / allFieldNames.length) * 100);

  const criticalGaps = gaps.filter((g) => g.isMissing && g.importance === 'CRITICAL').length;
  const importantGaps = gaps.filter((g) => g.isMissing && g.importance === 'IMPORTANT').length;
  const optionalGaps = gaps.filter((g) => g.isMissing && g.importance === 'OPTIONAL').length;

  return {
    projectId,
    totalFields: allFieldNames.length,
    completedFields,
    missingFields,
    completionPercentage,
    gaps,
    criticalGaps,
    importantGaps,
    optionalGaps,
    analyzedAt: new Date().toISOString(),
  };
};

/**
 * Generate follow-up email content for missing fields
 */
export const generateFollowUpEmail = (
  gapAnalysis: GapAnalysisResult,
  companyName: string,
  projectName: string
): string => {
  const missingCritical = gapAnalysis.gaps.filter(
    (g) => g.isMissing && g.importance === 'CRITICAL'
  );
  const missingImportant = gapAnalysis.gaps.filter(
    (g) => g.isMissing && g.importance === 'IMPORTANT'
  );

  let email = `Dear ${companyName} Team,\n\n`;
  email += `Thank you for submitting information about ${projectName}. We have reviewed your materials and are very interested in learning more.\n\n`;

  if (missingCritical.length > 0) {
    email += `To proceed with our evaluation, we require the following critical information:\n\n`;
    missingCritical.forEach((gap, index) => {
      email += `${index + 1}. ${gap.label}\n`;
    });
    email += `\n`;
  }

  if (missingImportant.length > 0) {
    email += `Additionally, the following information would be very helpful for our assessment:\n\n`;
    missingImportant.forEach((gap, index) => {
      email += `${index + 1}. ${gap.label}\n`;
    });
    email += `\n`;
  }

  email += `Please provide this information at your earliest convenience. You can reply to this email or use the secure follow-up form link below:\n\n`;
  email += `[Follow-up Form Link]\n\n`;
  email += `If you have any questions, please don't hesitate to reach out.\n\n`;
  email += `Best regards,\n`;
  email += `HekaBio Team`;

  return email;
};
