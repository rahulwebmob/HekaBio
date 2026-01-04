/**
 * Contract Form Drawer
 * Create new contract record with details
 */

import { useState } from 'react';
import { IconFileText } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { createContract } from '../../../store/slices/contractSlice';
import { Drawer, Button } from '../../ui';
import type { ContractType, ContractStatus } from '../../../types/contract.types';

interface ContractFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  companyId?: string;
}

export default function ContractFormDrawer({
  isOpen,
  onClose,
  projectId: initialProjectId,
  companyId: initialCompanyId,
}: ContractFormDrawerProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const projects = useAppSelector((state) => state.projects.projects);

  const [companyId, setCompanyId] = useState(initialCompanyId || '');
  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContractType>('LICENSING');
  const [status, setStatus] = useState<ContractStatus>('DRAFT');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [value, setValue] = useState('');
  const [terms, setTerms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId || !title || !type) {
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
      createContract({
        companyId,
        companyName: company.name,
        projectId: projectId || undefined,
        projectName: project?.name || undefined,
        title,
        type,
        description: terms || undefined,
      })
    );

    // Reset form
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setType('LICENSING');
    setStatus('DRAFT');
    setEffectiveDate('');
    setExpirationDate('');
    setValue('');
    setTerms('');

    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setType('LICENSING');
    setStatus('DRAFT');
    setEffectiveDate('');
    setExpirationDate('');
    setValue('');
    setTerms('');
    onClose();
  };

  const contractTypes: { value: ContractType; label: string }[] = [
    { value: 'LICENSING', label: 'Licensing Agreement' },
    { value: 'PARTNERSHIP', label: 'Partnership Agreement' },
    { value: 'SUPPLY', label: 'Supply Agreement' },
    { value: 'COLLABORATION', label: 'Collaboration Agreement' },
    { value: 'SERVICE', label: 'Service Agreement' },
    { value: 'OTHER', label: 'Other' },
  ];

  const contractStatuses: { value: ContractStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_REVIEW', label: 'Pending Review' },
    { value: 'PENDING_SIGNATURES', label: 'Pending Signatures' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'TERMINATED', label: 'Terminated' },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Contract">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Project (Optional)</label>
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

        {/* Contract Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Title <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Exclusive Licensing Agreement - Product XYZ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          />
        </div>

        {/* Contract Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Type <span className="text-error-600">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContractType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          >
            {contractTypes.map((ct) => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>

        {/* Contract Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContractStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {contractStatuses.map((cs) => (
              <option key={cs.value} value={cs.value}>
                {cs.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Contract Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Value (USD)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 1000000"
            min={0}
            step={1000}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Key Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Key Terms</label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={4}
            placeholder="Describe key terms and conditions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" leftIcon={<IconFileText size={18} />}>
            Create Contract
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
