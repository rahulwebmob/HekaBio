/**
 * Bulk Stage Movement Modal
 * Move multiple projects to a new stage with reason and notes
 */

import { useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Modal, Button, Select } from '../ui';
import type { Stage, ProjectTag } from '../../types/project.types';
import { StageLabels, StageWorkflows } from '../../types/project.types';

interface BulkStageMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  projectTag: ProjectTag;
  onConfirm: (newStage: Stage, reason: string, notes?: string) => void;
}

export function BulkStageMovementModal({
  isOpen,
  onClose,
  selectedCount,
  projectTag,
  onConfirm,
}: BulkStageMovementModalProps) {
  const [newStage, setNewStage] = useState<Stage | ''>('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workflow = StageWorkflows[projectTag];
  const stageOptions = workflow.map((stage) => ({
    value: stage,
    label: StageLabels[stage],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStage || !reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(newStage, reason, notes || undefined);
      handleClose();
    } catch (error) {
      console.error('Failed to move projects:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNewStage('');
      setReason('');
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Move ${selectedCount} Project${selectedCount > 1 ? 's' : ''}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Card */}
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <p className="text-sm text-brand-900">
            You are about to move <strong>{selectedCount}</strong> project
            {selectedCount > 1 ? 's' : ''} to a new stage. All projects must be in the same workflow
            ({projectTag}) for bulk movement.
          </p>
        </div>

        {/* New Stage Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            New Stage <span className="text-error-600">*</span>
          </label>
          <Select
            value={newStage}
            onChange={(e) => setNewStage(e.target.value as Stage)}
            options={[{ value: '', label: 'Select a stage...' }, ...stageOptions]}
            fullWidth
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Reason for Stage Change <span className="text-error-600">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why these projects are moving to the new stage..."
            rows={3}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
          />
          <p className="text-xs text-gray-600 mt-1">
            This reason will be recorded in the stage history for all selected projects
          </p>
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional context or notes..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
          />
        </div>

        {/* Preview */}
        {newStage && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">Moving to:</span>
              <div className="flex items-center gap-2">
                <IconArrowRight size={16} className="text-brand-600" />
                <span className="font-semibold text-brand-700">{StageLabels[newStage]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!newStage || !reason.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Move {selectedCount} Project{selectedCount > 1 ? 's' : ''}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
