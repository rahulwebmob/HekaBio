/**
 * Quick Assessment Form
 * Form for submitting quick assessments of opportunities
 */

import { useState } from 'react';
import { IconX, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Input, Select, Card } from '../../ui';
import type { Opportunity, TechnologyReadinessLevel, StrategicFitRating } from '../../../types/opportunity.types';

interface QuickAssessmentFormProps {
  opportunity: Opportunity;
  onSubmit: (assessment: QuickAssessmentFormData) => void;
  onCancel: () => void;
}

export interface QuickAssessmentFormData {
  technologyDescription: string;
  therapeuticArea: string[];
  indication: string;
  trl?: TechnologyReadinessLevel;
  strategicFit: StrategicFitRating;
  strategicFitNotes: string;
  alignsWithFocus: boolean;
  japanMarketPotential?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  teamStrength?: 'STRONG' | 'ADEQUATE' | 'WEAK' | 'UNKNOWN';
  ipStatus?: 'STRONG' | 'ADEQUATE' | 'WEAK' | 'UNKNOWN';
  keyStrengths: string[];
  redFlags: string[];
  recommendation: 'STRONG_GO' | 'GO' | 'MAYBE' | 'NO_GO' | 'NEEDS_MORE_INFO';
  recommendationRationale: string;
}

const TRL_OPTIONS = [
  { value: 'TRL_1', label: 'TRL 1 - Basic principles observed' },
  { value: 'TRL_2', label: 'TRL 2 - Technology concept formulated' },
  { value: 'TRL_3', label: 'TRL 3 - Experimental proof of concept' },
  { value: 'TRL_4', label: 'TRL 4 - Technology validated in lab' },
  { value: 'TRL_5', label: 'TRL 5 - Technology validated in relevant environment' },
  { value: 'TRL_6', label: 'TRL 6 - Technology demonstrated in relevant environment' },
  { value: 'TRL_7', label: 'TRL 7 - System prototype demonstration' },
  { value: 'TRL_8', label: 'TRL 8 - System complete and qualified' },
  { value: 'TRL_9', label: 'TRL 9 - Actual system proven' },
];

const STRATEGIC_FIT_OPTIONS = [
  { value: 'EXCELLENT', label: 'Excellent Fit' },
  { value: 'GOOD', label: 'Good Fit' },
  { value: 'FAIR', label: 'Fair Fit' },
  { value: 'POOR', label: 'Poor Fit' },
  { value: 'NOT_ASSESSED', label: 'Not Assessed' },
];

const RATING_OPTIONS = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

