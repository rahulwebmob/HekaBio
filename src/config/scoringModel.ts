/**
 * Lead Scoring Model Configuration
 * Defines scoring factors, weights, and calculation logic
 */

export interface ScoringFactor {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-100 (percentage contribution to total)
  maxScore: number; // Maximum points for this factor
  criteria: ScoringCriterion[];
}

export interface ScoringCriterion {
  condition: string;
  points: number;
  description: string;
}

export interface ScoringModel {
  id: string;
  name: string;
  version: string;
  effectiveDate: string;
  factors: ScoringFactor[];
  thresholds: ScoreThresholds;
}

export interface ScoreThresholds {
  hot: number; // Score >= this = Hot lead
  warm: number; // Score >= this = Warm lead
  // Score < warm = Cold lead
}

// Current active scoring model
export const CURRENT_SCORING_MODEL: ScoringModel = {
  id: 'model-2025-q1',
  name: 'HekaBio Lead Scoring Model Q1 2025',
  version: '1.0',
  effectiveDate: '2025-01-01',
  factors: [
    {
      id: 'clinical_evidence',
      name: 'Clinical Evidence',
      description: 'Strength of clinical data and development stage',
      weight: 20,
      maxScore: 20,
      criteria: [
        { condition: 'Phase III completed or approved', points: 20, description: 'Strong clinical validation' },
        { condition: 'Phase II completed', points: 15, description: 'Good clinical data' },
        { condition: 'Phase I completed', points: 10, description: 'Initial clinical data' },
        { condition: 'Preclinical with strong data', points: 7, description: 'Promising preclinical' },
        { condition: 'Early preclinical', points: 3, description: 'Early stage' },
        { condition: 'Discovery/research', points: 1, description: 'Very early stage' },
      ],
    },
    {
      id: 'ip_status',
      name: 'Intellectual Property Status',
      description: 'Patent portfolio strength and protection',
      weight: 15,
      maxScore: 15,
      criteria: [
        { condition: 'Granted patents in major markets', points: 15, description: 'Strong IP protection' },
        { condition: 'Patents pending in major markets', points: 12, description: 'Good IP strategy' },
        { condition: 'Provisional patents filed', points: 8, description: 'Initial IP protection' },
        { condition: 'Trade secrets/know-how', points: 5, description: 'Some IP value' },
        { condition: 'Limited or no IP', points: 2, description: 'Weak IP position' },
      ],
    },
    {
      id: 'market_traction',
      name: 'Market Traction',
      description: 'Commercial partnerships, funding, and validation',
      weight: 15,
      maxScore: 15,
      criteria: [
        { condition: 'Major pharma partnership', points: 15, description: 'Strong market validation' },
        { condition: 'Series B+ funding (>$30M)', points: 12, description: 'Well-funded' },
        { condition: 'Series A funding ($10-30M)', points: 9, description: 'Funded' },
        { condition: 'Seed/angel funding (<$10M)', points: 6, description: 'Early funding' },
        { condition: 'Grant-funded', points: 3, description: 'Non-dilutive funding' },
        { condition: 'Bootstrapped/unfunded', points: 1, description: 'Self-funded' },
      ],
    },
    {
      id: 'strategic_fit',
      name: 'Strategic Fit',
      description: 'Alignment with HekaBio focus areas and Japan market',
      weight: 20,
      maxScore: 20,
      criteria: [
        { condition: 'Perfect fit: Japan interest + therapeutic area + unmet need', points: 20, description: 'Ideal strategic match' },
        { condition: 'Strong fit: 2 of 3 criteria met', points: 15, description: 'Good strategic match' },
        { condition: 'Moderate fit: 1 of 3 criteria met', points: 10, description: 'Some strategic value' },
        { condition: 'Adjacent opportunity', points: 5, description: 'Peripheral fit' },
        { condition: 'Limited strategic alignment', points: 2, description: 'Weak strategic fit' },
      ],
    },
    {
      id: 'regulatory_clarity',
      name: 'Regulatory Clarity',
      description: 'Regulatory pathway and approval status',
      weight: 15,
      maxScore: 15,
      criteria: [
        { condition: 'Approved in major markets', points: 15, description: 'Regulatory success' },
        { condition: 'Orphan/breakthrough designation', points: 12, description: 'Favorable pathway' },
        { condition: 'Clear regulatory pathway', points: 10, description: 'Well-defined path' },
        { condition: 'Standard regulatory pathway', points: 7, description: 'Normal pathway' },
        { condition: 'Complex/uncertain pathway', points: 4, description: 'Regulatory challenges' },
        { condition: 'Very early/undefined', points: 1, description: 'Regulatory uncertainty' },
      ],
    },
    {
      id: 'financial_health',
      name: 'Financial Health',
      description: 'Runway, revenue, and financial sustainability',
      weight: 15,
      maxScore: 15,
      criteria: [
        { condition: 'Revenue-generating + >2yr runway', points: 15, description: 'Financially strong' },
        { condition: '>2 years runway', points: 12, description: 'Good runway' },
        { condition: '1-2 years runway', points: 9, description: 'Adequate runway' },
        { condition: '6-12 months runway', points: 5, description: 'Short runway' },
        { condition: '<6 months runway', points: 2, description: 'Financing urgency' },
      ],
    },
  ],
  thresholds: {
    hot: 80, // Score >= 80 = Hot lead
    warm: 60, // Score >= 60 = Warm lead
    // Score < 60 = Cold lead
  },
};

/**
 * Calculate overall score based on factor scores
 */
export function calculateOverallScore(factorScores: Record<string, number>): number {
  let totalScore = 0;

  CURRENT_SCORING_MODEL.factors.forEach((factor) => {
    const score = factorScores[factor.id] || 0;
    // Normalize to factor's weight (score is 0-maxScore, weight is percentage)
    const normalizedScore = (score / factor.maxScore) * factor.weight;
    totalScore += normalizedScore;
  });

  return Math.round(totalScore * 10) / 10; // Round to 1 decimal
}

/**
 * Get score category based on thresholds
 */
export function getScoreCategory(score: number): 'hot' | 'warm' | 'cold' {
  const { hot, warm } = CURRENT_SCORING_MODEL.thresholds;
  if (score >= hot) return 'hot';
  if (score >= warm) return 'warm';
  return 'cold';
}

/**
 * Get score color based on category
 */
export function getScoreColor(score: number): string {
  const category = getScoreCategory(score);
  switch (category) {
    case 'hot':
      return 'text-error-600';
    case 'warm':
      return 'text-warning-600';
    case 'cold':
      return 'text-blue-600';
  }
}

/**
 * Get score background color
 */
export function getScoreBgColor(score: number): string {
  const category = getScoreCategory(score);
  switch (category) {
    case 'hot':
      return 'bg-error-50 border-error-200';
    case 'warm':
      return 'bg-warning-50 border-warning-200';
    case 'cold':
      return 'bg-blue-50 border-blue-200';
  }
}

/**
 * Get recommended action based on score
 */
export function getRecommendedAction(score: number): string {
  const category = getScoreCategory(score);
  switch (category) {
    case 'hot':
      return 'Priority pursuit - Fast track to DD and partnership discussions';
    case 'warm':
      return 'Active pursuit - Continue evaluation and engagement';
    case 'cold':
      return 'Monitor - Keep in pipeline but deprioritize resources';
  }
}
