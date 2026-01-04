/**
 * Opportunity Detail Drawer
 * For viewing pipeline opportunity details
 */

import { useState } from 'react';
import {
  IconBuilding,
  IconCurrencyDollar,
  IconPercentage,
  IconCalendar,
  IconUser,
  IconClock,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconNote,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { deleteOpportunity, moveOpportunityToStage } from '../../../store/slices/pipelineSlice';
import { Drawer, Badge, Button } from '../../ui';
import type { PipelineOpportunity, PipelineStage } from '../../../types/pipeline.types';
import { PIPELINE_STAGE_CONFIG } from '../../../types/pipeline.types';

interface OpportunityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: PipelineOpportunity | null;
  onEdit?: (opportunity: PipelineOpportunity) => void;
}

export default function OpportunityDetailDrawer({
  isOpen,
  onClose,
  opportunity,
  onEdit,
}: OpportunityDetailDrawerProps) {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!opportunity) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(opportunity);
    }
  };

  const handleDelete = () => {
    dispatch(deleteOpportunity(opportunity.id));
    onClose();
  };

  const handleMarkAsWon = () => {
    dispatch(
      moveOpportunityToStage({
        opportunityId: opportunity.id,
        newStage: 'WON' as PipelineStage,
        probability: 100,
      })
    );
  };

  const handleMarkAsLost = () => {
    dispatch(
      moveOpportunityToStage({
        opportunityId: opportunity.id,
        newStage: 'LOST' as PipelineStage,
        probability: 0,
      })
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<
      string,
      { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }
    > = {
      LOW: { variant: 'default', label: 'Low' },
      MEDIUM: { variant: 'info', label: 'Medium' },
      HIGH: { variant: 'warning', label: 'High' },
      URGENT: { variant: 'error', label: 'Urgent' },
    };
    const config = variants[priority] || variants.MEDIUM;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStageBadge = (stage: PipelineStage) => {
    const config = PIPELINE_STAGE_CONFIG[stage];
    const variantMap: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
      gray: 'default',
      blue: 'info',
      purple: 'info',
      orange: 'warning',
      yellow: 'warning',
      green: 'success',
      red: 'error',
    };
    return <Badge variant={variantMap[config.color] || 'default'}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: opportunity.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDaysInStage = (enteredAt: string, exitedAt?: string) => {
    const entered = new Date(enteredAt);
    const exited = exitedAt ? new Date(exitedAt) : new Date();
    const diff = exited.getTime() - entered.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isClosedDeal = opportunity.stage === 'WON' || opportunity.stage === 'LOST';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Opportunity Details"
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {!isClosedDeal && (
              <>
                <Button
                  variant="primary"
                  leftIcon={<IconCheck size={18} />}
                  onClick={handleMarkAsWon}
                >
                  Mark as Won
                </Button>
                <Button variant="ghost" leftIcon={<IconX size={18} />} onClick={handleMarkAsLost}>
                  Mark as Lost
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<IconEdit size={18} />} onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/60 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
            <div className="flex items-center gap-2">
              {getStageBadge(opportunity.stage)}
              {getPriorityBadge(opportunity.priority)}
            </div>
          </div>

          {opportunity.description && (
            <p className="text-gray-700 border-t border-gray-200/50 pt-4">
              {opportunity.description}
            </p>
          )}
        </div>

        {/* Company & Project */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <IconBuilding size={20} />
            <span className="text-sm font-medium">Company & Project</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-600">Company:</span>
              <p className="text-sm font-medium text-gray-900">{opportunity.company.name}</p>
            </div>
            {opportunity.project && (
              <div>
                <span className="text-xs text-gray-600">Project:</span>
                <p className="text-sm font-medium text-gray-900">{opportunity.project.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconCurrencyDollar size={16} />
              <span className="text-sm font-medium">Estimated Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(opportunity.estimatedValue)}
            </p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconPercentage size={16} />
              <span className="text-sm font-medium">Probability</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{opportunity.probability}%</p>
            <p className="text-xs text-gray-600 mt-1">
              Weighted:{' '}
              {formatCurrency(opportunity.estimatedValue * (opportunity.probability / 100))}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          {opportunity.estimatedCloseDate && (
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <IconCalendar size={16} />
                <span className="text-sm font-medium">Estimated Close Date</span>
              </div>
              <p className="font-semibold text-gray-900">
                {formatDate(opportunity.estimatedCloseDate)}
              </p>
            </div>
          )}

          {opportunity.actualCloseDate && (
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <IconCalendar size={16} />
                <span className="text-sm font-medium">Actual Close Date</span>
              </div>
              <p className="font-semibold text-gray-900">
                {formatDate(opportunity.actualCloseDate)}
              </p>
            </div>
          )}
        </div>

        {/* Owner & Team */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <IconUser size={20} />
            <span className="text-sm font-medium">Owner & Team</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-600">Owner:</span>
              <p className="text-sm font-medium text-gray-900">{opportunity.ownerName}</p>
            </div>
            {opportunity.teamMembers && opportunity.teamMembers.length > 0 && (
              <div>
                <span className="text-xs text-gray-600">Team Members:</span>
                <p className="text-sm text-gray-700">{opportunity.teamMembers.length} members</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Tracking */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <IconClock size={20} />
            <span className="text-sm font-medium">Contact Tracking</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Contacts:</span>
              <span className="font-medium text-gray-900">{opportunity.contactCount}</span>
            </div>
            {opportunity.lastContactDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Contact:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(opportunity.lastContactDate)}
                </span>
              </div>
            )}
            {opportunity.nextFollowUpDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next Follow-up:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(opportunity.nextFollowUpDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stage History */}
        {opportunity.stageHistory && opportunity.stageHistory.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <IconTrendingUp size={20} />
              <span className="text-sm font-medium">Stage History</span>
            </div>
            <div className="space-y-3">
              {[...opportunity.stageHistory]
                .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())
                .map((history, index) => {
                  const stageConfig = PIPELINE_STAGE_CONFIG[history.stage];
                  const daysInStage = calculateDaysInStage(history.enteredAt, history.exitedAt);
                  const isCurrent = index === 0 && !history.exitedAt;

                  return (
                    <div
                      key={`${history.stage}-${history.enteredAt}`}
                      className={`border-l-4 pl-3 py-2 ${
                        isCurrent ? 'border-brand-500 bg-brand-50' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {stageConfig.label}
                          {isCurrent && (
                            <span className="ml-2 text-xs text-brand-600">(Current)</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-600">{daysInStage} days</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Entered: {formatDateTime(history.enteredAt)}
                        {history.exitedAt && (
                          <span className="ml-2">• Exited: {formatDateTime(history.exitedAt)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Win/Loss Information */}
        {opportunity.outcome && (
          <div
            className={`rounded-lg p-4 ${
              opportunity.outcome === 'WON'
                ? 'bg-success-50 border border-success-200'
                : 'bg-error-50 border border-error-200'
            }`}
          >
            <h4
              className={`text-sm font-semibold mb-2 ${
                opportunity.outcome === 'WON' ? 'text-success-900' : 'text-error-900'
              }`}
            >
              {opportunity.outcome === 'WON' ? 'Deal Won' : 'Deal Lost'}
            </h4>
            <div className="space-y-1 text-sm">
              {opportunity.winReason && (
                <div>
                  <span className="text-success-700">Reason: </span>
                  <span className="text-success-900 font-medium">
                    {opportunity.winReason.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              {opportunity.lossReason && (
                <div>
                  <span className="text-error-700">Reason: </span>
                  <span className="text-error-900 font-medium">
                    {opportunity.lossReason.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              {opportunity.competitorInfo && (
                <div>
                  <span className="text-error-700">Competitor Info: </span>
                  <span className="text-error-900">{opportunity.competitorInfo}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {opportunity.tags.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {opportunity.notes && (
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <IconNote size={20} />
              <h4 className="text-sm font-semibold text-gray-700">Notes</h4>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{opportunity.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Opportunity Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">{formatDateTime(opportunity.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900">{formatDateTime(opportunity.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-900 mb-3">
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<IconTrash size={16} />}
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showDeleteConfirm && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<IconTrash size={16} />}
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error-600 hover:text-error-700 hover:bg-error-50"
            >
              Delete Opportunity
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
