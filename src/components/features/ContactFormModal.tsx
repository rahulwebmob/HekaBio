/**
 * Contact Form Modal
 * Modal dialog for adding or editing contact information
 */

import { useState, useEffect } from 'react';
import { IconUser } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addContact, updateContact } from '../../store/slices/addressBookSlice';
import { Button, Input, Select, Modal } from '../ui';
import { ContactRole, ContactRoleLabels } from '../../types/addressBook.types';
import type { Contact } from '../../types/addressBook.types';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSuccess?: (contact: Contact) => void;
  preSelectedCompanyId?: string;
}

export function ContactFormModal({
  isOpen,
  onClose,
  contact,
  onSuccess,
  preSelectedCompanyId,
}: ContactFormModalProps) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.addressBook.companies);
  const isEdit = !!contact;

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '' as ContactRole | '',
    title: '',
    companyId: preSelectedCompanyId || '',
    email: '',
    phone: '',
    mobilePhone: '',
    linkedIn: '',
    department: '',
    notes: '',
    isPrimaryContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing contact data if editing
  useEffect(() => {
    // Batch state updates to avoid multiple renders
    const newFormData = contact
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
          role: contact.role as ContactRole | '',
          title: contact.title || '',
          companyId: contact.companyId,
          email: contact.email,
          phone: contact.phone || '',
          mobilePhone: contact.mobilePhone || '',
          linkedIn: contact.linkedIn || '',
          department: contact.department || '',
          notes: contact.notes || '',
          isPrimaryContact: contact.isPrimaryContact,
        }
      : {
          firstName: '',
          lastName: '',
          role: '' as ContactRole | '',
          title: '',
          companyId: preSelectedCompanyId || '',
          email: '',
          phone: '',
          mobilePhone: '',
          linkedIn: '',
          department: '',
          notes: '',
          isPrimaryContact: false,
        };

    // Use setTimeout to defer state update and avoid direct setState in effect
    const timeoutId = setTimeout(() => {
      setFormData(newFormData);
      setErrors({});
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [contact, isOpen, preSelectedCompanyId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // LinkedIn URL validation
    if (formData.linkedIn && !/^https?:\/\/.+/.test(formData.linkedIn)) {
      newErrors.linkedIn = 'LinkedIn URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    const contactData: Contact = {
      id: isEdit ? contact.id : `cont-${Date.now()}`,
      companyId: formData.companyId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName,
      role: formData.role as ContactRole,
      title: formData.title.trim() || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      mobilePhone: formData.mobilePhone.trim() || undefined,
      linkedIn: formData.linkedIn.trim() || undefined,
      department: formData.department.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      isPrimaryContact: formData.isPrimaryContact,
      isActive: isEdit ? contact.isActive : true,
      createdAt: isEdit ? contact.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: isEdit ? contact.createdBy : 'user-001',
    };

    if (isEdit) {
      dispatch(updateContact(contactData));
    } else {
      dispatch(addContact(contactData));
    }

    onSuccess?.(contactData);
    onClose();
  };

  const roleOptions = Object.values(ContactRole).map((role) => ({
    value: role,
    label: ContactRoleLabels[role],
  }));

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Contact' : 'Add New Contact'}
      size="xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <IconUser size={18} className="text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="e.g., Hiroshi"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
              fullWidth
            />

            <Input
              label="Last Name *"
              placeholder="e.g., Tanaka"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={errors.lastName}
              fullWidth
            />

            <Select
              label="Role *"
              placeholder="Select role"
              options={roleOptions}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as ContactRole })}
              error={errors.role}
              fullWidth
            />

            <Input
              label="Job Title"
              placeholder="e.g., Director of Oncology"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />

            <div className="md:col-span-2">
              <Select
                label="Company *"
                placeholder="Select company"
                options={companyOptions}
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                error={errors.companyId}
                fullWidth
              />
            </div>

            <Input
              label="Department"
              placeholder="e.g., Radiation Oncology"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              fullWidth
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimaryContact"
                checked={formData.isPrimaryContact}
                onChange={(e) => setFormData({ ...formData, isPrimaryContact: e.target.checked })}
                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <label htmlFor="isPrimaryContact" className="text-sm font-medium text-gray-700">
                Primary Contact
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Email *"
                type="email"
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                fullWidth
              />
            </div>

            <Input
              label="Phone"
              type="tel"
              placeholder="+81-3-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />

            <Input
              label="Mobile Phone"
              type="tel"
              placeholder="+81-90-1234-5678"
              value={formData.mobilePhone}
              onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
              fullWidth
            />

            <div className="md:col-span-2">
              <Input
                label="LinkedIn Profile"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                error={errors.linkedIn}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 ease-out bg-white/80 hover:bg-white hover:border-gray-400 placeholder:text-gray-400"
              placeholder="Any additional notes about this contact..."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
