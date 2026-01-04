/**
 * Conditional Logic Builder
 * Build conditional display rules for survey questions
 */

import { useState, useEffect } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Select, Input, Badge } from '../../ui';
import type { SurveyQuestion, ConditionalLogic } from '../../../types/survey.types';

interface ConditionalLogicBuilderProps {
  question: SurveyQuestion;
  allQuestions: SurveyQuestion[]; // All previous questions that can be referenced
  onLogicChange: (logic: ConditionalLogic | undefined) => void;
}

export default function ConditionalLogicBuilder({
  question,
  allQuestions,
  onLogicChange,
}: ConditionalLogicBuilderProps) {
  const [enabled, setEnabled] = useState(!!question.conditionalLogic);
  const [dependsOnQuestionId, setDependsOnQuestionId] = useState(
    question.conditionalLogic?.dependsOnQuestionId || ''
  );
  const [operator, setOperator] = useState<ConditionalLogic['showWhen']['operator']>(
    question.conditionalLogic?.showWhen.operator || 'EQUALS'
  );
  const [value, setValue] = useState(
    question.conditionalLogic?.showWhen.value?.toString() || ''
  );

  // Get available previous questions (questions that appear before current question)
  const availableQuestions = allQuestions.filter(
    (q) => q.order < question.order && q.id !== question.id
  );

  const selectedQuestion = availableQuestions.find((q) => q.id === dependsOnQuestionId);

  useEffect(() => {
    if (enabled && dependsOnQuestionId && operator && value) {
      const logic: ConditionalLogic = {
        dependsOnQuestionId,
        showWhen: {
          operator,
          value: selectedQuestion?.type === 'NUMBER' ? parseFloat(value) : value,
        },
      };
      onLogicChange(logic);
    } else {
      onLogicChange(undefined);
    }
  }, [enabled, dependsOnQuestionId, operator, value, selectedQuestion, onLogicChange]);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (!newEnabled) {
      setDependsOnQuestionId('');
      setOperator('EQUALS');
      setValue('');
      onLogicChange(undefined);
    }
  };

  const getOperatorOptions = () => {
    if (!selectedQuestion) {
      return [
        { value: 'EQUALS', label: 'Equals' },
        { value: 'NOT_EQUALS', label: 'Does Not Equal' },
      ];
    }

    switch (selectedQuestion.type) {
      case 'NUMBER':
      case 'RATING':
        return [
          { value: 'EQUALS', label: 'Equals' },
          { value: 'NOT_EQUALS', label: 'Does Not Equal' },
          { value: 'GREATER_THAN', label: 'Greater Than' },
          { value: 'LESS_THAN', label: 'Less Than' },
        ];
      case 'TEXT':
      case 'TEXTAREA':
        return [
          { value: 'EQUALS', label: 'Equals' },
          { value: 'NOT_EQUALS', label: 'Does Not Equal' },
          { value: 'CONTAINS', label: 'Contains' },
        ];
      case 'SINGLE_CHOICE':
      case 'MULTIPLE_CHOICE':
        return [
          { value: 'EQUALS', label: 'Equals' },
          { value: 'NOT_EQUALS', label: 'Does Not Equal' },
          { value: 'CONTAINS', label: 'Contains' },
        ];
      default:
        return [
          { value: 'EQUALS', label: 'Equals' },
          { value: 'NOT_EQUALS', label: 'Does Not Equal' },
        ];
    }
  };

  const renderValueInput = () => {
    if (!selectedQuestion) {
      return (
        <Input
          placeholder="Enter value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
        />
      );
    }

    switch (selectedQuestion.type) {
      case 'NUMBER':
      case 'RATING':
        return (
          <Input
            type="number"
            placeholder="Enter number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />
        );
      case 'SINGLE_CHOICE':
      case 'MULTIPLE_CHOICE':
        return (
          <Select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            options={[
              { value: '', label: 'Select option' },
              ...(selectedQuestion.options?.map((opt) => ({
                value: opt.value,
                label: opt.label,
              })) || []),
            ]}
            fullWidth
          />
        );
      default:
        return (
          <Input
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900">Conditional Logic</h4>
          {enabled && (
            <Badge variant="info" size="sm">
              Active
            </Badge>
          )}
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-brand-600' : 'bg-gray-200'
          }`}
          aria-label="Toggle conditional logic"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Info Box */}
      {!enabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <IconInfoCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-1">About Conditional Logic</h5>
              <p className="text-sm text-blue-700">
                Show or hide this question based on how respondents answer a previous question.
                This helps create dynamic surveys that adapt to each respondent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logic Builder */}
      {enabled && (
        <div className="border border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
          {availableQuestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <IconInfoCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="font-medium mb-1">No Previous Questions</p>
              <p className="text-sm">
                Add questions above this one to create conditional logic rules
              </p>
            </div>
          ) : (
            <>
              {/* Rule Description */}
              <div className="bg-white border border-gray-300 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Show this question when:</span>
                </p>
              </div>

              {/* Question Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depends On Question
                </label>
                <Select
                  value={dependsOnQuestionId}
                  onChange={(e) => {
                    setDependsOnQuestionId(e.target.value);
                    setValue(''); // Reset value when question changes
                  }}
                  options={[
                    { value: '', label: 'Select a question' },
                    ...availableQuestions.map((q) => ({
                      value: q.id,
                      label: `Q${q.order}: ${q.questionText.substring(0, 50)}${
                        q.questionText.length > 50 ? '...' : ''
                      }`,
                    })),
                  ]}
                  fullWidth
                />
              </div>

              {/* Operator Selection */}
              {dependsOnQuestionId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <Select
                    value={operator}
                    onChange={(e) =>
                      setOperator(e.target.value as ConditionalLogic['showWhen']['operator'])
                    }
                    options={getOperatorOptions()}
                    fullWidth
                  />
                </div>
              )}

              {/* Value Input */}
              {dependsOnQuestionId && operator && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                  {renderValueInput()}
                </div>
              )}

              {/* Preview */}
              {dependsOnQuestionId && operator && value && selectedQuestion && (
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-brand-900 mb-1">Rule Preview:</p>
                  <p className="text-sm text-brand-700">
                    This question will be shown when{' '}
                    <span className="font-semibold">
                      "{selectedQuestion.questionText.substring(0, 40)}
                      {selectedQuestion.questionText.length > 40 ? '...' : ''}"
                    </span>{' '}
                    {operator.toLowerCase().replace(/_/g, ' ')}{' '}
                    <span className="font-semibold">"{value}"</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Example Use Cases */}
      {!enabled && availableQuestions.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-2">Example Use Cases:</h5>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Show follow-up questions only if initial answer is "Yes"</li>
            <li>Display different questions based on numeric ratings</li>
            <li>Skip sections that aren't relevant based on previous answers</li>
            <li>Create branching survey paths for different respondent types</li>
          </ul>
        </div>
      )}
    </div>
  );
}
