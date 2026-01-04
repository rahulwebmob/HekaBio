/**
 * Gate 1 Review Panel - Data Gathering Stage
 * Review survey completeness, data extraction, initial scoring
 */

import { useState } from 'react';
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconChartBar,
  IconFileText,
  IconDatabase,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addGateReview } from '../../../store/slices/gateSlice';
import { Card, Button, Badge } from '../../ui';
import type { GateNumber, GateReview, GateDecision } from '../../../types/gate.types';

interface Gate1ReviewPanelProps {
  projectId: string;
  projectName: string;
  companyName: string;
  surveyCompleteness: number;
  dataExtractionStatus: 'NOT_STARTED' | 'COMPLETED' | 'VERIFIED';
  initialScore: number;
  gateNumber: GateNumber;
}

export default function Gate1ReviewPanel({
  projectId,
  projectName,
  companyName,
  surveyCompleteness,
  dataExtractionStatus,
  initialScore,
  gateNumber,
}: Gate1ReviewPanelProps) {
  const dispatch = useAppDispatch();
  const [decision, setDecision] = useState<GateDecision | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [requestedInfo, setRequestedInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      conditions: decision === 'PENDING' ? [requestedInfo] : [],
      followUpRequired: decision === 'PENDING',
      createdBy: 'user-001',
    };

    dispatch(addGateReview(gateReview));
    setSubmitted(true);
  };

  const canApprove = surveyCompleteness >= 80 && dataExtractionStatus === 'VERIFIED';
  const canRequestInfo = surveyCompleteness < 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card padding="lg" shadow="sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Gate 1 Review</h2>
            <p className="text-gray-600">Data Gathering Assessment</p>
          </div>
          <Badge variant="info" size="lg">
            Gate 1
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Survey Completeness */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
              <IconFileText size={20} className="text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Survey Completeness</h3>
              <p className="text-xs text-gray-600">Required fields submitted</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">{surveyCompleteness}%</div>
            <Badge variant={surveyCompleteness >= 80 ? 'success' : 'warning'}>
              {surveyCompleteness >= 80 ? 'Sufficient' : 'Needs Review'}
            </Badge>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                surveyCompleteness >= 80 ? 'bg-success-500' : 'bg-warning-500'
              }`}
              style={{ width: `${surveyCompleteness}%` }}
            />
          </div>
        </Card>

        {/* Data Extraction Status */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <IconDatabase size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Data Extraction</h3>
              <p className="text-xs text-gray-600">AI extraction status</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-lg font-bold text-gray-900">
              {dataExtractionStatus === 'VERIFIED'
                ? 'Verified'
                : dataExtractionStatus === 'COMPLETED'
                ? 'Completed'
                : 'Not Started'}
            </div>
            <Badge
              variant={
                dataExtractionStatus === 'VERIFIED'
                  ? 'success'
                  : dataExtractionStatus === 'COMPLETED'
                  ? 'warning'
                  : 'default'
              }
            >
              {dataExtractionStatus === 'VERIFIED' ? (
                <>
                  <IconCheck size={12} className="mr-1" />
                  Ready
                </>
              ) : dataExtractionStatus === 'COMPLETED' ? (
                <>
                  <IconAlertCircle size={12} className="mr-1" />
                  Needs Verification
                </>
              ) : (
                'Pending'
              )}
            </Badge>
          </div>
        </Card>

        {/* Initial Score */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconChartBar size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Initial Score</h3>
              <p className="text-xs text-gray-600">Preliminary assessment</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900">{initialScore}</div>
            <Badge variant={initialScore >= 60 ? 'success' : initialScore >= 40 ? 'warning' : 'error'}>
              {initialScore >= 60 ? 'Strong' : initialScore >= 40 ? 'Moderate' : 'Weak'}
            </Badge>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                initialScore >= 60
                  ? 'bg-success-500'
                  : initialScore >= 40
                  ? 'bg-warning-500'
                  : 'bg-error-500'
              }`}
              style={{ width: `${initialScore}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Decision Section */}
      {!submitted ? (
        <Card padding="lg" shadow="sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gate 1 Decision</h3>

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
                  Approve to Gate 2
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Sufficient data collected. Ready for Japan screening.
              </p>
              {!canApprove && (
                <p className="text-xs text-warning-600 mt-2">
                  Requires ≥80% survey completion and verified data extraction
                </p>
              )}
            </button>

            <button
              onClick={() => setDecision('PENDING')}
              disabled={!canRequestInfo}
              className={`p-4 rounded-lg border-2 transition-all ${
                decision === 'PENDING'
                  ? 'border-warning-500 bg-warning-50'
                  : 'border-gray-200 hover:border-warning-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <IconAlertCircle size={20} className={decision === 'PENDING' ? 'text-warning-600' : 'text-gray-400'} />
                <span className={`font-semibold ${decision === 'PENDING' ? 'text-warning-900' : 'text-gray-700'}`}>
                  Request Information
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Missing critical data. Request additional information.
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
                Does not meet minimum criteria. Close project.
              </p>
            </button>
          </div>

          {/* Reasoning Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision Reasoning <span className="text-error-600">*</span>
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              rows={4}
              placeholder="Explain your decision and key considerations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Requested Information (if applicable) */}
          {decision === 'PENDING' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Information <span className="text-error-600">*</span>
              </label>
              <textarea
                value={requestedInfo}
                onChange={(e) => setRequestedInfo(e.target.value)}
                rows={3}
                placeholder="List specific information needed from the product owner..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                !decision ||
                !reasoning.trim() ||
                (decision === 'PENDING' && !requestedInfo.trim())
              }
            >
              Submit Gate 1 Decision
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
              Gate 1 Decision Submitted
            </h3>
            <p className="text-gray-600">
              {decision === 'APPROVED'
                ? 'Project approved to proceed to Gate 2 (Japan Screening)'
                : decision === 'PENDING'
                ? 'Follow-up request sent to product owner'
                : 'Project closed at Gate 1'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
