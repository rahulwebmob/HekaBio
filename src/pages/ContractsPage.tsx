/**
 * Contracts Management Page
 * Manage contracts and agreements
 */

import { useState, useMemo } from 'react';
import {
  IconFileText,
  IconPlus,
  IconSearch,
  IconFilter,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconEye,
  IconDownload,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import {
  CONTRACT_TYPE_LABELS,
  CONTRACT_STATUS_LABELS,
  getContractStatusVariant,
  isContractExpiringSoon,
  isContractExpired,
  getPaymentCompletionPercentage,
  getMilestoneCompletionPercentage,
  getOverduePayments,
} from '../types/contract.types';
import type { ContractType, ContractStatus } from '../types/contract.types';
import { ContractFormDrawer } from '../components/features/contracts';

export default function ContractsPage() {
  const contracts = useAppSelector((state) => state.contract.contracts);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContractType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);

  // Filter contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          contract.title.toLowerCase().includes(query) ||
          (contract.companyName && contract.companyName.toLowerCase().includes(query)) ||
          (contract.projectName && contract.projectName.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (typeFilter !== 'ALL' && contract.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && contract.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [contracts, searchQuery, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: contracts.length,
      active: contracts.filter((c) => c.status === 'ACTIVE').length,
      expiringSoon: contracts.filter((c) => isContractExpiringSoon(c)).length,
      expired: contracts.filter((c) => isContractExpired(c)).length,
    };
  }, [contracts]);

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Contracts</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage contracts, agreements, and legal documents
            </p>
          </div>
          <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => setShowContractForm(true)}>
            New Contract
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contracts</p>
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
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-success-600 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <IconCheck size={24} className="text-success-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-warning-600 mt-1">{stats.expiringSoon}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <IconClock size={24} className="text-warning-600" />
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
                  placeholder="Search contracts by title, company, or project..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as ContractType | 'ALL')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ALL">All Types</option>
                    {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'ALL')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.entries(CONTRACT_STATUS_LABELS).map(([value, label]) => (
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

        {/* Contract List */}
        {filteredContracts.length === 0 ? (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'No contracts found'
                  : 'No contracts yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first contract to get started'}
              </p>
              {!searchQuery && typeFilter === 'ALL' && statusFilter === 'ALL' && (
                <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => setShowContractForm(true)}>
                  New Contract
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract) => {
              const expiringSoon = isContractExpiringSoon(contract);
              const expired = isContractExpired(contract);
              const paymentCompletion = getPaymentCompletionPercentage(contract);
              const milestoneCompletion = getMilestoneCompletionPercentage(contract);
              const overduePayments = getOverduePayments(contract);

              return (
                <Card
                  key={contract.id}
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
                        <h3 className="text-lg font-semibold text-gray-900">{contract.title}</h3>
                        <Badge variant={getContractStatusVariant(contract.status)} size="md">
                          {CONTRACT_STATUS_LABELS[contract.status]}
                        </Badge>
                        <Badge variant="default" size="md">
                          {CONTRACT_TYPE_LABELS[contract.type]}
                        </Badge>
                        {expiringSoon && (
                          <Badge variant="warning" size="md">
                            Expiring Soon
                          </Badge>
                        )}
                        {expired && (
                          <Badge variant="error" size="md">
                            Expired
                          </Badge>
                        )}
                        {overduePayments.length > 0 && (
                          <Badge variant="error" size="md">
                            {overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      {/* Company and project */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {contract.companyName && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Company:</span>
                              <span>{contract.companyName}</span>
                            </div>
                          </>
                        )}
                        {contract.projectName && (
                          <>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Project:</span>
                              <span>{contract.projectName}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Value and dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        {contract.totalValue && (
                          <div>
                            <span className="text-gray-600">Total Value:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {formatCurrency(contract.totalValue, contract.currency)}
                            </span>
                          </div>
                        )}
                        {contract.startDate && (
                          <div>
                            <span className="text-gray-600">Start:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatDate(contract.startDate)}
                            </span>
                          </div>
                        )}
                        {contract.endDate && (
                          <div>
                            <span className="text-gray-600">End:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {formatDate(contract.endDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress bars */}
                      {contract.payments.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Payments</span>
                            <span className="text-gray-600">{paymentCompletion}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                paymentCompletion === 100
                                  ? 'bg-success-500'
                                  : overduePayments.length > 0
                                  ? 'bg-error-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${paymentCompletion}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {contract.milestones.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Milestones</span>
                            <span className="text-gray-600">{milestoneCompletion}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                milestoneCompletion === 100
                                  ? 'bg-success-500'
                                  : milestoneCompletion >= 50
                                  ? 'bg-blue-500'
                                  : 'bg-warning-500'
                              }`}
                              style={{ width: `${milestoneCompletion}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Parties */}
                      {contract.parties.length > 0 && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Parties:</span>
                          <span className="ml-2">
                            {contract.parties.map((p) => p.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" leftIcon={<IconEye size={16} />}>
                        View
                      </Button>
                      {contract.documents.length > 0 && (
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

        {/* Contract Form Drawer */}
        <ContractFormDrawer
          isOpen={showContractForm}
          onClose={() => setShowContractForm(false)}
        />
      </div>
    </AppLayout>
  );
}
