/**
 * NDA Form Drawer
 * Create new NDA with company and project selection
 */

import { useState } from 'react';
import { IconFileText } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { createNDA } from '../../../store/slices/ndaSlice';
import { Drawer, Button } from '../../ui';
import type { NDAType } from '../../../types/nda.types';
import { NDA_TYPE_LABELS } from '../../../types/nda.types';

interface NDAFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  companyId?: string;
}

export default function NDAFormDrawer({
  isOpen,
  onClose,
  projectId: initialProjectId,
  companyId: initialCompanyId,
}: NDAFormDrawerProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const projects = useAppSelector((state) => state.projects.projects);

  const [companyId, setCompanyId] = useState(initialCompanyId || '');
  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NDAType>('MUTUAL');
  const [purpose, setPurpose] = useState('');
  const [termYears, setTermYears] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId || !title || !purpose) {
      alert('Please fill in all required fields');
      return;
    }

    const company = companies.find((c) => c.id === companyId);
    const project = projects.find((p) => p.id === projectId);

    if (!company) {
      alert('Please select a valid company');
      return;
    }

    dispatch(
      createNDA({
        companyId,
        companyName: company.name,
        projectId: projectId || undefined,
        projectName: project?.name || undefined,
        title,
        type,
        purpose,
        termYears,
      })
    );

    // Reset form
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setType('MUTUAL');
    setPurpose('');
    setTermYears(2);

    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setType('MUTUAL');
    setPurpose('');
    setTermYears(2);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New NDA">
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

        {/* Project Selection (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project (Optional)
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            disabled={!!initialProjectId}
          >
            <option value="">No project selected</option>
            {projects
              .filter((p) => !companyId || p.company.id === companyId)
              .map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
          </select>
        </div>

        {/* NDA Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NDA Title <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Mutual NDA for Partnership Discussion"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          />
        </div>

        {/* NDA Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NDA Type <span className="text-error-600">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as NDAType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          >
            {Object.entries(NDA_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose <span className="text-error-600">*</span>
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            placeholder="Describe the purpose of this NDA..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          />
        </div>

        {/* Term (Years) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Term (Years)
          </label>
          <input
            type="number"
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            min={1}
            max={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Typical: 2 years for mutual NDAs, 1 year for one-way
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" leftIcon={<IconFileText size={18} />}>
            Create NDA
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
