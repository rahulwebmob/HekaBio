/**
 * Companies Page
 * List and manage all companies in the address book
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconFilter,
  IconBuilding,
  IconMapPin,
  IconWorld,
  IconPhone,
} from '@tabler/icons-react';
import { PlusIcon, MailIcon, EyeIcon } from '../icons';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Button, Card, Input, Select, Badge } from '../components/ui';
import { CompanyFormModal, CompanyDetailDrawer } from '../components/features';
import {
  CompanyRole,
  CompanyCategory,
  CompanyRoleLabels,
  CompanyCategoryLabels,
} from '../types/addressBook.types';
import type { Company } from '../types/addressBook.types';

export default function CompaniesPage() {
  const companies = useAppSelector((state) => state.addressBook.companies);

  // Modal and drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique countries for filter
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(companies.map((c) => c.address.country))];
    return uniqueCountries.sort();
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        company.name.toLowerCase().includes(searchLower) ||
        company.nameLocal?.toLowerCase().includes(searchLower) ||
        company.email?.toLowerCase().includes(searchLower) ||
        company.address.city.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = !roleFilter || company.role === roleFilter;

      // Category filter
      const matchesCategory = !categoryFilter || company.category === categoryFilter;

      // Country filter
      const matchesCountry = !countryFilter || company.address.country === countryFilter;

      // Active filter
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' && company.isActive) ||
        (activeFilter === 'inactive' && !company.isActive);

      return matchesSearch && matchesRole && matchesCategory && matchesCountry && matchesActive;
    });
  }, [companies, searchTerm, roleFilter, categoryFilter, countryFilter, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Role options for filter
  const roleOptions = [
    { value: '', label: 'All Roles' },
    ...Object.values(CompanyRole).map((role) => ({
      value: role,
      label: CompanyRoleLabels[role],
    })),
  ];

  // Category options for filter
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...Object.values(CompanyCategory).map((category) => ({
      value: category,
      label: CompanyCategoryLabels[category],
    })),
  ];

  // Country options for filter
  const countryOptions = [
    { value: '', label: 'All Countries' },
    ...countries.map((country) => ({
      value: country,
      label: country,
    })),
  ];

  // Active status options
  const activeOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
  ];

  const getRoleBadgeVariant = (role: CompanyRole) => {
    switch (role) {
      case CompanyRole.HOSPITAL:
        return 'primary' as const;
      case CompanyRole.DISTRIBUTOR:
        return 'info' as const;
      case CompanyRole.MANUFACTURER:
        return 'warning' as const;
      case CompanyRole.PRODUCT_OWNER:
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  const getCategoryBadgeVariant = (category: CompanyCategory) => {
    switch (category) {
      case CompanyCategory.CUSTOMER:
        return 'success' as const;
      case CompanyCategory.PARTNER:
        return 'primary' as const;
      case CompanyCategory.PROSPECT:
        return 'warning' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Companies</h1>
            <p className="text-gray-600 mt-1">
              Manage your company address book and relationships
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="w-[18px] h-[18px]" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Company
          </Button>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            {/* Search */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                placeholder="Search companies..."
                leftIcon={<IconSearch size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                placeholder="Filter by role"
                options={roleOptions}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by category"
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by country"
                options={countryOptions}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by status"
                options={activeOptions}
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                fullWidth
              />
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {paginatedCompanies.length} of {filteredCompanies.length} companies
              </span>
              {(searchTerm || roleFilter || categoryFilter || countryFilter || activeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('');
                    setCategoryFilter('');
                    setCountryFilter('');
                    setActiveFilter('all');
                    setCurrentPage(1);
                  }}
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Companies Table */}
        <Card padding="none" shadow="sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 backdrop-blur-xl border-b border-white/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {paginatedCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconBuilding size={20} className="text-brand-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {company.name}
                          </p>
                          {company.nameLocal && (
                            <p className="text-xs text-gray-600 truncate">{company.nameLocal}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {CompanyRoleLabels[company.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {CompanyCategoryLabels[company.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{company.address.city}</div>
                      <div className="text-xs text-gray-600">{company.address.country}</div>
                    </td>
                    <td className="px-6 py-4">
                      {company.email ? (
                        <div className="text-sm text-gray-900 truncate max-w-[200px]">
                          {company.email}
                        </div>
                      ) : company.phone ? (
                        <div className="text-sm text-gray-900">{company.phone}</div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {company.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success-700">
                          <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setSelectedCompanyId(company.id)}
                          className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="View company details"
                        >
                          <EyeIcon className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <Card padding="lg" shadow="sm">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconBuilding size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || roleFilter || categoryFilter || countryFilter
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first company'}
              </p>
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="w-[18px] h-[18px]" />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Company
              </Button>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                    ${
                      currentPage === page
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Company Form Modal */}
      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setCurrentPage(1); // Reset to first page when new company is added
        }}
      />

      {/* Company Detail Drawer */}
      <CompanyDetailDrawer
        isOpen={!!selectedCompanyId}
        onClose={() => setSelectedCompanyId(null)}
        companyId={selectedCompanyId}
      />
    </AppLayout>
  );
}
