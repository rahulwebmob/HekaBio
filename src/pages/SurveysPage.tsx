/**
 * Surveys Page
 * List and manage all survey instances
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconFileText,
  IconEye,
  IconSend,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Button, Card, Input, Select, Badge } from '../components/ui';
import { SendSurveyModal } from '../components/features';
import type { SubmissionStatus } from '../types/survey.types';

export default function SurveysPage() {
  const navigate = useNavigate();
  const surveys = useAppSelector((state) => state.surveys.instances);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        survey.company.name.toLowerCase().includes(searchLower) ||
        survey.template.name.toLowerCase().includes(searchLower) ||
        survey.project?.name.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = !statusFilter || survey.status === statusFilter;

      // Type filter
      const matchesType = !typeFilter || survey.template.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [surveys, searchTerm, statusFilter, typeFilter]);

  // Sort by sent date (most recent first)
  const sortedSurveys = useMemo(() => {
    return [...filteredSurveys].sort((a, b) => {
      const dateA = new Date(a.sentAt).getTime();
      const dateB = new Date(b.sentAt).getTime();
      return dateB - dateA;
    });
  }, [filteredSurveys]);

  // Pagination
  const totalPages = Math.ceil(sortedSurveys.length / itemsPerPage);
  const paginatedSurveys = sortedSurveys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  // Filter options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'REVIEWED', label: 'Reviewed' },
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'SURVEY_1', label: 'Survey 1' },
    { value: 'SURVEY_2', label: 'Survey 2' },
    { value: 'SURVEY_3', label: 'Survey 3' },
    { value: 'JAPAN_ASSESSMENT', label: 'Japan Assessment' },
    { value: 'CUSTOM', label: 'Custom' },
  ];

  // Helper functions
  const getStatusBadge = (status: SubmissionStatus) => {
    const variants = {
      NOT_STARTED: 'default' as const,
      IN_PROGRESS: 'warning' as const,
      SUBMITTED: 'info' as const,
      REVIEWED: 'success' as const,
    };

    const labels = {
      NOT_STARTED: 'Not Started',
      IN_PROGRESS: 'In Progress',
      SUBMITTED: 'Submitted',
      REVIEWED: 'Reviewed',
    };

    return (
      <Badge variant={variants[status]} size="sm">
        {labels[status]}
      </Badge>
    );
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'text-success-600';
    if (percentage >= 70) return 'text-brand-600';
    if (percentage >= 40) return 'text-warning-600';
    return 'text-gray-600';
  };

  const isDueSoon = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (dueDate?: string, status?: SubmissionStatus) => {
    if (!dueDate || status === 'SUBMITTED' || status === 'REVIEWED') return false;
    return new Date(dueDate) < new Date();
  };

  const hasFilters = searchTerm || statusFilter || typeFilter;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Surveys</h1>
            <p className="text-gray-600 mt-1">
              Manage survey distribution and track responses
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<IconSend size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            Send Survey
          </Button>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            {/* Search */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                placeholder="Search by company, project, or survey name..."
                leftIcon={<IconSearch size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                placeholder="Filter by status"
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by type"
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                fullWidth
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {paginatedSurveys.length} of {sortedSurveys.length} surveys
              </span>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setTypeFilter('');
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

        {/* Surveys Table */}
        {paginatedSurveys.length > 0 ? (
          <Card padding="none" shadow="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 backdrop-blur-xl border-b border-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Survey
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Company / Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sent / Due
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {paginatedSurveys.map((survey) => (
                    <tr
                      key={survey.id}
                      className="hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {survey.template.name}
                          </p>
                          <p className="text-xs text-gray-600">{survey.template.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {survey.company.name}
                          </p>
                          {survey.project && (
                            <p className="text-xs text-gray-600">{survey.project.name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(survey.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-[80px]">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-brand-500 h-2 rounded-full transition-all"
                                style={{ width: `${survey.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                          <span
                            className={`text-sm font-semibold ${getCompletionColor(
                              survey.completionPercentage
                            )}`}
                          >
                            {survey.completionPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {new Date(survey.sentAt).toLocaleDateString()}
                          </p>
                          {survey.dueDate && (
                            <p
                              className={`text-xs ${
                                isOverdue(survey.dueDate, survey.status)
                                  ? 'text-error-600 font-semibold'
                                  : isDueSoon(survey.dueDate)
                                  ? 'text-warning-600 font-semibold'
                                  : 'text-gray-600'
                              }`}
                            >
                              Due: {new Date(survey.dueDate).toLocaleDateString()}
                              {isOverdue(survey.dueDate, survey.status) && ' (Overdue)'}
                              {isDueSoon(survey.dueDate) && !isOverdue(survey.dueDate, survey.status) && ' (Soon)'}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => navigate(`/surveys/${survey.id}`)}
                            className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="View survey"
                          >
                            <IconEye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No surveys found</h3>
              <p className="text-gray-600 mb-6">
                {hasFilters
                  ? 'Try adjusting your filters'
                  : 'Send your first survey to get started'}
              </p>
              <Button
                variant="primary"
                leftIcon={<IconSend size={18} />}
                onClick={() => setIsModalOpen(true)}
              >
                Send Survey
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                    ${
                      currentPage === page
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
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

      {/* Send Survey Modal */}
      <SendSurveyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AppLayout>
  );
}
