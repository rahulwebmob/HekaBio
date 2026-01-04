/**
 * Due Diligence Workspace Page
 * Manage DD workspaces for projects
 */

import { useState, useMemo } from 'react';
import {
  IconFolderOpen,
  IconPlus,
  IconSearch,
  IconFilter,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconEye,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import {
  DD_SECTION_TYPE_LABELS,
  getDDRatingVariant,
  getDDRiskLevelVariant,
} from '../types/dd.types';
import type { DDWorkspace } from '../types/dd.types';
import { DDFormDrawer } from '../components/features/dd';

export default function DDWorkspacePage() {
  const workspaces = useAppSelector((state) => state.dd.workspaces);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DDWorkspace['status']>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showDDForm, setShowDDForm] = useState(false);

  // Filter workspaces
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          workspace.title.toLowerCase().includes(query) ||
          workspace.projectName.toLowerCase().includes(query) ||
          workspace.companyName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && workspace.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [workspaces, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: workspaces.length,
      inProgress: workspaces.filter((w) => w.status === 'IN_PROGRESS').length,
      completed: workspaces.filter((w) => w.status === 'COMPLETED').length,
      avgCompletion:
        workspaces.length > 0
          ? Math.round(
              workspaces.reduce((sum, w) => sum + w.overallCompletionPercentage, 0) /
                workspaces.length
            )
          : 0,
    };
  }, [workspaces]);

  const getStatusVariant = (
    status: DDWorkspace['status']
  ): 'default' | 'info' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
      case 'REVIEW':
        return 'info';
      case 'ON_HOLD':
        return 'warning';
      case 'NOT_STARTED':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Due Diligence Workspaces</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage due diligence processes and assessments
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<IconPlus size={18} />}
            onClick={() => setShowDDForm(true)}
          >
            New DD Workspace
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workspaces</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconFolderOpen size={24} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconClock size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <IconCheck size={24} className="text-success-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-brand-600 mt-1">{stats.avgCompletion}%</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconAlertCircle size={24} className="text-brand-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            {/* Search bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <IconSearch
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search DD workspaces by title, project, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                leftIcon={<IconFilter size={18} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </div>

            {/* Filter controls */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as 'ALL' | DDWorkspace['status'])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Under Review</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Workspace List */}
        {filteredWorkspaces.length === 0 ? (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFolderOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No workspaces found'
                  : 'No DD workspaces yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first DD workspace to get started'}
              </p>
              {!searchQuery && statusFilter === 'ALL' && (
                <Button
                  variant="primary"
                  leftIcon={<IconPlus size={18} />}
                  onClick={() => setShowDDForm(true)}
                >
                  New DD Workspace
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredWorkspaces.map((workspace) => (
              <Card
                key={workspace.id}
                padding="lg"
                shadow="sm"
                hover
                className="cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Main content */}
                  <div className="flex-1 space-y-3">
                    {/* Title and badges */}
                    <div className="flex items-start gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">{workspace.title}</h3>
                      <Badge variant={getStatusVariant(workspace.status)} size="md">
                        {workspace.status.replace('_', ' ')}
                      </Badge>
                      {workspace.overallRating && (
                        <Badge variant={getDDRatingVariant(workspace.overallRating)} size="md">
                          {workspace.overallRating}
                        </Badge>
                      )}
                      {workspace.overallRiskLevel && (
                        <Badge
                          variant={getDDRiskLevelVariant(workspace.overallRiskLevel)}
                          size="md"
                        >
                          {workspace.overallRiskLevel} Risk
                        </Badge>
                      )}
                    </div>

                    {/* Project and company */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Project:</span>
                        <span>{workspace.projectName}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Company:</span>
                        <span>{workspace.companyName}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium">Overall Progress</span>
                        <span className="text-gray-600">
                          {workspace.completedItems} of {workspace.totalItems} items (
                          {workspace.overallCompletionPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            workspace.overallCompletionPercentage === 100
                              ? 'bg-success-500'
                              : workspace.overallCompletionPercentage >= 75
                                ? 'bg-blue-500'
                                : workspace.overallCompletionPercentage >= 50
                                  ? 'bg-warning-500'
                                  : 'bg-gray-400'
                          }`}
                          style={{ width: `${workspace.overallCompletionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Sections summary */}
                    {workspace.sections.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-600">Sections:</span>
                        {workspace.sections.slice(0, 5).map((section) => (
                          <Badge key={section.id} variant="default" size="sm">
                            {DD_SECTION_TYPE_LABELS[section.type]} ({section.completionPercentage}%)
                          </Badge>
                        ))}
                        {workspace.sections.length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{workspace.sections.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      {workspace.startDate && (
                        <div className="flex items-center gap-2">
                          <IconClock size={14} />
                          <span>Started: {formatDate(workspace.startDate)}</span>
                        </div>
                      )}
                      {workspace.targetCompletionDate && (
                        <div className="flex items-center gap-2">
                          <IconAlertCircle size={14} />
                          <span>Target: {formatDate(workspace.targetCompletionDate)}</span>
                        </div>
                      )}
                      {workspace.actualCompletionDate && (
                        <div className="flex items-center gap-2">
                          <IconCheck size={14} />
                          <span>Completed: {formatDate(workspace.actualCompletionDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" leftIcon={<IconEye size={16} />}>
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* DD Form Drawer */}
        <DDFormDrawer isOpen={showDDForm} onClose={() => setShowDDForm(false)} />
      </div>
    </AppLayout>
  );
}
