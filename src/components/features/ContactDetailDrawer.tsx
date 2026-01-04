/**
 * Contact Detail Drawer
 * Right-side sliding panel for viewing contact details
 */

import { useState } from 'react';
import { IconUser, IconPhone, IconBuilding, IconWorld } from '@tabler/icons-react';
import { MailIcon, PencilIcon, TrashBinIcon } from '../../icons';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { deleteContact } from '../../store/slices/addressBookSlice';
import { Button, Badge, Drawer, Modal } from '../ui';
import { ContactFormModal } from './ContactFormModal';
import { ContactRoleLabels } from '../../types/addressBook.types';

interface ContactDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string | null;
}

export function ContactDetailDrawer({ isOpen, onClose, contactId }: ContactDetailDrawerProps) {
  const dispatch = useAppDispatch();

  const contact = useAppSelector((state) =>
    contactId ? state.addressBook.contacts.find((c) => c.id === contactId) : null
  );

  const company = useAppSelector((state) =>
    contact ? state.addressBook.companies.find((c) => c.id === contact.companyId) : null
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = () => {
    if (contact) {
      dispatch(deleteContact(contact.id));
      setShowDeleteModal(false);
      onClose();
    }
  };

  if (!contact) {
    return null;
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="danger"
              leftIcon={<TrashBinIcon className="w-[18px] h-[18px]" />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Contact
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
                Edit Contact
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-3xl">
                {contact.firstName[0]}
                {contact.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">{contact.fullName}</h1>
              <p className="text-lg text-gray-600 mt-1">
                {contact.title || ContactRoleLabels[contact.role]}
              </p>

              {/* Status Badges */}
              <div className="flex items-center gap-2 mt-4">
                {contact.isPrimaryContact && (
                  <Badge variant="primary" size="md">
                    Primary Contact
                  </Badge>
                )}
                {!contact.isActive && (
                  <Badge variant="error" size="md">
                    Inactive
                  </Badge>
                )}
                {contact.department && (
                  <Badge variant="default" size="md">
                    {contact.department}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          {company && (
            <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <IconBuilding size={20} className="text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Company</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company Name</p>
                  <p className="text-base font-semibold text-gray-900">{company.name}</p>
                  {company.nameLocal && (
                    <p className="text-sm text-gray-600">{company.nameLocal}</p>
                  )}
                </div>

                {company.address && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-sm text-gray-900">
                      {company.address.city}, {company.address.country}
                    </p>
                  </div>
                )}

                {company.website && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-600 hover:text-brand-700 break-all"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3">
                <MailIcon className="w-[18px] h-[18px] text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm flex-1">
                  <p className="text-gray-600 mb-1">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-brand-600 hover:text-brand-700 font-medium break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="flex items-start gap-3">
                  <IconPhone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="text-gray-600 mb-1">Phone</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Mobile Phone */}
              {contact.mobilePhone && (
                <div className="flex items-start gap-3">
                  <IconPhone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="text-gray-600 mb-1">Mobile Phone</p>
                    <a
                      href={`tel:${contact.mobilePhone}`}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {contact.mobilePhone}
                    </a>
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {contact.linkedIn && (
                <div className="flex items-start gap-3">
                  <IconWorld size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="text-gray-600 mb-1">LinkedIn</p>
                    <a
                      href={contact.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700 font-medium break-all"
                    >
                      {contact.linkedIn}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconUser size={20} className="text-brand-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Professional Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-base font-semibold text-gray-900">
                  {ContactRoleLabels[contact.role]}
                </p>
              </div>

              {contact.title && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Job Title</p>
                  <p className="text-base text-gray-900">{contact.title}</p>
                </div>
              )}

              {contact.department && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="text-base text-gray-900">{contact.department}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white/80 border border-gray-200/40 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="text-gray-900 font-medium">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900 font-medium">
                  {new Date(contact.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Contact ID</p>
                <p className="text-gray-900 font-mono text-xs">{contact.id}</p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Contact
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{contact.fullName}</strong>?
          </p>
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-800">
              <strong>Warning:</strong> This action cannot be undone. The contact will be
              permanently removed from {company?.name || 'the company'}.
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit Contact Modal */}
      <ContactFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        contact={contact}
        onSuccess={() => setShowEditModal(false)}
      />
    </>
  );
}
