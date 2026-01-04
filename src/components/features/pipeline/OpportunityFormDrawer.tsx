/**
 * Opportunity Form Drawer
 * Create new pipeline opportunity
 */

import { useState } from 'react';
import { IconTarget } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { addOpportunity } from '../../../store/slices/pipelineSlice';
import { Drawer, Button } from '../../ui';

interface OpportunityFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
  projectId?: string;
}

export default function OpportunityFormDrawer({
  isOpen,
  onClose,
  companyId: initialCompanyId,
  projectId: initialProjectId,
}: OpportunityFormDrawerProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const projects = useAppSelector((state) => state.projects.projects);

  const [companyId, setCompanyId] = useState(initialCompanyId || '');
  const [projectId, setProjectId] = useState(initialProjectId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [estimatedCloseDate, setEstimatedCloseDate] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId || !title || !estimatedValue) {
      alert('Please fill in all required fields');
      return;
    }

    const company = companies.find((c) => c.id === companyId);
    const project = projects.find((p) => p.id === projectId);

    if (!company) {
      alert('Please select a valid company');
      return;
    }

    const now = new Date().toISOString();

    dispatch(
      addOpportunity({
        id: `opp-${Date.now()}`,
        title,
        description: description || undefined,
        companyId,
        company,
        projectId: projectId || undefined,
        project: project || undefined,
        stage: 'LEAD',
        probability: 10,
        estimatedValue: parseFloat(estimatedValue),
        currency: 'USD',
        estimatedCloseDate: estimatedCloseDate || undefined,
        ownerId: 'user-1',
        ownerName: 'Current User',
        stageHistory: [
          {
            stage: 'LEAD',
            enteredAt: now,
          },
        ],
        contactCount: 0,
        tags: [],
        priority,
        notes: notes || undefined,
        createdAt: now,
        createdBy: 'user-1',
        updatedAt: now,
      })
    );

    // Reset form
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setDescription('');
    setEstimatedValue('');
    setEstimatedCloseDate('');
    setPriority('MEDIUM');
    setNotes('');

    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setCompanyId(initialCompanyId || '');
    setProjectId(initialProjectId || '');
    setTitle('');
    setDescription('');
    setEstimatedValue('');
    setEstimatedCloseDate('');
    setPriority('MEDIUM');
    setNotes('');
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Opportunity">
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

        {/* Opportunity Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opportunity Title <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Licensing Agreement - Product XYZ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe this opportunity..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Estimated Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Value (USD) <span className="text-error-600">*</span>
          </label>
          <input
            type="number"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            placeholder="e.g., 500000"
            min={0}
            step={1000}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          />
        </div>

        {/* Estimated Close Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Close Date
          </label>
          <input
            type="date"
            value={estimatedCloseDate}
            onChange={(e) => setEstimatedCloseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Additional notes or context..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" leftIcon={<IconTarget size={18} />}>
            Create Opportunity
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
