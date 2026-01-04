/**
 * Stage History Component
 * Display the history of stage changes for a project
 */

import { IconClock, IconArrowRight, IconUser } from '@tabler/icons-react';
import type { StageChange } from '../../types/project.types';
import { StageLabels } from '../../types/project.types';
import { Badge } from '../ui';

interface StageHistoryProps {
  stageHistory: StageChange[];
  compact?: boolean;
}

export function StageHistory({ stageHistory, compact = false }: StageHistoryProps) {
  if (!stageHistory || stageHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <IconClock size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">No stage changes yet</p>
      </div>
    );
  }

  // Sort by most recent first
  const sortedHistory = [...stageHistory].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return then.toLocaleDateString();
  };

  if (compact) {
    // Compact version - just list
    return (
      <div className="space-y-2">
        {sortedHistory.slice(0, 5).map((change) => (
          <div
            key={change.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs"
          >
            <div className="flex items-center gap-2">
              {change.fromStage && (
                <>
                  <span className="text-gray-600">{StageLabels[change.fromStage]}</span>
                  <IconArrowRight size={14} className="text-gray-400" />
                </>
              )}
              <span className="font-semibold text-gray-900">{StageLabels[change.toStage]}</span>
            </div>
            <span className="text-gray-500">{getRelativeTime(change.changedAt)}</span>
          </div>
        ))}
      </div>
    );
  }

  // Full version - detailed timeline
  return (
    <div className="space-y-6">
      {sortedHistory.map((change, index) => (
        <div key={change.id} className="flex gap-4">
          {/* Timeline Track */}
          <div className="flex flex-col items-center">
            {/* Dot */}
            <div
              className={`
                w-3 h-3 rounded-full flex-shrink-0
                ${index === 0 ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-gray-300'}
              `}
            />
            {/* Line */}
            {index < sortedHistory.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[40px]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                {/* Stage Change */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {change.fromStage ? (
                    <>
                      <Badge variant="default" size="sm">
                        {StageLabels[change.fromStage]}
                      </Badge>
                      <IconArrowRight size={16} className="text-gray-400" />
                      <Badge variant="success" size="sm">
                        {StageLabels[change.toStage]}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">Created at</span>
                      <Badge variant="success" size="sm">
                        {StageLabels[change.toStage]}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Changed By */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <IconUser size={14} />
                  <span>{change.changedByName}</span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <IconClock size={14} />
                  <span>{getRelativeTime(change.changedAt)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{new Date(change.changedAt).toLocaleString()}</span>
                </div>

                {/* Reason */}
                {change.reason && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong className="text-gray-900">Reason:</strong> {change.reason}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {change.notes && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>Notes:</strong> {change.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
