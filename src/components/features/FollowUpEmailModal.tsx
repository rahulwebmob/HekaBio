/**
 * Follow-Up Email Generator Modal
 * Creates automated follow-up emails for missing survey data
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconMail,
  IconCopy,
  IconCheck,
  IconSend,
  IconExternalLink,
  IconEdit,
} from '@tabler/icons-react';
import { Button, Input, Modal, Badge } from '../ui';
import type { DataGap } from './GapAnalysisReport';
import type { SurveyInstance } from '../../types/survey.types';

interface FollowUpEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyInstance: SurveyInstance;
  gaps: DataGap[];
}

export function FollowUpEmailModal({
  isOpen,
  onClose,
  surveyInstance,
  gaps,
}: FollowUpEmailModalProps) {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState(
    `Follow-up: Additional Information Needed - ${surveyInstance.template.name}`
  );
  const [emailBody, setEmailBody] = useState(generateEmailBody());
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  function generateEmailBody(): string {
    const criticalGaps = gaps.filter((g) => g.priority === 'critical');
    const importantGaps = gaps.filter((g) => g.priority === 'important');

    // Generate follow-up form link
    const followUpLink = `${window.location.origin}/survey/${surveyInstance.id}/follow-up`;

    let body = `Dear ${surveyInstance.company.name} Team,\n\n`;
    body += `Thank you for submitting your response to the ${surveyInstance.template.name}. We've reviewed your submission and would like to request some additional information to complete our assessment.\n\n`;

    if (criticalGaps.length > 0) {
      body += `**Required Information:**\n`;
      criticalGaps.forEach((gap, idx) => {
        body += `${idx + 1}. ${gap.questionText} (${gap.section})\n`;
      });
      body += `\n`;
    }

    if (importantGaps.length > 0) {
      body += `**Additional Information (Recommended):**\n`;
      importantGaps.forEach((gap, idx) => {
        body += `${idx + 1}. ${gap.questionText} (${gap.section})\n`;
      });
      body += `\n`;
    }

    body += `To provide this information, please use the following link to access a focused follow-up form containing only the missing fields:\n\n`;
    body += `${followUpLink}\n\n`;
    body += `This form will take approximately ${Math.ceil(gaps.length / 2)} minutes to complete.\n\n`;
    body += `If you have any questions or need clarification on any of the requested information, please don't hesitate to reach out.\n\n`;
    body += `Best regards,\n`;
    body += `HekaBio Team`;

    return body;
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    // Simulate sending email
    console.log('Sending follow-up email to:', recipientEmail);
    console.log('Subject:', subject);
    console.log('Body:', emailBody);

    setSent(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  const handleOpenFollowUpForm = () => {
    navigate(`/survey/${surveyInstance.id}/follow-up`);
  };

  const criticalCount = gaps.filter((g) => g.priority === 'critical').length;
  const importantCount = gaps.filter((g) => g.priority === 'important').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Follow-Up Email"
      size="xl"
      footer={
        !sent ? (
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              leftIcon={copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              onClick={handleCopyEmail}
            >
              {copied ? 'Copied!' : 'Copy Email'}
            </Button>
            <Button
              variant="primary"
              leftIcon={<IconSend size={18} />}
              onClick={handleSendEmail}
              disabled={!recipientEmail}
            >
              Send Email
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        )
      }
    >
      {!sent ? (
        <div className="space-y-6">
          {/* Gap Summary */}
          <div className="flex items-center gap-3 p-4 bg-brand-50 border border-brand-200 rounded-lg">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <IconMail size={20} className="text-brand-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-900">
                Requesting {gaps.length} missing field{gaps.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {criticalCount > 0 && (
                  <Badge variant="error" size="sm">
                    {criticalCount} Critical
                  </Badge>
                )}
                {importantCount > 0 && (
                  <Badge variant="warning" size="sm">
                    {importantCount} Important
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <Input
              label="Recipient Email *"
              type="email"
              placeholder="contact@company.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="Subject Line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Body
                </label>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <IconEdit size={14} />
                  {isEditing ? 'Preview' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={14}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm"
                />
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap text-sm text-gray-700 max-h-80 overflow-y-auto">
                  {emailBody}
                </div>
              )}
            </div>
          </div>

          {/* Follow-Up Form Link */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Follow-Up Form Link
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              This link will direct the recipient to a focused form containing only the missing fields.
            </p>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/survey/${surveyInstance.id}/follow-up`}
                readOnly
                fullWidth
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="outline"
                leftIcon={<IconExternalLink size={18} />}
                onClick={handleOpenFollowUpForm}
              >
                Open
              </Button>
            </div>
          </div>

          {/* Email Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Email Best Practices
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Be specific about what information is needed and why</li>
              <li>• Provide a clear deadline if time-sensitive</li>
              <li>• Offer to answer questions or provide clarification</li>
              <li>• Keep the tone professional but friendly</li>
              <li>• Include the direct follow-up form link for convenience</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
              <IconCheck size={32} className="text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-success-900 mb-2">
              Follow-Up Email Sent!
            </h3>
            <p className="text-sm text-success-700 text-center max-w-md">
              The follow-up email has been sent to <strong>{recipientEmail}</strong> with a link to complete the missing information.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Recipient will receive the email with follow-up form link</li>
              <li>• They can complete only the missing fields</li>
              <li>• Responses will automatically update this survey instance</li>
              <li>• You'll be notified when they submit the follow-up</li>
              <li>• Gap analysis will update in real-time</li>
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}
