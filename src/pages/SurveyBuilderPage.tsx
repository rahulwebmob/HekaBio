/**
 * Survey Builder Page
 * Admin page to create and edit survey templates
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
  IconX,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { addTemplate, updateTemplate } from '../store/slices/surveysSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Input, Select, Badge } from '../components/ui';
import type {
  SurveyTemplate,
  SurveySection,
  SurveyQuestion,
  QuestionType,
  QuestionOption,
  SurveyType,
} from '../types/survey.types';

export default function SurveyBuilderPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const existingTemplate = useAppSelector((state) =>
    state.surveys.templates.find((t) => t.id === templateId)
  );

  const isEditMode = templateId !== 'new' && existingTemplate;

  // Form state
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateType, setTemplateType] = useState<SurveyType>('CUSTOM');
  const [sections, setSections] = useState<SurveySection[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Load existing template
  useEffect(() => {
    if (isEditMode && existingTemplate) {
      const timeoutId = setTimeout(() => {
        setTemplateName(existingTemplate.name);
        setTemplateDescription(existingTemplate.description || '');
        setTemplateType(existingTemplate.type);
        setSections(existingTemplate.sections);
        setExpandedSections(new Set(existingTemplate.sections.map((s) => s.id)));
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isEditMode, existingTemplate]);

  // Add new section
  const handleAddSection = () => {
    const newSection: SurveySection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      order: sections.length + 1,
      questions: [],
    };
    setSections([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, newSection.id]));
  };

  // Update section
  const handleUpdateSection = (sectionId: string, field: keyof SurveySection, value: string) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s)));
  };

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Add question to section
  const handleAddQuestion = (sectionId: string) => {
    const newQuestion: SurveyQuestion = {
      id: `question-${Date.now()}`,
      sectionId,
      questionText: 'New Question',
      helpText: '',
      type: 'TEXT',
      isRequired: false,
      order: sections.find((s) => s.id === sectionId)?.questions.length || 0 + 1,
    };

    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, questions: [...s.questions, newQuestion] } : s
      )
    );
  };

  // Update question
  const handleUpdateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<SurveyQuestion>
  ) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
            }
          : s
      )
    );
  };

  // Delete question
  const handleDeleteQuestion = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== questionId) } : s
      )
    );
  };

  // Add option to question (for choice questions)
  const handleAddOption = (sectionId: string, questionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const question = section?.questions.find((q) => q.id === questionId);
    const optionsCount = question?.options?.length || 0;

    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      label: `Option ${optionsCount + 1}`,
      value: `option-${optionsCount + 1}`,
      order: optionsCount + 1,
    };

    handleUpdateQuestion(sectionId, questionId, {
      options: [...(question?.options || []), newOption],
    });
  };

  // Update option
  const handleUpdateOption = (
    sectionId: string,
    questionId: string,
    optionId: string,
    field: 'label' | 'value',
    value: string
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    const question = section?.questions.find((q) => q.id === questionId);

    const updatedOptions = question?.options?.map((opt) =>
      opt.id === optionId ? { ...opt, [field]: value } : opt
    );

    handleUpdateQuestion(sectionId, questionId, { options: updatedOptions });
  };

  // Delete option
  const handleDeleteOption = (sectionId: string, questionId: string, optionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const question = section?.questions.find((q) => q.id === questionId);

    const updatedOptions = question?.options?.filter((opt) => opt.id !== optionId);

    handleUpdateQuestion(sectionId, questionId, { options: updatedOptions });
  };

  // Save template
  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (sections.length === 0) {
      alert('Please add at least one section');
      return;
    }

    const now = new Date().toISOString();

    const template: SurveyTemplate = {
      id: isEditMode ? existingTemplate.id : `template-${Date.now()}`,
      name: templateName,
      type: templateType,
      description: templateDescription,
      version: isEditMode ? existingTemplate.version : '1.0',
      isActive: isEditMode ? existingTemplate.isActive : true,
      sections: sections.map((section, idx) => ({
        ...section,
        order: idx + 1,
        questions: section.questions.map((question, qIdx) => ({
          ...question,
          order: qIdx + 1,
        })),
      })),
      createdAt: isEditMode ? existingTemplate.createdAt : now,
      updatedAt: now,
      createdBy: 'user-001', // TODO: Get from auth
    };

    if (isEditMode) {
      dispatch(updateTemplate(template));
    } else {
      dispatch(addTemplate(template));
    }

    navigate('/admin/survey-templates');
  };

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: 'TEXT', label: 'Short Text' },
    { value: 'TEXTAREA', label: 'Long Text' },
    { value: 'NUMBER', label: 'Number' },
    { value: 'SINGLE_CHOICE', label: 'Single Choice' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { value: 'RATING', label: 'Rating (1-5)' },
    { value: 'DATE', label: 'Date' },
    { value: 'FILE_UPLOAD', label: 'File Upload' },
  ];

  const surveyTypeOptions: { value: SurveyType; label: string }[] = [
    { value: 'SURVEY_1', label: 'Survey 1' },
    { value: 'SURVEY_2', label: 'Survey 2' },
    { value: 'SURVEY_3', label: 'Survey 3' },
    { value: 'JAPAN_ASSESSMENT', label: 'Japan Assessment' },
    { value: 'CUSTOM', label: 'Custom' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Survey Template' : 'Create Survey Template'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Modify your survey template' : 'Build a custom survey template'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/survey-templates')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<IconDeviceFloppy size={18} />}
              onClick={handleSave}
            >
              Save Template
            </Button>
          </div>
        </div>

        {/* Template Settings */}
        <Card padding="lg" shadow="sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Settings</h2>
          <div className="space-y-4">
            <Input
              label="Template Name *"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Initial Company Assessment"
              fullWidth
            />
            <Input
              label="Description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Brief description of this survey"
              fullWidth
            />
            <Select
              label="Survey Type *"
              options={surveyTypeOptions}
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value as SurveyType)}
              fullWidth
            />
          </div>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Sections ({sections.length})</h2>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={handleAddSection}
            >
              Add Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <Card padding="lg" shadow="sm">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No sections yet. Add your first section to start building the survey.
                </p>
                <Button
                  variant="primary"
                  leftIcon={<IconPlus size={18} />}
                  onClick={handleAddSection}
                >
                  Add First Section
                </Button>
              </div>
            </Card>
          ) : (
            sections.map((section) => (
              <Card key={section.id} padding="md" shadow="sm">
                {/* Section Header */}
                <div className="flex items-start gap-3 mb-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-move">
                    <IconGripVertical size={20} />
                  </button>
                  <div className="flex-1 space-y-3">
                    <Input
                      value={section.title}
                      onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                      placeholder="Section title"
                      fullWidth
                    />
                    <Input
                      value={section.description || ''}
                      onChange={(e) =>
                        handleUpdateSection(section.id, 'description', e.target.value)
                      }
                      placeholder="Section description (optional)"
                      fullWidth
                    />
                  </div>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    {expandedSections.has(section.id) ? (
                      <IconChevronUp size={20} />
                    ) : (
                      <IconChevronDown size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-2 text-error-600 hover:text-error-700"
                  >
                    <IconTrash size={20} />
                  </button>
                </div>

                {/* Questions */}
                {expandedSections.has(section.id) && (
                  <div className="ml-11 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">
                        Questions ({section.questions.length})
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<IconPlus size={16} />}
                        onClick={() => handleAddQuestion(section.id)}
                      >
                        Add Question
                      </Button>
                    </div>

                    {section.questions.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-sm text-gray-600 mb-2">No questions in this section</p>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<IconPlus size={16} />}
                          onClick={() => handleAddQuestion(section.id)}
                        >
                          Add Question
                        </Button>
                      </div>
                    ) : (
                      section.questions.map((question, qIdx) => (
                        <div
                          key={question.id}
                          className="p-4 bg-white border border-gray-200 rounded-lg space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            <Badge variant="default" size="sm">
                              Q{qIdx + 1}
                            </Badge>
                            <div className="flex-1 space-y-3">
                              <Input
                                value={question.questionText}
                                onChange={(e) =>
                                  handleUpdateQuestion(section.id, question.id, {
                                    questionText: e.target.value,
                                  })
                                }
                                placeholder="Question text"
                                fullWidth
                              />
                              <Input
                                value={question.helpText || ''}
                                onChange={(e) =>
                                  handleUpdateQuestion(section.id, question.id, {
                                    helpText: e.target.value,
                                  })
                                }
                                placeholder="Help text (optional)"
                                fullWidth
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <Select
                                  options={questionTypeOptions}
                                  value={question.type}
                                  onChange={(e) =>
                                    handleUpdateQuestion(section.id, question.id, {
                                      type: e.target.value as QuestionType,
                                      options:
                                        e.target.value === 'SINGLE_CHOICE' ||
                                        e.target.value === 'MULTIPLE_CHOICE'
                                          ? question.options || []
                                          : undefined,
                                    })
                                  }
                                  fullWidth
                                />
                                <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg">
                                  <input
                                    type="checkbox"
                                    checked={question.isRequired}
                                    onChange={(e) =>
                                      handleUpdateQuestion(section.id, question.id, {
                                        isRequired: e.target.checked,
                                      })
                                    }
                                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                                  />
                                  <span className="text-sm text-gray-700">Required</span>
                                </label>
                              </div>

                              {/* Options for choice questions */}
                              {(question.type === 'SINGLE_CHOICE' ||
                                question.type === 'MULTIPLE_CHOICE') && (
                                <div className="space-y-2 mt-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-700">Options</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      leftIcon={<IconPlus size={14} />}
                                      onClick={() => handleAddOption(section.id, question.id)}
                                    >
                                      Add Option
                                    </Button>
                                  </div>
                                  {question.options?.map((option) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                      <Input
                                        value={option.label}
                                        onChange={(e) =>
                                          handleUpdateOption(
                                            section.id,
                                            question.id,
                                            option.id,
                                            'label',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Option label"
                                        fullWidth
                                      />
                                      <button
                                        onClick={() =>
                                          handleDeleteOption(section.id, question.id, option.id)
                                        }
                                        className="p-2 text-error-600 hover:text-error-700"
                                      >
                                        <IconX size={16} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteQuestion(section.id, question.id)}
                              className="p-2 text-error-600 hover:text-error-700"
                            >
                              <IconTrash size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Save Button (Bottom) */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={() => navigate('/admin/survey-templates')}>
            Cancel
          </Button>
          <Button variant="primary" leftIcon={<IconDeviceFloppy size={18} />} onClick={handleSave}>
            Save Template
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
