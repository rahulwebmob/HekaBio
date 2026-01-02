/**
 * Project Form Page
 * Add or Edit project information
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconFlask } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { addProject, updateProject } from '../store/slices/projectsSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Input, Select } from '../components/ui';
import {
  StageLabels,
  StageWorkflows,
} from '../types/project.types';
import type { Project, ProjectTag, Stage, JapanMarketFit, NDAStatus } from '../types/project.types';

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const existingProject = useAppSelector((state) =>
    id ? state.projects.projects.find((p) => p.id === id) : null
  );

  const companies = useAppSelector((state) => state.addressBook.companies);

  const isEdit = !!id && !!existingProject;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    tag: '' as ProjectTag | '',
    currentStage: '' as Stage | '',
    description: '',
    score: '0',
    japanInterest: false,
    japanMarketFit: '' as JapanMarketFit | '',
    japanSummary: '',
    ndaStatus: 'NOT_REQUIRED' as NDAStatus,
    ddProgress: '',
    partnerTags: '',
    isHot: false,
    isDiamond: false,
    isStalled: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available stages based on selected tag
  const [availableStages, setAvailableStages] = useState<Stage[]>([]);

  // Load existing project data if editing
  useEffect(() => {
    if (existingProject) {
      const newFormData = {
        name: existingProject.name,
        companyId: existingProject.company.id,
        tag: (existingProject.tags[0] || '') as ProjectTag | '',
        currentStage: existingProject.currentStage as Stage | '',
        description: existingProject.description || '',
        score: existingProject.score.toString(),
        japanInterest: existingProject.japanInterest,
        japanMarketFit: (existingProject.japanMarketFit || '') as JapanMarketFit | '',
        japanSummary: existingProject.japanSummary || '',
        ndaStatus: existingProject.ndaStatus,
        ddProgress: existingProject.ddProgress?.toString() || '',
        partnerTags: existingProject.partnerTags.join(', '),
        isHot: existingProject.isHot || false,
        isDiamond: existingProject.isDiamond || false,
        isStalled: existingProject.isStalled || false,
      };

      // Defer state update to avoid direct setState in effect
      const timeoutId = setTimeout(() => setFormData(newFormData), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [existingProject]);

  // Update available stages when tag changes
  useEffect(() => {
    if (formData.tag) {
      const stages = StageWorkflows[formData.tag];

      // Defer state updates to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setAvailableStages(stages);

        // If current stage is not in the workflow, reset it
        if (formData.currentStage && !stages.includes(formData.currentStage)) {
          setFormData(prev => ({ ...prev, currentStage: '' }));
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        setAvailableStages([]);
        setFormData(prev => ({ ...prev, currentStage: '' }));
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.tag, formData.currentStage]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }
    if (!formData.tag) {
      newErrors.tag = 'Project tag is required';
    }
    if (!formData.currentStage) {
      newErrors.currentStage = 'Current stage is required';
    }

    // Score validation
    const score = parseInt(formData.score);
    if (isNaN(score) || score < 0 || score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }

    // DD Progress validation
    if (formData.ddProgress) {
      const ddProgress = parseInt(formData.ddProgress);
      if (isNaN(ddProgress) || ddProgress < 0 || ddProgress > 100) {
        newErrors.ddProgress = 'Due diligence progress must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedCompany = companies.find((c) => c.id === formData.companyId);
    if (!selectedCompany) {
      return;
    }

    const partnerTags = formData.partnerTags
      ? formData.partnerTags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      : [];

    const projectData: Project = {
      id: isEdit ? existingProject.id : `proj-${Date.now()}`,
      name: formData.name.trim(),
      company: selectedCompany,
      tags: [formData.tag as ProjectTag],
      description: formData.description.trim() || undefined,
      currentStage: formData.currentStage as Stage,
      stageHistory: isEdit ? existingProject.stageHistory : [],
      score: parseInt(formData.score),
      scoreBreakdown: isEdit ? existingProject.scoreBreakdown : undefined,
      lastScoredAt: isEdit ? existingProject.lastScoredAt : new Date().toISOString(),
      japanInterest: formData.japanInterest,
      japanMarketFit: formData.japanMarketFit || undefined,
      japanSummary: formData.japanSummary.trim() || undefined,
      japanScreeningCompletedAt: formData.japanMarketFit && formData.japanMarketFit !== 'NOT_ASSESSED'
        ? new Date().toISOString()
        : undefined,
      partnerTags,
      ndaStatus: formData.ndaStatus,
      ndaRequestedAt: isEdit ? existingProject.ndaRequestedAt : undefined,
      ndaCompletedAt: isEdit ? existingProject.ndaCompletedAt : undefined,
      ddProgress: formData.ddProgress ? parseInt(formData.ddProgress) : undefined,
      ddStartedAt: isEdit ? existingProject.ddStartedAt : undefined,
      ddCompletedAt: isEdit ? existingProject.ddCompletedAt : undefined,
      contractStatus: isEdit ? existingProject.contractStatus : undefined,
      contractDecisionAt: isEdit ? existingProject.contractDecisionAt : undefined,
      createdAt: isEdit ? existingProject.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: isEdit ? existingProject.createdBy : 'user-001',
      assignedTo: isEdit ? existingProject.assignedTo : undefined,
      isStalled: formData.isStalled,
      isHot: formData.isHot,
      isDiamond: formData.isDiamond,
    };

    if (isEdit) {
      dispatch(updateProject(projectData));
    } else {
      dispatch(addProject(projectData));
    }

    navigate(`/projects/${projectData.id}`);
  };

  const tagOptions = [
    { value: '', label: 'Select project tag' },
    { value: 'Strategic Portfolio', label: 'Strategic Portfolio' },
    { value: 'Finders', label: 'Finders' },
    { value: 'Development Services', label: 'Development Services' },
  ];

  const stageOptions = [
    { value: '', label: 'Select stage' },
    ...availableStages.map((stage) => ({
      value: stage,
      label: StageLabels[stage],
    })),
  ];

  const companyOptions = [
    { value: '', label: 'Select company' },
    ...companies.map((company) => ({
      value: company.id,
      label: company.name,
    })),
  ];

  const japanFitOptions = [
    { value: '', label: 'Not Assessed' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const ndaStatusOptions = [
    { value: 'NOT_REQUIRED', label: 'Not Required' },
    { value: 'REQUESTED', label: 'Requested' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'EXPIRED', label: 'Expired' },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IconArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update project information' : 'Enter project details below'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card
            padding="lg"
            shadow="sm"
            header={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <IconFlask size={20} className="text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Project Name *"
                  placeholder="e.g., AI-Powered Cancer Diagnostics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  fullWidth
                />
              </div>

              <Select
                label="Company *"
                placeholder="Select company"
                options={companyOptions}
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                error={errors.companyId}
                fullWidth
              />

              <Select
                label="Project Tag *"
                placeholder="Select tag"
                options={tagOptions}
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as ProjectTag })}
                error={errors.tag}
                fullWidth
              />

              <Select
                label="Current Stage *"
                placeholder="Select stage"
                options={stageOptions}
                value={formData.currentStage}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as Stage })}
                error={errors.currentStage}
                fullWidth
                disabled={!formData.tag}
              />

              <Input
                label="Overall Score (0-100) *"
                type="number"
                placeholder="75"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                error={errors.score}
                fullWidth
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Brief description of the project..."
                />
              </div>
            </div>
          </Card>

          {/* Japan Market Assessment */}
          <Card
            padding="lg"
            shadow="sm"
            header={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🇯🇵</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Japan Market Assessment</h2>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.japanInterest}
                    onChange={(e) => setFormData({ ...formData, japanInterest: e.target.checked })}
                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Japan Market Interest
                  </span>
                </label>
              </div>

              <Select
                label="Japan Market Fit"
                placeholder="Select fit"
                options={japanFitOptions}
                value={formData.japanMarketFit}
                onChange={(e) => setFormData({ ...formData, japanMarketFit: e.target.value as JapanMarketFit })}
                fullWidth
                disabled={!formData.japanInterest}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Japan Market Summary
                </label>
                <textarea
                  value={formData.japanSummary}
                  onChange={(e) => setFormData({ ...formData, japanSummary: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Summary of Japan market opportunity..."
                  disabled={!formData.japanInterest}
                />
              </div>
            </div>
          </Card>

          {/* NDA & Due Diligence */}
          <Card
            padding="lg"
            shadow="sm"
            header={<h2 className="text-xl font-semibold text-gray-900">NDA & Due Diligence</h2>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="NDA Status"
                placeholder="Select status"
                options={ndaStatusOptions}
                value={formData.ndaStatus}
                onChange={(e) => setFormData({ ...formData, ndaStatus: e.target.value as NDAStatus })}
                fullWidth
              />

              <Input
                label="Due Diligence Progress (%)"
                type="number"
                placeholder="0-100"
                value={formData.ddProgress}
                onChange={(e) => setFormData({ ...formData, ddProgress: e.target.value })}
                error={errors.ddProgress}
                fullWidth
              />
            </div>
          </Card>

          {/* Additional Details */}
          <Card
            padding="lg"
            shadow="sm"
            header={<h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>}
          >
            <div className="space-y-6">
              <div>
                <Input
                  label="Partner Tags (comma separated)"
                  placeholder="Medical Device, Oncology, AI"
                  value={formData.partnerTags}
                  onChange={(e) => setFormData({ ...formData, partnerTags: e.target.value })}
                  helperText="Internal tags for potential partners"
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Project Flags
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isHot}
                      onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">🔥 Hot Project</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isDiamond}
                      onChange={(e) => setFormData({ ...formData, isDiamond: e.target.checked })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">💎 Diamond Project</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isStalled}
                      onChange={(e) => setFormData({ ...formData, isStalled: e.target.checked })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">⏸️ Stalled Project</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
