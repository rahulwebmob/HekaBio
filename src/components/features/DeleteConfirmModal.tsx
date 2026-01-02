/**
 * Delete Confirmation Modal
 * Generic confirmation modal for delete actions
 */

import { IconAlertTriangle } from '@tabler/icons-react';
import { Modal, Button } from '../ui';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
            <IconAlertTriangle size={32} className="text-error-600" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-gray-700">{message}</p>
          {itemName && (
            <p className="text-sm font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
              {itemName}
            </p>
          )}
          <p className="text-sm text-error-600 font-medium">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
