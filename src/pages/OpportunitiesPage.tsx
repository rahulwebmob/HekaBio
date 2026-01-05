/**
 * Opportunities Page
 * Lead qualification and assessment workflow
 */

import { useState, useMemo } from 'react';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconCheck,
  IconAlertCircle,
  IconClock,
  IconChevronRight,
  IconUser,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { setSelectedOpportunity, submitQuickAssessment, makeGoNoGoDecision, convertToProject } from '../store/slices/opportunitiesSlice';
import { addProject } from '../store/slices/projectsSlice';
import type { Project } from '../types/project.types';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge, Input, Select } from '../components/ui';
import {
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_PRIORITY_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  getOpportunityStatusVariant,
  getOpportunityPriorityVariant,
  getStrategicFitVariant,
  needsAttention,
  getRecommendedAction,
} from '../types/opportunity.types';
import type { OpportunityStatus, OpportunityPriority, OpportunitySource, Opportunity } from '../types/opportunity.types';
import QuickAssessmentForm, { type QuickAssessmentFormData } from '../components/features/opportunities/QuickAssessmentForm';
import GoNoGoDecisionModal, { type GoNoGoDecisionFormData } from '../components/features/opportunities/GoNoGoDecisionModal';

export default function OpportunitiesPage() {
  const dispatch = useAppDispatch();
  const opportunities = useAppSelector((state) => state.opportunities.opportunities);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<OpportunityPriority | ''>('');
  const [sourceFilter, setSourceFilter] = useState<OpportunitySource | ''>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Assessment form
  const [assessingOpportunity, setAssessingOpportunity] = useState<Opportunity | null>(null);

  // Decision modal
  const [decidingOpportunity, setDecidingOpportunity] = useState<Opportunity | null>(null);

  // Stats
  const stats = useMemo(() => {
    return {
      total: opportunities.length,
      new: opportunities.filter((o) => o.status === 'NEW').length,
      reviewing: opportunities.filter(
        (o) => o.status === 'REVIEWING' || o.status === 'ASSESSING'
      ).length,
      awaitingDecision: opportunities.filter((o) => o.status === 'AWAITING_DECISION').length,
      approved: opportunities.filter((o) => o.status === 'APPROVED').length,
      needsAttention: opportunities.filter((o) => needsAttention(o)).length,
    };
  }, [opportunities]);

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        opp.name.toLowerCase().includes(searchLower) ||
        opp.company.name.toLowerCase().includes(searchLower) ||
        opp.description?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = !statusFilter || opp.status === statusFilter;

      // Priority filter
      const matchesPriority = !priorityFilter || opp.priority === priorityFilter;

      // Source filter
      const matchesSource = !sourceFilter || opp.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    });
  }, [opportunities, searchTerm, statusFilter, priorityFilter, sourceFilter]);

  // Sort: Urgent first, then by created date
  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
      // Urgent priority first
      if (a.priority === 'URGENT' && b.priority !== 'URGENT') return -1;
      if (a.priority !== 'URGENT' && b.priority === 'URGENT') return 1;

      // Then by needs attention
      const aNeeds = needsAttention(a);
      const bNeeds = needsAttention(b);
      if (aNeeds && !bNeeds) return -1;
      if (!aNeeds && bNeeds) return 1;

      // Then by created date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredOpportunities]);

  // Pagination
  const totalPages = Math.ceil(sortedOpportunities.length / itemsPerPage);
  const paginatedOpportunities = sortedOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasFilters = searchTerm || statusFilter || priorityFilter || sourceFilter;

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setSourceFilter('');
    setCurrentPage(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleOpportunityClick = (oppId: string) => {
    dispatch(setSelectedOpportunity(oppId));
    // TODO: Open opportunity detail drawer or navigate to detail page
  };

  const handleStartAssessment = (opp: Opportunity) => {
    setAssessingOpportunity(opp);
  };

  const handleSubmitAssessment = (assessmentData: QuickAssessmentFormData) => {
    if (!assessingOpportunity) return;

    dispatch(
      submitQuickAssessment({
        opportunityId: assessingOpportunity.id,
        assessment: assessmentData,
      })
    );

    setAssessingOpportunity(null);
  };

  const handleCancelAssessment = () => {
    setAssessingOpportunity(null);
  };

  const handleStartDecision = (opp: Opportunity) => {
    setDecidingOpportunity(opp);
  };

  const handleSubmitDecision = (decisionData: GoNoGoDecisionFormData) => {
    if (!decidingOpportunity) return;

    // Submit the decision
    dispatch(
      makeGoNoGoDecision({
        opportunityId: decidingOpportunity.id,
        decision: decisionData,
      })
    );

    // If GO decision, automatically convert to project
    if (decisionData.decision === 'GO') {
      const now = new Date().toISOString();
      const projectId = `project-${Date.now()}`;

      // Determine project tag from decision or opportunity tags
      const projectTag = decisionData.suggestedProjectTag || decidingOpportunity.tags[0] || 'Strategic Portfolio';

      // Create new project from opportunity
      const newProject: Project = {
        id: projectId,
        name: decidingOpportunity.name,
        company: decidingOpportunity.company,
        tags: [projectTag],
        description: decidingOpportunity.description,
        currentStage: 'LOBBY', // All new projects start in LOBBY
        stageHistory: [
          {
            id: `stage-${Date.now()}`,
            projectId: projectId,
            fromStage: null, // No previous stage for new projects
            toStage: 'LOBBY',
            changedBy: 'current-user-id', // TODO: Get from auth context
            changedByName: 'Current User', // TODO: Get from auth context
            changedAt: now,
            notes: `Converted from opportunity. ${decisionData.decisionRationale}`,
          },
        ],
        score: 0, // Initial score
        japanInterest: decidingOpportunity.quickAssessment?.japanMarketPotential === 'HIGH' || false,
        japanMarketFit: decidingOpportunity.quickAssessment?.japanMarketPotential as Project['japanMarketFit'],
        partnerTags: [], // Empty initially
        ndaStatus: 'NOT_REQUIRED',
        ddProgress: 0, // 0-100 percentage
        contractStatus: 'PENDING',
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user-id', // TODO: Get from auth context
      };

      // Add project to projects slice
      dispatch(addProject(newProject));

      // Mark opportunity as converted
      dispatch(
        convertToProject({
          opportunityId: decidingOpportunity.id,
          projectId: projectId,
        })
      );
    }

    setDecidingOpportunity(null);
  };

  const handleCancelDecision = () => {
    setDecidingOpportunity(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Opportunities</h1>
            <p className="text-gray-600 mt-1">Lead qualification and assessment pipeline</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconFilter size={20} className="text-gray-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.new}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconPlus size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviewing</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.reviewing}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <IconClock size={20} className="text-purple-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Awaiting Decision</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.awaitingDecision}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <IconAlertCircle size={20} className="text-orange-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IconCheck size={20} className="text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            {/* Search */}
            <Input
              placeholder="Search opportunities by name, company, or description..."
              leftIcon={<IconSearch size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                placeholder="All Statuses"
                options={[
                  { value: '', label: 'All Statuses' },
                  ...Object.entries(OPPORTUNITY_STATUS_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OpportunityStatus | '')}
                fullWidth
              />
              <Select
                placeholder="All Priorities"
                options={[
                  { value: '', label: 'All Priorities' },
                  ...Object.entries(OPPORTUNITY_PRIORITY_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as OpportunityPriority | '')}
                fullWidth
              />
              <Select
                placeholder="All Sources"
                options={[
                  { value: '', label: 'All Sources' },
                  ...Object.entries(OPPORTUNITY_SOURCE_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  })),
                ]}
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as OpportunitySource | '')}
                fullWidth
              />
            </div>

            {/* Results count and clear */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {paginatedOpportunities.length} of {sortedOpportunities.length} opportunities
              </span>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Opportunities Grid */}
        {paginatedOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedOpportunities.map((opp) => (
              <Card
                key={opp.id}
                padding="md"
                shadow="sm"
                hover
                className="cursor-pointer transition-all"
                onClick={() => handleOpportunityClick(opp.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{opp.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{opp.company.name}</p>
                  </div>
                  {needsAttention(opp) && (
                    <IconAlertCircle size={20} className="text-orange-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                {/* Description */}
                {opp.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{opp.description}</p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={getOpportunityStatusVariant(opp.status)} size="sm">
                    {OPPORTUNITY_STATUS_LABELS[opp.status]}
                  </Badge>
                  <Badge variant={getOpportunityPriorityVariant(opp.priority)} size="sm">
                    {OPPORTUNITY_PRIORITY_LABELS[opp.priority]}
                  </Badge>
                  {opp.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Assessment Info */}
                {opp.quickAssessment && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Strategic Fit:</span>
                      <Badge
                        variant={getStrategicFitVariant(opp.quickAssessment.strategicFit)}
                        size="sm"
                      >
                        {opp.quickAssessment.strategicFit}
                      </Badge>
                    </div>
                    {opp.quickAssessment.recommendation && (
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-600">Recommendation:</span>
                        <span className="font-medium text-gray-900">
                          {opp.quickAssessment.recommendation.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <IconUser size={14} />
                    <span>{opp.assignedToName || 'Unassigned'}</span>
                  </div>
                  <span>{formatDate(opp.createdAt)}</span>
                </div>

                {/* Recommended Action */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (opp.status === 'NEW' || opp.status === 'REVIEWING') {
                        handleStartAssessment(opp);
                      } else if (opp.status === 'AWAITING_DECISION' || opp.status === 'ASSESSING') {
                        handleStartDecision(opp);
                      } else {
                        handleOpportunityClick(opp.id);
                      }
                    }}
                    className="w-full flex items-center justify-between text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <span>{getRecommendedAction(opp)}</span>
                    <IconChevronRight size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFilter size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600">
                {hasFilters
                  ? 'Try adjusting your filters'
                  : 'Opportunities are created when companies submit surveys'}
              </p>
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

        {/* Quick Assessment Form Modal */}
        {assessingOpportunity && (
          <QuickAssessmentForm
            opportunity={assessingOpportunity}
            onSubmit={handleSubmitAssessment}
            onCancel={handleCancelAssessment}
          />
        )}

        {/* Go/No-Go Decision Modal */}
        {decidingOpportunity && (
          <GoNoGoDecisionModal
            opportunity={decidingOpportunity}
            onSubmit={handleSubmitDecision}
            onCancel={handleCancelDecision}
          />
        )}
      </div>
    </AppLayout>
  );
}
