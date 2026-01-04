/**
 * Gate History Timeline
 * Visual timeline showing gate progression and decisions
 */

import { useMemo } from 'react';
import {
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
  IconChevronRight,
} from '@tabler/icons-react';
import { Badge } from '../../ui';
import type { GateReview, GateDecision } from '../../../types/gate.types';
import { GATE_CONFIGS } from '../../../types/gate.types';

interface GateHistoryTimelineProps {
  reviews: GateReview[];
  projectId: string;
}

export default function GateHistoryTimeline({
  reviews,
  projectId,
}: GateHistoryTimelineProps) {
  // Filter and sort reviews for this project
  const projectReviews = useMemo(() => {
    return reviews
      .filter((r) => r.projectId === projectId)
      .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
  }, [reviews, projectId]);

  const getDecisionIcon = (decision: GateDecision) => {
    switch (decision) {
      case 'APPROVED':
        return <IconCheck size={20} className="text-success-600" />;
      case 'REJECTED':
        return <IconX size={20} className="text-error-600" />;
      case 'CONDITIONAL':
        return <IconAlertCircle size={20} className="text-warning-600" />;
      case 'DEFERRED':
        return <IconClock size={20} className="text-info-600" />;
      default:
        return <IconClock size={20} className="text-gray-400" />;
    }
  };

  const getDecisionBadge = (decision: GateDecision) => {
    const variants: Record<GateDecision, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      PENDING: { variant: 'default', label: 'Pending' },
      APPROVED: { variant: 'success', label: 'Approved' },
      REJECTED: { variant: 'error', label: 'Rejected' },
      CONDITIONAL: { variant: 'warning', label: 'Conditional' },
      DEFERRED: { variant: 'info', label: 'Deferred' },
    };
    const config = variants[decision];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50',
      purple: 'border-purple-500 bg-purple-50',
      green: 'border-success-500 bg-success-50',
    };
    return colors[color] || colors.blue;
  };

  if (projectReviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <IconClock size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 text-sm">No gate reviews yet</p>
        <p className="text-gray-500 text-xs mt-1">Gate reviews will appear here as they are completed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projectReviews.map((review, index) => {
        const gateConfig = GATE_CONFIGS[review.gateNumber];
        const isLatest = index === 0;

        return (
          <div
            key={review.id}
            className={`relative pl-8 pb-6 ${
              index !== projectReviews.length - 1 ? 'border-l-2 border-gray-300' : ''
            }`}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-0 -ml-[9px] w-4 h-4 rounded-full border-2 ${
                review.decision === 'APPROVED'
                  ? 'bg-success-500 border-success-600'
                  : review.decision === 'REJECTED'
                  ? 'bg-error-500 border-error-600'
                  : review.decision === 'CONDITIONAL'
                  ? 'bg-warning-500 border-warning-600'
                  : review.decision === 'DEFERRED'
                  ? 'bg-info-500 border-info-600'
                  : 'bg-gray-300 border-gray-400'
              }`}
            />

            {/* Review card */}
            <div
              className={`border-2 rounded-lg p-4 ${
                isLatest ? getColorClass(gateConfig.color) : 'border-gray-200 bg-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getDecisionIcon(review.decision)}
                    <h4 className="font-semibold text-gray-900">{gateConfig.name}</h4>
                  </div>
                  {isLatest && (
                    <Badge variant="info" size="sm">Latest</Badge>
                  )}
                </div>
                {getDecisionBadge(review.decision)}
              </div>

              {/* Reviewer and date */}
              <div className="text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.reviewerName}</span>
                  <span>•</span>
                  <span className="text-gray-500">{review.reviewerRole}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(review.reviewDate)}
                </div>
              </div>

              {/* Checklist progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Checklist Progress</span>
                  <span className="text-gray-600">{review.checklistCompletionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      review.checklistCompletionRate === 100
                        ? 'bg-success-500'
                        : review.checklistCompletionRate >= 75
                        ? 'bg-blue-500'
                        : review.checklistCompletionRate >= 50
                        ? 'bg-warning-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${review.checklistCompletionRate}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {review.checklist.filter((i) => i.completed).length} of {review.checklist.length} items completed
                </div>
              </div>

              {/* Scores */}
              {review.overallScore !== undefined && (
                <div className="mb-3 p-3 bg-white/50 rounded border border-gray-200">
                  <div className="grid grid-cols-5 gap-3 text-center">
                    {[
                      { label: 'Technical', value: review.technicalScore },
                      { label: 'Market', value: review.marketScore },
                      { label: 'Team', value: review.teamScore },
                      { label: 'Fit', value: review.fitScore },
                      { label: 'Overall', value: review.overallScore },
                    ].map((score, idx) => (
                      <div key={idx}>
                        <div className={`text-lg font-bold ${idx === 4 ? 'text-brand-600' : 'text-gray-900'}`}>
                          {score.value?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">{score.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              {review.comments && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-1">Comments</h5>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{review.comments}</p>
                </div>
              )}

              {/* Strengths */}
              {review.strengths && review.strengths.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <IconCheck size={14} className="text-success-600" />
                    Strengths
                  </h5>
                  <ul className="space-y-1">
                    {review.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-success-600 mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concerns */}
              {review.concerns && review.concerns.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <IconAlertCircle size={14} className="text-warning-600" />
                    Concerns
                  </h5>
                  <ul className="space-y-1">
                    {review.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-warning-600 mt-0.5">•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {review.recommendations && review.recommendations.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <IconChevronRight size={14} className="text-blue-600" />
                    Recommendations
                  </h5>
                  <ul className="space-y-1">
                    {review.recommendations.map((recommendation, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conditions (if conditional approval) */}
              {review.conditions && review.conditions.length > 0 && (
                <div className="mb-3 p-3 bg-warning-50 border border-warning-200 rounded">
                  <h5 className="text-sm font-semibold text-warning-900 mb-2">
                    Conditions for Approval
                  </h5>
                  <ul className="space-y-1">
                    {review.conditions.map((condition, idx) => (
                      <li key={idx} className="text-sm text-warning-800 flex items-start gap-2">
                        <span className="font-bold mt-0.5">{idx + 1}.</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up */}
              {review.followUpRequired && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <h5 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-1">
                    <IconClock size={14} />
                    Follow-up Required
                  </h5>
                  {review.nextReviewDate && (
                    <p className="text-sm text-blue-800 mb-2">
                      Next Review: {formatDate(review.nextReviewDate)}
                    </p>
                  )}
                  {review.followUpTasks && review.followUpTasks.length > 0 && (
                    <div>
                      <p className="text-xs text-blue-700 mb-1">Tasks:</p>
                      <ul className="space-y-1">
                        {review.followUpTasks.map((task, idx) => (
                          <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
