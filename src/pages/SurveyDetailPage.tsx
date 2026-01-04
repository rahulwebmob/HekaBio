/**
 * Survey Detail Page
 * View survey instance details and responses
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconFileText,
  IconArrowLeft,
  IconBuilding,
  IconFlask,
  IconTrash,
  IconSend,
  IconDownload,
  IconMessageCircle,
  IconChartBar,
  IconPlus,
  IconSparkles,
  IconLoader,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { deleteSurveyInstance } from '../store/slices/surveysSlice';
import { addProject } from '../store/slices/projectsSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge, Modal } from '../components/ui';
import { ExtractionResultsModal, GapAnalysisReport } from '../components/features';
import { extractDataFromDeck, type ExtractedField } from '../services/aiExtraction.service';
import type { SubmissionStatus } from '../types/survey.types';
import type { Project } from '../types/project.types';

export default function SurveyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const survey = useAppSelector((state) => state.surveys.instances.find((s) => s.id === id));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'analytics'>('overview');

  // AI Extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResults, setExtractionResults] = useState<ExtractedField[]>([]);
  const [extractionTime, setExtractionTime] = useState<number>(0);
  const [showExtractionModal, setShowExtractionModal] = useState(false);

  if (!survey) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconFileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Survey not found</h3>
          <p className="text-gray-600 mb-6">
            The survey you're looking for doesn't exist or has been deleted.
          </p>
          <Button variant="primary" onClick={() => navigate('/surveys')}>
            Back to Surveys
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    dispatch(deleteSurveyInstance(survey.id));
    navigate('/surveys');
  };

  const handleResend = () => {
    // TODO: Implement resend logic
    console.log('Resend survey:', survey.id);
  };

  const handleExportCSV = () => {
    if (!survey.responses || survey.responses.length === 0) {
      alert('No responses to export');
      return;
    }

    // Create CSV content
    const headers = ['Section', 'Question', 'Answer', 'Answered At'];
    const rows = survey.responses.map((response) => {
      const section = survey.template.sections.find((s) =>
        s.questions.some((q) => q.id === response.questionId)
      );

      let answer = '';
      if (response.textAnswer) answer = response.textAnswer;
      else if (response.numberAnswer !== undefined) answer = String(response.numberAnswer);
      else if (response.dateAnswer) answer = response.dateAnswer;
      else if (response.choiceAnswers) answer = response.choiceAnswers.join(', ');
      else if (response.fileUrls) answer = response.fileUrls.join(', ');

      return [
        section?.title || 'Unknown',
        response.question.questionText,
        answer,
        new Date(response.answeredAt).toLocaleString(),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `survey-${survey.id}-responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProject = () => {
    if (!survey.project) {
      // Create a new project from this survey
      const now = new Date().toISOString();

      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: `${survey.company.name} - ${survey.template.name}`,
        company: survey.company,
        tags: ['Strategic Portfolio'], // Default tag
        currentStage: 'LOBBY',
        score: 0,
        scoreBreakdown: {
          clinicalEvidence: 0,
          ipStatus: 0,
          marketTraction: 0,
          strategicFit: 0,
          regulatoryClarity: 0,
          financialHealth: 0,
          total: 0,
        },
        japanInterest: false,
        japanMarketFit: 'NOT_ASSESSED',
        japanSummary: '',
        ndaStatus: 'NOT_REQUIRED',
        ddProgress: 0,
        isHot: false,
        isDiamond: false,
        isStalled: false,
        partnerTags: [],
        stageHistory: [],
        createdAt: now,
        updatedAt: now,
        createdBy: 'user-001',
      };

      dispatch(addProject(newProject));
      navigate(`/projects/${newProject.id}`);
    } else {
      navigate(`/projects/${survey.project.id}`);
    }
  };

  const handleExtractData = async () => {
    // Check if there are uploaded files
    const fileResponse = survey.responses?.find((r) => r.fileUrls && r.fileUrls.length > 0);
    if (!fileResponse || !fileResponse.fileUrls) {
      alert('No introduction deck found to extract from');
      return;
    }

    setIsExtracting(true);

    try {
      // Create a mock file object for extraction
      const mockFile = new File([''], fileResponse.fileUrls[0], { type: 'application/pdf' });

      // Extract data using AI service
      const result = await extractDataFromDeck(mockFile);

      if (result.status === 'completed') {
        setExtractionResults(result.fields);
        setExtractionTime(result.processingTime || 0);
        setShowExtractionModal(true);
      } else {
        alert('Extraction failed. Please try again.');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      alert('An error occurred during extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApproveExtraction = (approvedData: Record<string, string>) => {
    console.log('Approved extracted data:', approvedData);
    // TODO: Apply extracted data to project
    // For now, just show a success message
    alert(
      `Successfully extracted ${Object.keys(approvedData).length} fields. Data can now be used to enrich the project.`
    );
  };

  // Check if survey has uploaded files
  const hasUploadedFiles = survey.responses?.some((r) => r.fileUrls && r.fileUrls.length > 0);

  const getStatusBadge = (status: SubmissionStatus) => {
    const variants = {
      NOT_STARTED: 'default' as const,
      IN_PROGRESS: 'warning' as const,
      SUBMITTED: 'info' as const,
      REVIEWED: 'success' as const,
    };

    const labels = {
      NOT_STARTED: 'Not Started',
      IN_PROGRESS: 'In Progress',
      SUBMITTED: 'Submitted',
      REVIEWED: 'Reviewed',
    };

    return (
      <Badge variant={variants[status]} size="md">
        {labels[status]}
      </Badge>
    );
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'text-success-600';
    if (percentage >= 70) return 'text-brand-600';
    if (percentage >= 40) return 'text-warning-600';
    return 'text-gray-600';
  };

  const isDueSoon = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (dueDate?: string, status?: SubmissionStatus) => {
    if (!dueDate || status === 'SUBMITTED' || status === 'REVIEWED') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/surveys')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IconArrowLeft size={16} />
          <span>Back to Surveys</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{survey.template.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{survey.company.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {hasUploadedFiles && (
              <Button
                variant="primary"
                leftIcon={
                  isExtracting ? (
                    <IconLoader size={18} className="animate-spin" />
                  ) : (
                    <IconSparkles size={18} />
                  )
                }
                onClick={handleExtractData}
                disabled={isExtracting}
              >
                {isExtracting ? 'Extracting...' : 'Extract Data with AI'}
              </Button>
            )}
            {survey.responses && survey.responses.length > 0 && (
              <Button
                variant="outline"
                leftIcon={<IconDownload size={18} />}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
            )}
            {survey.status !== 'REVIEWED' && (
              <Button variant="outline" leftIcon={<IconSend size={18} />} onClick={handleResend}>
                Resend
              </Button>
            )}
            <Button
              variant="danger"
              leftIcon={<IconTrash size={18} />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          {getStatusBadge(survey.status)}
          {survey.dueDate && isOverdue(survey.dueDate, survey.status) && (
            <Badge variant="error" size="md">
              Overdue
            </Badge>
          )}
          {survey.dueDate &&
            isDueSoon(survey.dueDate) &&
            !isOverdue(survey.dueDate, survey.status) && (
              <Badge variant="warning" size="md">
                Due Soon
              </Badge>
            )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'overview'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconFileText size={18} />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'responses'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconMessageCircle size={18} />
                <span>Responses</span>
                {survey.responses && survey.responses.length > 0 && (
                  <Badge variant="info" size="sm">
                    {survey.responses.length}
                  </Badge>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'analytics'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <IconChartBar size={18} />
                <span>Analytics</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Survey Overview */}
                <Card
                  padding="lg"
                  shadow="sm"
                  header={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <IconFileText size={20} className="text-brand-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Survey Details</h2>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Template</p>
                      <p className="text-base font-semibold text-gray-900">
                        {survey.template.name}
                      </p>
                      <p className="text-sm text-gray-600">{survey.template.type}</p>
                    </div>

                    {survey.template.description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Description</p>
                        <p className="text-base text-gray-700">{survey.template.description}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Completion Progress</p>
                        <span
                          className={`text-lg font-bold ${getCompletionColor(survey.completionPercentage)}`}
                        >
                          {survey.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-brand-500 h-3 rounded-full transition-all"
                          style={{ width: `${survey.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Sections</p>
                        <p className="text-base font-semibold text-gray-900">
                          {survey.template.sections.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                        <p className="text-base font-semibold text-gray-900">
                          {survey.template.sections.reduce(
                            (sum, section) => sum + section.questions.length,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Sections Overview */}
                <Card
                  padding="lg"
                  shadow="sm"
                  header={
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <IconFileText size={20} className="text-brand-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Survey Sections ({survey.template.sections.length})
                      </h2>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {survey.template.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="p-4 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-brand-600">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                              {section.title}
                            </h3>
                            {section.description && (
                              <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {section.questions.length} question
                              {section.questions.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Gap Analysis */}
                {survey.status === 'SUBMITTED' && <GapAnalysisReport surveyInstance={survey} />}

                {/* Review Notes */}
                {survey.reviewNotes && (
                  <Card
                    padding="lg"
                    shadow="sm"
                    header={<h2 className="text-xl font-semibold text-gray-900">Review Notes</h2>}
                  >
                    <p className="text-gray-700 leading-relaxed">{survey.reviewNotes}</p>
                    {survey.reviewedAt && (
                      <p className="text-xs text-gray-500 mt-4">
                        Reviewed on {new Date(survey.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </Card>
                )}
              </>
            )}

            {/* RESPONSES TAB */}
            {activeTab === 'responses' && (
              <>
                {survey.responses && survey.responses.length > 0 ? (
                  survey.template.sections.map((section) => {
                    const sectionResponses = survey.responses.filter((r) =>
                      section.questions.some((q) => q.id === r.questionId)
                    );

                    if (sectionResponses.length === 0) return null;

                    return (
                      <Card key={section.id} padding="lg" shadow="sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="text-sm text-gray-600 mb-6">{section.description}</p>
                        )}
                        <div className="space-y-6">
                          {section.questions.map((question) => {
                            const response = survey.responses.find(
                              (r) => r.questionId === question.id
                            );

                            if (!response) return null;

                            let answerDisplay = '';
                            if (response.textAnswer) {
                              answerDisplay = response.textAnswer;
                            } else if (response.numberAnswer !== undefined) {
                              answerDisplay = String(response.numberAnswer);
                            } else if (response.dateAnswer) {
                              answerDisplay = new Date(response.dateAnswer).toLocaleDateString();
                            } else if (response.choiceAnswers) {
                              const labels = response.choiceAnswers.map((value) => {
                                const option = question.options?.find((opt) => opt.value === value);
                                return option?.label || value;
                              });
                              answerDisplay = labels.join(', ');
                            } else if (response.fileUrls) {
                              answerDisplay = `${response.fileUrls.length} file(s) uploaded`;
                            } else if (response.skipped) {
                              answerDisplay = '(Skipped)';
                            }

                            return (
                              <div
                                key={question.id}
                                className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                              >
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                      {question.questionText}
                                      {question.isRequired && (
                                        <span className="text-error-500 ml-1">*</span>
                                      )}
                                    </p>
                                    {question.helpText && (
                                      <p className="text-xs text-gray-500 mb-2">
                                        {question.helpText}
                                      </p>
                                    )}
                                  </div>
                                  <Badge variant="default" size="sm">
                                    {question.type}
                                  </Badge>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <p className="text-gray-900 whitespace-pre-wrap">
                                    {answerDisplay || '(No answer)'}
                                  </p>
                                  {response.notes && (
                                    <p className="text-sm text-gray-600 mt-2 italic">
                                      Note: {response.notes}
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-2">
                                    Answered {new Date(response.answeredAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <Card padding="lg" shadow="sm">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconMessageCircle size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses yet</h3>
                      <p className="text-gray-600">This survey hasn't been filled out yet.</p>
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <>
                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card padding="md" shadow="sm">
                    <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                    <p
                      className={`text-3xl font-bold ${getCompletionColor(survey.completionPercentage)}`}
                    >
                      {survey.completionPercentage}%
                    </p>
                  </Card>
                  <Card padding="md" shadow="sm">
                    <p className="text-sm text-gray-600 mb-1">Questions Answered</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {survey.responses?.length || 0}
                      <span className="text-base text-gray-500 ml-1">
                        / {survey.template.sections.reduce((sum, s) => sum + s.questions.length, 0)}
                      </span>
                    </p>
                  </Card>
                  <Card padding="md" shadow="sm">
                    <p className="text-sm text-gray-600 mb-1">Time to Complete</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {survey.submittedAt && survey.startedAt
                        ? Math.round(
                            (new Date(survey.submittedAt).getTime() -
                              new Date(survey.startedAt).getTime()) /
                              (1000 * 60)
                          )
                        : '--'}
                      <span className="text-base text-gray-500 ml-1">min</span>
                    </p>
                  </Card>
                </div>

                {/* Section-by-Section Completion */}
                <Card padding="lg" shadow="sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Section Completion</h2>
                  <div className="space-y-4">
                    {survey.template.sections.map((section, idx) => {
                      const totalQuestions = section.questions.length;
                      const answeredQuestions =
                        survey.responses?.filter((r) =>
                          section.questions.some((q) => q.id === r.questionId)
                        ).length || 0;
                      const sectionPercentage = Math.round(
                        (answeredQuestions / totalQuestions) * 100
                      );

                      return (
                        <div key={section.id}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Section {idx + 1}: {section.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {answeredQuestions} / {totalQuestions} questions answered
                              </p>
                            </div>
                            <span
                              className={`text-sm font-bold ${getCompletionColor(sectionPercentage)}`}
                            >
                              {sectionPercentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-brand-500 h-2 rounded-full transition-all"
                              style={{ width: `${sectionPercentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Response Quality */}
                <Card padding="lg" shadow="sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Response Quality</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Required Questions</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-success-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  ((survey.responses?.filter((r) => r.question.isRequired).length ||
                                    0) /
                                    (survey.template.sections.reduce(
                                      (sum, s) =>
                                        sum + s.questions.filter((q) => q.isRequired).length,
                                      0
                                    ) || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {survey.responses?.filter((r) => r.question.isRequired).length || 0} /{' '}
                          {survey.template.sections.reduce(
                            (sum, s) => sum + s.questions.filter((q) => q.isRequired).length,
                            0
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Skipped Questions</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-warning-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  ((survey.responses?.filter((r) => r.skipped).length || 0) /
                                    (survey.template.sections.reduce(
                                      (sum, s) => sum + s.questions.length,
                                      0
                                    ) || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {survey.responses?.filter((r) => r.skipped).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Quick Info</h2>}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {getStatusBadge(survey.status)}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Completion</p>
                  <p
                    className={`text-2xl font-bold ${getCompletionColor(survey.completionPercentage)}`}
                  >
                    {survey.completionPercentage}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Company & Project */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Related</h2>}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <IconBuilding size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-600">Company</p>
                  </div>
                  <button
                    onClick={() => navigate(`/companies/${survey.company.id}`)}
                    className="text-base font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {survey.company.name}
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <IconFlask size={16} className="text-gray-400" />
                    <p className="text-sm text-gray-600">Project</p>
                  </div>
                  {survey.project ? (
                    <button
                      onClick={() => navigate(`/projects/${survey.project!.id}`)}
                      className="text-base font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {survey.project.name}
                    </button>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-3">No project linked to this survey</p>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<IconPlus size={16} />}
                        onClick={handleCreateProject}
                        fullWidth
                      >
                        Create Project
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Timeline</h2>}
            >
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Sent</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(survey.sentAt).toLocaleDateString()}
                  </p>
                </div>

                {survey.dueDate && (
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p
                      className={`font-medium ${
                        isOverdue(survey.dueDate, survey.status)
                          ? 'text-error-600'
                          : isDueSoon(survey.dueDate)
                            ? 'text-warning-600'
                            : 'text-gray-900'
                      }`}
                    >
                      {new Date(survey.dueDate).toLocaleDateString()}
                      {isOverdue(survey.dueDate, survey.status) && ' (Overdue)'}
                      {isDueSoon(survey.dueDate) &&
                        !isOverdue(survey.dueDate, survey.status) &&
                        ' (Soon)'}
                    </p>
                  </div>
                )}

                {survey.startedAt && (
                  <div>
                    <p className="text-gray-600">Started</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(survey.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {survey.submittedAt && (
                  <div>
                    <p className="text-gray-600">Submitted</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(survey.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {survey.reviewedAt && (
                  <div>
                    <p className="text-gray-600">Reviewed</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(survey.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card
              padding="lg"
              shadow="sm"
              header={<h2 className="text-lg font-semibold text-gray-900">Metadata</h2>}
            >
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Survey ID</p>
                  <p className="text-gray-900 font-mono text-xs">{survey.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Template Version</p>
                  <p className="text-gray-900 font-medium">{survey.template.version}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Survey"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Survey
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this survey instance for{' '}
            <strong>{survey.company.name}</strong>?
          </p>
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-800">
              <strong>Warning:</strong> This action cannot be undone. All responses and data will be
              permanently deleted.
            </p>
          </div>
        </div>
      </Modal>

      {/* AI Extraction Results Modal */}
      <ExtractionResultsModal
        isOpen={showExtractionModal}
        onClose={() => setShowExtractionModal(false)}
        extractedFields={extractionResults}
        processingTime={extractionTime}
        onApprove={handleApproveExtraction}
      />
    </AppLayout>
  );
}
