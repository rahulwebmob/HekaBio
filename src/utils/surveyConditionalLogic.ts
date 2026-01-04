/**
 * Survey Conditional Logic Utilities
 * Helper functions for evaluating conditional display rules
 */

import type {
  SurveyQuestion,
  SurveyResponse,
  ConditionalLogic,
} from '../types/survey.types';

/**
 * Evaluate if a question should be shown based on conditional logic
 */
export const shouldShowQuestion = (
  question: SurveyQuestion,
  responses: SurveyResponse[]
): boolean => {
  // If no conditional logic, always show
  if (!question.conditionalLogic) {
    return true;
  }

  const { dependsOnQuestionId, showWhen } = question.conditionalLogic;

  // Find the response to the question this depends on
  const dependentResponse = responses.find((r) => r.questionId === dependsOnQuestionId);

  // If the dependent question hasn't been answered yet, hide this question
  if (!dependentResponse) {
    return false;
  }

  // Get the actual answer value
  const answerValue = getResponseValue(dependentResponse);

  // If no answer provided, hide the question
  if (answerValue === null || answerValue === undefined || answerValue === '') {
    return false;
  }

  // Evaluate the condition
  return evaluateCondition(answerValue, showWhen.operator, showWhen.value);
};

/**
 * Extract the answer value from a response
 */
const getResponseValue = (
  response: SurveyResponse
): string | number | string[] | null => {
  if (response.textAnswer !== undefined && response.textAnswer !== null) {
    return response.textAnswer;
  }
  if (response.numberAnswer !== undefined && response.numberAnswer !== null) {
    return response.numberAnswer;
  }
  if (response.choiceAnswers && response.choiceAnswers.length > 0) {
    return response.choiceAnswers;
  }
  if (response.dateAnswer) {
    return response.dateAnswer;
  }
  return null;
};

/**
 * Evaluate a condition
 */
const evaluateCondition = (
  actualValue: string | number | string[],
  operator: ConditionalLogic['showWhen']['operator'],
  expectedValue: string | number
): boolean => {
  // Handle array values (multiple choice)
  if (Array.isArray(actualValue)) {
    const expectedStr = String(expectedValue);
    switch (operator) {
      case 'EQUALS':
        return actualValue.length === 1 && actualValue[0] === expectedStr;
      case 'NOT_EQUALS':
        return !(actualValue.length === 1 && actualValue[0] === expectedStr);
      case 'CONTAINS':
        return actualValue.includes(expectedStr);
      default:
        return false;
    }
  }

  // Handle numeric comparisons
  if (typeof actualValue === 'number' && typeof expectedValue === 'number') {
    switch (operator) {
      case 'EQUALS':
        return actualValue === expectedValue;
      case 'NOT_EQUALS':
        return actualValue !== expectedValue;
      case 'GREATER_THAN':
        return actualValue > expectedValue;
      case 'LESS_THAN':
        return actualValue < expectedValue;
      default:
        return false;
    }
  }

  // Handle string comparisons
  const actualStr = String(actualValue);
  const expectedStr = String(expectedValue);

  switch (operator) {
    case 'EQUALS':
      return actualStr === expectedStr;
    case 'NOT_EQUALS':
      return actualStr !== expectedStr;
    case 'CONTAINS':
      return actualStr.toLowerCase().includes(expectedStr.toLowerCase());
    case 'GREATER_THAN': {
      // Try numeric comparison if both can be parsed as numbers
      const actualNum = parseFloat(actualStr);
      const expectedNum = parseFloat(expectedStr);
      if (!isNaN(actualNum) && !isNaN(expectedNum)) {
        return actualNum > expectedNum;
      }
      return actualStr > expectedStr; // Lexicographic comparison
    }
    case 'LESS_THAN': {
      const actualNum2 = parseFloat(actualStr);
      const expectedNum2 = parseFloat(expectedStr);
      if (!isNaN(actualNum2) && !isNaN(expectedNum2)) {
        return actualNum2 < expectedNum2;
      }
      return actualStr < expectedStr; // Lexicographic comparison
    }
    default:
      return false;
  }
};

/**
 * Get all questions that should be shown based on current responses
 */
export const getVisibleQuestions = (
  questions: SurveyQuestion[],
  responses: SurveyResponse[]
): SurveyQuestion[] => {
  return questions.filter((question) => shouldShowQuestion(question, responses));
};

/**
 * Get questions that are hidden by conditional logic
 */
export const getHiddenQuestions = (
  questions: SurveyQuestion[],
  responses: SurveyResponse[]
): SurveyQuestion[] => {
  return questions.filter((question) => !shouldShowQuestion(question, responses));
};

/**
 * Check if all required visible questions have been answered
 */
export const areRequiredQuestionsAnswered = (
  questions: SurveyQuestion[],
  responses: SurveyResponse[]
): boolean => {
  const visibleQuestions = getVisibleQuestions(questions, responses);
  const requiredQuestions = visibleQuestions.filter((q) => q.isRequired);

  return requiredQuestions.every((question) =>
    responses.some(
      (response) =>
        response.questionId === question.id &&
        !response.skipped &&
        getResponseValue(response) !== null
    )
  );
};

/**
 * Calculate completion percentage based on visible questions
 */
export const calculateCompletionPercentage = (
  questions: SurveyQuestion[],
  responses: SurveyResponse[]
): number => {
  const visibleQuestions = getVisibleQuestions(questions, responses);

  if (visibleQuestions.length === 0) {
    return 0;
  }

  const answeredCount = visibleQuestions.filter((question) =>
    responses.some(
      (response) =>
        response.questionId === question.id &&
        !response.skipped &&
        getResponseValue(response) !== null
    )
  ).length;

  return Math.round((answeredCount / visibleQuestions.length) * 100);
};

/**
 * Validate that conditional logic doesn't create circular dependencies
 */
export const validateConditionalLogic = (
  questions: SurveyQuestion[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  questions.forEach((question) => {
    if (!question.conditionalLogic) return;

    const { dependsOnQuestionId } = question.conditionalLogic;
    const dependentQuestion = questions.find((q) => q.id === dependsOnQuestionId);

    // Check if dependent question exists
    if (!dependentQuestion) {
      errors.push(
        `Question "${question.questionText}" depends on a non-existent question`
      );
      return;
    }

    // Check if dependent question comes after current question
    if (dependentQuestion.order >= question.order) {
      errors.push(
        `Question "${question.questionText}" depends on a later question. Conditional logic can only reference previous questions.`
      );
    }

    // Check for circular dependencies (simplified check)
    if (dependentQuestion.conditionalLogic?.dependsOnQuestionId === question.id) {
      errors.push(
        `Circular dependency detected between "${question.questionText}" and "${dependentQuestion.questionText}"`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
