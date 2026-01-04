/**
 * Email Composer Drawer
 * For composing and sending emails
 */

import { useState, useMemo } from 'react';
import { IconPaperclip, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { addCommunication, updateCommunication } from '../../../store/slices/communicationsSlice';
import { Drawer, Input, Select, Button } from '../../ui';
import type {
  Communication,
  CommunicationPriority,
  CommunicationStatus,
} from '../../../types/communication.types';

interface EmailComposerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  communication?: Communication | null;
  replyTo?: Communication | null;
}

export default function EmailComposerDrawer({
  isOpen,
  onClose,
  communication,
  replyTo,
}: EmailComposerDrawerProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const isEdit = !!communication;
  const isReply = !!replyTo;

  // Compute initial form data
  const initialFormData = useMemo(() => {
    if (communication) {
      // Editing existing draft
      return {
        to: communication.to.join(', '),
        cc: communication.cc?.join(', ') || '',
        bcc: communication.bcc?.join(', ') || '',
        subject: communication.subject,
        body: communication.body,
        priority: communication.priority,
        companyId: communication.companyId,
        needsFollowUp: communication.needsFollowUp,
        followUpDate: communication.followUpDate
          ? new Date(communication.followUpDate).toISOString().split('T')[0]
          : '',
        tags: communication.tags,
      };
    } else if (replyTo) {
      // Replying to an email
      return {
        to: replyTo.from,
        cc: '',
        bcc: '',
        subject: replyTo.subject.startsWith('Re:')
          ? replyTo.subject
          : `Re: ${replyTo.subject}`,
        body: `\n\n--- Original Message ---\n${replyTo.body}`,
        priority: replyTo.priority,
        companyId: replyTo.companyId,
        needsFollowUp: false,
        followUpDate: '',
        tags: replyTo.tags,
      };
    } else {
      // New email - reset form
      return {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        priority: 'MEDIUM' as CommunicationPriority,
        companyId: '',
        needsFollowUp: false,
        followUpDate: '',
        tags: [] as string[],
      };
    }
  }, [communication, replyTo]);

  const [formData, setFormData] = useState(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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

  const parseEmails = (emailString: string): string[] => {
    return emailString
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter((e) => e);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.to.trim()) {
      newErrors.to = 'Recipient email is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Email body is required';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Please select a company';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    if (!formData.to.trim() && !formData.subject.trim()) {
      return; // Don't save empty drafts
    }

    const company = companies.find((c) => c.id === formData.companyId);
    if (!company) return;

    const draftCommunication: Communication = {
      id: communication?.id || `comm-draft-${Date.now()}`,
      type: 'EMAIL',
      subject: formData.subject || '(No Subject)',
      body: formData.body,
      from: 'user@hekabio.com',
      to: parseEmails(formData.to),
      cc: formData.cc ? parseEmails(formData.cc) : undefined,
      bcc: formData.bcc ? parseEmails(formData.bcc) : undefined,
      companyId: formData.companyId,
      company,
      status: 'DRAFT',
      priority: formData.priority,
      needsFollowUp: formData.needsFollowUp,
      followUpDate: formData.followUpDate
        ? new Date(formData.followUpDate).toISOString()
        : undefined,
      followUpCompleted: false,
      tags: formData.tags,
      isArchived: false,
      isPinned: false,
      createdAt: communication?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-001',
    };

    if (communication) {
      dispatch(updateCommunication(draftCommunication));
    } else {
      dispatch(addCommunication(draftCommunication));
    }

    onClose();
  };

  const handleSend = () => {
    if (!validate()) return;

    const company = companies.find((c) => c.id === formData.companyId);
    if (!company) return;

    const status: CommunicationStatus = 'SENT';
    const now = new Date().toISOString();

    const sentCommunication: Communication = {
      id: communication?.id || `comm-${Date.now()}`,
      type: 'EMAIL',
      subject: formData.subject,
      body: formData.body,
      from: 'user@hekabio.com',
      to: parseEmails(formData.to),
      cc: formData.cc ? parseEmails(formData.cc) : undefined,
      bcc: formData.bcc ? parseEmails(formData.bcc) : undefined,
      companyId: formData.companyId,
      company,
      status,
      priority: formData.priority,
      messageId: `msg-${Date.now()}`,
      threadId: replyTo?.threadId || `thread-${Date.now()}`,
      inReplyTo: replyTo?.id,
      sentAt: now,
      needsFollowUp: formData.needsFollowUp,
      followUpDate: formData.followUpDate
        ? new Date(formData.followUpDate).toISOString()
        : undefined,
      followUpCompleted: false,
      tags: formData.tags,
      isArchived: false,
      isPinned: false,
      createdAt: communication?.createdAt || now,
      updatedAt: now,
      createdBy: 'user-001',
    };

    if (communication && communication.status === 'DRAFT') {
      dispatch(updateCommunication(sentCommunication));
    } else {
      dispatch(addCommunication(sentCommunication));
    }

    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? 'Edit Draft'
          : isReply
          ? 'Reply to Email'
          : 'New Email'
      }
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSend}>
              Send Email
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-error-600">*</span>
          </label>
          <Select
            value={formData.companyId}
            onChange={(e) => handleInputChange('companyId', e.target.value)}
            options={[
              { value: '', label: 'Select a company' },
              ...companies.map((company) => ({
                value: company.id,
                label: company.name,
              })),
            ]}
            fullWidth
            error={errors.companyId}
          />
        </div>

        {/* To Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To <span className="text-error-600">*</span>
          </label>
          <Input
            value={formData.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
            placeholder="recipient@example.com (separate multiple with comma)"
            fullWidth
            error={errors.to}
          />
        </div>

        {/* CC Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CC</label>
          <Input
            value={formData.cc}
            onChange={(e) => handleInputChange('cc', e.target.value)}
            placeholder="cc@example.com (optional)"
            fullWidth
          />
        </div>

        {/* BCC Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">BCC</label>
          <Input
            value={formData.bcc}
            onChange={(e) => handleInputChange('bcc', e.target.value)}
            placeholder="bcc@example.com (optional)"
            fullWidth
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <Select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'URGENT', label: 'Urgent' },
            ]}
            fullWidth
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-error-600">*</span>
          </label>
          <Input
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Enter email subject"
            fullWidth
            error={errors.subject}
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-error-600">*</span>
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Compose your email..."
            rows={12}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
              errors.body ? 'border-error-500' : 'border-gray-300'
            }`}
          />
          {errors.body && <p className="mt-1 text-sm text-error-600">{errors.body}</p>}
        </div>

        {/* Follow-up */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="needsFollowUp"
              checked={formData.needsFollowUp}
              onChange={(e) => handleInputChange('needsFollowUp', e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
            />
            <label htmlFor="needsFollowUp" className="text-sm font-medium text-gray-700">
              Needs Follow-up
            </label>
          </div>

          {formData.needsFollowUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
          )}
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
                  <IconX size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Attachments placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <IconPaperclip size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop files or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">(Feature coming soon)</p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
