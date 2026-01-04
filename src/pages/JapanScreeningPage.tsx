/**
 * Japan Screening Workspace Page
 * Comprehensive Japan market assessment workspace
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconArrowLeft,
  IconCheck,
  IconSparkles,
  IconLoader,
  IconDeviceFloppy,
  IconEye,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import { analyzeJapanMarketFit } from '../services/japanMarketAnalysis.service';
import { JAPAN_SCREENING_SECTIONS } from '../types/japanScreening.types';
import type { JapanMarketAnalysis } from '../types/japanScreening.types';

export default function JapanScreeningPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = useAppSelector((state) =>
    state.projects.projects.find((p) => p.id === projectId)
  );

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JapanMarketAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found</p>
          <Button variant="primary" onClick={() => navigate('/projects')} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </AppLayout>
    );
  }

  const activeSection = JAPAN_SCREENING_SECTIONS[activeSectionIndex];
  const completedSections = Object.keys(sectionContent).filter(
    (key) => sectionContent[key]?.trim().length > 0
  ).length;
  const completionPercentage = Math.round(
    (completedSections / JAPAN_SCREENING_SECTIONS.length) * 100
  );

  const handleSectionChange = (content: string) => {
    setSectionContent((prev) => ({
      ...prev,
      [activeSection.id]: content,
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(`japan-screening-${projectId}`, JSON.stringify(sectionContent));
    alert('Draft saved successfully');
  };

  const handleRunAnalysis = async () => {
    if (!project) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeJapanMarketFit(project);
      setAnalysis(result);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to run analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFitScoreColor = (score: number): string => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-brand-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-error-600';
  };

  const getFitScoreBg = (score: number): string => {
    if (score >= 80) return 'bg-success-50 border-success-200';
    if (score >= 60) return 'bg-brand-50 border-brand-200';
    if (score >= 40) return 'bg-warning-50 border-warning-200';
    return 'bg-error-50 border-error-200';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <IconArrowLeft size={16} />
            <span>Back to Project</span>
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
                🇯🇵 Japan Market Screening
              </h1>
              <p className="text-lg text-gray-600 mt-1">{project.name}</p>
              <p className="text-sm text-gray-500">{project.company.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                leftIcon={<IconDeviceFloppy size={18} />}
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                leftIcon={
                  isAnalyzing ? (
                    <IconLoader size={18} className="animate-spin" />
                  ) : (
                    <IconSparkles size={18} />
                  )
                }
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || completedSections < 3}
              >
                {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card padding="md" shadow="sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Screening Progress</span>
            <span className="text-lg font-bold text-brand-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-brand-500 h-3 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {completedSections} of {JAPAN_SCREENING_SECTIONS.length} sections completed
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigator */}
          <div className="lg:col-span-1">
            <Card padding="md" shadow="sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Assessment Sections</h3>
              <nav className="space-y-1">
                {JAPAN_SCREENING_SECTIONS.map((section, index) => {
                  const isCompleted = sectionContent[section.id]?.trim().length > 0;
                  const isActive = index === activeSectionIndex;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionIndex(index)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-500'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">
                          {isCompleted ? (
                            <IconCheck size={14} className="text-success-600" />
                          ) : (
                            <span className="text-gray-600">{index + 1}</span>
                          )}
                        </span>
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {analysis && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <IconEye size={16} />
                      AI Analysis
                    </span>
                    <Badge variant="success" size="sm">
                      Ready
                    </Badge>
                  </button>
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!showAnalysis ? (
              <Card padding="lg" shadow="sm">
                <div className="space-y-6">
                  {/* Section Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-sm font-semibold text-brand-600">
                        {activeSectionIndex + 1}
                      </span>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {activeSection.title}
                      </h2>
                    </div>
                    <p className="text-gray-600">{activeSection.description}</p>
                  </div>

                  {/* Key Fields Reference */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      Key Topics to Address:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {activeSection.fields.map((field, idx) => (
                        <li key={idx}>• {field}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Content
                    </label>
                    <textarea
                      value={sectionContent[activeSection.id] || ''}
                      onChange={(e) => handleSectionChange(e.target.value)}
                      placeholder={`Enter your analysis for ${activeSection.title.toLowerCase()}...`}
                      rows={16}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {sectionContent[activeSection.id]?.length || 0} characters
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
                      disabled={activeSectionIndex === 0}
                    >
                      Previous Section
                    </Button>

                    {activeSectionIndex < JAPAN_SCREENING_SECTIONS.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={() =>
                          setActiveSectionIndex(
                            Math.min(JAPAN_SCREENING_SECTIONS.length - 1, activeSectionIndex + 1)
                          )
                        }
                      >
                        Next Section
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        leftIcon={<IconSparkles size={18} />}
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing || completedSections < 3}
                      >
                        Complete & Analyze
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card padding="lg" shadow="sm">
                <div className="space-y-6">
                  {/* Analysis Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                      <IconSparkles size={28} className="text-brand-600" />
                      AI Market Analysis Results
                    </h2>
                    <Button variant="outline" onClick={() => setShowAnalysis(false)}>
                      Back to Editing
                    </Button>
                  </div>

                  {analysis && (
                    <>
                      {/* Overall Scores */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                          className={`p-4 border rounded-lg ${getFitScoreBg(analysis.aiInsights.marketAttractiveness)}`}
                        >
                          <p className="text-xs text-gray-600 mb-1">Market Attractiveness</p>
                          <p
                            className={`text-2xl font-bold ${getFitScoreColor(analysis.aiInsights.marketAttractiveness)}`}
                          >
                            {analysis.aiInsights.marketAttractiveness.toFixed(0)}
                          </p>
                        </div>
                        <div
                          className={`p-4 border rounded-lg ${getFitScoreBg(analysis.aiInsights.competitivePosition)}`}
                        >
                          <p className="text-xs text-gray-600 mb-1">Competitive Position</p>
                          <p
                            className={`text-2xl font-bold ${getFitScoreColor(analysis.aiInsights.competitivePosition)}`}
                          >
                            {analysis.aiInsights.competitivePosition.toFixed(0)}
                          </p>
                        </div>
                        <div
                          className={`p-4 border rounded-lg ${getFitScoreBg(100 - analysis.aiInsights.regulatoryComplexity)}`}
                        >
                          <p className="text-xs text-gray-600 mb-1">Regulatory Clarity</p>
                          <p
                            className={`text-2xl font-bold ${getFitScoreColor(100 - analysis.aiInsights.regulatoryComplexity)}`}
                          >
                            {(100 - analysis.aiInsights.regulatoryComplexity).toFixed(0)}
                          </p>
                        </div>
                        <div
                          className={`p-4 border rounded-lg ${getFitScoreBg(analysis.aiInsights.strategicFit)}`}
                        >
                          <p className="text-xs text-gray-600 mb-1">Strategic Fit</p>
                          <p
                            className={`text-2xl font-bold ${getFitScoreColor(analysis.aiInsights.strategicFit)}`}
                          >
                            {analysis.aiInsights.strategicFit.toFixed(0)}
                          </p>
                        </div>
                      </div>

                      {/* Overall Recommendation */}
                      <div className="bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-brand-900 mb-2">
                          Overall Recommendation
                        </h3>
                        <p className="text-gray-800 leading-relaxed">
                          {analysis.aiInsights.overallRecommendation}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <Badge variant="success" size="sm">
                            {analysis.aiInsights.confidence.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>

                      {/* Market Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Market Size</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Prevalence:</span>
                              <p className="font-medium text-gray-900">{analysis.prevalence}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Incidence:</span>
                              <p className="font-medium text-gray-900">{analysis.incidence}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Market Size:</span>
                              <p className="font-medium text-gray-900">
                                {analysis.marketSizeEstimate}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Regulatory</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Pathway:</span>
                              <p className="font-medium text-gray-900">
                                {analysis.regulatoryPathway}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Timeline:</span>
                              <p className="font-medium text-gray-900">
                                {analysis.approvalTimeline}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Pricing:</span>
                              <p className="font-medium text-gray-900">
                                {analysis.pricingReimbursement}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Success Factors & Risks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-success-900 mb-3">
                            Key Success Factors
                          </h4>
                          <ul className="text-sm text-success-800 space-y-1">
                            {analysis.keySuccess.map((factor, idx) => (
                              <li key={idx}>• {factor}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-error-900 mb-3">Key Risks</h4>
                          <ul className="text-sm text-error-800 space-y-1">
                            {analysis.keyRisks.map((risk, idx) => (
                              <li key={idx}>• {risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
