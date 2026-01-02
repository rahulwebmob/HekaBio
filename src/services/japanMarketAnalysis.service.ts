/**
 * Japan Market Analysis Service (Mock)
 * Simulates AI-powered market analysis for Japan market fit
 */

import type { JapanMarketAnalysis } from '../types/japanScreening.types';
import type { Project } from '../types/project.types';

/**
 * Mock AI market analysis - simulates analyzing project for Japan market fit
 */
export async function analyzeJapanMarketFit(
  project: Project
): Promise<JapanMarketAnalysis> {
  // Simulate processing delay (3-5 seconds)
  const processingTime = 3 + Math.random() * 2;
  await new Promise((resolve) => setTimeout(resolve, processingTime * 1000));

  // Generate mock analysis based on project data
  const hasJapanInterest = project.japanInterest;
  const scoreBonus = hasJapanInterest ? 15 : 0;

  return {
    // Market Size
    prevalence: generateMockPrevalence(),
    incidence: generateMockIncidence(),
    targetPatientPopulation: generateMockPatientPopulation(),
    marketSizeEstimate: generateMockMarketSize(),

    // Competition
    currentTreatments: generateMockTreatments(),
    competitiveLandscape: generateMockCompetitiveLandscape(),
    marketLeaders: generateMockMarketLeaders(),

    // Regulatory
    regulatoryPathway: generateMockRegulatoryPathway(),
    approvalTimeline: generateMockApprovalTimeline(),
    pricingReimbursement: generateMockPricingReimbursement(),

    // Strategic
    partnerOpportunities: generateMockPartnerOpportunities(),
    marketEntry: generateMockMarketEntry(),
    keySuccess: generateMockSuccessFactors(),
    keyRisks: generateMockRisks(),

    // AI Generated Insights
    aiInsights: {
      marketAttractiveness: 70 + Math.random() * 20 + scoreBonus,
      competitivePosition: 60 + Math.random() * 30 + scoreBonus,
      regulatoryComplexity: 40 + Math.random() * 40, // Lower is better
      strategicFit: 65 + Math.random() * 25 + scoreBonus,
      overallRecommendation: generateRecommendation(project),
      confidence: 75 + Math.random() * 20,
    },
  };
}

// Mock data generators
function generateMockPrevalence(): string {
  const ranges = [
    '~50,000-100,000 patients in Japan',
    '~100,000-250,000 patients in Japan',
    '~250,000-500,000 patients in Japan',
    '~500,000-1M patients in Japan',
    '>1M patients in Japan',
  ];
  return ranges[Math.floor(Math.random() * ranges.length)];
}

function generateMockIncidence(): string {
  const ranges = [
    '~5,000-10,000 new cases per year',
    '~10,000-25,000 new cases per year',
    '~25,000-50,000 new cases per year',
    '~50,000-100,000 new cases per year',
    '>100,000 new cases per year',
  ];
  return ranges[Math.floor(Math.random() * ranges.length)];
}

function generateMockPatientPopulation(): string {
  const populations = [
    'Adult patients (18+) with moderate to severe disease',
    'Pediatric and adult patients with rare genetic disorder',
    'Elderly patients (65+) with chronic condition',
    'Treatment-naive and treatment-experienced patients',
    'Second-line therapy for refractory patients',
  ];
  return populations[Math.floor(Math.random() * populations.length)];
}

