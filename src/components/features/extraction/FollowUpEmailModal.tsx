/**
 * Follow-Up Email Modal
 * Generate email for requesting missing information
 */

import { useState } from 'react';
import { IconMail, IconCopy, IconCheck } from '@tabler/icons-react';
import { Modal, Button } from '../../ui';
import type { GapAnalysisResult } from '../../../types/extraction.types';
import { generateFollowUpEmail } from '../../../services/extractionService';

interface FollowUpEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gapAnalysis: GapAnalysisResult | null;
  companyName: string;
  projectName: string;
}

export default function FollowUpEmailModal({
  isOpen,
  onClose,
  gapAnalysis,
  companyName,
  projectName,
}: FollowUpEmailModalProps) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  if (!gapAnalysis) return null;

  const emailContent = generateFollowUpEmail(gapAnalysis, companyName, projectName);
  const followUpLink = `${window.location.origin}/follow-up/${gapAnalysis.projectId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailContent.replace('[Follow-up Form Link]', followUpLink));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    // Mock send email
    console.log('Sending follow-up email:', emailContent);
    setSent(true);
    setTimeout(() => {
      onClose();
      setSent(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Follow-Up Email" size="lg">
      <div className="space-y-6">
        {/* Email Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">To:</label>
            <div className="text-sm text-gray-900">{companyName}</div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Subject:</label>
            <div className="text-sm text-gray-900">
              Additional Information Needed: {projectName}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Message:</label>
            <div className="bg-white rounded border border-gray-200 p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                {emailContent}
              </pre>
            </div>
          </div>
        </div>

        {/* Follow-up Form Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-xs font-semibold text-blue-900 mb-2">
            Follow-Up Form Link:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={followUpLink}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm text-blue-900"
            />
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <IconCheck size={16} className="mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <IconCopy size={16} className="mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            This link will take the recipient to a focused form with only the missing fields
          </p>
        </div>

        {/* Gap Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Missing Fields Summary</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-600">Critical:</span>
              <span className="ml-2 font-semibold text-error-600">
                {gapAnalysis.criticalGaps}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Important:</span>
              <span className="ml-2 font-semibold text-warning-600">
                {gapAnalysis.importantGaps}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Optional:</span>
              <span className="ml-2 font-semibold text-gray-600">
                {gapAnalysis.optionalGaps}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose} disabled={sent}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleCopy} disabled={sent}>
            <IconCopy size={18} className="mr-2" />
            Copy Email
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={sent}>
            {sent ? (
              <>
                <IconCheck size={18} className="mr-2" />
                Email Sent!
              </>
            ) : (
              <>
                <IconMail size={18} className="mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
