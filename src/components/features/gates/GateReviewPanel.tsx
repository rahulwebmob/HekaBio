/**
 * Gate Review Panel
 * Comprehensive gate review interface with checklist, scoring, and decision
 */

import { useState, useEffect, useMemo } from 'react';
import {
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  createGateReview,
  updateGateDecision,
  toggleChecklistItem,
  updateGateScores,
  setFollowUp,
} from '../../../store/slices/gateSlice';
import { Card, Badge, Button } from '../../ui';
import type { GateNumber, GateDecision, GateReview } from '../../../types/gate.types';
import { GATE_CONFIGS } from '../../../types/gate.types';

interface GateReviewPanelProps {
  projectId: string;
  gateNumber: GateNumber;
  existingReview?: GateReview;
}

export default function GateReviewPanel({
  projectId,
  gateNumber,
  existingReview,
}: GateReviewPanelProps) {
  const dispatch = useAppDispatch();
  const gateConfig = GATE_CONFIGS[gateNumber];

  // Find or create gate review
  const reviews = useAppSelector((state) => state.gate.reviews);
  const currentReview = useMemo(() => {
    return existingReview || reviews.find(
      (r) => r.projectId === projectId && r.gateNumber === gateNumber
    );
  }, [existingReview, reviews, projectId, gateNumber]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [showScoring, setShowScoring] = useState(false);
  const [showDecision, setShowDecision] = useState(false);

  // Form state
  const [decision, setDecision] = useState<GateDecision>('PENDING');
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);

  // Scores
  const [technicalScore, setTechnicalScore] = useState<number>(5);
  const [marketScore, setMarketScore] = useState<number>(5);
  const [teamScore, setTeamScore] = useState<number>(5);
  const [fitScore, setFitScore] = useState<number>(5);

  // Follow-up
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [followUpTasks, setFollowUpTasks] = useState<string[]>([]);

  // Input states
  const [strengthInput, setStrengthInput] = useState('');
  const [concernInput, setConcernInput] = useState('');
  const [recommendationInput, setRecommendationInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [taskInput, setTaskInput] = useState('');

  // Initialize review if doesn't exist
  useEffect(() => {
    if (!currentReview) {
      dispatch(
        createGateReview({
          projectId,
          gateNumber,
          reviewerName: 'Current User',
          reviewerRole: 'Business Development',
        })
      );
    } else {
      // Load existing review data
      setDecision(currentReview.decision);
      setComments(currentReview.comments);
      setStrengths(currentReview.strengths || []);
      setConcerns(currentReview.concerns || []);
      setRecommendations(currentReview.recommendations || []);
      setConditions(currentReview.conditions || []);
      setTechnicalScore(currentReview.technicalScore || 5);
      setMarketScore(currentReview.marketScore || 5);
      setTeamScore(currentReview.teamScore || 5);
      setFitScore(currentReview.fitScore || 5);
      setFollowUpRequired(currentReview.followUpRequired);
      setNextReviewDate(
        currentReview.nextReviewDate
          ? new Date(currentReview.nextReviewDate).toISOString().split('T')[0]
          : ''
      );
      setFollowUpTasks(currentReview.followUpTasks || []);
    }
  }, [currentReview, dispatch, projectId, gateNumber]);

  if (!currentReview) {
    return (
      <Card padding="lg">
        <div className="text-center py-8">
          <IconClock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Initializing gate review...</p>
        </div>
      </Card>
    );
  }

  const handleChecklistToggle = (itemId: string, completed: boolean) => {
    dispatch(
      toggleChecklistItem({
        reviewId: currentReview.id,
        checklistItemId: itemId,
        completed,
      })
    );
  };

  const handleSaveScores = () => {
    dispatch(
      updateGateScores({
        reviewId: currentReview.id,
        technicalScore,
        marketScore,
        teamScore,
        fitScore,
      })
    );
  };

  const handleSubmitDecision = () => {
    dispatch(
      updateGateDecision({
        reviewId: currentReview.id,
        decision,
        comments,
        strengths: strengths.length > 0 ? strengths : undefined,
        concerns: concerns.length > 0 ? concerns : undefined,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
        conditions: conditions.length > 0 ? conditions : undefined,
      })
    );

    if (followUpRequired) {
      dispatch(
        setFollowUp({
          reviewId: currentReview.id,
          required: true,
          nextReviewDate: nextReviewDate || undefined,
          tasks: followUpTasks.length > 0 ? followUpTasks : undefined,
        })
      );
    }

    setShowDecision(false);
  };

  const getDecisionBadge = (dec: GateDecision) => {
    const variants: Record<GateDecision, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      PENDING: { variant: 'default', label: 'Pending Review' },
      APPROVED: { variant: 'success', label: 'Approved' },
      REJECTED: { variant: 'error', label: 'Rejected' },
      CONDITIONAL: { variant: 'warning', label: 'Conditional Approval' },
      DEFERRED: { variant: 'info', label: 'Deferred' },
    };
    const config = variants[dec];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      green: 'bg-success-100 text-success-700 border-success-300',
    };
    return colors[color] || colors.blue;
  };

  // Group checklist by category
  const checklistByCategory = useMemo(() => {
    if (!currentReview) return {};
    const grouped: Record<string, typeof currentReview.checklist> = {};
    currentReview.checklist.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [currentReview]);

  // Show loading state while review is being created
  if (!currentReview) {
    return (
      <Card padding="lg">
        <div className="text-center py-8 text-gray-600">
          <IconClock size={32} className="mx-auto mb-2 text-gray-400" />
          <p>Initializing gate review...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card padding="md" className={`border-2 ${getColorClass(gateConfig.color)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              {isExpanded ? <IconChevronDown size={20} /> : <IconChevronRight size={20} />}
            </button>
            <div>
              <h3 className="text-lg font-semibold">{gateConfig.name}</h3>
              <p className="text-sm opacity-80">{gateConfig.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getDecisionBadge(currentReview.decision)}
            <div className="text-right text-sm">
              <div className="font-medium">
                {currentReview.checklistCompletionRate}% Complete
              </div>
              <div className="text-xs opacity-75">
                {currentReview.checklist.filter((i) => i.completed).length} /{' '}
                {currentReview.checklist.length} items
              </div>
            </div>
          </div>
        </div>
      </Card>

      {isExpanded && (
        <div className="space-y-4">
          {/* Checklist */}
          <Card padding="md">
            <h4 className="font-semibold text-gray-900 mb-4">Review Checklist</h4>
            <div className="space-y-4">
              {Object.entries(checklistByCategory).map(([category, items]) => (
                <div key={category}>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">{category}</h5>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => handleChecklistToggle(item.id, e.target.checked)}
                          className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.text}
                            {item.required && <span className="text-error-600 ml-1">*</span>}
                          </span>
                          {item.notes && (
                            <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Scoring Section */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Scoring (Optional)</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScoring(!showScoring)}
              >
                {showScoring ? 'Hide' : 'Show'} Scores
              </Button>
            </div>

            {showScoring && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Technical', value: technicalScore, setter: setTechnicalScore },
                    { label: 'Market', value: marketScore, setter: setMarketScore },
                    { label: 'Team', value: teamScore, setter: setTeamScore },
                    { label: 'Fit', value: fitScore, setter: setFitScore },
                  ].map((score) => (
                    <div key={score.label}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {score.label} Score: {score.value}/10
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={score.value}
                        onChange={(e) => score.setter(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                      />
                    </div>
                  ))}
                </div>

                {currentReview.overallScore !== undefined && (
                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-600">
                        {currentReview.overallScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-brand-700">Overall Score</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button variant="secondary" onClick={handleSaveScores}>
                    Save Scores
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Decision Section */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Gate Decision</h4>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowDecision(!showDecision)}
              >
                {showDecision ? 'Hide' : 'Make'} Decision
              </Button>
            </div>

            {showDecision && (
              <div className="space-y-4">
                {/* Decision Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision <span className="text-error-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'APPROVED' as GateDecision, label: 'Approve', icon: IconCheck, color: 'success' },
                      { value: 'CONDITIONAL' as GateDecision, label: 'Conditional', icon: IconAlertCircle, color: 'warning' },
                      { value: 'DEFERRED' as GateDecision, label: 'Defer', icon: IconClock, color: 'info' },
                      { value: 'REJECTED' as GateDecision, label: 'Reject', icon: IconX, color: 'error' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDecision(option.value)}
                        className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                          decision === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50`
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <option.icon size={20} className={decision === option.value ? `text-${option.color}-600` : 'text-gray-600'} />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments <span className="text-error-600">*</span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide detailed reasoning for your decision..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  />
                </div>

                {/* Strengths, Concerns, Recommendations */}
                {[
                  { label: 'Strengths', items: strengths, setItems: setStrengths, input: strengthInput, setInput: setStrengthInput },
                  { label: 'Concerns', items: concerns, setItems: setConcerns, input: concernInput, setInput: setConcernInput },
                  { label: 'Recommendations', items: recommendations, setItems: setRecommendations, input: recommendationInput, setInput: setRecommendationInput },
                ].map((section) => (
                  <div key={section.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{section.label}</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={section.input}
                        onChange={(e) => section.setInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && section.input.trim()) {
                            section.setItems([...section.items, section.input.trim()]);
                            section.setInput('');
                          }
                        }}
                        placeholder={`Add ${section.label.toLowerCase()}...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (section.input.trim()) {
                            section.setItems([...section.items, section.input.trim()]);
                            section.setInput('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {item}
                          <button
                            onClick={() => section.setItems(section.items.filter((_, i) => i !== index))}
                            className="hover:text-gray-900 transition-colors"
                          >
                            <IconX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Conditions (if conditional approval) */}
                {decision === 'CONDITIONAL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conditions for Approval <span className="text-error-600">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && conditionInput.trim()) {
                            setConditions([...conditions, conditionInput.trim()]);
                            setConditionInput('');
                          }
                        }}
                        placeholder="Add condition..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (conditionInput.trim()) {
                            setConditions([...conditions, conditionInput.trim()]);
                            setConditionInput('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-warning-50 rounded">
                          <span className="text-sm flex-1">{condition}</span>
                          <button
                            onClick={() => setConditions(conditions.filter((_, i) => i !== index))}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <IconX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="followUpRequired"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                      Follow-up Required
                    </label>
                  </div>

                  {followUpRequired && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Review Date
                        </label>
                        <input
                          type="date"
                          value={nextReviewDate}
                          onChange={(e) => setNextReviewDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Follow-up Tasks
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && taskInput.trim()) {
                                setFollowUpTasks([...followUpTasks, taskInput.trim()]);
                                setTaskInput('');
                              }
                            }}
                            placeholder="Add follow-up task..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => {
                              if (taskInput.trim()) {
                                setFollowUpTasks([...followUpTasks, taskInput.trim()]);
                                setTaskInput('');
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <ul className="space-y-1">
                          {followUpTasks.map((task, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <span>• {task}</span>
                              <button
                                onClick={() => setFollowUpTasks(followUpTasks.filter((_, i) => i !== index))}
                                className="text-gray-600 hover:text-gray-900 ml-auto"
                              >
                                <IconX size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button variant="ghost" onClick={() => setShowDecision(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmitDecision}
                    disabled={!comments.trim() || (decision === 'CONDITIONAL' && conditions.length === 0)}
                  >
                    Submit Decision
                  </Button>
                </div>
              </div>
            )}

            {/* Show existing decision if not editing */}
            {!showDecision && currentReview.decision !== 'PENDING' && (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Decision: </span>
                  {getDecisionBadge(currentReview.decision)}
                </div>
                {currentReview.comments && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Comments:</span>
                    <p className="text-sm text-gray-600 mt-1">{currentReview.comments}</p>
                  </div>
                )}
                {currentReview.strengths && currentReview.strengths.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Strengths:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {currentReview.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {currentReview.concerns && currentReview.concerns.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Concerns:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {currentReview.concerns.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
