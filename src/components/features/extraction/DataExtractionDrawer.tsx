/**
 * Data Extraction Drawer
 * Upload documents and extract data with AI (mock)
 */

import { useState } from 'react';
import {
  IconUpload,
  IconSparkles,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconEdit,
  IconLoader,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addExtraction, verifyField, verifyAllFields, addGapAnalysis } from '../../../store/slices/extractionSlice';
import { Drawer, Button, Badge } from '../../ui';
import type { ExtractionResult, ExtractedField } from '../../../types/extraction.types';
import { extractDataFromDocument, analyzeDataGaps } from '../../../services/extractionService';
import { getConfidenceColor, getConfidenceBadgeVariant, EXTRACTABLE_FIELDS } from '../../../types/extraction.types';

interface DataExtractionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export default function DataExtractionDrawer({
  isOpen,
  onClose,
  projectId,
}: DataExtractionDrawerProps) {
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setExtractionResult(null);

    try {
      // Call the AI extraction service
      const result = await extractDataFromDocument(file, projectId);
      setExtractionResult(result);
      dispatch(addExtraction(result));
    } catch (error) {
      console.error('Extraction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyField = (fieldName: string) => {
    if (!extractionResult) return;

    dispatch(
      verifyField({
        extractionId: extractionResult.id,
        fieldName,
        editedValue: editValue || undefined,
      })
    );

    // Update local state
    setExtractionResult({
      ...extractionResult,
      extractedFields: extractionResult.extractedFields.map((f) =>
        f.fieldName === fieldName
          ? { ...f, isVerified: true, editedValue: editValue || undefined }
          : f
      ),
    });

    setEditingField(null);
    setEditValue('');
  };

  const handleVerifyAll = () => {
    if (!extractionResult) return;

    dispatch(verifyAllFields(extractionResult.id));

    // Run gap analysis
    if (projectId) {
      const gapAnalysis = analyzeDataGaps(extractionResult.extractedFields, projectId);
      dispatch(addGapAnalysis(gapAnalysis));
    }

    setExtractionResult({
      ...extractionResult,
      status: 'VERIFIED',
      extractedFields: extractionResult.extractedFields.map((f) => ({
        ...f,
        isVerified: true,
      })),
    });
  };

  const startEditing = (field: ExtractedField) => {
    setEditingField(field.fieldName);
    setEditValue(String(field.editedValue || field.value));
  };

  const getFieldLabel = (fieldName: string): string => {
    return EXTRACTABLE_FIELDS[fieldName as keyof typeof EXTRACTABLE_FIELDS]?.label || fieldName;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="AI Data Extraction"
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <div>
            {extractionResult && (
              <p className="text-sm text-gray-600">
                {extractionResult.extractedFields.filter((f) => f.isVerified).length} of{' '}
                {extractionResult.extractedFields.length} fields verified
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {extractionResult && extractionResult.status !== 'VERIFIED' && (
              <Button variant="primary" onClick={handleVerifyAll}>
                Verify All & Analyze Gaps
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Upload Section */}
        {!extractionResult && !isProcessing && (
          <div className="bg-white/60 rounded-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconSparkles size={32} className="text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Introduction Deck
              </h3>
              <p className="text-gray-600 mb-6">
                Upload a PDF or PowerPoint file and our AI will extract key information
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                  <IconUpload size={20} />
                  Choose File
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white/60 rounded-lg p-8">
            <div className="text-center">
              <IconLoader size={48} className="mx-auto text-brand-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Document...
              </h3>
              <p className="text-gray-600">
                Our AI is analyzing your document and extracting key information
              </p>
            </div>
          </div>
        )}

        {/* Extraction Results */}
        {extractionResult && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-success-50 border border-success-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-success-900 mb-2">
                <IconCheck size={20} />
                <span className="font-semibold">Extraction Complete</span>
              </div>
              <p className="text-sm text-success-800">
                Successfully extracted {extractionResult.extractedFields.length} fields from{' '}
                {extractionResult.fileName} in {((extractionResult.processingTimeMs || 0) / 1000).toFixed(1)}s
              </p>
            </div>

            {/* Extracted Fields */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Extracted Data</h4>
              {extractionResult.extractedFields.map((field) => (
                <div
                  key={field.fieldName}
                  className={`bg-white/60 rounded-lg p-4 border ${
                    field.isVerified ? 'border-success-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {getFieldLabel(field.fieldName)}
                        </span>
                        <Badge
                          variant={getConfidenceBadgeVariant(field.confidence)}
                          size="sm"
                        >
                          {field.confidence}% confident
                        </Badge>
                        {field.isVerified && (
                          <Badge variant="success" size="sm">
                            <IconCheck size={12} className="mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Source: {field.source}</p>
                    </div>
                  </div>

                  {editingField === field.fieldName ? (
                    <div className="space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyField(field.fieldName)}
                        >
                          Save & Verify
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingField(null);
                            setEditValue('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <p
                        className={`flex-1 ${getConfidenceColor(field.confidence)}`}
                      >
                        {String(field.editedValue || field.value)}
                      </p>
                      <div className="flex gap-2">
                        {!field.isVerified && (
                          <>
                            <button
                              onClick={() => startEditing(field)}
                              className="text-brand-600 hover:text-brand-700 transition-colors"
                              title="Edit"
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleVerifyField(field.fieldName)}
                              className="text-success-600 hover:text-success-700 transition-colors"
                              title="Verify"
                            >
                              <IconCheck size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Confidence Legend */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                Confidence Levels
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <IconCheck size={14} className="text-success-600" />
                  <span>≥90% High confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconAlertCircle size={14} className="text-warning-600" />
                  <span>70-89% Medium confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconX size={14} className="text-error-600" />
                  <span>&lt;70% Low confidence - review carefully</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
