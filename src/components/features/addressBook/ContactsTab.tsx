/**
 * Contacts Tab Component
 * Reuses logic from ContactsPage.tsx without AppLayout wrapper
 */

import { useState, useMemo } from 'react';
import { IconSearch, IconUser, IconMail, IconPhone, IconBuilding } from '@tabler/icons-react';
import { PlusIcon, EyeIcon } from '../../../icons';
import { useAppSelector } from '../../../app/store';
import { Button, Card, Input, Select } from '../../ui';
import { ContactFormModal, ContactDetailDrawer } from '../index';
import { ContactRole, ContactRoleLabels } from '../../../types/addressBook.types';

export default function ContactsTab() {
  const contacts = useAppSelector((state) => state.addressBook.contacts);
  const companies = useAppSelector((state) => state.addressBook.companies);

  // Modal and drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        contact.fullName.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.title?.toLowerCase().includes(searchLower) ||
        contact.phone?.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = !roleFilter || contact.role === roleFilter;

      // Company filter
      const matchesCompany = !companyFilter || contact.companyId === companyFilter;

      // Active filter
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' && contact.isActive) ||
        (activeFilter === 'inactive' && !contact.isActive);

      return matchesSearch && matchesRole && matchesCompany && matchesActive;
    });
  }, [contacts, searchTerm, roleFilter, companyFilter, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Role options for filter
  const roleOptions = [
    { value: '', label: 'All Roles' },
    ...Object.values(ContactRole).map((role) => ({
      value: role,
      label: ContactRoleLabels[role],
    })),
  ];

  // Company options for filter
  const companyOptions = [
    { value: '', label: 'All Companies' },
    ...companies.map((company) => ({
      value: company.id,
      label: company.name,
    })),
  ];

  // Active status options
  const activeOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
  ];

  // Get company name by ID
  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || '-';
  };

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="w-[18px] h-[18px]" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <Card padding="md" shadow="sm">
        <div className="space-y-4">
          {/* Search */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              placeholder="Search contacts by name, email, or title..."
              leftIcon={<IconSearch size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              placeholder="Filter by role"
              options={roleOptions}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              fullWidth
            />
            <Select
              placeholder="Filter by company"
              options={companyOptions}
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
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
              Showing {paginatedContacts.length} of {filteredContacts.length} contacts
            </span>
            {(searchTerm || roleFilter || companyFilter || activeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setCompanyFilter('');
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

      {/* Contacts Table */}
      {filteredContacts.length > 0 ? (
        <>
          <Card padding="none" shadow="sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 backdrop-blur-xl border-b border-white/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone
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
                  {paginatedContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconUser size={20} className="text-brand-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {contact.fullName}
                            </p>
                            {contact.title && (
                              <p className="text-xs text-gray-600 truncate">{contact.title}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {ContactRoleLabels[contact.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconBuilding size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate max-w-[200px]">
                            {getCompanyName(contact.companyId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <IconMail size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate max-w-[200px]">
                            {contact.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {contact.phone ? (
                          <div className="flex items-center gap-2">
                            <IconPhone size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-900">{contact.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {contact.isActive ? (
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
                            onClick={() => setSelectedContactId(contact.id)}
                            className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="View contact details"
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
        </>
      ) : (
        /* Empty State */
        <Card padding="lg" shadow="sm">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconUser size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || roleFilter || companyFilter
                ? 'Try adjusting your filters'
                : 'Get started by adding your first contact'}
            </p>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="w-[18px] h-[18px]" />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Contact
            </Button>
          </div>
        </Card>
      )}

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setCurrentPage(1);
        }}
      />

      {/* Contact Detail Drawer */}
      <ContactDetailDrawer
        isOpen={!!selectedContactId}
        onClose={() => setSelectedContactId(null)}
        contactId={selectedContactId}
      />
    </div>
  );
}
