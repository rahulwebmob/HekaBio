/**
 * Screenings Page
 * Pre-project screening assessments with TRL, therapeutic fit, and market assessment
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconChevronDown,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Input, Button, Badge, Card } from '../components/ui';
import { TRL_DEFINITIONS } from '../types/screening.types';
import type { ScreeningStatus, TherapeuticArea } from '../types/screening.types';

type SortField = 'score' | 'name' | 'trl' | 'status' | 'date';
type SortOrder = 'asc' | 'desc';

export default function ScreeningsPage() {
  const navigate = useNavigate();
  const screenings = useAppSelector((state) => state.screenings.screenings);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<ScreeningStatus | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => {
    const completed = screenings.filter((s) => s.status === 'COMPLETED' || s.status === 'APPROVED' || s.status === 'REJECTED');
    const approved = screenings.filter((s) => s.decision === 'PROCEED_TO_GATE_1');
    const avgScore = completed.length > 0
      ? completed.reduce((sum, s) => sum + s.overallScore, 0) / completed.length
      : 0;

    return {
      total: screenings.length,
      inProgress: screenings.filter((s) => s.status === 'IN_PROGRESS').length,
      completed: completed.length,
      approved: approved.length,
      avgScore: Math.round(avgScore),
    };
  }, [screenings]);

  // Filter and sort
  const filteredScreenings = useMemo(() => {
    let filtered = [...screenings];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.innovationName.toLowerCase().includes(query) ||
          s.company.name.toLowerCase().includes(query) ||
          s.therapeuticArea.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'score':
          aVal = a.overallScore;
          bVal = b.overallScore;
          break;
        case 'name':
          aVal = a.innovationName.toLowerCase();
          bVal = b.innovationName.toLowerCase();
          break;
        case 'trl':
          aVal = TRL_DEFINITIONS.find((d) => d.level === a.trl)?.number || 0;
          bVal = TRL_DEFINITIONS.find((d) => d.level === b.trl)?.number || 0;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'date':
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [screenings, searchQuery, sortField, sortOrder, statusFilter]);

  const getStatusBadge = (status: ScreeningStatus) => {
    switch (status) {
      case 'NOT_STARTED':
        return <Badge>Not Started</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="info">Completed</Badge>;
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="error">Rejected</Badge>;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="success">{score}</Badge>;
    if (score >= 60) return <Badge variant="warning">{score}</Badge>;
    return <Badge variant="error">{score}</Badge>;
  };

  const getTRLInfo = (trl: string) => {
    return TRL_DEFINITIONS.find((d) => d.level === trl);
  };

  const formatTherapeuticArea = (area: TherapeuticArea): string => {
    return area.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Pre-Project Screenings</h1>
            <p className="text-gray-600 mt-1">
              Technology readiness, therapeutic fit, and market assessment
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<IconPlus size={18} />}
            onClick={() => navigate('/screenings/new')}
          >
            New Screening
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Total Screenings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-warning-600 mt-1">{stats.inProgress}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{stats.completed}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-success-600 mt-1">{stats.approved}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Avg Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgScore}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                leftIcon={<IconSearch size={18} />}
                placeholder="Search by innovation name, company, or therapeutic area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ScreeningStatus | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="ALL">All Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortField(field as SortField);
                  setSortOrder(order as SortOrder);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
                <option value="name-asc">Name A-Z</option>
                <option value="trl-desc">TRL High-Low</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Screenings List */}
        <div className="space-y-4">
          {filteredScreenings.length === 0 ? (
            <Card padding="lg" shadow="sm">
              <div className="text-center py-12">
                <IconFilter size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No screenings found matching your filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            filteredScreenings.map((screening) => {
              const trlInfo = getTRLInfo(screening.trl);
              const isExpanded = expandedId === screening.id;

              return (
                <Card key={screening.id} padding="none" shadow="sm" hover>
                  {/* Main Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : screening.id)}
                    className="w-full text-left p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Score */}
                    <div className="flex-shrink-0">
                      {getScoreBadge(screening.overallScore)}
                    </div>

                    {/* Innovation Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {screening.innovationName}
                      </h3>
                      <p className="text-sm text-gray-600">{screening.company.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTherapeuticArea(screening.therapeuticArea)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          TRL {trlInfo?.number} - {trlInfo?.name}
                        </span>
                      </div>
                    </div>

                    {/* Status & Decision */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      {getStatusBadge(screening.status)}
                      {screening.decision && (
                        <Badge
                          variant={
                            screening.decision === 'PROCEED_TO_GATE_1'
                              ? 'success'
                              : screening.decision === 'REJECT'
                              ? 'error'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {screening.decision.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      <IconChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 space-y-6 bg-gray-50">
                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-700">{screening.innovationDescription}</p>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Therapeutic Fit */}
                        <Card padding="md" className="bg-white">
                          <h5 className="text-xs font-semibold text-gray-600 mb-2">Therapeutic Fit</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Score:</span>
                              <Badge
                                variant={
                                  screening.therapeuticAreaFit.scoreValue >= 80
                                    ? 'success'
                                    : screening.therapeuticAreaFit.scoreValue >= 60
                                    ? 'warning'
                                    : 'error'
                                }
                                size="sm"
                              >
                                {screening.therapeuticAreaFit.scoreValue}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Strategic:</span>{' '}
                              {screening.therapeuticAreaFit.strategicAlignment}
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Technical:</span>{' '}
                              {screening.therapeuticAreaFit.technicalCapability}
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Market:</span>{' '}
                              {screening.therapeuticAreaFit.marketOpportunity}
                            </div>
                          </div>
                        </Card>

                        {/* Market Assessment */}
                        <Card padding="md" className="bg-white">
                          <h5 className="text-xs font-semibold text-gray-600 mb-2">Market Assessment</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Attractiveness:</span>
                              <Badge
                                variant={
                                  screening.marketAssessment.overallMarketAttractiveness === 'HIGH'
                                    ? 'success'
                                    : screening.marketAssessment.overallMarketAttractiveness === 'MEDIUM'
                                    ? 'warning'
                                    : 'error'
                                }
                                size="sm"
                              >
                                {screening.marketAssessment.overallMarketAttractiveness}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Competitive:</span>
                              <Badge
                                variant={
                                  screening.marketAssessment.overallCompetitiveStrength === 'STRONG'
                                    ? 'success'
                                    : screening.marketAssessment.overallCompetitiveStrength === 'MODERATE'
                                    ? 'warning'
                                    : 'error'
                                }
                                size="sm"
                              >
                                {screening.marketAssessment.overallCompetitiveStrength}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              <span className="font-medium">Recommendation:</span>{' '}
                              {screening.marketAssessment.recommendation.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </Card>

                        {/* Pre-Screening */}
                        <Card padding="md" className="bg-white">
                          <h5 className="text-xs font-semibold text-gray-600 mb-2">Pre-Screening Checklist</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Score:</span>
                              <Badge
                                variant={
                                  screening.preScreeningChecklist.totalScore >= 80
                                    ? 'success'
                                    : screening.preScreeningChecklist.totalScore >= 60
                                    ? 'warning'
                                    : 'error'
                                }
                                size="sm"
                              >
                                {screening.preScreeningChecklist.totalScore}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Must-Haves:</span>{' '}
                              {screening.preScreeningChecklist.mustHavesMet}/
                              {screening.preScreeningChecklist.mustHavesTotal}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              {screening.preScreeningChecklist.redFlagsCount === 0 ? (
                                <>
                                  <IconCheck size={14} className="text-success-600" />
                                  <span className="text-success-600">No Red Flags</span>
                                </>
                              ) : (
                                <>
                                  <IconAlertTriangle size={14} className="text-error-600" />
                                  <span className="text-error-600">
                                    {screening.preScreeningChecklist.redFlagsCount} Red Flags
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs mt-2">
                              {screening.preScreeningChecklist.passesMinimumThreshold ? (
                                <>
                                  <IconCheck size={14} className="text-success-600" />
                                  <span className="text-success-600">Passes Threshold</span>
                                </>
                              ) : (
                                <>
                                  <IconX size={14} className="text-error-600" />
                                  <span className="text-error-600">Below Threshold</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Recommendation */}
                      {screening.recommendation && (
                        <div className="bg-white border border-brand-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-brand-900 mb-2">Recommendation</h4>
                          <p className="text-sm text-gray-700">{screening.recommendation}</p>
                        </div>
                      )}

                      {/* Decision Rationale */}
                      {screening.decisionRationale && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Decision Rationale</h4>
                          <p className="text-sm text-gray-700">{screening.decisionRationale}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/screenings/${screening.id}`)}
                        >
                          View Full Assessment
                        </Button>
                        {screening.status === 'IN_PROGRESS' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/screenings/${screening.id}/edit`)}
                          >
                            Continue Assessment
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
