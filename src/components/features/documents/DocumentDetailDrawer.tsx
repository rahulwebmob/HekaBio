/**
 * Document Detail Drawer
 * For viewing document details, versions, comments, and permissions
 */

import { useState } from 'react';
import {
  IconFileText,
  IconDownload,
  IconEye,
  IconEdit,
  IconTrash,
  IconLock,
  IconShield,
  IconCheck,
  IconX,
  IconClock,
  IconUser,
  IconMessage,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import {
  deleteDocument,
  incrementViewCount,
  incrementDownloadCount,
  approveDocument,
  rejectDocument,
  archiveDocument,
  addComment,
} from '../../../store/slices/documentsSlice';
import { Drawer, Badge, Button } from '../../ui';
import type { Document, DocumentStatus } from '../../../types/document.types';
import { getDocumentCategoryColor, formatFileSize } from '../../../types/document.types';

interface DocumentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onEdit?: (document: Document) => void;
}

export default function DocumentDetailDrawer({
  isOpen,
  onClose,
  document,
  onEdit,
}: DocumentDetailDrawerProps) {
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!document) return null;

  const currentVersion = document.versions.find((v) => v.isCurrent);

  const handleView = () => {
    dispatch(incrementViewCount(document.id));
    // In real app, open document viewer
    window.open(document.fileUrl, '_blank');
  };

  const handleDownload = () => {
    dispatch(incrementDownloadCount(document.id));
    // In real app, trigger download
    window.open(document.fileUrl, '_blank');
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleDelete = () => {
    dispatch(deleteDocument(document.id));
    onClose();
  };

  const handleApprove = () => {
    dispatch(
      approveDocument({
        documentId: document.id,
        approvedBy: 'user-001',
        approvedByName: 'Current User',
      })
    );
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      dispatch(
        rejectDocument({
          documentId: document.id,
          rejectedBy: 'user-001',
          rejectedByName: 'Current User',
          reason,
        })
      );
    }
  };

  const handleArchive = () => {
    dispatch(archiveDocument(document.id));
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      dispatch(
        addComment({
          documentId: document.id,
          comment: {
            id: `comment-${Date.now()}`,
            userId: 'user-001',
            userName: 'Current User',
            content: commentText,
            createdAt: new Date().toISOString(),
          },
        })
      );
      setCommentText('');
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    const variants: Record<
      DocumentStatus,
      { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }
    > = {
      DRAFT: { variant: 'default', label: 'Draft' },
      UNDER_REVIEW: { variant: 'warning', label: 'Under Review' },
      APPROVED: { variant: 'success', label: 'Approved' },
      REJECTED: { variant: 'error', label: 'Rejected' },
      ARCHIVED: { variant: 'default', label: 'Archived' },
      ACTIVE: { variant: 'success', label: 'Active' },
      EXPIRED: { variant: 'error', label: 'Expired' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAccessLevelIcon = (accessLevel: string) => {
    switch (accessLevel) {
      case 'RESTRICTED':
        return <IconShield size={18} className="text-error-600" />;
      case 'CONFIDENTIAL':
        return <IconLock size={18} className="text-warning-600" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Document Details"
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {document.status === 'UNDER_REVIEW' && (
              <>
                <Button variant="primary" leftIcon={<IconCheck size={18} />} onClick={handleApprove}>
                  Approve
                </Button>
                <Button variant="ghost" leftIcon={<IconX size={18} />} onClick={handleReject}>
                  Reject
                </Button>
              </>
            )}
            {document.status !== 'ARCHIVED' && (
              <Button variant="ghost" onClick={handleArchive}>
                Archive
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" leftIcon={<IconEye size={18} />} onClick={handleView}>
              View
            </Button>
            <Button variant="secondary" leftIcon={<IconDownload size={18} />} onClick={handleDownload}>
              Download
            </Button>
            <Button variant="primary" leftIcon={<IconEdit size={18} />} onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/60 rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${getDocumentCategoryColor(document.category)}`}
              >
                <IconFileText size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-semibold text-gray-900">{document.name}</h3>
                  {getAccessLevelIcon(document.accessLevel)}
                </div>
                <p className="text-sm text-gray-600">{currentVersion?.fileName || 'No file'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Version {document.currentVersion} • {formatFileSize(document.fileSize)}
                </p>
              </div>
            </div>
            {getStatusBadge(document.status)}
          </div>

          {document.description && (
            <p className="text-gray-700 border-t border-gray-200/50 pt-4">{document.description}</p>
          )}

          {/* Tags */}
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-200/50 pt-4">
              {document.tags.map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconUser size={16} />
              <span className="text-sm font-medium">Owner</span>
            </div>
            <p className="text-gray-900">{document.ownerName}</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconClock size={16} />
              <span className="text-sm font-medium">Created At</span>
            </div>
            <p className="text-gray-900">{formatDate(document.createdAt)}</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconEye size={16} />
              <span className="text-sm font-medium">Views</span>
            </div>
            <p className="text-gray-900">{document.viewCount}</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconDownload size={16} />
              <span className="text-sm font-medium">Downloads</span>
            </div>
            <p className="text-gray-900">{document.downloadCount}</p>
          </div>
        </div>

        {/* Company */}
        {document.company && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Associated Company</h4>
            <p className="text-gray-900">{document.company.name}</p>
          </div>
        )}

        {/* Version History */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Version History</h4>
          <div className="space-y-2">
            {document.versions
              .sort((a, b) => b.versionNumber.localeCompare(a.versionNumber))
              .map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 bg-white/40 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">v{version.versionNumber}</span>
                      {version.isCurrent && (
                        <Badge variant="success" size="sm">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {version.uploadedByName} • {formatDate(version.uploadedAt)}
                    </p>
                    {version.changeNotes && (
                      <p className="text-sm text-gray-700 mt-1">{version.changeNotes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatFileSize(version.fileSize)}</span>
                    <IconDownload
                      size={16}
                      className="text-gray-600 cursor-pointer hover:text-brand-600 transition-colors"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Permissions</h4>
          <div className="space-y-2">
            {document.permissions.map((permission) => (
              <div
                key={permission.userId}
                className="flex items-center justify-between p-3 bg-white/40 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{permission.userName}</p>
                  <p className="text-xs text-gray-600">
                    {[
                      permission.canView && 'View',
                      permission.canEdit && 'Edit',
                      permission.canDelete && 'Delete',
                      permission.canShare && 'Share',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <IconMessage size={18} />
            Comments ({document.comments.length})
          </h4>

          {/* Add Comment */}
          <div className="mb-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
            <div className="mt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={handleAddComment}>
                Add Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {document.comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-white/40 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{comment.userName}</p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-900 mb-3">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" leftIcon={<IconTrash size={16} />} onClick={handleDelete}>
                Confirm Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showDeleteConfirm && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<IconTrash size={16} />}
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error-600 hover:text-error-700 hover:bg-error-50"
            >
              Delete Document
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
