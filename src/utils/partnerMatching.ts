/**
 * Partner Matching Utility
 * AI-based partner matching algorithm based on therapeutic area, disease area, and modality
 */

import type { Project } from '../types/project.types';
import type { Company, TherapeuticArea, DiseaseArea, Modality } from '../types/addressBook.types';

/**
 * Partner Match Result
 */
export interface PartnerMatch {
  partnerId: string;
  partnerName: string;
  matchScore: number; // 0-100
  matchReasons: string[];
  therapeuticAreaMatches: TherapeuticArea[];
  diseaseAreaMatches: DiseaseArea[];
  modalityMatches: Modality[];
  geographicMatch: boolean;
}

/**
 * Match a project with potential partners from the address book
 *
 * Matching criteria:
 * 1. Therapeutic Area (30% weight)
 * 2. Disease Area (30% weight)
 * 3. Modality (25% weight)
 * 4. Geographic Focus (15% weight)
 *
 * @param project - The project to match partners for
 * @param partners - List of potential partner companies
 * @param minMatchScore - Minimum match score threshold (default: 40)
 * @returns Array of matched partners sorted by match score (highest first)
 */
export function matchPartnersForProject(
  project: Project,
  partners: Company[],
  minMatchScore: number = 40
): PartnerMatch[] {
  const matches: PartnerMatch[] = [];

  // Extract project criteria from company or project metadata
  // Note: We'll need to add these fields to projects or extract from surveys
  const projectTherapeuticAreas = extractTherapeuticAreas(project);
  const projectDiseaseAreas = extractDiseaseAreas(project);
  const projectModalities = extractModalities(project);

  for (const partner of partners) {
    // Skip inactive partners or non-partner companies
    if (!partner.isActive) continue;
    if (partner.category !== 'PARTNER' && partner.category !== 'PROSPECT') continue;
    if (!partner.focusedTherapeuticAreas && !partner.focusedDiseaseAreas && !partner.modalities) {
      continue; // Skip partners without matching fields
    }

    const match = calculatePartnerMatch(
      project,
      partner,
      projectTherapeuticAreas,
      projectDiseaseAreas,
      projectModalities
    );

    if (match.matchScore >= minMatchScore) {
      matches.push(match);
    }
  }

  // Sort by match score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculate match score between a project and a partner
 */
function calculatePartnerMatch(
  project: Project,
  partner: Company,
  projectTherapeuticAreas: TherapeuticArea[],
  projectDiseaseAreas: DiseaseArea[],
  projectModalities: Modality[]
): PartnerMatch {
  let totalScore = 0;
  const matchReasons: string[] = [];
  const therapeuticAreaMatches: TherapeuticArea[] = [];
  const diseaseAreaMatches: DiseaseArea[] = [];
  const modalityMatches: Modality[] = [];

  // 1. Therapeutic Area Matching (30% weight)
  if (partner.focusedTherapeuticAreas && partner.focusedTherapeuticAreas.length > 0) {
    const taMatches = projectTherapeuticAreas.filter((ta) =>
      partner.focusedTherapeuticAreas?.includes(ta)
    );
    if (taMatches.length > 0) {
      const taScore = (taMatches.length / projectTherapeuticAreas.length) * 30;
      totalScore += taScore;
      therapeuticAreaMatches.push(...taMatches);
      matchReasons.push(
        `Matches ${taMatches.length} therapeutic area${taMatches.length > 1 ? 's' : ''}`
      );
    }
  }

  // 2. Disease Area Matching (30% weight)
  if (partner.focusedDiseaseAreas && partner.focusedDiseaseAreas.length > 0) {
    const daMatches = projectDiseaseAreas.filter((da) =>
      partner.focusedDiseaseAreas?.includes(da)
    );
    if (daMatches.length > 0) {
      const daScore = (daMatches.length / Math.max(projectDiseaseAreas.length, 1)) * 30;
      totalScore += daScore;
      diseaseAreaMatches.push(...daMatches);
      matchReasons.push(
        `Matches ${daMatches.length} disease area${daMatches.length > 1 ? 's' : ''}`
      );
    }
  }

  // 3. Modality Matching (25% weight)
  if (partner.modalities && partner.modalities.length > 0) {
    const modalityMatchList = projectModalities.filter((m) => partner.modalities?.includes(m));
    if (modalityMatchList.length > 0) {
      const modalityScore = (modalityMatchList.length / projectModalities.length) * 25;
      totalScore += modalityScore;
      modalityMatches.push(...modalityMatchList);
      matchReasons.push(
        `Matches ${modalityMatchList.length} modality${modalityMatchList.length > 1 ? 'ies' : ''}`
      );
    }
  }

  // 4. Geographic Focus Matching (15% weight)
  let geographicMatch = false;
  if (partner.geographicFocus && partner.geographicFocus.length > 0) {
    // Check if partner has Japan or Asia-Pacific focus (since client is focused on Japan market)
    const hasJapanFocus = partner.geographicFocus.some(
      (geo) =>
        geo.toLowerCase().includes('japan') ||
        geo.toLowerCase().includes('asia') ||
        geo.toLowerCase().includes('global')
    );
    if (hasJapanFocus && project.japanInterest) {
      totalScore += 15;
      geographicMatch = true;
      matchReasons.push('Has Japan/Asia-Pacific focus');
    } else if (hasJapanFocus) {
      totalScore += 7.5;
      geographicMatch = true;
      matchReasons.push('Has geographic focus relevant to project');
    }
  }

  return {
    partnerId: partner.id,
    partnerName: partner.name,
    matchScore: Math.round(totalScore),
    matchReasons,
    therapeuticAreaMatches,
    diseaseAreaMatches,
    modalityMatches,
    geographicMatch,
  };
}

/**
 * Extract therapeutic areas from project
 * TODO: This should be enhanced to extract from survey data or project metadata
 */
function extractTherapeuticAreas(project: Project): TherapeuticArea[] {
  // Placeholder: Extract from project tags or company data
  // In real implementation, this would come from survey responses
  const areas: TherapeuticArea[] = [];

  // For now, check company tags for therapeutic area keywords
  if (project.company.tags) {
    for (const tag of project.company.tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes('oncology') || tagLower.includes('cancer')) areas.push('ONCOLOGY');
      if (tagLower.includes('cardio')) areas.push('CARDIOLOGY');
      if (tagLower.includes('neuro')) areas.push('NEUROLOGY');
      if (tagLower.includes('immuno')) areas.push('IMMUNOLOGY');
      if (tagLower.includes('rare')) areas.push('RARE_DISEASES');
      // Add more mappings as needed
    }
  }

  return Array.from(new Set(areas)); // Remove duplicates
}