const STRENGTH_OPTIONS = [
  { value: 'STRONG', label: 'Strong' },
  { value: 'ADEQUATE', label: 'Adequate' },
  { value: 'WEAK', label: 'Weak' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

const RECOMMENDATION_OPTIONS = [
  { value: 'STRONG_GO', label: 'Strong Go - Highly Recommended' },
  { value: 'GO', label: 'Go - Recommended' },
  { value: 'MAYBE', label: 'Maybe - Conditional' },
  { value: 'NO_GO', label: 'No Go - Not Recommended' },
  { value: 'NEEDS_MORE_INFO', label: 'Needs More Information' },
];

const THERAPEUTIC_AREAS = [
  'Oncology',
  'Immunology',
  'Neurology',
  'Cardiology',
  'Metabolic',
  'Infectious Disease',
  'Rare Disease',
  'Ophthalmology',
  'Dermatology',
  'Other',
];

export default function QuickAssessmentForm({
  opportunity,
  onSubmit,
  onCancel,
}: QuickAssessmentFormProps) {
  const [formData, setFormData] = useState<QuickAssessmentFormData>({
    technologyDescription: opportunity.description || '',
    therapeuticArea: [],
    indication: '',
    trl: undefined,
    strategicFit: 'NOT_ASSESSED',
    strategicFitNotes: '',
    alignsWithFocus: false,
    japanMarketPotential: 'UNKNOWN',
    teamStrength: 'UNKNOWN',
    ipStatus: 'UNKNOWN',
    keyStrengths: [],
    redFlags: [],
    recommendation: 'NEEDS_MORE_INFO',
    recommendationRationale: '',
  });

  const [newTherapeuticArea, setNewTherapeuticArea] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newRedFlag, setNewRedFlag] = useState('');

  const handleAddTherapeuticArea = () => {
    if (newTherapeuticArea.trim() && !formData.therapeuticArea.includes(newTherapeuticArea)) {
      setFormData({
        ...formData,
        therapeuticArea: [...formData.therapeuticArea, newTherapeuticArea],
      });
      setNewTherapeuticArea('');
    }
  };

  const handleRemoveTherapeuticArea = (area: string) => {
    setFormData({
      ...formData,
      therapeuticArea: formData.therapeuticArea.filter((a) => a !== area),
    });
  };

  const handleAddStrength = () => {
    if (newStrength.trim() && !formData.keyStrengths.includes(newStrength)) {
      setFormData({
        ...formData,
        keyStrengths: [...formData.keyStrengths, newStrength],
      });
      setNewStrength('');
    }
  };

  const handleRemoveStrength = (index: number) => {
    setFormData({
      ...formData,
      keyStrengths: formData.keyStrengths.filter((_, i) => i !== index),
    });
  };

  const handleAddRedFlag = () => {
    if (newRedFlag.trim() && !formData.redFlags.includes(newRedFlag)) {
      setFormData({
        ...formData,
        redFlags: [...formData.redFlags, newRedFlag],
      });
      setNewRedFlag('');
    }
  };

  const handleRemoveRedFlag = (index: number) => {
    setFormData({
      ...formData,
      redFlags: formData.redFlags.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = () => {
    return (
      formData.technologyDescription.trim() !== '' &&
      formData.strategicFit !== undefined &&
      formData.recommendation !== undefined &&
      formData.recommendationRationale.trim() !== ''
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Quick Assessment</h2>
            <p className="text-sm text-gray-600 mt-1">{opportunity.name}</p>
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
            {/* Technology Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.technologyDescription}
                onChange={(e) =>
                  setFormData({ ...formData, technologyDescription: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                placeholder="Describe the technology and its unique value proposition..."
                required
              />
            </div>

            {/* Therapeutic Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Therapeutic Area(s)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select
                    options={[
                      { value: '', label: 'Select therapeutic area...' },
                      ...THERAPEUTIC_AREAS.map((area) => ({ value: area, label: area })),
                    ]}
                    value={newTherapeuticArea}
                    onChange={(e) => setNewTherapeuticArea(e.target.value)}
                    fullWidth
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<IconPlus size={16} />}
                    onClick={handleAddTherapeuticArea}
                    disabled={!newTherapeuticArea}
                  >
                    Add
                  </Button>
                </div>
                {formData.therapeuticArea.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.therapeuticArea.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveTherapeuticArea(area)}
                          className="hover:text-brand-900"
                        >
                          <IconX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Indication & TRL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Indication
                </label>
                <Input
                  value={formData.indication}
                  onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                  placeholder="e.g., Non-small cell lung cancer"
                  fullWidth
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Readiness Level (TRL)
                </label>
                <Select
                  options={[{ value: '', label: 'Select TRL...' }, ...TRL_OPTIONS]}
                  value={formData.trl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trl: e.target.value ? (e.target.value as TechnologyReadinessLevel) : undefined,
                    })
                  }
                  fullWidth
                />
              </div>
            </div>

            {/* Strategic Fit */}
            <Card padding="md" className="bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Assessment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strategic Fit <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={STRATEGIC_FIT_OPTIONS}
                    value={formData.strategicFit}
                    onChange={(e) =>
                      setFormData({ ...formData, strategicFit: e.target.value as StrategicFitRating })
                    }
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strategic Fit Notes
                  </label>
                  <textarea
                    value={formData.strategicFitNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, strategicFitNotes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[80px]"
                    placeholder="Explain how this aligns with strategic priorities..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="alignsWithFocus"
                    checked={formData.alignsWithFocus}
                    onChange={(e) =>
                      setFormData({ ...formData, alignsWithFocus: e.target.checked })
                    }
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="alignsWithFocus" className="text-sm font-medium text-gray-700">
                    Aligns with current strategic focus areas
                  </label>
                </div>
              </div>
            </Card>

            {/* Market & Team Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Japan Market Potential
                </label>
                <Select
                  options={RATING_OPTIONS}
                  value={formData.japanMarketPotential || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      japanMarketPotential: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN',
                    })
                  }
                  fullWidth
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Strength
                </label>
                <Select
                  options={STRENGTH_OPTIONS}
                  value={formData.teamStrength || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamStrength: e.target.value as 'STRONG' | 'ADEQUATE' | 'WEAK' | 'UNKNOWN',
                    })
                  }
                  fullWidth
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP Status
                </label>
                <Select
                  options={STRENGTH_OPTIONS}
                  value={formData.ipStatus || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ipStatus: e.target.value as 'STRONG' | 'ADEQUATE' | 'WEAK' | 'UNKNOWN',
                    })
                  }
                  fullWidth
                />
              </div>
            </div>

            {/* Key Strengths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Strengths
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStrength())}
                    placeholder="Add a key strength..."
                    fullWidth
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<IconPlus size={16} />}
                    onClick={handleAddStrength}
                    disabled={!newStrength.trim()}
                  >
                    Add
                  </Button>
                </div>
                {formData.keyStrengths.length > 0 && (
                  <ul className="space-y-2">
                    {formData.keyStrengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-2 bg-green-50 rounded-lg"
                      >
                        <span className="flex-1 text-sm text-gray-700">{strength}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStrength(index)}
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

            {/* Red Flags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Red Flags / Concerns
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newRedFlag}
                    onChange={(e) => setNewRedFlag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRedFlag())}
                    placeholder="Add a red flag or concern..."
                    fullWidth
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<IconPlus size={16} />}
                    onClick={handleAddRedFlag}
                    disabled={!newRedFlag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {formData.redFlags.length > 0 && (
                  <ul className="space-y-2">
                    {formData.redFlags.map((flag, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-2 bg-red-50 rounded-lg"
                      >
                        <span className="flex-1 text-sm text-gray-700">{flag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRedFlag(index)}
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

            {/* Recommendation */}
            <Card padding="md" className="bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Recommendation <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={RECOMMENDATION_OPTIONS}
                    value={formData.recommendation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recommendation: e.target.value as QuickAssessmentFormData['recommendation'],
                      })
                    }
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendation Rationale <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.recommendationRationale}
                    onChange={(e) =>
                      setFormData({ ...formData, recommendationRationale: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[100px]"
                    placeholder="Explain your recommendation and key decision factors..."
                    required
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isValid()}>
              Submit Assessment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
