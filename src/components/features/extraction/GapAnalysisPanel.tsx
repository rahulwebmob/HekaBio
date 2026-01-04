/**
 * Gap Analysis Panel
 * Shows missing fields and data completeness
 */

import { IconAlertCircle, IconCheck, IconX, IconMail } from '@tabler/icons-react';
import { Badge, Button, Card } from '../../ui';
import type { GapAnalysisResult, GapCategory } from '../../../types/extraction.types';
import { getGapImportanceColor, getGapImportanceBadge } from '../../../types/extraction.types';

interface GapAnalysisPanelProps {
  gapAnalysis: GapAnalysisResult | null;
  onGenerateFollowUp?: () => void;
}

export default function GapAnalysisPanel({
  gapAnalysis,
  onGenerateFollowUp,
}: GapAnalysisPanelProps) {
  if (!gapAnalysis) {
    return (
      <Card padding="lg" shadow="sm">
        <div className="text-center py-8">
          <IconAlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No gap analysis available</p>
          <p className="text-sm text-gray-500 mt-2">
            Upload and verify data extraction to see gap analysis
          </p>
        </div>
      </Card>
    );
  }

  const categoryGaps: Record<GapCategory, typeof gapAnalysis.gaps> = {
    BASIC_INFO: [],
    CLINICAL: [],
    REGULATORY: [],
    IP: [],
    COMMERCIAL: [],
    FINANCIAL: [],
  };

  gapAnalysis.gaps.forEach((gap) => {
    categoryGaps[gap.category].push(gap);
  });

  const getCategoryLabel = (category: GapCategory): string => {
    const labels: Record<GapCategory, string> = {
      BASIC_INFO: 'Basic Information',
      CLINICAL: 'Clinical Data',
      REGULATORY: 'Regulatory Status',
      IP: 'Intellectual Property',
      COMMERCIAL: 'Commercial',
      FINANCIAL: 'Financial',
    };
    return labels[category];
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card padding="lg" shadow="sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Completeness</h3>
            <p className="text-sm text-gray-600">
              {gapAnalysis.completedFields} of {gapAnalysis.totalFields} fields completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-600 mb-1">
              {gapAnalysis.completionPercentage}%
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  gapAnalysis.completionPercentage >= 80
                    ? 'bg-success-500'
                    : gapAnalysis.completionPercentage >= 60
                      ? 'bg-warning-500'
                      : 'bg-error-500'
                }`}
                style={{ width: `${gapAnalysis.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gap Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-error-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-error-700 font-medium">Critical</span>
              <IconX size={16} className="text-error-600" />
            </div>
            <div className="text-2xl font-bold text-error-900">{gapAnalysis.criticalGaps}</div>
            <div className="text-xs text-error-600">Missing fields</div>
          </div>

          <div className="bg-warning-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-warning-700 font-medium">Important</span>
              <IconAlertCircle size={16} className="text-warning-600" />
            </div>
            <div className="text-2xl font-bold text-warning-900">{gapAnalysis.importantGaps}</div>
            <div className="text-xs text-warning-600">Missing fields</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 font-medium">Optional</span>
              <IconAlertCircle size={16} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{gapAnalysis.optionalGaps}</div>
            <div className="text-xs text-gray-600">Missing fields</div>
          </div>
        </div>

        {/* Follow-up Action */}
        {gapAnalysis.missingFields > 0 && onGenerateFollowUp && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              leftIcon={<IconMail size={18} />}
              onClick={onGenerateFollowUp}
              fullWidth
            >
              Generate Follow-Up Email for Missing Data
            </Button>
          </div>
        )}
      </Card>

      {/* Missing Fields by Category */}
      {gapAnalysis.missingFields > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Missing Fields by Category</h4>
          {(Object.keys(categoryGaps) as GapCategory[]).map((category) => {
            const missingInCategory = categoryGaps[category].filter((g) => g.isMissing);
            if (missingInCategory.length === 0) return null;

            return (
              <Card key={category} padding="md" shadow="sm">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-semibold text-gray-900">
                    {getCategoryLabel(category)}
                  </h5>
                  <Badge variant="default" size="sm">
                    {missingInCategory.length} missing
                  </Badge>
                </div>
                <div className="space-y-2">
                  {missingInCategory.map((gap) => (
                    <div
                      key={gap.fieldName}
                      className="flex items-start justify-between gap-4 p-2 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{gap.label}</span>
                          <Badge variant={getGapImportanceBadge(gap.importance)} size="sm">
                            {gap.importance}
                          </Badge>
                        </div>
                        {gap.expectedFormat && (
                          <p className="text-xs text-gray-500">
                            Expected format: {gap.expectedFormat}
                          </p>
                        )}
                      </div>
                      <IconX size={16} className={getGapImportanceColor(gap.importance)} />
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed Fields */}
      {gapAnalysis.completedFields > 0 && (
        <Card padding="md" shadow="sm">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-gray-900">Completed Fields</h5>
            <Badge variant="success" size="sm">
              {gapAnalysis.completedFields} completed
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {gapAnalysis.gaps
              .filter((g) => !g.isMissing)
              .map((gap) => (
                <div
                  key={gap.fieldName}
                  className="flex items-center gap-2 p-2 bg-success-50 rounded"
                >
                  <IconCheck size={14} className="text-success-600 flex-shrink-0" />
                  <span className="text-xs text-gray-900 truncate">{gap.label}</span>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
