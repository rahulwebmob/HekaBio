/**
 * Project Card Component
 * Card display for project in list/grid view
 */

import { IconBuilding, IconUsers, IconTrendingUp } from '@tabler/icons-react';
import { Badge } from '../ui';
import type { Project } from '../../types/project.types';
import { StageLabels } from '../../types/project.types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (projectId: string) => void;
}

export function ProjectCard({
  project,
  onClick,
  selectable = false,
  selected = false,
  onSelect
}: ProjectCardProps) {
  const getStageColor = (stage: string) => {
    if (stage.includes('LOBBY')) return 'default';
    if (stage.includes('SURVEY')) return 'info';
    if (stage.includes('JAPAN')) return 'primary';
    if (stage.includes('NDA')) return 'warning';
    if (stage.includes('DUE_DILIGENCE')) return 'primary';
    if (stage.includes('CONTRACT')) return 'success';
    if (stage.includes('DATA_ANALYSIS')) return 'info';
    if (stage.includes('OUTREACH') || stage.includes('INTRODUCTIONS')) return 'warning';
    if (stage.includes('REVENUE')) return 'success';
    return 'default';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 70) return 'text-brand-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-gray-600';
  };

  const getJapanFitBadge = () => {
    if (!project.japanMarketFit || project.japanMarketFit === 'NOT_ASSESSED') return null;

    const variants = {
      HIGH: 'success' as const,
      MEDIUM: 'warning' as const,
      LOW: 'default' as const,
    };

    return (
      <Badge variant={variants[project.japanMarketFit]} size="sm">
        Japan: {project.japanMarketFit}
      </Badge>
    );
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable) {
      e.stopPropagation();
      onSelect?.(project.id);
    } else if (onClick) {
      onClick();
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(project.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-white/80 backdrop-blur-xl border rounded-lg p-6 transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:bg-white/90 hover:scale-[1.02]
        ${selected ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-200' : 'border-white/40'}
        ${selectable ? 'relative' : ''}
      `}
    >
      {/* Selection Checkbox */}
      {selectable && (
        <div
          className="absolute top-4 left-4 z-10"
          onClick={handleCheckboxClick}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => {}}
            className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start justify-between mb-4 ${selectable ? 'ml-7' : ''}`}>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconBuilding size={16} className="flex-shrink-0" />
            <span className="truncate">{project.company.name}</span>
          </div>
        </div>

        {/* Score Badge */}
        <div className={`ml-4 flex-shrink-0 text-center ${getScoreColor(project.score)}`}>
          <div className="text-2xl font-bold">{project.score}</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Tags and Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Project Tag */}
        {project.tags.map((tag) => (
          <Badge key={tag} variant="primary" size="sm">
            {tag}
          </Badge>
        ))}

        {/* Stage Badge */}
        <Badge variant={getStageColor(project.currentStage)} size="sm">
          {StageLabels[project.currentStage]}
        </Badge>

        {/* Japan Fit */}
        {getJapanFitBadge()}

        {/* Hot/Diamond Flags */}
        {project.isHot && (
          <Badge variant="error" size="sm">
            🔥 Hot
          </Badge>
        )}
        {project.isDiamond && (
          <Badge variant="success" size="sm">
            💎 Diamond
          </Badge>
        )}
        {project.isStalled && (
          <Badge variant="default" size="sm">
            ⏸️ Stalled
          </Badge>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {/* NDA Status */}
          {project.ndaStatus !== 'NOT_REQUIRED' && (
            <div className="flex items-center gap-1">
              <span className="font-medium">NDA:</span>
              <span className={project.ndaStatus === 'COMPLETED' ? 'text-success-600' : 'text-warning-600'}>
                {project.ndaStatus}
              </span>
            </div>
          )}

          {/* DD Progress */}
          {typeof project.ddProgress === 'number' && (
            <div className="flex items-center gap-1">
              <IconTrendingUp size={14} />
              <span>DD: {project.ddProgress}%</span>
            </div>
          )}

          {/* Assigned Team */}
          {project.assignedTo && project.assignedTo.length > 0 && (
            <div className="flex items-center gap-1">
              <IconUsers size={14} />
              <span>{project.assignedTo.length}</span>
            </div>
          )}
        </div>

        {/* Updated Date */}
        <span>
          {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
