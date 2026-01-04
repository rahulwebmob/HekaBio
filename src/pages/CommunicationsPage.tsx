/**
 * Communications Page
 * Email tracking and communication history
 */

import { useState, useMemo } from 'react';
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconNote,
  IconSearch,
  IconPin,
  IconClock,
  IconSend,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Input, Select, Card, Badge, Button } from '../components/ui';
import type { Communication, CommunicationType, CommunicationStatus } from '../types/communication.types';
import EmailComposerDrawer from '../components/features/communications/EmailComposerDrawer';

export default function CommunicationsPage() {
  const communications = useAppSelector((state) => state.communications.communications);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showArchived, setShowArchived] = useState(false);

  // Email composer drawer state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingCommunication, setEditingCommunication] = useState<Communication | null>(null);
  const [replyToCommunication, setReplyToCommunication] = useState<Communication | null>(null);

  // Filter communications
  const filteredCommunications = useMemo(() => {
    return communications.filter((comm) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        comm.subject.toLowerCase().includes(searchLower) ||
        comm.company.name.toLowerCase().includes(searchLower) ||
        comm.body.toLowerCase().includes(searchLower);

      const matchesType = !typeFilter || comm.type === typeFilter;
      const matchesStatus = !statusFilter || comm.status === statusFilter;
      const matchesArchived = showArchived || !comm.isArchived;

      return matchesSearch && matchesType && matchesStatus && matchesArchived;
    });
  }, [communications, searchTerm, typeFilter, statusFilter, showArchived]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: communications.length,
      unread: communications.filter((c) => !c.readAt && c.status !== 'DRAFT').length,
      followUp: communications.filter((c) => c.needsFollowUp && !c.followUpCompleted).length,
      pinned: communications.filter((c) => c.isPinned).length,
    };
  }, [communications]);

  const getTypeIcon = (type: CommunicationType) => {
    switch (type) {
      case 'EMAIL':
        return <IconMail size={16} />;
      case 'CALL':
        return <IconPhone size={16} />;
      case 'MEETING':
        return <IconCalendar size={16} />;
      case 'NOTE':
        return <IconNote size={16} />;
    }
  };

  const getStatusBadge = (status: CommunicationStatus) => {
    const variants: Record<CommunicationStatus, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      DRAFT: { variant: 'default', label: 'Draft' },
      SENT: { variant: 'info', label: 'Sent' },
      DELIVERED: { variant: 'info', label: 'Delivered' },
      READ: { variant: 'success', label: 'Read' },
      REPLIED: { variant: 'success', label: 'Replied' },
      FAILED: { variant: 'error', label: 'Failed' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-error-600';
      case 'HIGH':
        return 'text-warning-600';
      case 'MEDIUM':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handler functions for email composer
  const handleNewEmail = () => {
    setEditingCommunication(null);
    setReplyToCommunication(null);
    setIsComposerOpen(true);
  };

  const handleCloseComposer = () => {
    setIsComposerOpen(false);
    setEditingCommunication(null);
    setReplyToCommunication(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Communications</h1>
            <p className="text-gray-600 mt-1">
              Track emails, calls, and communication history
            </p>
          </div>
          <Button variant="primary" leftIcon={<IconSend size={18} />} onClick={handleNewEmail}>
            New Email
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconMail size={20} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-warning-600">{stats.unread}</p>
              </div>
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <IconAlertCircle size={20} className="text-warning-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Follow-Up</p>
                <p className="text-2xl font-bold text-error-600">{stats.followUp}</p>
              </div>
              <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
                <IconClock size={20} className="text-error-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pinned</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pinned}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconPin size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<IconSearch size={18} />}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                placeholder="Filter by type"
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'EMAIL', label: 'Email' },
                  { value: 'CALL', label: 'Call' },
                  { value: 'MEETING', label: 'Meeting' },
                  { value: 'NOTE', label: 'Note' },
                ]}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by status"
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'SENT', label: 'Sent' },
                  { value: 'DELIVERED', label: 'Delivered' },
                  { value: 'READ', label: 'Read' },
                  { value: 'REPLIED', label: 'Replied' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                fullWidth
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showArchived"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="showArchived" className="text-sm text-gray-700">
                  Show Archived
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Communications List */}
        <div className="space-y-3">
          {filteredCommunications.map((comm) => (
            <Card
              key={comm.id}
              padding="md"
              shadow="sm"
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {/* TODO: Navigate to detail */}}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  comm.isPinned ? 'bg-brand-100' : 'bg-gray-100'
                }`}>
                  {getTypeIcon(comm.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {comm.isPinned && <IconPin size={14} className="text-brand-600" />}
                        <h3 className={`font-semibold truncate ${getPriorityColor(comm.priority)}`}>
                          {comm.subject}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {comm.company.name}
                        {comm.project && ` • ${comm.project.name}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(comm.status)}
                      {comm.needsFollowUp && !comm.followUpCompleted && (
                        <Badge variant="warning" size="sm">
                          <IconClock size={12} className="mr-1" />
                          Follow-up
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {comm.body}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>From: {comm.from}</span>
                      <span>To: {comm.to.join(', ')}</span>
                      {comm.duration && <span>Duration: {comm.duration}m</span>}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(comm.sentAt)}</span>
                  </div>

                  {comm.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {comm.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredCommunications.length === 0 && (
            <Card padding="lg" shadow="sm">
              <div className="text-center py-12">
                <IconMail size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No communications found</p>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredCommunications.length} of {communications.length} communications
        </div>
      </div>

      {/* Email Composer Drawer */}
      <EmailComposerDrawer
        isOpen={isComposerOpen}
        onClose={handleCloseComposer}
        communication={editingCommunication}
        replyTo={replyToCommunication}
      />
    </AppLayout>
  );
}
