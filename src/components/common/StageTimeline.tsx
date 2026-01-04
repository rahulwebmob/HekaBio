/**
 * Stage Timeline Component
 * Visual timeline/stepper showing project workflow stages
 */

import { IconCheck, IconClock, IconCircle } from '@tabler/icons-react';
import type { Stage, ProjectTag } from '../../types/project.types';
import { StageLabels, StageWorkflows } from '../../types/project.types';

interface StageTimelineProps {
  currentStage: Stage;
  projectTag: ProjectTag;
  onStageClick?: (stage: Stage) => void;
  compact?: boolean;
}

export function StageTimeline({
  currentStage,
  projectTag,
  onStageClick,
  compact = false,
}: StageTimelineProps) {
  const workflow = StageWorkflows[projectTag];
  const currentIndex = workflow.indexOf(currentStage);

  const getStageStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStageIcon = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return <IconCheck size={20} className="text-white" />;
      case 'current':
        return <IconClock size={20} className="text-white" />;
      case 'upcoming':
        return <IconCircle size={20} className="text-gray-400" />;
    }
  };

  const getStageStyles = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'bg-success-500 border-success-600';
      case 'current':
        return 'bg-brand-500 border-brand-600 ring-4 ring-brand-200';
      case 'upcoming':
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getTextStyles = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'text-success-700 font-medium';
      case 'current':
        return 'text-brand-700 font-bold';
      case 'upcoming':
        return 'text-gray-500 font-normal';
    }
  };

  const getLineStyles = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'bg-success-500';
      case 'current':
        return 'bg-gradient-to-r from-success-500 to-brand-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (compact) {
    // Compact horizontal timeline for smaller spaces
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {workflow.map((stage, index) => {
          const status = getStageStatus(index);
          return (
            <div key={stage} className="flex items-center flex-shrink-0">
              <button
                onClick={() => onStageClick?.(stage)}
                disabled={!onStageClick}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all
                  ${status === 'current' ? 'bg-brand-100 text-brand-700' : ''}
                  ${status === 'completed' ? 'bg-success-50 text-success-700' : ''}
                  ${status === 'upcoming' ? 'bg-gray-50 text-gray-500' : ''}
                  ${onStageClick ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}
                `}
                title={StageLabels[stage]}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${getStageStyles(status)}`}
                >
                  {status === 'completed' && <IconCheck size={12} className="text-white" />}
                </div>
                <span className="whitespace-nowrap">{StageLabels[stage]}</span>
              </button>
              {index < workflow.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${getLineStyles(status)}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Full timeline with vertical or horizontal layout
  return (
    <div className="space-y-0">
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between">
          {workflow.map((stage, index) => {
            const status = getStageStatus(index);
            const isClickable = onStageClick !== undefined;

            return (
              <div key={stage} className="flex flex-col items-center flex-1 relative">
                {/* Connector Line */}
                {index < workflow.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-1">
                    <div className={`h-full ${getLineStyles(status)}`} />
                  </div>
                )}

                {/* Stage Circle */}
                <button
                  onClick={() => isClickable && onStageClick(stage)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300
                    ${getStageStyles(status)}
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                  title={isClickable ? `Move to ${StageLabels[stage]}` : StageLabels[stage]}
                >
                  {getStageIcon(status)}
                </button>

                {/* Stage Label */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p className={`text-sm ${getTextStyles(status)}`}>{StageLabels[stage]}</p>
                  {status === 'current' && <p className="text-xs text-brand-600 mt-1">Current</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="block lg:hidden space-y-4">
        {workflow.map((stage, index) => {
          const status = getStageStatus(index);
          const isClickable = onStageClick !== undefined;

          return (
            <div key={stage} className="flex items-start gap-4">
              {/* Timeline Track */}
              <div className="flex flex-col items-center">
                {/* Stage Circle */}
                <button
                  onClick={() => isClickable && onStageClick(stage)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                    ${getStageStyles(status)}
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                  title={isClickable ? `Move to ${StageLabels[stage]}` : StageLabels[stage]}
                >
                  {getStageIcon(status)}
                </button>

                {/* Connector Line */}
                {index < workflow.length - 1 && (
                  <div className={`w-1 flex-1 min-h-[40px] ${getLineStyles(status)}`} />
                )}
              </div>

              {/* Stage Content */}
              <div className="flex-1 pb-6">
                <p className={`text-base ${getTextStyles(status)}`}>{StageLabels[stage]}</p>
                {status === 'current' && (
                  <p className="text-sm text-brand-600 mt-1">Current Stage</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
