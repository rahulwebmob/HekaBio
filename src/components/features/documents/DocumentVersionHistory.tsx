/**
 * Document Version History
 * View and manage document versions
 */

import { useState } from 'react';
import {
  IconClock,
  IconDownload,
  IconEye,
  IconRefresh,
  IconCheck,
  IconUser,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import {
  restoreDocumentVersion,
  incrementDownloadCount,
} from '../../../store/slices/documentsSlice';
import { Drawer, Button, Badge } from '../../ui';
import type { Document, DocumentVersion } from '../../../types/document.types';
import { formatFileSize } from '../../../types/document.types';

interface DocumentVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onPreviewVersion?: (version: DocumentVersion) => void;
}

export default function DocumentVersionHistory({
  isOpen,
  onClose,
  document,
  onPreviewVersion,
}: DocumentVersionHistoryProps) {
  const dispatch = useAppDispatch();
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);

  if (!document) return null;

  // Sort versions by upload date (newest first)
  const sortedVersions = [...document.versions].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  const handleRestoreVersion = (versionId: string) => {
    if (
      window.confirm(
        'Are you sure you want to restore this version? This will make it the current version.'
      )
    ) {
      setRestoringVersion(versionId);
      dispatch(restoreDocumentVersion({ documentId: document.id, versionId }));
      setTimeout(() => {
        setRestoringVersion(null);
      }, 1000);
    }
  };

  const handleDownloadVersion = (version: DocumentVersion) => {
    // Trigger download
    const link = window.document.createElement('a');
    link.href = version.fileUrl;
    link.download = version.fileName;
    link.click();
    dispatch(incrementDownloadCount(document.id));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVersionColor = (version: DocumentVersion) => {
    if (version.isCurrent) return 'bg-success-50 border-success-200';
    return 'bg-white border-gray-200';
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Version History: ${document.name}`}
      size="lg"
      footer={
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {sortedVersions.length} version{sortedVersions.length !== 1 ? 's' : ''}
          </span>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Current Version Info */}
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconCheck size={18} className="text-brand-600" />
            <h3 className="font-semibold text-brand-900">Current Version</h3>
          </div>
          <p className="text-sm text-brand-700">
            Version {document.currentVersion} - Last updated {formatDate(document.updatedAt)}
          </p>
        </div>

        {/* Version List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">All Versions</h3>

          {sortedVersions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <IconClock size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No version history available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedVersions.map((version, index) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 transition-all ${getVersionColor(version)}`}
                >
                  {/* Version Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          Version {version.versionNumber}
                        </h4>
                        {version.isCurrent && (
                          <Badge variant="success" size="sm">
                            Current
                          </Badge>
                        )}
                        {index === 0 && !version.isCurrent && (
                          <Badge variant="info" size="sm">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{version.fileName}</p>
                    </div>

                    <div className="flex gap-1 flex-shrink-0 ml-4">
                      {onPreviewVersion && (
                        <button
                          onClick={() => onPreviewVersion(version)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview Version"
                        >
                          <IconEye size={16} className="text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadVersion(version)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download Version"
                      >
                        <IconDownload size={16} className="text-gray-600" />
                      </button>
                      {!version.isCurrent && (
                        <button
                          onClick={() => handleRestoreVersion(version.id)}
                          disabled={restoringVersion === version.id}
                          className="p-2 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Restore This Version"
                        >
                          {restoringVersion === version.id ? (
                            <IconRefresh size={16} className="text-brand-600 animate-spin" />
                          ) : (
                            <IconRefresh size={16} className="text-brand-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Version Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Uploaded By</p>
                      <div className="flex items-center gap-2">
                        <IconUser size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{version.uploadedByName}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                      <div className="flex items-center gap-2">
                        <IconClock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(version.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">File Size</p>
                    <span className="text-sm text-gray-900">
                      {formatFileSize(version.fileSize)}
                    </span>
                  </div>

                  {/* Change Notes */}
                  {version.changeNotes && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Change Notes</p>
                      <p className="text-sm text-gray-700">{version.changeNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">About Version Control</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Each time a document is updated, a new version is created</li>
            <li>You can restore any previous version to make it current</li>
            <li>All versions are preserved and can be downloaded separately</li>
            <li>The current version is highlighted in green</li>
          </ul>
        </div>
      </div>
    </Drawer>
  );
}