/**
 * Extract disease areas from project
 * TODO: This should be enhanced to extract from survey data or project metadata
 */
function extractDiseaseAreas(project: Project): DiseaseArea[] {
  const areas: DiseaseArea[] = [];

  // Extract from project.diseaseArea if available
  if (project.diseaseArea) {
    const diseaseAreaLower = project.diseaseArea.toLowerCase();
    if (diseaseAreaLower.includes('breast cancer')) areas.push('BREAST_CANCER');
    if (diseaseAreaLower.includes('lung cancer')) areas.push('LUNG_CANCER');
    if (diseaseAreaLower.includes('alzheimer')) areas.push('ALZHEIMERS');
    if (diseaseAreaLower.includes('parkinson')) areas.push('PARKINSONS');
    if (diseaseAreaLower.includes('diabetes')) {
      areas.push('DIABETES_TYPE_1');
      areas.push('DIABETES_TYPE_2');
    }
    // Add more mappings as needed
  }

  // Also check company tags
  if (project.company.tags) {
    for (const tag of project.company.tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes('breast cancer')) areas.push('BREAST_CANCER');
      if (tagLower.includes('diabetes')) {
        areas.push('DIABETES_TYPE_1');
        areas.push('DIABETES_TYPE_2');
      }
      // Add more mappings
    }
  }

  return Array.from(new Set(areas));
}

/**
 * Extract modalities from project
 * TODO: This should be enhanced to extract from survey data or project metadata
 */
function extractModalities(project: Project): Modality[] {
  const modalities: Modality[] = [];

  // Check company tags for modality keywords
  if (project.company.tags) {
    for (const tag of project.company.tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes('small molecule') || tagLower.includes('drug')) {
        modalities.push('SMALL_MOLECULE');
      }
      if (tagLower.includes('biologic') || tagLower.includes('antibody')) {
        modalities.push('BIOLOGICS');
        modalities.push('ANTIBODY');
      }
      if (tagLower.includes('cell therapy')) modalities.push('CELL_THERAPY');
      if (tagLower.includes('gene therapy')) modalities.push('GENE_THERAPY');
      if (tagLower.includes('rna')) modalities.push('RNA_THERAPY');
      if (tagLower.includes('vaccine')) modalities.push('VACCINE');
      if (tagLower.includes('device')) modalities.push('MEDICAL_DEVICE');
      if (tagLower.includes('diagnostic')) modalities.push('DIAGNOSTIC');
      if (tagLower.includes('digital')) modalities.push('DIGITAL_HEALTH');
    }
  }

  return Array.from(new Set(modalities));
}

/**
 * Get partner type recommendations for a project
 */
export function getRecommendedPartnerTypes(project: Project): string[] {
  const types: string[] = [];

  // Based on project stage, recommend different partner types
  switch (project.currentStage) {
    case 'PARTNER_MATCHING':
    case 'OUTREACH':
      types.push('DISTRIBUTOR', 'INVESTOR', 'SERVICE_PROVIDER');
      break;
    case 'DUE_DILIGENCE':
      types.push('CONSULTANT', 'SERVICE_PROVIDER');
      break;
    case 'CONTRACT_NEGOTIATION':
      types.push('DISTRIBUTOR', 'INVESTOR');
      break;
    default:
      types.push('DISTRIBUTOR', 'INVESTOR', 'CONSULTANT', 'SERVICE_PROVIDER');
  }

  // If high Japan interest, prioritize distributors with Japan focus
  if (project.japanInterest) {
    types.unshift('DISTRIBUTOR');
  }

  return Array.from(new Set(types));
}

/**
 * Filter partners by type
 */
export function filterPartnersByType(
  partners: Company[],
  partnerTypes: string[]
): Company[] {
  return partners.filter((partner) => {
    if (!partner.partnerType || partner.partnerType.length === 0) return false;
    return partner.partnerType.some((type) => partnerTypes.includes(type));
  });
}

/**
 * Get top N partners for a project
 */
export function getTopPartners(
  project: Project,
  partners: Company[],
  limit: number = 10
): PartnerMatch[] {
  const matches = matchPartnersForProject(project, partners);
  return matches.slice(0, limit);
}
