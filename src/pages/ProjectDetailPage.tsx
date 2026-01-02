/**
 * Project Detail Page
 * View and manage individual project details
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconFlask,
  IconBuilding,
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconTargetArrow,
  IconWorld,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { deleteProject } from '../store/slices/projectsSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge, Modal } from '../components/ui';
import { ProjectFormModal } from '../components/features';
import { StageTimeline, StageHistory } from '../components/common';
import { StageLabels } from '../types/project.types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const project = useAppSelector((state) =>
    state.projects.projects.find((p) => p.id === id)
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // If project not found
  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconFlask size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="primary" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    dispatch(deleteProject(project.id));
    navigate('/projects');
  };

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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IconArrowLeft size={16} />
          <span>Back to Projects</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{project.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{project.company.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.japanInterest && (
              <Button
                variant="primary"
                leftIcon={<IconWorld size={18} />}
                onClick={() => navigate(`/projects/${project.id}/japan-screening`)}
              >
                🇯🇵 Japan Screening
              </Button>
            )}
            <Button
              variant="outline"
              leftIcon={<IconEdit size={18} />}
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              leftIcon={<IconTrash size={18} />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Project Tags */}
          {project.tags.map((tag) => (
            <Badge key={tag} variant="primary" size="md">
              {tag}
            </Badge>
          ))}

          {/* Stage Badge */}
          <Badge variant={getStageColor(project.currentStage)} size="md">
            {StageLabels[project.currentStage]}
          </Badge>

          {/* Japan Fit */}
          {project.japanMarketFit && project.japanMarketFit !== 'NOT_ASSESSED' && (
            <Badge
              variant={
                project.japanMarketFit === 'HIGH'
                  ? 'success'
                  : project.japanMarketFit === 'MEDIUM'
                  ? 'warning'
                  : 'default'
              }
              size="md"
            >
              Japan: {project.japanMarketFit}
            </Badge>
          )}

          {/* Flags */}
          {project.isHot && (
            <Badge variant="error" size="md">
              🔥 Hot
            </Badge>
          )}
          {project.isDiamond && (
            <Badge variant="success" size="md">
              💎 Diamond
            </Badge>
          )}
          {project.isStalled && (
            <Badge variant="default" size="md">
              ⏸️ Stalled
            </Badge>
          )}
        </div>

        {/* Stage Workflow Timeline */}
        <Card padding="lg" shadow="sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Stage Workflow</h2>
            <p className="text-sm text-gray-600">
              Track progress through the {project.tags[0]} pipeline
            </p>
          </div>
          <StageTimeline
            currentStage={project.currentStage}
            projectTag={project.tags[0]}
          />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card
              padding="lg"
              shadow="sm"
              header={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <IconFlask size={20} className="text-brand-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
                </div>
              }
            >
              {project.description ? (
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </Card>

            {/* Score Breakdown */}
            {project.scoreBreakdown && (
              <Card
                padding="lg"
                shadow="sm"
                header={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <IconTargetArrow size={20} className="text-brand-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Score Breakdown</h2>
                  </div>
                }
              >
                <div className="space-y-4">
                  {/* Total Score */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(project.score)}`}>
                      {project.score}
                    </span>
                  </div>

                  {/* Individual Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Clinical Evidence</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.scoreBreakdown.clinicalEvidence}/20
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{
                            width: `${(project.scoreBreakdown.clinicalEvidence / 20) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">IP Status</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.scoreBreakdown.ipStatus}/15
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{ width: `${(project.scoreBreakdown.ipStatus / 15) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Market Traction</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.scoreBreakdown.marketTraction}/15
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{
                            width: `${(project.scoreBreakdown.marketTraction / 15) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Strategic Fit</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.scoreBreakdown.strategicFit}/20
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{
                            width: `${(project.scoreBreakdown.strategicFit / 20) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Regulatory Clarity</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.scoreBreakdown.regulatoryClarity}/15
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{
                            width: `${(project.scoreBreakdown.regulatoryClarity / 15) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Financial Health</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {project.scoreBreakdown.financialHealth}/15
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{
                            width: `${(project.scoreBreakdown.financialHealth / 15) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {project.lastScoredAt && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Last scored: {new Date(project.lastScoredAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Japan Market Assessment */}
            {project.japanInterest && (
              <Card
                padding="lg"
                shadow="sm"
                header={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🇯🇵</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Japan Market Assessment
                    </h2>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Market Fit</span>
                    <Badge
                      variant={
                        project.japanMarketFit === 'HIGH'
                          ? 'success'
                          : project.japanMarketFit === 'MEDIUM'
                          ? 'warning'
                          : 'default'
                      }
                      size="md"
                    >
                      {project.japanMarketFit || 'NOT_ASSESSED'}
                    </Badge>
                  </div>

                  {project.japanSummary && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Summary</p>
                      <p className="text-gray-700 leading-relaxed">{project.japanSummary}</p>
                    </div>
                  )}

                  {project.japanScreeningCompletedAt && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Screening completed:{' '}
                        {new Date(project.japanScreeningCompletedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Stage History */}
            <Card
              padding="lg"
              shadow="sm"
              header={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                    <IconCalendar size={20} className="text-brand-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Stage History</h2>
                </div>
              }
            >
              <StageHistory stageHistory={project.stageHistory} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(project.score)}`}>
                    {project.score}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Current Stage</p>
                  <Badge variant={getStageColor(project.currentStage)} size="md">
                    {StageLabels[project.currentStage]}
                  </Badge>
                </div>

                {project.ndaStatus !== 'NOT_REQUIRED' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">NDA Status</p>
                    <Badge
                      variant={project.ndaStatus === 'COMPLETED' ? 'success' : 'warning'}
                      size="md"
                    >
                      {project.ndaStatus}
                    </Badge>
                  </div>
                )}

                {typeof project.ddProgress === 'number' && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Due Diligence</p>
                      <span className="text-sm font-semibold text-gray-900">
                        {project.ddProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full"
                        style={{ width: `${project.ddProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Company Information */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Company</h2>}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <IconBuilding size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <button
                      onClick={() => navigate(`/companies/${project.company.id}`)}
                      className="text-base font-semibold text-brand-600 hover:text-brand-700 text-left"
                    >
                      {project.company.name}
                    </button>
                  </div>
                </div>

                {project.company.address && (
                  <div className="text-sm text-gray-600">
                    <p>
                      {project.company.address.city}, {project.company.address.country}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Metadata</h2>}
            >
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {project.updatedAt && (
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Project ID</p>
                  <p className="text-gray-900 font-mono text-xs">{project.id}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Project
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{project.name}</strong>?
          </p>
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-800">
              <strong>Warning:</strong> This action cannot be undone. All project history and
              data will be permanently deleted.
            </p>
          </div>
        </div>
      </Modal>

      {/* Project Edit Modal */}
      <ProjectFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={project}
      />
    </AppLayout>
  );
}
