/**
 * Document Form Drawer
 * For uploading and editing documents
 */

import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/store';
import { addDocument, updateDocument } from '../../../store/slices/documentsSlice';
import { Drawer, Input, Select, Button } from '../../ui';
import type {
  Document,
  DocumentCategory,
  AccessLevel,
  FileType,
} from '../../../types/document.types';
import { getFileTypeFromMime } from '../../../types/document.types';

interface DocumentFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document?: Document | null;
}

export default function DocumentFormDrawer({ isOpen, onClose, document }: DocumentFormDrawerProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!document;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'CONTRACT' as DocumentCategory,
    accessLevel: 'INTERNAL' as AccessLevel,
    tags: [] as string[],
    fileUrl: '',
    fileName: '',
    mimeType: 'application/pdf',
    fileSize: 0,
    companyId: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (document && isOpen) {
      const currentVersion = document.versions.find((v) => v.isCurrent);
      setFormData({
        name: document.name,
        description: document.description || '',
        category: document.category,
        accessLevel: document.accessLevel,
        tags: document.tags,
        fileUrl: document.fileUrl,
        fileName: currentVersion?.fileName || '',
        mimeType: document.mimeType,
        fileSize: document.fileSize,
        companyId: document.companyId || '',
      });
    } else if (!isOpen) {
      // Reset form when drawer closes
      setFormData({
        name: '',
        description: '',
        category: 'CONTRACT',
        accessLevel: 'INTERNAL',
        tags: [],
        fileUrl: '',
        fileName: '',
        mimeType: 'application/pdf',
        fileSize: 0,
        companyId: '',
      });
      setTagInput('');
      setErrors({});
    }
  }, [document, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload - in real app, you'd upload to server
      const fileName = file.name;
      const fileSize = file.size;
      const mimeType = file.type;
      const fileUrl = URL.createObjectURL(file); // Mock URL

      setFormData((prev) => ({
        ...prev,
        fileName,
        fileSize,
        mimeType,
        fileUrl,
        name: prev.name || fileName.replace(/\.[^/.]+$/, ''), // Use filename as name if empty
      }));
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Document name is required';
    }

    if (!isEdit && !formData.fileUrl) {
      newErrors.file = 'Please upload a file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && document) {
      // Update existing document
      dispatch(
        updateDocument({
          documentId: document.id,
          updates: {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            accessLevel: formData.accessLevel,
            tags: formData.tags,
            companyId: formData.companyId || undefined,
          },
        })
      );
    } else {
      // Create new document
      const fileType: FileType = getFileTypeFromMime(formData.mimeType);
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        status: 'DRAFT',
        mimeType: formData.mimeType,
        fileType,
        fileSize: formData.fileSize,
        fileUrl: formData.fileUrl,
        currentVersion: '1.0',
        accessLevel: formData.accessLevel,
        tags: formData.tags,
        versions: [
          {
            id: `ver-${Date.now()}`,
            versionNumber: '1.0',
            fileName: formData.fileName,
            fileUrl: formData.fileUrl,
            fileSize: formData.fileSize,
            uploadedBy: 'user-001',
            uploadedByName: 'Current User',
            uploadedAt: new Date().toISOString(),
            changeNotes: 'Initial version',
            isCurrent: true,
          },
        ],
        ownerId: 'user-001',
        ownerName: 'Current User',
        permissions: [
          {
            userId: 'user-001',
            userName: 'Current User',
            canView: true,
            canEdit: true,
            canDelete: true,
            canShare: true,
          },
        ],
        comments: [],
        requiresApproval: false,
        viewCount: 0,
        downloadCount: 0,
        isPublic: false,
        isEncrypted: false,
        isPasswordProtected: false,
        createdAt: new Date().toISOString(),
        createdBy: 'user-001',
        updatedAt: new Date().toISOString(),
        companyId: formData.companyId || undefined,
      };

      dispatch(addDocument(newDocument));
    }

    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Document' : 'Upload Document'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? 'Update Document' : 'Upload Document'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* File Upload */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File <span className="text-error-600">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-brand-50 file:text-brand-600
                hover:file:bg-brand-100
                cursor-pointer"
            />
            {errors.file && <p className="mt-1 text-sm text-error-600">{errors.file}</p>}
            {formData.fileName && (
              <p className="mt-2 text-sm text-gray-600">Selected: {formData.fileName}</p>
            )}
          </div>
        )}

        {/* Document Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Name <span className="text-error-600">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter document name"
            fullWidth
            error={errors.name}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter document description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <Select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            options={[
              { value: 'CONTRACT', label: 'Contract' },
              { value: 'PROPOSAL', label: 'Proposal' },
              { value: 'NDA', label: 'NDA' },
              { value: 'PROTOCOL', label: 'Protocol' },
              { value: 'FINANCIAL', label: 'Financial' },
              { value: 'PRESENTATION', label: 'Presentation' },
              { value: 'TECHNICAL', label: 'Technical' },
              { value: 'REGULATORY', label: 'Regulatory' },
            ]}
            fullWidth
          />
        </div>

        {/* Access Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
          <Select
            value={formData.accessLevel}
            onChange={(e) => handleInputChange('accessLevel', e.target.value)}
            options={[
              { value: 'PUBLIC', label: 'Public' },
              { value: 'INTERNAL', label: 'Internal' },
              { value: 'CONFIDENTIAL', label: 'Confidential' },
              { value: 'RESTRICTED', label: 'Restricted' },
            ]}
            fullWidth
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tag and press Enter"
              fullWidth
            />
            <Button variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-brand-900 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
