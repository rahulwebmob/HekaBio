/**
 * Project Form Modal
 * Modal dialog for adding or editing project information
 */

import { useState, useEffect } from 'react';
import { IconFlask } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addProject, updateProject } from '../../store/slices/projectsSlice';
import { Button, Input, Select, Modal } from '../ui';
import { StageLabels, StageWorkflows } from '../../types/project.types';
import type {
  Project,
  ProjectTag,
  Stage,
  JapanMarketFit,
  NDAStatus,
} from '../../types/project.types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSuccess?: (project: Project) => void;
}

export function ProjectFormModal({ isOpen, onClose, project, onSuccess }: ProjectFormModalProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const isEdit = !!project;

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
  const [availableStages, setAvailableStages] = useState<Stage[]>([]);

  // Load existing project data if editing
  useEffect(() => {
    if (project) {
      const newFormData = {
        name: project.name,
        companyId: project.company.id,
        tag: (project.tags[0] || '') as ProjectTag | '',
        currentStage: project.currentStage as Stage | '',
        description: project.description || '',
        score: project.score.toString(),
        japanInterest: project.japanInterest,
        japanMarketFit: (project.japanMarketFit || '') as JapanMarketFit | '',
        japanSummary: project.japanSummary || '',
        ndaStatus: project.ndaStatus,
        ddProgress: project.ddProgress?.toString() || '',
        partnerTags: project.partnerTags.join(', '),
        isHot: project.isHot || false,
        isDiamond: project.isDiamond || false,
        isStalled: project.isStalled || false,
      };

      const timeoutId = setTimeout(() => setFormData(newFormData), 0);
      return () => clearTimeout(timeoutId);
    } else {
      // Reset form for new project
      const resetData = {
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
      };

      const timeoutId = setTimeout(() => setFormData(resetData), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [project, isOpen]);

  // Update available stages when tag changes
  useEffect(() => {
    if (formData.tag) {
      const stages = StageWorkflows[formData.tag];

      const timeoutId = setTimeout(() => {
        setAvailableStages(stages);

        if (formData.currentStage && !stages.includes(formData.currentStage)) {
          setFormData((prev) => ({ ...prev, currentStage: '' }));
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        setAvailableStages([]);
        setFormData((prev) => ({ ...prev, currentStage: '' }));
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.tag, formData.currentStage]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    const score = parseInt(formData.score);
    if (isNaN(score) || score < 0 || score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }

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
      ? formData.partnerTags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const projectData: Project = {
      id: isEdit ? project.id : `proj-${Date.now()}`,
      name: formData.name.trim(),
      company: selectedCompany,
      tags: [formData.tag as ProjectTag],
      description: formData.description.trim() || undefined,
      currentStage: formData.currentStage as Stage,
      stageHistory: isEdit ? project.stageHistory : [],
      score: parseInt(formData.score),
      scoreBreakdown: isEdit ? project.scoreBreakdown : undefined,
      lastScoredAt: isEdit ? project.lastScoredAt : new Date().toISOString(),
      japanInterest: formData.japanInterest,
      japanMarketFit: formData.japanMarketFit || undefined,
      japanSummary: formData.japanSummary.trim() || undefined,
      japanScreeningCompletedAt:
        formData.japanMarketFit && formData.japanMarketFit !== 'NOT_ASSESSED'
          ? new Date().toISOString()
          : undefined,
      partnerTags,
      ndaStatus: formData.ndaStatus,
      ndaRequestedAt: isEdit ? project.ndaRequestedAt : undefined,
      ndaCompletedAt: isEdit ? project.ndaCompletedAt : undefined,
      ddProgress: formData.ddProgress ? parseInt(formData.ddProgress) : undefined,
      ddStartedAt: isEdit ? project.ddStartedAt : undefined,
      ddCompletedAt: isEdit ? project.ddCompletedAt : undefined,
      contractStatus: isEdit ? project.contractStatus : undefined,
      contractDecisionAt: isEdit ? project.contractDecisionAt : undefined,
      createdAt: isEdit ? project.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: isEdit ? project.createdBy : 'user-001',
      assignedTo: isEdit ? project.assignedTo : undefined,
      isStalled: formData.isStalled,
      isHot: formData.isHot,
      isDiamond: formData.isDiamond,
    };

    if (isEdit) {
      dispatch(updateProject(projectData));
    } else {
      dispatch(addProject(projectData));
    }

    onSuccess?.(projectData);
    onClose();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Project' : 'Add New Project'}
      size="xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <IconFlask size={18} className="text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 ease-out bg-white/80 hover:bg-white hover:border-gray-400 placeholder:text-gray-400"
                placeholder="Brief description of the project..."
              />
            </div>
          </div>
        </div>

        {/* Japan Market Assessment */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Japan Market Assessment</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.japanInterest}
                  onChange={(e) => setFormData({ ...formData, japanInterest: e.target.checked })}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-gray-700">Japan Market Interest</span>
              </label>
            </div>

            <Select
              label="Japan Market Fit"
              placeholder="Select fit"
              options={japanFitOptions}
              value={formData.japanMarketFit}
              onChange={(e) =>
                setFormData({ ...formData, japanMarketFit: e.target.value as JapanMarketFit })
              }
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
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 ease-out bg-white/80 hover:bg-white hover:border-gray-400 placeholder:text-gray-400"
                placeholder="Summary of Japan market opportunity..."
                disabled={!formData.japanInterest}
              />
            </div>
          </div>
        </div>

        {/* NDA & Due Diligence */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">NDA & Due Diligence</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Partner Tags (comma separated)"
              placeholder="Medical Device, Oncology, AI"
              value={formData.partnerTags}
              onChange={(e) => setFormData({ ...formData, partnerTags: e.target.value })}
              helperText="Internal tags for potential partners"
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Project Flags</label>
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
        </div>
      </form>
    </Modal>
  );
}
