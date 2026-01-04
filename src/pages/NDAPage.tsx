/**
 * NDA Management Page
 * Manage non-disclosure agreements and signature workflows
 */

import { useState, useMemo } from 'react';
import {
  IconFileText,
  IconPlus,
  IconFilter,
  IconSearch,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconDownload,
  IconEye,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import {
  NDA_STATUS_LABELS,
  NDA_TYPE_LABELS,
  getNDAStatusVariant,
  getNDASigningProgress,
  isNDAExpired,
  isNDAPendingAction,
} from '../types/nda.types';
import type { NDAStatus, NDAType } from '../types/nda.types';
import { NDAFormDrawer } from '../components/features/nda';

export default function NDAPage() {
  const ndas = useAppSelector((state) => state.nda.ndas);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<NDAStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<NDAType | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showNDAForm, setShowNDAForm] = useState(false);

  // Filter NDAs
  const filteredNDAs = useMemo(() => {
    return ndas.filter((nda) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          nda.title.toLowerCase().includes(query) ||
          nda.companyName.toLowerCase().includes(query) ||
          (nda.projectName && nda.projectName.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && nda.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'ALL' && nda.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [ndas, searchQuery, statusFilter, typeFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: ndas.length,
      pending: ndas.filter((n) => isNDAPendingAction(n)).length,
      fullySigned: ndas.filter((n) => n.status === 'FULLY_SIGNED').length,
      expired: ndas.filter((n) => isNDAExpired(n)).length,
    };
  }, [ndas]);

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">NDAs</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage non-disclosure agreements and signature workflows
            </p>
          </div>
          <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => setShowNDAForm(true)}>
            New NDA
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total NDAs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconFileText size={24} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Action</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconClock size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fully Signed</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{stats.fullySigned}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <IconCheck size={24} className="text-success-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-error-600 mt-1">{stats.expired}</p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <IconAlertCircle size={24} className="text-error-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            {/* Search bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <IconSearch
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search NDAs by title, company, or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                leftIcon={<IconFilter size={18} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </div>

            {/* Filter controls */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as NDAStatus | 'ALL')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.entries(NDA_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as NDAType | 'ALL')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ALL">All Types</option>
                    {Object.entries(NDA_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* NDA List */}
        {filteredNDAs.length === 0 ? (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                  ? 'No NDAs found'
                  : 'No NDAs yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first NDA to get started'}
              </p>
              {!searchQuery && statusFilter === 'ALL' && typeFilter === 'ALL' && (
                <Button variant="primary" leftIcon={<IconPlus size={18} />}>
                  New NDA
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNDAs.map((nda) => {
              const progress = getNDASigningProgress(nda);
              const expired = isNDAExpired(nda);
              const pendingAction = isNDAPendingAction(nda);

              return (
                <Card
                  key={nda.id}
                  padding="lg"
                  shadow="sm"
                  hover
                  className="cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Main content */}
                    <div className="flex-1 space-y-3">
                      {/* Title and badges */}
                      <div className="flex items-start gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{nda.title}</h3>
                        <Badge variant={getNDAStatusVariant(nda.status)} size="md">
                          {NDA_STATUS_LABELS[nda.status]}
                        </Badge>
                        {expired && (
                          <Badge variant="error" size="md">
                            Expired
                          </Badge>
                        )}
                        {pendingAction && (
                          <Badge variant="warning" size="md">
                            Action Required
                          </Badge>
                        )}
                      </div>

                      {/* Company and project */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Company:</span>
                          <span>{nda.companyName}</span>
                        </div>
                        {nda.projectName && (
                          <>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Project:</span>
                              <span>{nda.projectName}</span>
                            </div>
                          </>
                        )}
                        <span className="text-gray-400">•</span>
                        <Badge variant="default" size="sm">
                          {NDA_TYPE_LABELS[nda.type]}
                        </Badge>
                      </div>

                      {/* Signing progress */}
                      {nda.signatories.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 font-medium">Signatures</span>
                            <span className="text-gray-600">
                              {progress.signed} of {progress.total} ({progress.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                progress.percentage === 100
                                  ? 'bg-success-500'
                                  : progress.percentage > 0
                                  ? 'bg-blue-500'
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <IconClock size={14} />
                          <span>Sent: {formatDate(nda.sentDate)}</span>
                        </div>
                        {nda.signedDate && (
                          <div className="flex items-center gap-2">
                            <IconCheck size={14} />
                            <span>Signed: {formatDate(nda.signedDate)}</span>
                          </div>
                        )}
                        {nda.expiryDate && (
                          <div className="flex items-center gap-2">
                            <IconAlertCircle size={14} />
                            <span>Expires: {formatDate(nda.expiryDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" leftIcon={<IconEye size={16} />}>
                        View
                      </Button>
                      {nda.documents.length > 0 && (
                        <Button variant="outline" size="sm" leftIcon={<IconDownload size={16} />}>
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* NDA Form Drawer */}
        <NDAFormDrawer
          isOpen={showNDAForm}
          onClose={() => setShowNDAForm(false)}
        />
      </div>
    </AppLayout>
  );
}
