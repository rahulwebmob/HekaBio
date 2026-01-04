/**
 * What-If Score Calculator
 * Interactive tool to explore score scenarios by adjusting individual factors
 */

import { useState, useEffect } from 'react';
import { IconCalculator, IconRefresh, IconDeviceFloppy, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Card, Button, Badge } from '../../ui';
import type { ScoreBreakdown } from '../../../types/project.types';

interface WhatIfScoreCalculatorProps {
  currentBreakdown?: ScoreBreakdown;
  onApplyScore?: (breakdown: ScoreBreakdown) => void;
}

interface ScoreFactor {
  key: keyof Omit<ScoreBreakdown, 'total'>;
  label: string;
  max: number;
  description: string;
}

const SCORE_FACTORS: ScoreFactor[] = [
  {
    key: 'clinicalEvidence',
    label: 'Clinical Evidence',
    max: 20,
    description: 'Quality and stage of clinical data',
  },
  {
    key: 'strategicFit',
    label: 'Strategic Fit',
    max: 20,
    description: 'Alignment with company strategy',
  },
  {
    key: 'ipStatus',
    label: 'IP Status',
    max: 15,
    description: 'Patent protection and exclusivity',
  },
  {
    key: 'marketTraction',
    label: 'Market Traction',
    max: 15,
    description: 'Market validation and demand',
  },
  {
    key: 'regulatoryClarity',
    label: 'Regulatory Clarity',
    max: 15,
    description: 'Regulatory pathway clarity',
  },
  {
    key: 'financialHealth',
    label: 'Financial Health',
    max: 15,
    description: 'Company financial stability',
  },
];

export default function WhatIfScoreCalculator({
  currentBreakdown,
  onApplyScore,
}: WhatIfScoreCalculatorProps) {
  const [breakdown, setBreakdown] = useState<ScoreBreakdown>(() => {
    if (currentBreakdown) {
      return { ...currentBreakdown };
    }
    // Default breakdown if none provided
    return {
      clinicalEvidence: 10,
      ipStatus: 8,
      marketTraction: 7,
      strategicFit: 10,
      regulatoryClarity: 8,
      financialHealth: 7,
      total: 50,
    };
  });

  const [originalBreakdown] = useState<ScoreBreakdown>(
    currentBreakdown || breakdown
  );

  // Recalculate total whenever breakdown changes
  useEffect(() => {
    const total =
      breakdown.clinicalEvidence +
      breakdown.ipStatus +
      breakdown.marketTraction +
      breakdown.strategicFit +
      breakdown.regulatoryClarity +
      breakdown.financialHealth;
    setBreakdown((prev) => ({ ...prev, total }));
  }, [
    breakdown.clinicalEvidence,
    breakdown.ipStatus,
    breakdown.marketTraction,
    breakdown.strategicFit,
    breakdown.regulatoryClarity,
    breakdown.financialHealth,
  ]);

  const handleFactorChange = (key: keyof Omit<ScoreBreakdown, 'total'>, value: number) => {
    setBreakdown((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setBreakdown({ ...originalBreakdown });
  };

  const handleApply = () => {
    if (onApplyScore) {
      onApplyScore(breakdown);
    }
  };

  const scoreDelta = breakdown.total - originalBreakdown.total;
  const isChanged = scoreDelta !== 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-brand-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-error-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 60) return 'bg-brand-100';
    if (score >= 40) return 'bg-warning-100';
    return 'bg-error-100';
  };

  return (
    <Card padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100">
              <IconCalculator size={24} className="text-brand-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">What-If Score Calculator</h3>
              <p className="text-sm text-gray-600">
                Adjust factors to explore different scoring scenarios
              </p>
            </div>
          </div>
        </div>

        {/* Current vs New Score */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Original Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(originalBreakdown.total)}`}>
              {originalBreakdown.total}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${getScoreBgColor(breakdown.total)}`}>
            <p className="text-xs font-medium text-gray-700 mb-1">New Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(breakdown.total)}`}>
              {breakdown.total}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
            <p className="text-xs font-medium text-gray-600 mb-1">Change</p>
            <div className="flex items-center gap-2">
              {scoreDelta > 0 ? (
                <>
                  <IconTrendingUp size={20} className="text-success-600" />
                  <p className="text-2xl font-bold text-success-600">+{scoreDelta}</p>
                </>
              ) : scoreDelta < 0 ? (
                <>
                  <IconTrendingDown size={20} className="text-error-600" />
                  <p className="text-2xl font-bold text-error-600">{scoreDelta}</p>
                </>
              ) : (
                <p className="text-2xl font-bold text-gray-400">0</p>
              )}
            </div>
          </div>
        </div>

        {/* Factor Sliders */}
        <div className="space-y-4">
          {SCORE_FACTORS.map((factor) => {
            const originalValue = originalBreakdown[factor.key];
            const currentValue = breakdown[factor.key];
            const factorDelta = currentValue - originalValue;

            return (
              <div key={factor.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{factor.label}</p>
                    <p className="text-xs text-gray-500">{factor.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {factorDelta !== 0 && (
                      <Badge
                        variant={factorDelta > 0 ? 'success' : 'error'}
                        size="sm"
                      >
                        {factorDelta > 0 ? '+' : ''}{factorDelta}
                      </Badge>
                    )}
                    <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
                      {currentValue} / {factor.max}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={factor.max}
                    step="1"
                    value={currentValue}
                    onChange={(e) => handleFactorChange(factor.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    style={{
                      background: `linear-gradient(to right, #0F766E 0%, #0F766E ${(currentValue / factor.max) * 100}%, #E5E7EB ${(currentValue / factor.max) * 100}%, #E5E7EB 100%)`,
                    }}
                  />
                  {/* Original value marker */}
                  {originalValue !== currentValue && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-gray-400 rounded"
                      style={{
                        left: `${(originalValue / factor.max) * 100}%`,
                      }}
                      title={`Original: ${originalValue}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleReset}
            leftIcon={<IconRefresh size={18} />}
            disabled={!isChanged}
          >
            Reset to Original
          </Button>
          {onApplyScore && (
            <Button
              variant="primary"
              onClick={handleApply}
              leftIcon={<IconDeviceFloppy size={18} />}
              disabled={!isChanged}
            >
              Apply New Score
            </Button>
          )}
        </div>

        {/* Score Interpretation */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Score Interpretation:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success-500" />
              <span className="text-gray-700">80-100: Excellent fit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-brand-500" />
              <span className="text-gray-700">60-79: Good fit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-warning-500" />
              <span className="text-gray-700">40-59: Moderate fit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-error-500" />
              <span className="text-gray-700">0-39: Poor fit</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
