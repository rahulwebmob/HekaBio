/**
 * Company Detail Drawer
 * Right-side sliding panel for viewing company details
 */

import { useState } from 'react';
import {
  IconBuilding,
  IconMapPin,
  IconWorld,
  IconPhone,
} from '@tabler/icons-react';
import { MailIcon, PencilIcon, TrashBinIcon, UserIcon } from '../../icons';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { deleteCompany } from '../../store/slices/addressBookSlice';
import { Button, Badge, Drawer, Modal } from '../ui';
import { CompanyFormModal } from './CompanyFormModal';
import {
  CompanyRoleLabels,
  CompanyCategoryLabels,
  ContactRoleLabels,
} from '../../types/addressBook.types';
import type { Company } from '../../types/addressBook.types';

interface CompanyDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string | null;
}

export function CompanyDetailDrawer({ isOpen, onClose, companyId }: CompanyDetailDrawerProps) {
  const dispatch = useAppDispatch();

  const company = useAppSelector((state) =>
    companyId ? state.addressBook.companies.find((c) => c.id === companyId) : null
  );

  const contacts = useAppSelector((state) =>
    companyId ? state.addressBook.contacts.filter((c) => c.companyId === companyId) : []
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = () => {
    if (company) {
      dispatch(deleteCompany(company.id));
      setShowDeleteModal(false);
      onClose();
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'HOSPITAL':
        return 'primary' as const;
      case 'DISTRIBUTOR':
        return 'info' as const;
      case 'MANUFACTURER':
        return 'warning' as const;
      case 'PRODUCT_OWNER':
        return 'success' as const;
      default:
        return 'default' as const;
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'CUSTOMER':
        return 'success' as const;
      case 'PARTNER':
        return 'primary' as const;
      case 'PROSPECT':
        return 'warning' as const;
      default:
        return 'default' as const;
    }
  };

  const primaryContact = contacts.find((c) => c.isPrimaryContact);

  if (!company) {
    return null;
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="danger"
              leftIcon={<TrashBinIcon className="w-[18px] h-[18px]" />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Company
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                leftIcon={<PencilIcon className="w-[18px] h-[18px]" />}
                onClick={() => setShowEditModal(true)}
              >
                Edit Company
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{company.name}</h1>
            {company.nameLocal && (
              <p className="text-lg text-gray-600 mt-1">{company.nameLocal}</p>
            )}

            {/* Status Badges */}
            <div className="flex items-center gap-2 mt-4">
              <Badge variant={getRoleBadgeVariant(company.role)} size="md">
                {CompanyRoleLabels[company.role]}
              </Badge>
              <Badge variant={getCategoryBadgeVariant(company.category)} size="md">
                {CompanyCategoryLabels[company.category]}
              </Badge>
              {!company.isActive && (
                <Badge variant="error" size="md">
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          {/* Company Overview */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconBuilding size={20} className="text-brand-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Company Overview</h2>
            </div>

            {company.description ? (
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
              {company.foundedYear && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Founded</p>
                  <p className="text-base font-semibold text-gray-900">{company.foundedYear}</p>
                </div>
              )}
              {company.employeeCount && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Employees</p>
                  <p className="text-base font-semibold text-gray-900">
                    {company.employeeCount.toLocaleString()}
                  </p>
                </div>
              )}
              {company.revenue && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-base font-semibold text-gray-900">{company.revenue}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {company.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Industry Tags</p>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag, index) => (
                    <Badge key={index} variant="default" size="md">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-start gap-3">
                  <IconMapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Address</p>
                    <p className="text-gray-900 font-medium">{company.address.street}</p>
                    <p className="text-gray-900">
                      {company.address.city}, {company.address.postalCode}
                    </p>
                    <p className="text-gray-900">{company.address.country}</p>
                  </div>
                </div>
              </div>

              {company.email && (
                <div className="flex items-start gap-3">
                  <MailIcon className="w-[18px] h-[18px] text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Email</p>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>
              )}

              {company.phone && (
                <div className="flex items-start gap-3">
                  <IconPhone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Phone</p>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>
              )}

              {company.website && (
                <div className="flex items-start gap-3">
                  <IconWorld size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 font-medium break-all"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Contact */}
          {primaryContact && (
            <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-base font-semibold text-gray-900">{primaryContact.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-base text-gray-900">
                    {primaryContact.title || ContactRoleLabels[primaryContact.role]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${primaryContact.email}`}
                    className="text-base text-brand-600 hover:text-brand-700"
                  >
                    {primaryContact.email}
                  </a>
                </div>
                {primaryContact.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a
                      href={`tel:${primaryContact.phone}`}
                      className="text-base text-brand-600 hover:text-brand-700"
                    >
                      {primaryContact.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contacts */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Contacts ({contacts.length})
                </h2>
              </div>
              <Button variant="outline" size="sm" leftIcon={<UserIcon className="w-4 h-4" />}>
                Add Contact
              </Button>
            </div>

            {contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200/40 hover:bg-white/60 transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {contact.firstName[0]}
                          {contact.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {contact.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {contact.title || ContactRoleLabels[contact.role]}
                          </p>
                        </div>
                        {contact.isPrimaryContact && (
                          <Badge variant="primary" size="sm">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MailIcon className="w-3.5 h-3.5" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-brand-600 transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <IconPhone size={14} />
                            <a
                              href={`tel:${contact.phone}`}
                              className="hover:text-brand-600 transition-colors"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No contacts added yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<UserIcon className="w-4 h-4" />}
                  className="mt-4"
                >
                  Add First Contact
                </Button>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="text-gray-900 font-medium">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900 font-medium">
                  {new Date(company.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Company ID</p>
                <p className="text-gray-900 font-mono text-xs">{company.id}</p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Company"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Company
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{company.name}</strong>?
          </p>
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-800">
              <strong>Warning:</strong> This action cannot be undone. All associated contacts ({
                contacts.length
              }) will also be deleted.
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit Company Modal */}
      <CompanyFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        company={company}
        onSuccess={() => setShowEditModal(false)}
      />
    </>
  );
}
