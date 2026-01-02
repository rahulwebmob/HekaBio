/**
 * Score Card Component
 * Large visual display of project score with category indicator
 */

import {
  IconFlame,
  IconThermometer,
  IconSnowflake,
  IconTrendingUp,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
} from '@tabler/icons-react';
import { Card, Badge } from '../ui';
import { getScoreCategory, getScoreColor, getRecommendedAction } from '../../config/scoringModel';

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  showRecommendation?: boolean;
  compact?: boolean;
}

export function ScoreCard({
  score,
  previousScore,
  showRecommendation = true,
  compact = false,
}: ScoreCardProps) {
  const category = getScoreCategory(score);
  const scoreColor = getScoreColor(score);

  // Calculate change
  const change = previousScore !== undefined ? score - previousScore : undefined;
  const changePercent =
    previousScore !== undefined && previousScore > 0
      ? ((change || 0) / previousScore) * 100
      : undefined;

  const getCategoryIcon = () => {
    switch (category) {
      case 'hot':
        return <IconFlame size={compact ? 32 : 48} className="text-error-600" />;
      case 'warm':
        return <IconThermometer size={compact ? 32 : 48} className="text-warning-600" />;
      case 'cold':
        return <IconSnowflake size={compact ? 32 : 48} className="text-blue-600" />;
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'hot':
        return 'Hot Lead';
      case 'warm':
        return 'Warm Lead';
      case 'cold':
        return 'Cold Lead';
    }
  };

  const getCategoryBadgeVariant = () => {
    switch (category) {
      case 'hot':
        return 'error' as const;
      case 'warm':
        return 'warning' as const;
      case 'cold':
        return 'info' as const;
    }
  };

  const getCategoryBgColor = () => {
    switch (category) {
      case 'hot':
        return 'bg-gradient-to-br from-error-50 to-error-100';
      case 'warm':
        return 'bg-gradient-to-br from-warning-50 to-warning-100';
      case 'cold':
        return 'bg-gradient-to-br from-blue-50 to-blue-100';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        <div className={`w-16 h-16 ${getCategoryBgColor()} rounded-xl flex items-center justify-center`}>
          {getCategoryIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-sm text-gray-600">/ 100</span>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {change > 0 ? (
                  <>
                    <IconArrowUp size={14} className="text-success-600" />
                    <span className="text-success-600 font-medium">+{change.toFixed(1)}</span>
                  </>
                ) : change < 0 ? (
                  <>
                    <IconArrowDown size={14} className="text-error-600" />
                    <span className="text-error-600 font-medium">{change.toFixed(1)}</span>
                  </>
                ) : (
                  <>
                    <IconMinus size={14} className="text-gray-400" />
                    <span className="text-gray-400 font-medium">0</span>
                  </>
                )}
              </div>
            )}
          </div>
          <Badge variant={getCategoryBadgeVariant()} size="sm" className="mt-1">
            {getCategoryLabel()}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card padding="lg" shadow="md" className="relative overflow-hidden">
      <div className="relative z-10 space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className={`inline-flex w-24 h-24 ${getCategoryBgColor()} rounded-2xl items-center justify-center mb-4`}>
            {getCategoryIcon()}
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-center gap-2">
              <span className={`text-6xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-2xl text-gray-500">/ 100</span>
            </div>
            <Badge variant={getCategoryBadgeVariant()} size="md">
              {getCategoryLabel()}
            </Badge>
          </div>
        </div>

        {/* Score Change */}
        {change !== undefined && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <IconTrendingUp size={16} className="text-gray-400" />
            <span className="text-gray-600">Change from previous:</span>
            {change > 0 ? (
              <div className="flex items-center gap-1">
                <IconArrowUp size={16} className="text-success-600" />
                <span className="text-success-600 font-semibold">
                  +{change.toFixed(1)} ({changePercent?.toFixed(1)}%)
                </span>
              </div>
            ) : change < 0 ? (
              <div className="flex items-center gap-1">
                <IconArrowDown size={16} className="text-error-600" />
                <span className="text-error-600 font-semibold">
                  {change.toFixed(1)} ({changePercent?.toFixed(1)}%)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <IconMinus size={16} className="text-gray-400" />
                <span className="text-gray-400 font-semibold">No change</span>
              </div>
            )}
          </div>
        )}

        {/* Recommendation */}
        {showRecommendation && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Recommended Action:</p>
            <p className="text-sm text-gray-900">{getRecommendedAction(score)}</p>
          </div>
        )}

        {/* Score Range Reference */}
        <div className="space-y-2">
          <p className="text-xs text-gray-600 font-medium">Score Categories:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-error-50 border border-error-200 rounded">
              <p className="font-semibold text-error-900">Hot</p>
              <p className="text-error-700">80-100</p>
            </div>
            <div className="text-center p-2 bg-warning-50 border border-warning-200 rounded">
              <p className="font-semibold text-warning-900">Warm</p>
              <p className="text-warning-700">60-79</p>
            </div>
            <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="font-semibold text-blue-900">Cold</p>
              <p className="text-blue-700">0-59</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
