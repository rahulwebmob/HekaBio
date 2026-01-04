/**
 * Gate 2 Review Panel - 1-on-1 Meeting Stage
 * Review Japan screening, lead score, partner fit
 */

import { useState } from 'react';
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconCalendar,
  IconWorld,
  IconChartBar,
  IconUsers,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addGateReview } from '../../../store/slices/gateSlice';
import { Card, Button, Badge } from '../../ui';
import type { GateNumber, GateReview, GateDecision } from '../../../types/gate.types';

interface Gate2ReviewPanelProps {
  projectId: string;
  projectName: string;
  companyName: string;
  japanScreeningSummary: string;
  japanMarketFit: 'HIGH' | 'MEDIUM' | 'LOW';
  leadScore: number;
  partnerFit: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  meetingCompleted: boolean;
  gateNumber: GateNumber;
}

export default function Gate2ReviewPanel({
  projectId,
  projectName,
  companyName,
  japanScreeningSummary,
  japanMarketFit,
  leadScore,
  partnerFit,
  meetingCompleted,
  gateNumber,
}: Gate2ReviewPanelProps) {
  const dispatch = useAppDispatch();
  const [decision, setDecision] = useState<GateDecision | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAddCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setConditions(conditions.filter((c) => c !== condition));
  };

  const handleSubmit = () => {
    if (!decision) return;

    const gateReview: Omit<GateReview, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId,
      gateNumber,
      decision,
      reviewDate: new Date().toISOString(),
      reviewedBy: 'user-001',
      reviewerName: 'Current User',
      reviewerRole: 'BD Manager',
      checklist: [],
      checklistCompletionRate: 0,
      comments: reasoning,
      conditions: decision === 'APPROVED' ? conditions : [],
      followUpRequired: decision === 'PENDING',
      createdBy: 'user-001',
    };

    dispatch(addGateReview(gateReview));
    setSubmitted(true);
  };

  const canApprove = meetingCompleted && leadScore >= 50 && japanMarketFit !== 'LOW';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card padding="lg" shadow="sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Gate 2 Review</h2>
            <p className="text-gray-600">1-on-1 Meeting Assessment</p>
          </div>
          <Badge variant="info" size="lg">
            Gate 2
          </Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Project:</span>
            <span className="ml-2 font-medium text-gray-900">{projectName}</span>
          </div>
          <div>
            <span className="text-gray-600">Company:</span>
            <span className="ml-2 font-medium text-gray-900">{companyName}</span>
          </div>
        </div>
      </Card>

      {/* Assessment Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Meeting Status */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
              <IconCalendar size={20} className="text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">1-on-1 Meeting</h3>
              <p className="text-xs text-gray-600">Discussion completed</p>
            </div>
          </div>
          <Badge variant={meetingCompleted ? 'success' : 'warning'} size="md">
            {meetingCompleted ? (
              <>
                <IconCheck size={14} className="mr-1" />
                Completed
              </>
            ) : (
              <>
                <IconAlertCircle size={14} className="mr-1" />
                Pending
              </>
            )}
          </Badge>
        </Card>

        {/* Japan Market Fit */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconWorld size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Japan Market Fit</h3>
              <p className="text-xs text-gray-600">Screening assessment</p>
            </div>
          </div>
          <Badge
            variant={
              japanMarketFit === 'HIGH'
                ? 'success'
                : japanMarketFit === 'MEDIUM'
                ? 'warning'
                : 'error'
            }
            size="md"
          >
            {japanMarketFit} FIT
          </Badge>
        </Card>

        {/* Lead Score */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconChartBar size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Lead Score</h3>
              <p className="text-xs text-gray-600">Overall rating</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{leadScore}/100</div>
          <Badge variant={leadScore >= 70 ? 'success' : leadScore >= 50 ? 'warning' : 'error'} size="sm">
            {leadScore >= 70 ? 'Strong' : leadScore >= 50 ? 'Moderate' : 'Weak'}
          </Badge>
        </Card>

        {/* Partner Fit */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <IconUsers size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Partner Fit</h3>
              <p className="text-xs text-gray-600">Network alignment</p>
            </div>
          </div>
          <Badge
            variant={
              partnerFit === 'EXCELLENT'
                ? 'success'
                : partnerFit === 'GOOD'
                ? 'info'
                : partnerFit === 'FAIR'
                ? 'warning'
                : 'default'
            }
            size="md"
          >
            {partnerFit}
          </Badge>
        </Card>
      </div>

      {/* Japan Screening Summary */}
      <Card padding="lg" shadow="sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Japan Screening Summary</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{japanScreeningSummary}</p>
      </Card>

      {/* Decision Section */}
      {!submitted ? (
        <Card padding="lg" shadow="sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gate 2 Decision</h3>

          {/* Decision Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setDecision('APPROVED')}
              disabled={!canApprove}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'APPROVED'
                  ? 'border-success-500 bg-success-50'
                  : canApprove
                  ? 'border-gray-200 hover:border-success-300'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconCheck size={20} className={decision === 'APPROVED' ? 'text-success-600' : 'text-gray-400'} />
                <span className={`font-semibold ${decision === 'APPROVED' ? 'text-success-900' : 'text-gray-700'}`}>
                  Approve to Gate 3
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Strong potential. Ready for senior decision.
              </p>
              {!canApprove && (
                <p className="text-xs text-warning-600 mt-2">
                  Requires completed meeting, score ≥50, and Japan fit
                </p>
              )}
            </button>

            <button
              onClick={() => setDecision('PENDING')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'PENDING'
                  ? 'border-warning-500 bg-warning-50'
                  : 'border-gray-200 hover:border-warning-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconAlertCircle size={20} className={decision === 'PENDING' ? 'text-warning-600' : 'text-gray-400'} />
                <span className={`font-semibold ${decision === 'PENDING' ? 'text-warning-900' : 'text-gray-700'}`}>
                  Hold for Review
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Needs additional assessment or conditions.
              </p>
            </button>

            <button
              onClick={() => setDecision('REJECTED')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'REJECTED'
                  ? 'border-error-500 bg-error-50'
                  : 'border-gray-200 hover:border-error-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconX size={20} className={decision === 'REJECTED' ? 'text-error-600' : 'text-gray-400'} />
                <span className={`font-semibold ${decision === 'REJECTED' ? 'text-error-900' : 'text-gray-700'}`}>
                  Close Project
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Does not meet Gate 2 criteria. Close project.
              </p>
            </button>
          </div>

          {/* Conditions (for approved projects) */}
          {decision === 'APPROVED' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Conditions (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                  placeholder="Add condition and press Enter..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <Button variant="secondary" onClick={handleAddCondition}>
                  Add
                </Button>
              </div>
              {conditions.length > 0 && (
                <div className="space-y-2">
                  {conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">{condition}</span>
                      <button
                        onClick={() => handleRemoveCondition(condition)}
                        className="text-error-600 hover:text-error-700"
                      >
                        <IconX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reasoning Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision Reasoning <span className="text-error-600">*</span>
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={4}
              placeholder="Explain your decision and key considerations from the 1-on-1 meeting..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!decision || !reasoning.trim()}
            >
              Submit Gate 2 Decision
            </Button>
          </div>
        </Card>
      ) : (
        <Card padding="lg" shadow="sm">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCheck size={32} className="text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gate 2 Decision Submitted
            </h3>
            <p className="text-gray-600">
              {decision === 'APPROVED'
                ? 'Project approved to proceed to Gate 3 (Senior Decision)'
                : decision === 'PENDING'
                ? 'Project on hold pending additional review'
                : 'Project closed at Gate 2'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
