/**
 * Gap Analysis Report
 * Analyzes survey responses and identifies missing/incomplete data
 */

import {
  IconAlertTriangle,
  IconCheck,
  IconCircleDashed,
  IconExclamationCircle,
  IconChevronDown,
  IconChevronUp,
  IconMail,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Card, Badge, Button } from '../ui';
import { FollowUpEmailModal } from './FollowUpEmailModal';
import type { SurveyInstance } from '../../types/survey.types';

export interface DataGap {
  questionId: string;
  questionText: string;
  section: string;
  priority: 'critical' | 'important' | 'optional';
  isRequired: boolean;
  reason?: string;
}

interface GapAnalysisReportProps {
  surveyInstance: SurveyInstance;
  compact?: boolean;
}

export function GapAnalysisReport({ surveyInstance, compact = false }: GapAnalysisReportProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Calculate gaps
  const gaps: DataGap[] = [];
  const template = surveyInstance.template;

  template.sections.forEach((section) => {
    section.questions.forEach((question) => {
      const response = surveyInstance.responses?.find((r) => r.questionId === question.id);

      // Check if question is missing or incomplete
      const isMissing = !response || response.skipped;
      const isEmpty =
        response &&
        !response.textAnswer &&
        response.numberAnswer === undefined &&
        !response.dateAnswer &&
        (!response.choiceAnswers || response.choiceAnswers.length === 0) &&
        (!response.fileUrls || response.fileUrls.length === 0);

      if (isMissing || isEmpty) {
        // Determine priority based on question type and requirements
        let priority: 'critical' | 'important' | 'optional' = 'optional';
        if (question.isRequired) {
          priority = 'critical';
        } else if (
          question.type === 'FILE_UPLOAD' ||
          question.questionText.toLowerCase().includes('email') ||
          question.questionText.toLowerCase().includes('contact')
        ) {
          priority = 'important';
        }

        gaps.push({
          questionId: question.id,
          questionText: question.questionText,
          section: section.title,
          priority,
          isRequired: question.isRequired || false,
          reason: isMissing ? 'Not answered' : 'Empty response',
        });
      }
    });
  });

  // Calculate statistics
  const totalQuestions = template.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );
  const answeredQuestions = totalQuestions - gaps.length;
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const criticalGaps = gaps.filter((g) => g.priority === 'critical');
  const importantGaps = gaps.filter((g) => g.priority === 'important');
  const optionalGaps = gaps.filter((g) => g.priority === 'optional');

  const getCompletenessColor = (percentage: number) => {
    if (percentage === 100) return 'text-success-600';
    if (percentage >= 80) return 'text-brand-600';
    if (percentage >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getCompletenessLabel = (percentage: number) => {
    if (percentage === 100) return 'Complete';
    if (percentage >= 80) return 'Mostly Complete';
    if (percentage >= 60) return 'Partially Complete';
    return 'Incomplete';
  };

  if (gaps.length === 0) {
    return (
      <Card padding="lg" shadow="sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
            <IconCheck size={24} className="text-success-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-success-900">No Data Gaps Found</h3>
            <p className="text-sm text-success-700">
              All required and optional fields have been completed.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        padding="lg"
        shadow="sm"
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <IconCircleDashed size={20} className="text-warning-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gap Analysis Report</h2>
                <p className="text-sm text-gray-600">
                  {gaps.length} field{gaps.length !== 1 ? 's' : ''} missing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<IconMail size={16} />}
                onClick={() => setShowFollowUpModal(true)}
              >
                Generate Follow-Up Email
              </Button>
              {compact && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {isExpanded ? (
                    <IconChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <IconChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Completion Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className={`text-2xl font-bold ${getCompletenessColor(completionPercentage)}`}>
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  completionPercentage === 100
                    ? 'bg-success-500'
                    : completionPercentage >= 80
                      ? 'bg-brand-500'
                      : completionPercentage >= 60
                        ? 'bg-warning-500'
                        : 'bg-error-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {answeredQuestions} of {totalQuestions} questions answered
              </span>
              <Badge
                variant={
                  completionPercentage === 100
                    ? 'success'
                    : completionPercentage >= 80
                      ? 'info'
                      : completionPercentage >= 60
                        ? 'warning'
                        : 'error'
                }
                size="sm"
              >
                {getCompletenessLabel(completionPercentage)}
              </Badge>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Gap Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {criticalGaps.length > 0 && (
                  <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <IconExclamationCircle size={18} className="text-error-600" />
                      <span className="text-sm font-semibold text-error-900">Critical</span>
                    </div>
                    <p className="text-2xl font-bold text-error-600">{criticalGaps.length}</p>
                    <p className="text-xs text-error-700">Required fields missing</p>
                  </div>
                )}

                {importantGaps.length > 0 && (
                  <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <IconAlertTriangle size={18} className="text-warning-600" />
                      <span className="text-sm font-semibold text-warning-900">Important</span>
                    </div>
                    <p className="text-2xl font-bold text-warning-600">{importantGaps.length}</p>
                    <p className="text-xs text-warning-700">Recommended fields missing</p>
                  </div>
                )}

                {optionalGaps.length > 0 && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <IconCircleDashed size={18} className="text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Optional</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-600">{optionalGaps.length}</p>
                    <p className="text-xs text-gray-700">Optional fields missing</p>
                  </div>
                )}
              </div>

              {/* Gap Details */}
              <div className="space-y-4">
                {criticalGaps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-error-900 mb-3 flex items-center gap-2">
                      <IconExclamationCircle size={16} />
                      Critical Gaps ({criticalGaps.length})
                    </h3>
                    <div className="space-y-2">
                      {criticalGaps.map((gap) => (
                        <div
                          key={gap.questionId}
                          className="p-3 bg-error-50 border border-error-200 rounded-lg"
                        >
                          <p className="text-sm font-medium text-error-900">{gap.questionText}</p>
                          <p className="text-xs text-error-700 mt-1">
                            Section: {gap.section} • {gap.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importantGaps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-warning-900 mb-3 flex items-center gap-2">
                      <IconAlertTriangle size={16} />
                      Important Gaps ({importantGaps.length})
                    </h3>
                    <div className="space-y-2">
                      {importantGaps.map((gap) => (
                        <div
                          key={gap.questionId}
                          className="p-3 bg-warning-50 border border-warning-200 rounded-lg"
                        >
                          <p className="text-sm font-medium text-warning-900">{gap.questionText}</p>
                          <p className="text-xs text-warning-700 mt-1">
                            Section: {gap.section} • {gap.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optionalGaps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <IconCircleDashed size={16} />
                      Optional Gaps ({optionalGaps.length})
                    </h3>
                    <div className="space-y-2">
                      {optionalGaps.slice(0, 5).map((gap) => (
                        <div
                          key={gap.questionId}
                          className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <p className="text-sm font-medium text-gray-900">{gap.questionText}</p>
                          <p className="text-xs text-gray-700 mt-1">
                            Section: {gap.section} • {gap.reason}
                          </p>
                        </div>
                      ))}
                      {optionalGaps.length > 5 && (
                        <p className="text-xs text-gray-600 text-center py-2">
                          + {optionalGaps.length - 5} more optional fields
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      <FollowUpEmailModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        surveyInstance={surveyInstance}
        gaps={gaps}
      />
    </>
  );
}