function generateMockMarketSize(): string {
  const sizes = [
    '¥5-10 billion (peak sales)',
    '¥10-20 billion (peak sales)',
    '¥20-50 billion (peak sales)',
    '¥50-100 billion (peak sales)',
    '>¥100 billion (peak sales)',
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function generateMockTreatments(): string[] {
  const treatments = [
    'Standard chemotherapy regimens',
    'Targeted small molecule inhibitors',
    'Monoclonal antibody therapies',
    'Immunotherapy (checkpoint inhibitors)',
    'Surgical intervention',
    'Radiation therapy',
    'Supportive care only',
  ];
  return treatments.slice(0, 2 + Math.floor(Math.random() * 3));
}

function generateMockCompetitiveLandscape(): string {
  const landscapes = [
    'Highly competitive with multiple approved therapies and strong market leaders',
    'Moderately competitive with 2-3 major players dominating the market',
    'Limited competition with only 1-2 approved options available',
    'Unmet need with no approved targeted therapies in Japan',
    'Emerging market with recent approvals creating new standard of care',
  ];
  return landscapes[Math.floor(Math.random() * landscapes.length)];
}

function generateMockMarketLeaders(): string[] {
  const leaders = [
    'Takeda Pharmaceutical',
    'Daiichi Sankyo',
    'Astellas Pharma',
    'Eisai',
    'Chugai Pharmaceutical (Roche)',
    'Ono Pharmaceutical',
    'Otsuka Pharmaceutical',
  ];
  return leaders.slice(0, 1 + Math.floor(Math.random() * 3));
}

function generateMockRegulatoryPathway(): string {
  const pathways = [
    'Standard PMDA review pathway (12-18 months)',
    'Priority review pathway (9-12 months)',
    'SAKIGAKE designation pathway (6-9 months) - high potential',
    'Orphan drug designation pathway with accelerated review',
    'Conditional approval pathway with post-market commitment',
  ];
  return pathways[Math.floor(Math.random() * pathways.length)];
}

function generateMockApprovalTimeline(): string {
  const timelines = [
    '2025-2026 (Phase III ongoing)',
    '2026-2027 (Japan Phase III planned)',
    '2027-2028 (global approval first, then Japan)',
    '2028-2029 (early development stage)',
    'Already approved in US/EU, Japan filing 2025',
  ];
  return timelines[Math.floor(Math.random() * timelines.length)];
}

function generateMockPricingReimbursement(): string {
  const pricing = [
    'Premium pricing expected (>¥5M/patient/year) with full NHI reimbursement',
    'Competitive pricing (¥2-5M/patient/year) aligned with existing therapies',
    'Value-based pricing strategy with outcomes-based agreements',
    'Orphan drug pricing with 50% premium vs. standard therapies',
    'Cost-effectiveness challenges requiring health economic data',
  ];
  return pricing[Math.floor(Math.random() * pricing.length)];
}

function generateMockPartnerOpportunities(): string[] {
  const partners = [
    'Major Japanese pharmaceutical companies (Takeda, Daiichi Sankyo, Astellas)',
    'Specialty pharma focused on therapeutic area',
    'Japanese biotech companies with local expertise',
    'Global pharma with Japan infrastructure',
    'Japanese trading companies (sogo shosha) for commercialization',
  ];
  return partners.slice(0, 2 + Math.floor(Math.random() * 2));
}

function generateMockMarketEntry(): string {
  const strategies = [
    'Partnership with major Japanese pharma for development & commercialization',
    'Direct market entry with local subsidiary and sales force',
    'Licensing deal for Japan rights with milestone payments',
    'Co-development and co-commercialization agreement',
    'Hybrid approach: partner for early development, direct for commercial',
  ];
  return strategies[Math.floor(Math.random() * strategies.length)];
}

function generateMockSuccessFactors(): string[] {
  return [
    'Strong clinical differentiation vs. existing therapies',
    'Positive health economics and cost-effectiveness data',
    'KOL support and clinical guideline inclusion',
    'Successful partnership with credible Japanese company',
    'SAKIGAKE or orphan designation',
    'Addressing significant unmet medical need',
  ];
}

function generateMockRisks(): string[] {
  return [
    'Competitive landscape intensifying with new approvals',
    'PMDA requirements for Japan-specific clinical data',
    'Pricing and reimbursement pressure from NHI',
    'Need for long-term safety data in Japanese population',
    'Partner dependency for local market access',
    'Generic competition timeline',
  ];
}

function generateRecommendation(project: Project): string {
  const score = project.score;
  const hasJapan = project.japanInterest;

  if (score >= 80 && hasJapan) {
    return 'Strong Recommend - Excellent strategic fit for Japan market. High priority for partnership discussions and market entry planning.';
  } else if (score >= 70 && hasJapan) {
    return 'Recommend - Good Japan market potential. Proceed with detailed due diligence and partner identification.';
  } else if (score >= 60) {
    return 'Consider with Caution - Moderate opportunity. Requires further market validation and competitive analysis.';
  } else if (hasJapan) {
    return 'Monitor - Japan interest noted but overall profile needs strengthening. Re-evaluate after key milestones.';
  } else {
    return 'Low Priority - Limited Japan market fit. Focus resources on higher priority opportunities.';
  }
}
