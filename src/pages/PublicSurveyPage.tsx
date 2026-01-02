/**
 * Public Survey Page
 * Public form for companies to fill out surveys (no authentication required)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconCheck,
  IconUpload,
  IconFileText,
  IconAlertCircle,
  IconSend,
  IconChevronRight,
  IconChevronLeft,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { updateSurveyResponse } from '../store/slices/surveysSlice';
import { Button, Card, Input, Select, Badge } from '../components/ui';
import type { SurveyQuestion, SurveyResponse } from '../types/survey.types';

export default function PublicSurveyPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get survey instance from store
  const surveyInstance = useAppSelector((state) =>
    state.surveys.instances.find((s) => s.id === surveyId)
  );

  // State - Load draft from localStorage on mount using lazy initializer
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>(() => {
    if (surveyId) {
      const draft = localStorage.getItem(`survey-draft-${surveyId}`);
      if (draft) {
        try {
          return JSON.parse(draft);
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
    return {};
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save to localStorage whenever responses change
  useEffect(() => {
    if (surveyId && Object.keys(responses).length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`survey-draft-${surveyId}`, JSON.stringify(responses));
      }, 500); // Debounce 500ms
      return () => clearTimeout(timeoutId);
    }
  }, [surveyId, responses]);

  if (!surveyInstance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-4">
        <Card padding="lg" shadow="lg" className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconAlertCircle size={32} className="text-error-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Survey Not Found</h2>
          <p className="text-gray-600 mb-6">
            The survey link you're trying to access doesn't exist or has expired.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  // Already submitted
  if (isSubmitted || surveyInstance.status === 'SUBMITTED' || surveyInstance.status === 'REVIEWED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-4">
        <Card padding="lg" shadow="lg" className="max-w-2xl w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconCheck size={48} className="text-success-600" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Thank You for Your Submission!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your survey has been successfully submitted to <strong>{surveyInstance.company.name}</strong>.
            </p>
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-brand-900 mb-3">What happens next?</h3>
              <ul className="text-sm text-brand-800 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Our team will review your responses within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>You'll receive an acknowledgment email shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>We may reach out for clarification or additional information</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              Survey ID: <span className="font-mono text-brand-600">{surveyInstance.id}</span>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const { template } = surveyInstance;
  const sections = template.sections.sort((a, b) => a.order - b.order);
  const currentSection = sections[currentSectionIndex];

  // Calculate completion percentage
  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
  const answeredQuestions = Object.keys(responses).filter(
    (key) => responses[key] !== undefined && responses[key] !== '' && responses[key] !== null
  ).length;
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  // Validate current section
  const validateSection = (): boolean => {
    const newErrors: Record<string, string> = {};

    currentSection.questions.forEach((question) => {
      if (question.isRequired && !responses[question.id]) {
        newErrors[question.id] = 'This field is required';
      }

      // Custom validation
      if (responses[question.id] && question.validation) {
        const value = responses[question.id];
        const { validation } = question;
        const valueStr = String(value || '');

        if (validation.minLength && valueStr.length < validation.minLength) {
          newErrors[question.id] = validation.errorMessage || `Minimum ${validation.minLength} characters required`;
        }
        if (validation.maxLength && valueStr.length > validation.maxLength) {
          newErrors[question.id] = validation.errorMessage || `Maximum ${validation.maxLength} characters allowed`;
        }
        if (validation.minValue && Number(value) < validation.minValue) {
          newErrors[question.id] = validation.errorMessage || `Minimum value is ${validation.minValue}`;
        }
        if (validation.maxValue && Number(value) > validation.maxValue) {
          newErrors[question.id] = validation.errorMessage || `Maximum value is ${validation.maxValue}`;
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(valueStr)) {
          newErrors[question.id] = validation.errorMessage || 'Invalid format';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // TODO: Upload to backend and extract data with AI
    }
  };

  const handleSubmit = () => {
    if (!validateSection()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend
    // For now, just update Redux store
    setTimeout(() => {
      dispatch(
        updateSurveyResponse({
          surveyId: surveyInstance.id,
          responses: Object.entries(responses).map(([questionId, answer]) => {
            const question = sections
              .flatMap((s) => s.questions)
              .find((q) => q.id === questionId);

            const response: SurveyResponse = {
              id: `response-${questionId}-${Date.now()}`,
              surveyInstanceId: surveyInstance.id,
              questionId,
              question: question!,
              textAnswer: typeof answer === 'string' ? answer : undefined,
              numberAnswer: typeof answer === 'number' ? answer : undefined,
              choiceAnswers: Array.isArray(answer) ? answer : undefined,
              answeredAt: new Date().toISOString(),
              skipped: false,
            };

            return response;
          }),
          status: 'SUBMITTED',
          completionPercentage,
        })
      );

      // Clear localStorage draft
      localStorage.removeItem(`survey-draft-${surveyId}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const renderQuestion = (question: SurveyQuestion) => {
    const value = responses[question.id];
    const error = errors[question.id];

    const handleChange = (newValue: unknown) => {
      setResponses({ ...responses, [question.id]: newValue });
      // Clear error when user starts typing
      if (errors[question.id]) {
        setErrors({ ...errors, [question.id]: '' });
      }
    };

    // Convert value to string safely
    const valueStr = value != null && typeof value !== 'object' ? String(value) : '';

    switch (question.type) {
      case 'TEXT':
        return (
          <Input
            value={valueStr}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.helpText}
            error={error}
            fullWidth
          />
        );

      case 'TEXTAREA':
        return (
          <div>
            <textarea
              value={valueStr}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={question.helpText}
              rows={5}
              className={`
                w-full px-4 py-3 rounded-lg border transition-all
                ${error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300 focus:ring-brand-500'}
                focus:outline-none focus:ring-2
                placeholder:text-gray-400
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
            {error && <p className="text-sm text-error-600 mt-1">{error}</p>}
          </div>
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            value={valueStr}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={question.helpText}
            error={error}
            fullWidth
          />
        );

      case 'SINGLE_CHOICE':
        return (
          <div>
            <Select
              options={[
                { value: '', label: 'Select an option...' },
                ...(question.options?.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                })) || []),
              ]}
              value={valueStr}
              onChange={(e) => handleChange(e.target.value)}
              error={error}
              fullWidth
            />
          </div>
        );

      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v) => v !== option.value);
                    handleChange(newValues);
                  }}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
            {error && <p className="text-sm text-error-600 mt-1">{error}</p>}
          </div>
        );

      case 'RATING':
        return (
          <div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleChange(rating)}
                  className={`
                    w-12 h-12 rounded-lg font-semibold transition-all
                    ${
                      value === rating
                        ? 'bg-brand-500 text-white scale-110'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {rating}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-error-600 mt-1">{error}</p>}
          </div>
        );

      case 'DATE':
        return (
          <Input
            type="date"
            value={valueStr}
            onChange={(e) => handleChange(e.target.value)}
            error={error}
            fullWidth
          />
        );

      case 'FILE_UPLOAD':
        return (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-400 transition-colors">
              <input
                type="file"
                id={`file-${question.id}`}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleChange(file.name);
                    // TODO: Upload file to backend
                  }
                }}
                className="hidden"
              />
              <label htmlFor={`file-${question.id}`} className="cursor-pointer">
                <IconUpload size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-medium">
                  {valueStr || 'Click to upload file'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{question.helpText}</p>
              </label>
            </div>
            {error && <p className="text-sm text-error-600 mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/40 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{template.name}</h1>
              <p className="text-sm text-gray-600">For {surveyInstance.company.name}</p>
            </div>
            <Badge variant="info" size="lg">
              {completionPercentage}% Complete
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction Deck Upload (shown on first section only) */}
        {currentSectionIndex === 0 && (
          <Card padding="lg" shadow="sm" className="mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconFileText size={24} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload Introduction Deck (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your company's introduction deck and our AI will automatically extract
                  relevant information to help you fill this survey faster.
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-400 transition-colors">
                  <input
                    type="file"
                    id="deck-upload"
                    accept=".pdf,.ppt,.pptx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="deck-upload" className="cursor-pointer">
                    <IconUpload size={32} className="text-gray-400 mx-auto mb-2" />
                    {uploadedFile ? (
                      <div>
                        <p className="text-sm text-success-600 font-medium mb-1">
                          File uploaded: {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          AI extraction in progress... (Feature coming soon)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          Click to upload deck (PDF, PPT, PPTX)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Our AI will help pre-fill answers
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Current Section */}
        <Card padding="lg" shadow="md">
          {/* Section Header */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="default">
                Section {currentSectionIndex + 1} of {sections.length}
              </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {currentSection.title}
            </h2>
            {currentSection.description && (
              <p className="text-gray-600">{currentSection.description}</p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentSection.questions
              .sort((a, b) => a.order - b.order)
              .map((question, index) => (
                <div key={question.id} className="pb-6 border-b border-gray-100 last:border-0">
                  <label className="block mb-3">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Q{index + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-base font-medium text-gray-900">
                          {question.questionText}
                        </span>
                        {question.isRequired && (
                          <span className="text-error-500 ml-1">*</span>
                        )}
                        {question.helpText && (
                          <p className="text-sm text-gray-500 mt-1">{question.helpText}</p>
                        )}
                      </div>
                    </div>
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              leftIcon={<IconChevronLeft size={18} />}
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
            >
              Previous
            </Button>

            {currentSectionIndex < sections.length - 1 ? (
              <Button
                variant="primary"
                rightIcon={<IconChevronRight size={18} />}
                onClick={handleNext}
              >
                Next Section
              </Button>
            ) : (
              <Button
                variant="primary"
                leftIcon={<IconSend size={18} />}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </Button>
            )}
          </div>
        </Card>

        {/* Auto-save indicator */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your progress is automatically saved
        </p>
      </div>
    </div>
  );
}
