/**
 * Email Template Editor
 * Create and edit email templates with variable placeholders
 */

import { useState, useEffect, useRef } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addTemplate, updateTemplate } from '../../../store/slices/emailTemplatesSlice';
import { Modal, Input, Select, Button, Badge } from '../../ui';
import type {
  EmailTemplate,
  EmailTemplateCategory,
  EmailVariable,
} from '../../../types/emailTemplate.types';
import {
  EMAIL_VARIABLES,
  extractTemplateVariables,
} from '../../../types/emailTemplate.types';

interface EmailTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  template?: EmailTemplate | null;
}

export default function EmailTemplateEditor({
  isOpen,
  onClose,
  template,
}: EmailTemplateEditorProps) {
  const dispatch = useAppDispatch();
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!template;

  const [formData, setFormData] = useState({
    name: '',
    category: 'GENERAL' as EmailTemplateCategory,
    subject: '',
    body: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedVariableGroup, setSelectedVariableGroup] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setFormData({
          name: template.name,
          category: template.category,
          subject: template.subject,
          body: template.body,
          description: template.description || '',
        });
      } else {
        setFormData({
          name: '',
          category: 'GENERAL',
          subject: '',
          body: '',
          description: '',
        });
      }
      setErrors({});
    }
  }, [template, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const insertVariable = (variableName: string, target: 'subject' | 'body') => {
    const placeholder = `{{${variableName}}}`;

    if (target === 'subject') {
      const input = subjectInputRef.current;
      if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const newValue =
          formData.subject.substring(0, start) +
          placeholder +
          formData.subject.substring(end);
        setFormData((prev) => ({ ...prev, subject: newValue }));

        // Set cursor position after inserted variable
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(start + placeholder.length, start + placeholder.length);
        }, 0);
      }
    } else {
      const textarea = bodyTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const newValue =
          formData.body.substring(0, start) +
          placeholder +
          formData.body.substring(end);
        setFormData((prev) => ({ ...prev, body: newValue }));

        // Set cursor position after inserted variable
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
        }, 0);
      }
    }
  };

  const getFilteredVariables = (): EmailVariable[] => {
    if (selectedVariableGroup === 'all') {
      return EMAIL_VARIABLES;
    }
    return EMAIL_VARIABLES.filter((v) => v.category === selectedVariableGroup);
  };

  const detectUsedVariables = (): string[] => {
    const subjectVars = extractTemplateVariables(formData.subject);
    const bodyVars = extractTemplateVariables(formData.body);
    return [...new Set([...subjectVars, ...bodyVars])];
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject line is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Template body is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const usedVariables = detectUsedVariables();

    const templateData: EmailTemplate = {
      id: template?.id || `template-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      subject: formData.subject,
      body: formData.body,
      description: formData.description,
      variables: usedVariables,
      isActive: template?.isActive ?? true,
      createdBy: template?.createdBy || 'user-001',
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (template) {
      dispatch(updateTemplate(templateData));
    } else {
      dispatch(addTemplate(templateData));
    }

    onClose();
  };

  const usedVariables = detectUsedVariables();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Email Template' : 'Create Email Template'}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name <span className="text-error-600">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Initial Contact - Japan Market"
            fullWidth
            error={errors.name}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            options={[
              { value: 'INITIAL_CONTACT', label: 'Initial Contact' },
              { value: 'FOLLOW_UP', label: 'Follow-up' },
              { value: 'PROPOSAL', label: 'Proposal' },
              { value: 'CONTRACT', label: 'Contract' },
              { value: 'MEETING', label: 'Meeting' },
              { value: 'THANK_YOU', label: 'Thank You' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'GENERAL', label: 'General' },
            ]}
            fullWidth
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Input
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of when to use this template"
            fullWidth
          />
        </div>

        {/* Subject Line */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject Line <span className="text-error-600">*</span>
            </label>
            <span className="text-xs text-gray-500">Click variable to insert</span>
          </div>
          <input
            ref={subjectInputRef}
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Email subject with {{variables}}"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
              errors.subject ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.subject && <p className="mt-1 text-sm text-error-600">{errors.subject}</p>}
        </div>

        {/* Email Body */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Body <span className="text-error-600">*</span>
            </label>
            <span className="text-xs text-gray-500">Click variable to insert at cursor</span>
          </div>
          <textarea
            ref={bodyTextareaRef}
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Compose your email template with {{variables}}..."
            rows={12}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors font-mono text-sm ${
              errors.body ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.body && <p className="mt-1 text-sm text-error-600">{errors.body}</p>}
        </div>

        {/* Variable Palette */}
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Available Variables</h3>
            <Select
              value={selectedVariableGroup}
              onChange={(e) => setSelectedVariableGroup(e.target.value)}
              options={[
                { value: 'all', label: 'All Variables' },
                { value: 'company', label: 'Company' },
                { value: 'contact', label: 'Contact' },
                { value: 'user', label: 'User' },
                { value: 'date', label: 'Date' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {getFilteredVariables().map((variable) => (
              <div key={variable.name} className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => insertVariable(variable.name, 'body')}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-brand-50 hover:border-brand-500 transition-colors text-left group"
                    title={`Click to insert into body. Example: ${variable.example}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-900">
                        {variable.displayName}
                      </span>
                      <IconPlus size={14} className="text-gray-400 group-hover:text-brand-600" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {`{{${variable.name}}}`}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Used Variables Summary */}
        {usedVariables.length > 0 && (
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Variables Used in This Template ({usedVariables.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {usedVariables.map((varName) => {
                const varInfo = EMAIL_VARIABLES.find((v) => v.name === varName);
                return (
                  <Badge key={varName} variant="info" size="sm">
                    {varInfo ? varInfo.displayName : varName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
