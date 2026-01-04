/**
 * Upload New Version
 * Upload a new version of an existing document
 */

import { useState } from 'react';
import { IconUpload, IconFileText } from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addDocumentVersion } from '../../../store/slices/documentsSlice';
import { Modal, Button } from '../../ui';
import type { Document, DocumentVersion } from '../../../types/document.types';

interface UploadNewVersionProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export default function UploadNewVersion({ isOpen, onClose, document }: UploadNewVersionProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    changeNotes: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  if (!document) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: '' }));
      }
    }
  };

  const incrementVersion = (currentVersion: string): string => {
    const parts = currentVersion.split('.');
    if (parts.length === 0) return '1.0';

    // Increment the last part
    const lastPart = parseInt(parts[parts.length - 1]) || 0;
    parts[parts.length - 1] = (lastPart + 1).toString();

    return parts.join('.');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    }

    if (!formData.changeNotes.trim()) {
      newErrors.changeNotes = 'Please describe what changed in this version';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validate() || !selectedFile) return;

    setIsUploading(true);

    try {
      // Simulate file upload (in real app, this would upload to S3/cloud storage)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newVersionNumber = incrementVersion(document.currentVersion);

      const newVersion: DocumentVersion = {
        id: `version-${Date.now()}`,
        versionNumber: newVersionNumber,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileUrl: URL.createObjectURL(selectedFile), // In real app, this would be the uploaded URL
        uploadedBy: 'user-001',
        uploadedByName: 'Current User',
        uploadedAt: new Date().toISOString(),
        changeNotes: formData.changeNotes,
        isCurrent: true,
      };

      dispatch(addDocumentVersion({ documentId: document.id, version: newVersion }));

      // Reset form
      setFormData({ changeNotes: '' });
      setSelectedFile(null);
      setIsUploading(false);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setErrors({ upload: 'Upload failed. Please try again.' });
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFormData({ changeNotes: '' });
      setSelectedFile(null);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Upload New Version: ${document.name}`}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading}
            leftIcon={<IconUpload size={18} />}
          >
            {isUploading ? 'Uploading...' : 'Upload Version'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Current Version Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Current Version</p>
          <p className="text-lg font-semibold text-gray-900">Version {document.currentVersion}</p>
          <p className="text-xs text-gray-500 mt-1">
            New version will be: Version {incrementVersion(document.currentVersion)}
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File <span className="text-error-600">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="version-file-upload"
              accept={document.mimeType}
            />
            <label
              htmlFor="version-file-upload"
              className={`flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                errors.file
                  ? 'border-error-300 bg-error-50'
                  : selectedFile
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-gray-300 bg-gray-50 hover:border-brand-500 hover:bg-brand-50'
              }`}
            >
              {selectedFile ? (
                <>
                  <IconFileText size={24} className="text-brand-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-brand-900">{selectedFile.name}</p>
                    <p className="text-xs text-brand-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <IconUpload size={24} className="text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Click to select file</p>
                    <p className="text-xs text-gray-500">Accepted: {document.mimeType}</p>
                  </div>
                </>
              )}
            </label>
          </div>
          {errors.file && <p className="mt-1 text-sm text-error-600">{errors.file}</p>}
        </div>

        {/* Change Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change Notes <span className="text-error-600">*</span>
          </label>
          <textarea
            value={formData.changeNotes}
            onChange={(e) => handleInputChange('changeNotes', e.target.value)}
            placeholder="Describe what changed in this version..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
              errors.changeNotes ? 'border-error-500' : 'border-gray-300'
            }`}
            disabled={isUploading}
          />
          {errors.changeNotes && (
            <p className="mt-1 text-sm text-error-600">{errors.changeNotes}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Help others understand what's new or different in this version
          </p>
        </div>

        {/* Upload Error */}
        {errors.upload && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-3">
            <p className="text-sm text-error-700">{errors.upload}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">About Uploading New Versions</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Previous versions will be preserved in version history</li>
            <li>The new version will automatically become the current version</li>
            <li>All users with access will see the updated document</li>
            <li>You can always restore a previous version if needed</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
