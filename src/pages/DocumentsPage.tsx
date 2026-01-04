/**
 * Documents Page
 * Document repository and file management
 */

import { useMemo, useState } from 'react';
import {
  IconPlus,
  IconFileText,
  IconDownload,
  IconEye,
  IconFolderOpen,
  IconSearch,
  IconFilter,
  IconLock,
  IconShield,
  IconEdit,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { incrementViewCount, incrementDownloadCount } from '../store/slices/documentsSlice';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button, Input, Select } from '../components/ui';
import { getDocumentCategoryColor, formatFileSize } from '../types/document.types';
import type { DocumentCategory, DocumentStatus, Document } from '../types/document.types';
import DocumentFormDrawer from '../components/features/documents/DocumentFormDrawer';
import DocumentDetailDrawer from '../components/features/documents/DocumentDetailDrawer';

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.documents);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Drawer states
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        doc.name.toLowerCase().includes(searchLower) ||
        doc.description?.toLowerCase().includes(searchLower) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      const matchesCategory = !categoryFilter || doc.category === categoryFilter;
      const matchesStatus = !statusFilter || doc.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [documents, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
    return {
      total: documents.length,
      totalSize,
      pendingApproval: documents.filter((d) => d.status === 'UNDER_REVIEW').length,
      confidential: documents.filter((d) => d.accessLevel === 'CONFIDENTIAL').length,
    };
  }, [documents]);

  const getStatusBadge = (status: DocumentStatus) => {
    const variants: Record<DocumentStatus, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      DRAFT: { variant: 'default', label: 'Draft' },
      UNDER_REVIEW: { variant: 'warning', label: 'Under Review' },
      APPROVED: { variant: 'success', label: 'Approved' },
      REJECTED: { variant: 'error', label: 'Rejected' },
      ARCHIVED: { variant: 'default', label: 'Archived' },
      ACTIVE: { variant: 'success', label: 'Active' },
      EXPIRED: { variant: 'error', label: 'Expired' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getAccessLevelIcon = (accessLevel: string) => {
    switch (accessLevel) {
      case 'RESTRICTED':
        return <IconShield size={14} className="text-error-600" />;
      case 'CONFIDENTIAL':
        return <IconLock size={14} className="text-warning-600" />;
      default:
        return null;
    }
  };

  // Handler functions
  const handleOpenUpload = () => {
    setSelectedDocument(null);
    setIsEditMode(false);
    setIsFormDrawerOpen(true);
  };

  const handleViewDetails = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDetailDrawerOpen(true);
    dispatch(incrementViewCount(doc.id));
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditMode(true);
    setIsDetailDrawerOpen(false);
    setIsFormDrawerOpen(true);
  };

  const handleDownload = (docId: string) => {
    dispatch(incrementDownloadCount(docId));
  };

  const handleCloseFormDrawer = () => {
    setIsFormDrawerOpen(false);
    setSelectedDocument(null);
    setIsEditMode(false);
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedDocument(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">
              Manage contracts, proposals, and other files
            </p>
          </div>
          <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={handleOpenUpload}>
            Upload Document
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconFileText size={20} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-blue-600">{formatFileSize(stats.totalSize)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconFolderOpen size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-warning-600">{stats.pendingApproval}</p>
              </div>
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <IconFilter size={20} className="text-warning-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confidential</p>
                <p className="text-2xl font-bold text-error-600">{stats.confidential}</p>
              </div>
              <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
                <IconLock size={20} className="text-error-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<IconSearch size={18} />}
              fullWidth
            />
            <Select
              placeholder="Filter by category"
              options={[
                { value: '', label: 'All Categories' },
                { value: 'CONTRACT', label: 'Contracts' },
                { value: 'PROPOSAL', label: 'Proposals' },
                { value: 'NDA', label: 'NDAs' },
                { value: 'PROTOCOL', label: 'Protocols' },
                { value: 'FINANCIAL', label: 'Financial' },
                { value: 'PRESENTATION', label: 'Presentations' },
                { value: 'TECHNICAL', label: 'Technical' },
                { value: 'REGULATORY', label: 'Regulatory' },
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              fullWidth
            />
            <Select
              placeholder="Filter by status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'DRAFT', label: 'Draft' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
            />
          </div>
        </Card>

        {/* Documents Table */}
        <Card padding="none" shadow="sm">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <IconFileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No documents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 backdrop-blur-xl border-b border-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-white/50 transition-all duration-200 backdrop-blur-sm cursor-pointer"
                      onClick={() => handleViewDetails(doc)}
                    >
                      {/* Document Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${getDocumentCategoryColor(doc.category as DocumentCategory)}`}>
                            <IconFileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </p>
                              {getAccessLevelIcon(doc.accessLevel)}
                            </div>
                            <p className="text-xs text-gray-500">
                              v{doc.currentVersion}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <Badge
                          variant="default"
                          size="sm"
                          className={getDocumentCategoryColor(doc.category as DocumentCategory)}
                        >
                          {doc.category.replace('_', ' ')}
                        </Badge>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-[200px]">
                          {doc.company?.name || '-'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(doc.status)}
                      </td>

                      {/* Size */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatFileSize(doc.fileSize)}
                        </span>
                      </td>

                      {/* Modified Date */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(doc.updatedAt)}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <IconEye size={14} />
                            <span>{doc.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconDownload size={14} />
                            <span>{doc.downloadCount}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(doc);
                            }}
                            className="p-1.5 hover:bg-white/80 rounded-lg transition-colors backdrop-blur-sm"
                            title="View Details"
                          >
                            <IconEye size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDocument(doc);
                            }}
                            className="p-1.5 hover:bg-white/80 rounded-lg transition-colors backdrop-blur-sm"
                            title="Edit"
                          >
                            <IconEdit size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(doc.id);
                            }}
                            className="p-1.5 hover:bg-white/80 rounded-lg transition-colors backdrop-blur-sm"
                            title="Download"
                          >
                            <IconDownload size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Results Count */}
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredDocuments.length} of {documents.length} documents
        </div>
      </div>

      {/* Drawers */}
      <DocumentFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={handleCloseFormDrawer}
        document={isEditMode ? selectedDocument : null}
      />

      <DocumentDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        document={selectedDocument}
        onEdit={handleEditDocument}
      />
    </AppLayout>
  );
}
