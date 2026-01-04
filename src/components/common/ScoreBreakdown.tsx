/**
 * Score Breakdown Component
 * Displays detailed breakdown of score by factor with bars
 */

import { Card } from '../ui';
import { CURRENT_SCORING_MODEL } from '../../config/scoringModel';
import type { ScoreBreakdown as ScoreBreakdownType } from '../../types/project.types';

interface ScoreBreakdownProps {
  scoreBreakdown: ScoreBreakdownType;
  showWeights?: boolean;
  compact?: boolean;
}

export function ScoreBreakdown({
  scoreBreakdown,
  showWeights = true,
  compact = false,
}: ScoreBreakdownProps) {
  const factors = CURRENT_SCORING_MODEL.factors;

  const getFactorScore = (factorId: string): number => {
    switch (factorId) {
      case 'clinical_evidence':
        return scoreBreakdown.clinicalEvidence;
      case 'ip_status':
        return scoreBreakdown.ipStatus;
      case 'market_traction':
        return scoreBreakdown.marketTraction;
      case 'strategic_fit':
        return scoreBreakdown.strategicFit;
      case 'regulatory_clarity':
        return scoreBreakdown.regulatoryClarity;
      case 'financial_health':
        return scoreBreakdown.financialHealth;
      default:
        return 0;
    }
  };

  const getBarColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-success-500';
    if (percentage >= 60) return 'bg-brand-500';
    if (percentage >= 40) return 'bg-warning-500';
    return 'bg-error-500';
  };

  const getTextColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-success-600';
    if (percentage >= 60) return 'text-brand-600';
    if (percentage >= 40) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <Card
      padding="lg"
      shadow="sm"
      header={
        <div className="flex items-center justify-between">
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
            Score Breakdown
          </h3>
          <span className="text-sm text-gray-600">
            Total: <span className="font-bold text-brand-600">{scoreBreakdown.total}</span> / 100
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {factors.map((factor) => {
          const score = getFactorScore(factor.id);
          const percentage = (score / factor.maxScore) * 100;

          return (
            <div key={factor.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`${compact ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
                      {factor.name}
                    </p>
                    {showWeights && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {factor.weight}% weight
                      </span>
                    )}
                  </div>
                  {!compact && <p className="text-xs text-gray-600 mt-0.5">{factor.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`${compact ? 'text-lg' : 'text-xl'} font-bold ${getTextColor(percentage)}`}
                  >
                    {score}
                  </span>
                  <span className="text-sm text-gray-500">/ {factor.maxScore}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getBarColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{percentage.toFixed(0)}% of maximum</span>
                {percentage < 50 && (
                  <span className="text-error-600 font-medium">Improvement needed</span>
                )}
                {percentage >= 50 && percentage < 80 && (
                  <span className="text-warning-600 font-medium">Good</span>
                )}
                {percentage >= 80 && (
                  <span className="text-success-600 font-medium">Excellent</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Summary Note */}
        {!compact && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Each factor contributes to the total score based on its weight.
              Focus on improving low-scoring factors to increase overall score.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
