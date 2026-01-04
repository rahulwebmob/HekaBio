/**
 * Gate 3 Review Panel - Senior Decision Stage
 * Final strategic decision for NDA and Due Diligence
 */

import { useState } from 'react';
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconFileText,
  IconCurrencyDollar,
  IconUsers,
  IconChartBar,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addGateReview } from '../../../store/slices/gateSlice';
import { Card, Button, Badge } from '../../ui';
import type { GateNumber, GateReview, GateDecision } from '../../../types/gate.types';

interface Gate3ReviewPanelProps {
  projectId: string;
  projectName: string;
  companyName: string;
  executiveSummary: string;
  leadScore: number;
  japanMarketFit: 'HIGH' | 'MEDIUM' | 'LOW';
  gate1Approved: boolean;
  gate2Approved: boolean;
  estimatedValue: number;
  gateNumber: GateNumber;
}

export default function Gate3ReviewPanel({
  projectId,
  projectName,
  companyName,
  executiveSummary,
  leadScore,
  japanMarketFit,
  gate1Approved,
  gate2Approved,
  estimatedValue,
  gateNumber,
}: Gate3ReviewPanelProps) {
  const dispatch = useAppDispatch();
  const [decision, setDecision] = useState<GateDecision | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [budgetAllocation, setBudgetAllocation] = useState('');
  const [resourceAllocation, setResourceAllocation] = useState('');
  const [strategicNotes, setStrategicNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!decision) return;

    const gateReview: Omit<GateReview, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId,
      gateNumber,
      decision,
      reviewDate: new Date().toISOString(),
      reviewedBy: 'user-001',
      reviewerName: 'Senior Decision Maker',
      reviewerRole: 'Senior Leadership',
      checklist: [],
      checklistCompletionRate: 0,
      comments: `${reasoning}\n\nBudget: ${budgetAllocation || 'N/A'}\nResources: ${resourceAllocation || 'N/A'}\nNotes: ${strategicNotes || 'N/A'}`,
      conditions: [],
      followUpRequired: decision === 'PENDING',
      createdBy: 'user-001',
    };

    dispatch(addGateReview(gateReview));
    setSubmitted(true);
  };

  const meetsThresholds = gate1Approved && gate2Approved && leadScore >= 70;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card padding="lg" shadow="sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Gate 3 Review</h2>
            <p className="text-gray-600">Senior Strategic Decision</p>
          </div>
          <Badge variant="warning" size="lg">
            Gate 3
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

      {/* Gate Progression Check */}
      <Card padding="lg" shadow="sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Gate Progression Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                gate1Approved ? 'bg-success-100' : 'bg-gray-100'
              }`}
            >
              {gate1Approved ? (
                <IconCheck size={20} className="text-success-600" />
              ) : (
                <IconX size={20} className="text-gray-400" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Gate 1</div>
              <div className="text-xs text-gray-600">
                {gate1Approved ? 'Approved' : 'Not Approved'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                gate2Approved ? 'bg-success-100' : 'bg-gray-100'
              }`}
            >
              {gate2Approved ? (
                <IconCheck size={20} className="text-success-600" />
              ) : (
                <IconX size={20} className="text-gray-400" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Gate 2</div>
              <div className="text-xs text-gray-600">
                {gate2Approved ? 'Approved' : 'Not Approved'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                leadScore >= 70 ? 'bg-success-100' : 'bg-warning-100'
              }`}
            >
              <IconChartBar
                size={20}
                className={leadScore >= 70 ? 'text-success-600' : 'text-warning-600'}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Score: {leadScore}</div>
              <div className="text-xs text-gray-600">
                {leadScore >= 70 ? 'Meets Threshold' : 'Below Threshold'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconFileText size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Japan Market Fit</h3>
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
            size="lg"
          >
            {japanMarketFit} FIT
          </Badge>
        </Card>

        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconCurrencyDollar size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Estimated Value</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${(estimatedValue / 1000000).toFixed(1)}M
          </div>
        </Card>

        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <IconUsers size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Strategic Fit</h3>
            </div>
          </div>
          <Badge variant={meetsThresholds ? 'success' : 'warning'} size="lg">
            {meetsThresholds ? 'STRONG' : 'REVIEW'}
          </Badge>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card padding="lg" shadow="sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Executive Summary</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{executiveSummary}</p>
      </Card>

      {/* Decision Section */}
      {!submitted ? (
        <Card padding="lg" shadow="sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gate 3 Final Decision</h3>

          {/* Threshold Warning */}
          {!meetsThresholds && (
            <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-start gap-3">
                <IconAlertCircle size={20} className="text-warning-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-warning-900 mb-1">
                    Below Standard Thresholds
                  </p>
                  <p className="text-xs text-warning-700">
                    This project does not meet the standard criteria (Gate 1 & 2 approved, Score ≥
                    70). Consider carefully before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Decision Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setDecision('APPROVED')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'APPROVED'
                  ? 'border-success-500 bg-success-50'
                  : 'border-gray-200 hover:border-success-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconCheck
                  size={20}
                  className={decision === 'APPROVED' ? 'text-success-600' : 'text-gray-400'}
                />
                <span
                  className={`font-semibold ${decision === 'APPROVED' ? 'text-success-900' : 'text-gray-700'}`}
                >
                  Proceed to NDA/DD
                </span>
              </div>
              <p className="text-xs text-gray-600">Approve for NDA initiation and due diligence.</p>
            </button>

            <button
              onClick={() => setDecision('CONDITIONAL')}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'CONDITIONAL'
                  ? 'border-warning-500 bg-warning-50'
                  : 'border-gray-200 hover:border-warning-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconAlertCircle
                  size={20}
                  className={decision === 'CONDITIONAL' ? 'text-warning-600' : 'text-gray-400'}
                />
                <span
                  className={`font-semibold ${decision === 'CONDITIONAL' ? 'text-warning-900' : 'text-gray-700'}`}
                >
                  Renegotiate Terms
                </span>
              </div>
              <p className="text-xs text-gray-600">Requires term adjustments before proceeding.</p>
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
                <IconX
                  size={20}
                  className={decision === 'REJECTED' ? 'text-error-600' : 'text-gray-400'}
                />
                <span
                  className={`font-semibold ${decision === 'REJECTED' ? 'text-error-900' : 'text-gray-700'}`}
                >
                  Decline Project
                </span>
              </div>
              <p className="text-xs text-gray-600">Does not meet strategic criteria.</p>
            </button>
          </div>

          {/* Strategic Fields (for proceed decision) */}
          {decision === 'APPROVED' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Allocation
                </label>
                <input
                  type="text"
                  value={budgetAllocation}
                  onChange={(e) => setBudgetAllocation(e.target.value)}
                  placeholder="e.g., $500K for DD process"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Allocation
                </label>
                <input
                  type="text"
                  value={resourceAllocation}
                  onChange={(e) => setResourceAllocation(e.target.value)}
                  placeholder="e.g., 2 FTEs for 3 months"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Strategic Reasoning */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategic Reasoning <span className="text-error-600">*</span>
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={4}
              placeholder="Explain the strategic rationale for this decision..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Strategic Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Strategic Notes
            </label>
            <textarea
              value={strategicNotes}
              onChange={(e) => setStrategicNotes(e.target.value)}
              rows={3}
              placeholder="Any additional strategic considerations or notes..."
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
              Submit Gate 3 Decision
            </Button>
          </div>
        </Card>
      ) : (
        <Card padding="lg" shadow="sm">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCheck size={32} className="text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gate 3 Decision Submitted</h3>
            <p className="text-gray-600">
              {decision === 'APPROVED'
                ? 'Project approved for NDA initiation and due diligence process'
                : decision === 'CONDITIONAL'
                  ? 'Project requires term renegotiation before proceeding'
                  : 'Project declined at Gate 3'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
