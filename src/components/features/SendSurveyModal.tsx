/**
 * Send Survey Modal
 * Modal to create and send survey to companies
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSend, IconCopy, IconCheck, IconExternalLink } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addSurveyInstance } from '../../store/slices/surveysSlice';
import { Button, Input, Select, Modal } from '../ui';
import { QRCodeGenerator } from '../common';
import type { SurveyInstance } from '../../types/survey.types';

interface SendSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendSurveyModal({ isOpen, onClose }: SendSurveyModalProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const templates = useAppSelector((state) => state.surveys.templates.filter((t) => t.isActive));
  const companies = useAppSelector((state) => state.addressBook.companies);
  const projects = useAppSelector((state) => state.projects.projects);

  const [formData, setFormData] = useState({
    templateId: '',
    companyId: '',
    projectId: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [surveyLink, setSurveyLink] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.templateId) {
      newErrors.templateId = 'Survey template is required';
    }
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendSurvey = () => {
    if (!validateForm()) {
      return;
    }

    const template = templates.find((t) => t.id === formData.templateId);
    const company = companies.find((c) => c.id === formData.companyId);
    const project = formData.projectId
      ? projects.find((p) => p.id === formData.projectId)
      : undefined;

    if (!template || !company) {
      return;
    }

    // Create survey instance
    const surveyId = `survey-${Date.now()}`;
    const now = new Date().toISOString();

    const surveyInstance: SurveyInstance = {
      id: surveyId,
      templateId: template.id,
      template: template,
      companyId: company.id,
      company: company,
      projectId: project?.id,
      project: project,
      status: 'NOT_STARTED',
      assignedTo: 'contact-001', // TODO: Select contact from company
      assignedBy: 'user-001', // Current user
      sentAt: now,
      dueDate: formData.dueDate || undefined,
      completionPercentage: 0,
      responses: [],
      createdAt: now,
      updatedAt: now,
    };

    dispatch(addSurveyInstance(surveyInstance));

    // Generate public survey link
    const publicLink = `${window.location.origin}/survey/${surveyId}`;
    setSurveyLink(publicLink);
    setShowSuccess(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInNewWindow = () => {
    const surveyId = surveyLink.split('/survey/')[1];
    navigate(`/survey/${surveyId}`);
  };

  const handleReset = () => {
    setFormData({
      templateId: '',
      companyId: '',
      projectId: '',
      dueDate: '',
    });
    setSurveyLink('');
    setShowSuccess(false);
    setCopied(false);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const templateOptions = [
    { value: '', label: 'Select survey template' },
    ...templates.map((t) => ({
      value: t.id,
      label: `${t.name} (${t.type})`,
    })),
  ];

  const companyOptions = [
    { value: '', label: 'Select company' },
    ...companies.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const projectOptions = [
    { value: '', label: 'None (Optional)' },
    ...projects
      .filter((p) => p.company.id === formData.companyId)
      .map((p) => ({
        value: p.id,
        label: p.name,
      })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showSuccess ? 'Survey Sent!' : 'Send Survey'}
      size="lg"
      footer={
        !showSuccess ? (
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" leftIcon={<IconSend size={18} />} onClick={handleSendSurvey}>
              Send Survey
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleReset}>
              Send Another
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        )
      }
    >
      {!showSuccess ? (
        <div className="space-y-4">
          <Select
            label="Survey Template *"
            placeholder="Select template"
            options={templateOptions}
            value={formData.templateId}
            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
            error={errors.templateId}
            fullWidth
          />

          <Select
            label="Company *"
            placeholder="Select company"
            options={companyOptions}
            value={formData.companyId}
            onChange={(e) => setFormData({ ...formData, companyId: e.target.value, projectId: '' })}
            error={errors.companyId}
            fullWidth
          />

          <Select
            label="Link to Project (Optional)"
            placeholder="Select project"
            options={projectOptions}
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            fullWidth
            disabled={!formData.companyId}
          />

          <Input
            label="Due Date (Optional)"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            fullWidth
          />

          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-brand-800">
              <strong>Survey Distribution:</strong>
            </p>
            <ul className="text-sm text-brand-700 mt-2 space-y-1 list-disc list-inside">
              <li>Public form link (opens in new window)</li>
              <li>QR code for mobile scanning</li>
              <li>Upload introduction deck with AI extraction</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="flex items-center gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
              <IconCheck size={20} className="text-success-600" />
            </div>
            <div>
              <p className="font-semibold text-success-900">Survey successfully created!</p>
              <p className="text-sm text-success-700">
                The survey is now accessible via the link below.
              </p>
            </div>
          </div>

          {/* Public Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Survey Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={surveyLink}
                  readOnly
                  fullWidth
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <Button
                variant="outline"
                leftIcon={copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="primary"
                leftIcon={<IconExternalLink size={18} />}
                onClick={handleOpenInNewWindow}
              >
                Open
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Share this link with the company to fill out the survey
            </p>
          </div>

          {/* QR Code Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
            <QRCodeGenerator
              url={surveyLink}
              size={256}
              title="Generate a QR code for mobile access"
            />
          </div>

          {/* Additional Options */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Next Steps</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Share the link via email or messaging</li>
              <li>• Company can upload introduction deck for AI extraction</li>
              <li>• Responses will appear in Surveys list</li>
              <li>• Track completion status in real-time</li>
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}
