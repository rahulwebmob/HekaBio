/**
 * Survey Templates Management Page
 * Admin page to manage survey templates
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCopy,
  IconToggleLeft,
  IconToggleRight,
  IconFileText,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { deleteTemplate, toggleTemplateActive } from '../store/slices/surveysSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import { DeleteConfirmModal } from '../components/features';
import type { SurveyTemplate } from '../types/survey.types';

export default function SurveyTemplatesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const templates = useAppSelector((state) => state.surveys.templates);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<SurveyTemplate | null>(null);

  const handleDeleteClick = (template: SurveyTemplate) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      dispatch(deleteTemplate(templateToDelete.id));
    }
  };

  const handleToggleActive = (templateId: string) => {
    dispatch(toggleTemplateActive(templateId));
  };

  const handleDuplicate = (template: SurveyTemplate) => {
    // TODO: Implement template duplication
    console.log('Duplicate template:', template.id);
  };

  const getSurveyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SURVEY_1: 'Survey 1',
      SURVEY_2: 'Survey 2',
      SURVEY_3: 'Survey 3',
      JAPAN_ASSESSMENT: 'Japan Assessment',
      CUSTOM: 'Custom',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
      SURVEY_1: 'info',
      SURVEY_2: 'success',
      SURVEY_3: 'warning',
      JAPAN_ASSESSMENT: 'default',
      CUSTOM: 'default',
    };
    return colors[type] || 'default';
  };

  const getTotalQuestions = (template: SurveyTemplate) => {
    return template.sections.reduce((acc, section) => acc + section.questions.length, 0);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Survey Templates</h1>
            <p className="text-gray-600 mt-1">
              Create and manage survey templates for data collection
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<IconPlus size={18} />}
            onClick={() => navigate('/admin/survey-builder/new')}
          >
            Create Template
          </Button>
        </div>

        {/* Templates Table */}
        {templates.length > 0 ? (
          <Card padding="none" shadow="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 backdrop-blur-xl border-b border-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Structure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Enable/Disable
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {templates.map((template) => (
                    <tr
                      key={template.id}
                      className="hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {template.name}
                          </p>
                          {template.description && (
                            <p className="text-xs text-gray-600 line-clamp-1">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getTypeColor(template.type)} size="sm">
                          {getSurveyTypeLabel(template.type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <p className="font-semibold">{template.sections.length} sections</p>
                          <p className="text-xs text-gray-600">{getTotalQuestions(template)} questions</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{template.version}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <Badge
                            variant={template.isActive ? 'success' : 'default'}
                            size="sm"
                          >
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleToggleActive(template.id)}
                            className="p-2 hover:opacity-70 transition-opacity"
                            title={template.isActive ? 'Click to deactivate' : 'Click to activate'}
                          >
                            {template.isActive ? (
                              <IconToggleRight size={28} className="text-success-600" />
                            ) : (
                              <IconToggleLeft size={28} className="text-gray-500" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/survey-builder/${template.id}/edit`)}
                            className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit template"
                          >
                            <IconEdit size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/survey-builder/${template.id}/preview`)}
                            className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Preview template"
                          >
                            <IconEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(template)}
                            className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Duplicate"
                          >
                            <IconCopy size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(template)}
                            className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <IconTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No survey templates yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first survey template to start collecting data
              </p>
              <Button
                variant="primary"
                leftIcon={<IconPlus size={18} />}
                onClick={() => navigate('/admin/survey-builder/new')}
              >
                Create Template
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Survey Template"
        message="Are you sure you want to delete this survey template?"
        itemName={templateToDelete?.name}
      />
    </AppLayout>
  );
}
