/**
 * Extraction Results Modal
 * Displays AI-extracted data with confidence scores and allows editing
 */

import { useState } from 'react';
import { IconCheck, IconX, IconEdit, IconSparkles, IconAlertCircle } from '@tabler/icons-react';
import { Button, Input, Modal, Badge } from '../ui';
import type { ExtractedField } from '../../services/aiExtraction.service';

interface ExtractionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedFields: ExtractedField[];
  processingTime?: number;
  onApprove: (approvedData: Record<string, string>) => void;
}

export function ExtractionResultsModal({
  isOpen,
  onClose,
  extractedFields,
  processingTime,
  onApprove,
}: ExtractionResultsModalProps) {
  const [editedFields, setEditedFields] = useState<Record<string, string>>(
    extractedFields.reduce(
      (acc, field) => {
        acc[field.field] = field.value;
        return acc;
      },
      {} as Record<string, string>
    )
  );

  const [editingField, setEditingField] = useState<string | null>(null);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return (
        <Badge variant="success" size="sm">
          High ({confidence.toFixed(0)}%)
        </Badge>
      );
    } else if (confidence >= 75) {
      return (
        <Badge variant="warning" size="sm">
          Medium ({confidence.toFixed(0)}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="error" size="sm">
          Low ({confidence.toFixed(0)}%)
        </Badge>
      );
    }
  };

  const handleFieldEdit = (fieldName: string, value: string) => {
    setEditedFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleApprove = () => {
    onApprove(editedFields);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Extraction Results"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            {processingTime && <span>Processed in {processingTime}s</span>}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" leftIcon={<IconCheck size={18} />} onClick={handleApprove}>
              Approve & Apply
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-brand-50 border border-brand-200 rounded-lg">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            <IconSparkles size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="font-semibold text-brand-900">
              AI has extracted {extractedFields.length} fields from the introduction deck
            </p>
            <p className="text-sm text-brand-700">
              Review the confidence scores and edit any fields as needed before applying
            </p>
          </div>
        </div>

        {/* Low confidence warning */}
        {extractedFields.some((f) => f.confidence < 75) && (
          <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <IconAlertCircle size={20} className="text-warning-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-warning-900">
                Some fields have low confidence scores
              </p>
              <p className="text-warning-700">
                Please review and verify these fields before approving
              </p>
            </div>
          </div>
        )}

        {/* Extracted Fields */}
        <div className="space-y-3">
          {extractedFields.map((field) => (
            <div
              key={field.field}
              className="p-4 border border-gray-200 rounded-lg hover:border-brand-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-semibold text-gray-900">{field.label}</label>
                    {getConfidenceBadge(field.confidence)}
                  </div>
                  <p className="text-xs text-gray-500">Source: {field.source}</p>
                </div>
                <button
                  onClick={() => setEditingField(editingField === field.field ? null : field.field)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  title="Edit field"
                >
                  {editingField === field.field ? (
                    <IconX size={16} className="text-gray-600" />
                  ) : (
                    <IconEdit size={16} className="text-gray-600" />
                  )}
                </button>
              </div>

              {editingField === field.field ? (
                <Input
                  value={editedFields[field.field] || ''}
                  onChange={(e) => handleFieldEdit(field.field, e.target.value)}
                  fullWidth
                  autoFocus
                />
              ) : (
                <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                  {editedFields[field.field] || field.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">How AI Extraction Works</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• AI analyzes the uploaded introduction deck (PDF/PPT)</li>
            <li>• Extracts key fields with confidence scores based on text analysis</li>
            <li>• High confidence (&gt;90%): Strong match found</li>
            <li>• Medium confidence (75-90%): Likely match, please verify</li>
            <li>• Low confidence (&lt;75%): Uncertain match, please review carefully</li>
            <li>• You can edit any field before applying the extracted data</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
