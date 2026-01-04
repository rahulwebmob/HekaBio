/**
 * Email Templates Manager
 * View, create, edit, and delete email templates
 */

import { useState, useMemo } from 'react';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconTemplate,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import {
  deleteTemplate,
  toggleTemplateActive,
  addTemplate,
} from '../../../store/slices/emailTemplatesSlice';
import { Drawer, Input, Select, Button, Badge, Card } from '../../ui';
import EmailTemplateEditor from './EmailTemplateEditor';
import type { EmailTemplate, EmailTemplateCategory } from '../../../types/emailTemplate.types';
import {
  getTemplateCategoryLabel,
  getTemplateCategoryColor,
} from '../../../types/emailTemplate.types';

interface EmailTemplatesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: EmailTemplate) => void;
}

export default function EmailTemplatesManager({
  isOpen,
  onClose,
  onSelectTemplate,
}: EmailTemplatesManagerProps) {
  const dispatch = useAppDispatch();
  const templates = useAppSelector((state) => state.emailTemplates.templates);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showInactive, setShowInactive] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        template.name.toLowerCase().includes(searchLower) ||
        template.subject.toLowerCase().includes(searchLower) ||
        template.description?.toLowerCase().includes(searchLower);

      const matchesCategory = !categoryFilter || template.category === categoryFilter;
      const matchesActive = showInactive || template.isActive;

      return matchesSearch && matchesCategory && matchesActive;
    });
  }, [templates, searchTerm, categoryFilter, showInactive]);

  const stats = useMemo(() => {
    return {
      total: templates.length,
      active: templates.filter((t) => t.isActive).length,
      byCategory: templates.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<EmailTemplateCategory, number>),
    };
  }, [templates]);

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handleDuplicate = (template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addTemplate(duplicated));
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(deleteTemplate(templateId));
    }
  };

  const handleToggleActive = (templateId: string) => {
    dispatch(toggleTemplateActive(templateId));
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      onClose();
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Email Templates"
        size="xl"
        footer={
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredTemplates.length} of {templates.length} templates
            </span>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={handleCreateNew}>
                New Template
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="md" shadow="sm">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-brand-600">{stats.total}</p>
              </div>
            </Card>
            <Card padding="md" shadow="sm">
              <div className="text-center">
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-success-600">{stats.active}</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<IconSearch size={18} />}
              fullWidth
            />

            <div className="flex gap-3">
              <Select
                placeholder="Filter by category"
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'INITIAL_CONTACT', label: 'Initial Contact' },
                  { value: 'FOLLOW_UP', label: 'Follow-up' },
                  { value: 'PROPOSAL', label: 'Proposal' },
                  { value: 'CONTRACT', label: 'Contract' },
                  { value: 'MEETING', label: 'Meeting' },
                  { value: 'THANK_YOU', label: 'Thank You' },
                  { value: 'UPDATE', label: 'Update' },
                  { value: 'GENERAL', label: 'General' },
                ]}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                fullWidth
              />

              <div className="flex items-center gap-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  id="showInactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <label htmlFor="showInactive" className="text-sm text-gray-700">
                  Show Inactive
                </label>
              </div>
            </div>
          </div>

          {/* Templates List */}
          <div className="space-y-3">
            {filteredTemplates.length === 0 ? (
              <Card padding="lg" shadow="sm">
                <div className="text-center py-8">
                  <IconTemplate size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No templates found</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateNew}
                    leftIcon={<IconPlus size={16} />}
                    className="mt-4"
                  >
                    Create Your First Template
                  </Button>
                </div>
              </Card>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} padding="md" shadow="sm" className="hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {template.name}
                          </h3>
                          {!template.isActive && (
                            <Badge variant="default" size="sm">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="default"
                            size="sm"
                            className={getTemplateCategoryColor(template.category)}
                          >
                            {getTemplateCategoryLabel(template.category)}
                          </Badge>
                          {template.variables.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {template.variables.length} variables
                            </span>
                          )}
                        </div>
                        {template.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {template.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        {onSelectTemplate && (
                          <button
                            onClick={() => handleUseTemplate(template)}
                            className="p-2 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Use Template"
                          >
                            <IconCopy size={16} className="text-brand-600" />
                          </button>
                        )}
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <IconEye size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(template.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={template.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {template.isActive ? (
                            <IconEye size={16} className="text-success-600" />
                          ) : (
                            <IconEyeOff size={16} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <IconEdit size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(template)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <IconCopy size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="p-2 hover:bg-error-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <IconTrash size={16} className="text-error-600" />
                        </button>
                      </div>
                    </div>

                    {/* Subject Preview */}
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 mb-1">Subject:</p>
                      <p className="text-sm text-gray-700 font-medium line-clamp-1">
                        {template.subject}
                      </p>
                    </div>

                    {/* Body Preview */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Body Preview:</p>
                      <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-line">
                        {template.body}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Drawer>

      {/* Template Editor Modal */}
      <EmailTemplateEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
      />

      {/* Preview Modal */}
      {previewTemplate && (
        <Drawer
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Preview: ${previewTemplate.name}`}
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setPreviewTemplate(null)}>
                Close
              </Button>
              {onSelectTemplate && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                >
                  Use This Template
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Category:</p>
              <Badge
                variant="default"
                className={getTemplateCategoryColor(previewTemplate.category)}
              >
                {getTemplateCategoryLabel(previewTemplate.category)}
              </Badge>
            </div>

            {previewTemplate.description && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                <p className="text-sm text-gray-600">{previewTemplate.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Subject:</p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900 font-mono">{previewTemplate.subject}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Body:</p>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-900 whitespace-pre-line font-mono">
                  {previewTemplate.body}
                </p>
              </div>
            </div>

            {previewTemplate.variables.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Variables Used:</p>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.variables.map((varName) => (
                    <Badge key={varName} variant="info" size="sm">
                      {`{{${varName}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </>
  );
}
