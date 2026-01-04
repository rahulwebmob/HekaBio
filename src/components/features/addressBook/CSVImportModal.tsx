/**
 * CSV Import Modal
 * Import contacts from CSV file
 */

import { useState, useRef } from 'react';
import { IconUpload, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Modal, Button, Badge } from '../../ui';
import { parseContactsCSV, validateContactsData, type ContactValidationError } from '../../../utils/csvUtils';
import type { Contact } from '../../../types/addressBook.types';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: Partial<Contact>[]) => void;
}

export default function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [csvData, setCsvData] = useState<Partial<Contact>[]>([]);
  const [errors, setErrors] = useState<ContactValidationError[]>([]);
  const [step, setStep] = useState<'upload' | 'validate' | 'complete'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      try {
        const parsedData = parseContactsCSV(csvContent);
        const validationErrors = validateContactsData(parsedData);

        setCsvData(parsedData);
        setErrors(validationErrors);
        setStep('validate');
      } catch (error) {
        console.error('CSV parsing error:', error);
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (errors.length === 0) {
      onImport(csvData);
      setStep('complete');
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setCsvData([]);
    setErrors([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    const template = `First Name,Last Name,Email,Phone,Title,Department,Company,Primary Contact,Notes
John,Doe,john.doe@example.com,+1-555-0100,CEO,Executive,Example Corp,TRUE,Sample contact
Jane,Smith,jane.smith@example.com,+1-555-0101,CTO,Technology,Example Corp,FALSE,Another sample`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contacts-template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Contacts from CSV"
      size="lg"
    >
      <div className="space-y-6">
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <IconUpload size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select a CSV file containing contact information
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <Button variant="primary" onClick={() => fileInputRef.current?.click()} leftIcon={<IconUpload size={18} />}>
                  Choose File
                </Button>
              </div>
            </div>

            <div className="bg-brand-50 rounded-lg p-4 border border-brand-200">
              <p className="text-sm font-medium text-brand-900 mb-2">CSV Format Requirements:</p>
              <ul className="text-sm text-brand-700 space-y-1 list-disc list-inside">
                <li>Required columns: First Name, Last Name, Email</li>
                <li>Optional columns: Phone, Title, Department, Company, Primary Contact, Notes</li>
                <li>First row must be column headers</li>
                <li>Use comma (,) as delimiter</li>
              </ul>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  Download Template
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Validate */}
        {step === 'validate' && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Found {csvData.length} contacts
                  </p>
                  {errors.length > 0 ? (
                    <p className="text-sm text-error-600">
                      {errors.length} validation errors found
                    </p>
                  ) : (
                    <p className="text-sm text-success-600">
                      All contacts are valid and ready to import
                    </p>
                  )}
                </div>
                <Badge variant={errors.length > 0 ? 'error' : 'success'} size="lg">
                  {errors.length > 0 ? 'Has Errors' : 'Ready to Import'}
                </Badge>
              </div>

              {/* Error List */}
              {errors.length > 0 && (
                <div className="bg-error-50 rounded-lg p-4 border border-error-200 max-h-64 overflow-y-auto">
                  <div className="flex items-start gap-2 mb-2">
                    <IconAlertCircle size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-error-900">Validation Errors:</p>
                  </div>
                  <ul className="space-y-1 ml-7">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-error-700">
                        Row {error.row}, {error.field}: {error.message}
                        </li>
                    ))}
                  </ul>
                  <p className="text-xs text-error-600 mt-3">
                    Please fix these errors in your CSV file and re-upload.
                  </p>
                </div>
              )}

              {/* Preview of first few contacts */}
              {errors.length === 0 && csvData.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview (first 5 contacts):</p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-2">
                      {csvData.slice(0, 5).map((contact, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <IconCheck size={16} className="text-success-600" />
                          <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                          <span className="text-gray-500">({contact.email})</span>
                        </div>
                      ))}
                      {csvData.length > 5 && (
                        <p className="text-xs text-gray-500 mt-2">
                          ... and {csvData.length - 5} more contacts
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setStep('upload');
                  setCsvData([]);
                  setErrors([]);
                }}
              >
                Upload Different File
              </Button>
              {errors.length === 0 && (
                <Button variant="primary" onClick={handleImport}>
                  Import {csvData.length} Contacts
                </Button>
              )}
            </div>
          </>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCheck size={32} className="text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Import Successful!
            </h3>
            <p className="text-gray-600">
              {csvData.length} contacts have been imported successfully
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
