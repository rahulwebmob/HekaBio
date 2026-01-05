/**
 * Go/No-Go Decision Modal
 * Modal for making final decisions on opportunities
 */

import { useState } from 'react';
import { IconX, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, Select, Card } from '../../ui';
import type { Opportunity, DecisionType } from '../../../types/opportunity.types';
import type { ProjectTag } from '../../../types/project.types';

interface GoNoGoDecisionModalProps {
  opportunity: Opportunity;
  onSubmit: (decision: GoNoGoDecisionFormData) => void;
  onCancel: () => void;
}

export interface GoNoGoDecisionFormData {
  decision: DecisionType;
  decisionRationale: string;
  suggestedProjectTag?: ProjectTag;
  nextSteps?: string[];
  declineReason?: string;
  declineCategory?:
    | 'NOT_STRATEGIC_FIT'
    | 'TOO_EARLY_STAGE'
    | 'INSUFFICIENT_DATA'
    | 'IP_CONCERNS'
    | 'MARKET_CONCERNS'
    | 'TEAM_CONCERNS'
    | 'COMPETITIVE_LANDSCAPE'
    | 'OTHER';
}

const DECISION_OPTIONS = [
  { value: 'GO', label: 'Go - Approve & Convert to Project' },
  { value: 'NO_GO', label: 'No Go - Decline Opportunity' },
  { value: 'DEFER', label: 'Defer - Revisit Later' },
  { value: 'REQUEST_MORE_INFO', label: 'Request More Information' },
];

const PROJECT_TAG_OPTIONS: { value: ProjectTag; label: string }[] = [
  { value: 'Strategic Portfolio', label: 'Strategic Portfolio' },
  { value: 'Finders', label: 'Finders' },
  { value: 'Development Services', label: 'Development Services' },
];

const DECLINE_CATEGORY_OPTIONS = [
  { value: 'NOT_STRATEGIC_FIT', label: 'Not Strategic Fit' },
  { value: 'TOO_EARLY_STAGE', label: 'Too Early Stage' },
  { value: 'INSUFFICIENT_DATA', label: 'Insufficient Data' },
  { value: 'IP_CONCERNS', label: 'IP Concerns' },
  { value: 'MARKET_CONCERNS', label: 'Market Concerns' },
  { value: 'TEAM_CONCERNS', label: 'Team Concerns' },
  { value: 'COMPETITIVE_LANDSCAPE', label: 'Competitive Landscape' },
  { value: 'OTHER', label: 'Other' },
];

export default function GoNoGoDecisionModal({
  opportunity,
  onSubmit,
  onCancel,
}: GoNoGoDecisionModalProps) {
  const [formData, setFormData] = useState<GoNoGoDecisionFormData>({
    decision: 'DEFER',
    decisionRationale: '',
    suggestedProjectTag: undefined,
    nextSteps: [],
    declineReason: undefined,
    declineCategory: undefined,
  });

  const [newNextStep, setNewNextStep] = useState('');

  const handleAddNextStep = () => {
    if (newNextStep.trim() && !formData.nextSteps?.includes(newNextStep)) {
      setFormData({
        ...formData,
        nextSteps: [...(formData.nextSteps || []), newNextStep],
      });
      setNewNextStep('');
    }
  };

  const handleRemoveNextStep = (index: number) => {
    setFormData({
      ...formData,
      nextSteps: formData.nextSteps?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = () => {
    if (!formData.decision || !formData.decisionRationale.trim()) {
      return false;
    }
    // If NO_GO, require decline category
    if (formData.decision === 'NO_GO' && !formData.declineCategory) {
      return false;
    }
    return true;
  };

  const getDecisionColor = () => {
    switch (formData.decision) {
      case 'GO':
        return 'bg-green-50 border-green-200';
      case 'NO_GO':
        return 'bg-red-50 border-red-200';
      case 'DEFER':
        return 'bg-orange-50 border-orange-200';
      case 'REQUEST_MORE_INFO':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Go/No-Go Decision</h2>
            <p className="text-sm text-gray-600 mt-1">{opportunity.name}</p>
            {opportunity.quickAssessment && (
              <p className="text-xs text-gray-500 mt-1">
                Assessment Recommendation: <span className="font-medium">{opportunity.quickAssessment.recommendation.replace(/_/g, ' ')}</span>
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Decision */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision <span className="text-red-500">*</span>
              </label>
              <Select
                options={DECISION_OPTIONS}
                value={formData.decision}
                onChange={(e) =>
                  setFormData({ ...formData, decision: e.target.value as DecisionType })
                }
                fullWidth
                required
              />
            </div>

            {/* Decision Rationale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision Rationale <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.decisionRationale}
                onChange={(e) =>
                  setFormData({ ...formData, decisionRationale: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[120px]"
                placeholder="Explain the reasoning behind this decision..."
                required
              />
            </div>

            {/* GO-specific fields */}
            {formData.decision === 'GO' && (
              <Card padding="md" className={getDecisionColor()}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Planning</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suggested Project Tag
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'Select a tag...' },
                        ...PROJECT_TAG_OPTIONS,
                      ]}
                      value={formData.suggestedProjectTag || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, suggestedProjectTag: e.target.value as ProjectTag })
                      }
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Steps
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newNextStep}
                          onChange={(e) => setNewNextStep(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' && (e.preventDefault(), handleAddNextStep())
                          }
                          placeholder="Add a next step..."
                          fullWidth
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leftIcon={<IconPlus size={16} />}
                          onClick={handleAddNextStep}
                          disabled={!newNextStep.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      {formData.nextSteps && formData.nextSteps.length > 0 && (
                        <ul className="space-y-2">
                          {formData.nextSteps.map((step, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-200"
                            >
                              <span className="flex-1 text-sm text-gray-700">{step}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveNextStep(index)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <IconTrash size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* NO_GO-specific fields */}
            {formData.decision === 'NO_GO' && (
              <Card padding="md" className={getDecisionColor()}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Decline Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decline Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={[
                        { value: '', label: 'Select a category...' },
                        ...DECLINE_CATEGORY_OPTIONS,
                      ]}
                      value={formData.declineCategory || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          declineCategory: e.target.value as GoNoGoDecisionFormData['declineCategory'],
                        })
                      }
                      fullWidth
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Decline Reason
                    </label>
                    <textarea
                      value={formData.declineReason || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, declineReason: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[80px]"
                      placeholder="Provide any additional context for this decline..."
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* DEFER/REQUEST_MORE_INFO-specific message */}
            {(formData.decision === 'DEFER' || formData.decision === 'REQUEST_MORE_INFO') && (
              <Card padding="md" className={getDecisionColor()}>
                <p className="text-sm text-gray-700">
                  {formData.decision === 'DEFER'
                    ? 'This opportunity will remain in "AWAITING_DECISION" status. Please provide your rationale for why this decision should be revisited later.'
                    : 'This opportunity will remain in "AWAITING_DECISION" status. Please provide your rationale for what additional information is needed before making a final decision.'}
                </p>
              </Card>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={formData.decision === 'GO' ? 'primary' : formData.decision === 'NO_GO' ? 'danger' : 'secondary'}
              disabled={!isValid()}
            >
              {formData.decision === 'GO' && 'Approve & Convert to Project'}
              {formData.decision === 'NO_GO' && 'Decline Opportunity'}
              {formData.decision === 'DEFER' && 'Defer Decision'}
              {formData.decision === 'REQUEST_MORE_INFO' && 'Request More Info'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
