/**
 * Projects Page
 * Main project list view with filters
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconFlask,
  IconBriefcase,
  IconSearch as IconFinders,
  IconBuilding,
  IconCheck,
  IconX,
  IconArrowsMove,
} from '@tabler/icons-react';
import { PlusIcon } from '../icons';
import { useAppSelector, useAppDispatch } from '../app/store';
import { bulkMoveToStage } from '../store/slices/projectsSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Input, Select } from '../components/ui';
import { ProjectCard } from '../components/common/ProjectCard';
import { ProjectFormModal, BulkStageMovementModal } from '../components/features';
import type { ProjectTag, Stage } from '../types/project.types';
import { StageLabels } from '../types/project.types';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Selection state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [japanFitFilter, setJapanFitFilter] = useState<string>('');
  const [scoreFilter, setScoreFilter] = useState<string>('');
  const [flagFilter, setFlagFilter] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Tag options
  const tagOptions = [
    { value: '', label: 'All Tags' },
    { value: 'Strategic Portfolio', label: 'Strategic Portfolio' },
    { value: 'Finders', label: 'Finders' },
    { value: 'Development Services', label: 'Development Services' },
  ];

  // Tag statistics
  const tagStats = useMemo(() => {
    const stats: Record<string, number> = {
      'Strategic Portfolio': 0,
      'Finders': 0,
      'Development Services': 0,
    };

    projects.forEach((project) => {
      project.tags.forEach((tag) => {
        if (stats[tag] !== undefined) {
          stats[tag]++;
        }
      });
    });

    return stats;
  }, [projects]);

  const tagConfigs = [
    {
      value: 'Strategic Portfolio',
      label: 'Strategic Portfolio',
      icon: IconBriefcase,
      color: 'brand',
      description: 'Core strategic initiatives',
    },
    {
      value: 'Finders',
      label: 'Finders',
      icon: IconFinders,
      color: 'purple',
      description: 'Discovery & scouting projects',
    },
    {
      value: 'Development Services',
      label: 'Development Services',
      icon: IconBuilding,
      color: 'cyan',
      description: 'Client development work',
    },
  ];

  // Stage options (all unique stages from projects)
  const stageOptions = useMemo(() => {
    const uniqueStages = [...new Set(projects.map(p => p.currentStage))];
    return [
      { value: '', label: 'All Stages' },
      ...uniqueStages.map(stage => ({
        value: stage,
        label: StageLabels[stage],
      })),
    ];
  }, [projects]);

  // Japan Fit options
  const japanFitOptions = [
    { value: '', label: 'All Japan Fit' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
    { value: 'NOT_ASSESSED', label: 'Not Assessed' },
  ];

  // Score range options
  const scoreOptions = [
    { value: '', label: 'All Scores' },
    { value: '80-100', label: '80-100 (Excellent)' },
    { value: '70-79', label: '70-79 (Good)' },
    { value: '60-69', label: '60-69 (Fair)' },
    { value: '0-59', label: '0-59 (Low)' },
  ];

  // Flag filter options
  const flagOptions = [
    { value: '', label: 'All Projects' },
    { value: 'hot', label: '🔥 Hot Projects' },
    { value: 'diamond', label: '💎 Diamond Projects' },
    { value: 'stalled', label: '⏸️ Stalled Projects' },
    { value: 'japan', label: '🇯🇵 Japan Interest' },
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        project.name.toLowerCase().includes(searchLower) ||
        project.company.name.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower);

      // Tag filter
      const matchesTag = !tagFilter || project.tags.includes(tagFilter as ProjectTag);

      // Stage filter
      const matchesStage = !stageFilter || project.currentStage === stageFilter;

      // Japan Fit filter
      const matchesJapanFit =
        !japanFitFilter ||
        (project.japanMarketFit || 'NOT_ASSESSED') === japanFitFilter;

      // Score filter
      let matchesScore = true;
      if (scoreFilter) {
        const [min, max] = scoreFilter.split('-').map(Number);
        matchesScore = project.score >= min && project.score <= max;
      }

      // Flag filter
      let matchesFlag = true;
      if (flagFilter === 'hot') matchesFlag = !!project.isHot;
      if (flagFilter === 'diamond') matchesFlag = !!project.isDiamond;
      if (flagFilter === 'stalled') matchesFlag = !!project.isStalled;
      if (flagFilter === 'japan') matchesFlag = !!project.japanInterest;

      return matchesSearch && matchesTag && matchesStage && matchesJapanFit && matchesScore && matchesFlag;
    });
  }, [projects, searchTerm, tagFilter, stageFilter, japanFitFilter, scoreFilter, flagFilter]);

  // Sort by score (highest first) and then by updated date
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      // Hot and Diamond projects first
      if (a.isDiamond && !b.isDiamond) return -1;
      if (!a.isDiamond && b.isDiamond) return 1;
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;

      // Then by score
      if (b.score !== a.score) return b.score - a.score;

      // Then by updated date
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [filteredProjects]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasFilters = searchTerm || tagFilter || stageFilter || japanFitFilter || scoreFilter || flagFilter;

  // Selection handlers
  const handleToggleSelection = (projectId: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProjectIds(paginatedProjects.map((p) => p.id));
  };

  const handleClearSelection = () => {
    setSelectedProjectIds([]);
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedProjectIds([]);
    }
  };

  // Determine if bulk movement is possible (all selected projects must have same tag)
  const selectedProjects = projects.filter((p) => selectedProjectIds.includes(p.id));
  const canBulkMove = selectedProjects.length > 0 && selectedProjects.every((p) => p.tags[0] === selectedProjects[0].tags[0]);
  const bulkProjectTag = canBulkMove ? selectedProjects[0].tags[0] : 'Strategic Portfolio';

  const handleBulkMove = (newStage: Stage, reason: string, notes?: string) => {
    dispatch(bulkMoveToStage({
      projectIds: selectedProjectIds,
      stage: newStage,
      reason,
      notes,
    }));
    setSelectedProjectIds([]);
    setSelectionMode(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage your innovation pipeline and strategic opportunities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={selectionMode ? 'outline' : 'ghost'}
              leftIcon={selectionMode ? <IconX size={18} /> : <IconCheck size={18} />}
              onClick={handleToggleSelectionMode}
            >
              {selectionMode ? 'Cancel Selection' : 'Select Projects'}
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="w-[18px] h-[18px]" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectionMode && selectedProjectIds.length > 0 && (
          <Card padding="md" shadow="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <IconCheck size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedProjectIds.length} project{selectedProjectIds.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-xs text-gray-600">
                      {canBulkMove
                        ? `Ready for bulk actions (${bulkProjectTag})`
                        : 'Selected projects have different tags - bulk move unavailable'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {paginatedProjects.length > selectedProjectIds.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All ({paginatedProjects.length})
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<IconArrowsMove size={18} />}
                  onClick={() => setIsBulkModalOpen(true)}
                  disabled={!canBulkMove}
                >
                  Move to Stage
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tag Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tagConfigs.map((config) => {
            const Icon = config.icon;
            const count = tagStats[config.value];
            const isActive = tagFilter === config.value;

            const colorClasses = {
              brand: {
                iconBg: 'bg-brand-100',
                iconText: 'text-brand-600',
                countText: 'text-brand-700',
              },
              purple: {
                iconBg: 'bg-purple-100',
                iconText: 'text-purple-600',
                countText: 'text-purple-700',
              },
              cyan: {
                iconBg: 'bg-cyan-100',
                iconText: 'text-cyan-600',
                countText: 'text-cyan-700',
              },
            };

            const colors = colorClasses[config.color as keyof typeof colorClasses];

            return (
              <button
                key={config.value}
                onClick={() => {
                  setTagFilter(isActive ? '' : config.value);
                  setCurrentPage(1);
                }}
                className={`
                  bg-white/80 backdrop-blur-xl rounded-lg p-5 text-left transition-all duration-200
                  border cursor-pointer
                  ${isActive
                    ? 'border-brand-400 shadow-md bg-white/95'
                    : 'border-white/40 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${colors.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    <Icon size={20} className={colors.iconText} />
                  </div>
                  <div className={`text-2xl font-bold ${colors.countText}`}>
                    {count}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  {config.label}
                </h3>
                <p className="text-xs text-gray-600">
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            {/* Search */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                placeholder="Search projects by name, company, or description..."
                leftIcon={<IconSearch size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
                placeholder="Filter by tag"
                options={tagOptions}
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by stage"
                options={stageOptions}
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Japan Market Fit"
                options={japanFitOptions}
                value={japanFitFilter}
                onChange={(e) => setJapanFitFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Score range"
                options={scoreOptions}
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Show"
                options={flagOptions}
                value={flagFilter}
                onChange={(e) => setFlagFilter(e.target.value)}
                fullWidth
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {paginatedProjects.length} of {sortedProjects.length} projects
              </span>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTagFilter('');
                    setStageFilter('');
                    setJapanFitFilter('');
                    setScoreFilter('');
                    setFlagFilter('');
                    setCurrentPage(1);
                  }}
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
        {paginatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={selectionMode ? undefined : () => navigate(`/projects/${project.id}`)}
                selectable={selectionMode}
                selected={selectedProjectIds.includes(project.id)}
                onSelect={handleToggleSelection}
              />
            ))}
          </div>
        ) : (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFlask size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {hasFilters
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first project'}
              </p>
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="w-[18px] h-[18px]" />}
                onClick={() => setIsModalOpen(true)}
              >
                New Project
              </Button>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                      ${
                        currentPage === pageNum
                          ? 'bg-brand-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Bulk Stage Movement Modal */}
      <BulkStageMovementModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedProjectIds.length}
        projectTag={bulkProjectTag}
        onConfirm={handleBulkMove}
      />
    </AppLayout>
  );
}
