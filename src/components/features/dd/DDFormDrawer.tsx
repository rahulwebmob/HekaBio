/**
 * DD Workspace Form Drawer
 * Create new due diligence workspace
 */

import { useState } from 'react';
import { IconClipboardCheck } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { createDDWorkspace } from '../../../store/slices/ddSlice';
import { Drawer, Button } from '../../ui';

interface DDFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  companyId?: string;
}

export default function DDFormDrawer({
  isOpen,
  onClose,
  projectId: initialProjectId,
  companyId: initialCompanyId,
}: DDFormDrawerProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const projects = useAppSelector((state) => state.projects.projects);

  const [companyId, setCompanyId] = useState(initialCompanyId || '');
  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId || !projectId || !title) {
      alert('Please fill in all required fields');
      return;
    }

    const company = companies.find((c) => c.id === companyId);
    const project = projects.find((p) => p.id === projectId);

    if (!company) {
      alert('Please select a valid company');
      return;
    }

    if (!project) {
      alert('Please select a valid project');
      return;
    }

    dispatch(
      createDDWorkspace({
        projectId,
        projectName: project.name,
        companyId,
        companyName: company.name,
        title,
        description: description || undefined,
      })
    );

    // Reset form
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setDescription('');

    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create DD Workspace">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-error-600">*</span>
          </label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
            disabled={!!initialCompanyId}
          >
            <option value="">Select company...</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name} ({company.category})
              </option>
            ))}
          </select>
        </div>

        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project <span className="text-error-600">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
            disabled={!!initialProjectId}
          >
            <option value="">Select project...</option>
            {projects
              .filter((p) => !companyId || p.company.id === companyId)
              .map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
          </select>
        </div>

        {/* DD Workspace Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace Title <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Technical Due Diligence - Q1 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the purpose and scope of this due diligence process..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" leftIcon={<IconClipboardCheck size={18} />}>
            Create Workspace
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
