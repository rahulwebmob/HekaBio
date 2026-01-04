/**
 * Company Form Modal
 * Modal dialog for adding or editing company information
 */

import { useState, useEffect } from 'react';
import { IconBuilding } from '@tabler/icons-react';
import { useAppDispatch } from '../../app/store';
import { addCompany, updateCompany } from '../../store/slices/addressBookSlice';
import { Button, Input, Select, Modal } from '../ui';
import {
  CompanyRole,
  CompanyCategory,
  CompanyRoleLabels,
  CompanyCategoryLabels,
} from '../../types/addressBook.types';
import type { Company, Address } from '../../types/addressBook.types';

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
  onSuccess?: (company: Company) => void;
}

export function CompanyFormModal({ isOpen, onClose, company, onSuccess }: CompanyFormModalProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!company;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameLocal: '',
    role: '' as CompanyRole | '',
    category: '' as CompanyCategory | '',
    website: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    description: '',
    foundedYear: '',
    employeeCount: '',
    revenue: '',
    tags: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing company data if editing
  useEffect(() => {
    // Batch state updates to avoid multiple renders
    const newFormData = company
      ? {
          name: company.name,
          nameLocal: company.nameLocal || '',
          role: company.role as CompanyRole | '',
          category: company.category as CompanyCategory | '',
          website: company.website || '',
          phone: company.phone || '',
          email: company.email || '',
          street: company.address.street,
          city: company.address.city,
          state: company.address.state || '',
          postalCode: company.address.postalCode,
          country: company.address.country,
          description: company.description || '',
          foundedYear: company.foundedYear?.toString() || '',
          employeeCount: company.employeeCount?.toString() || '',
          revenue: company.revenue || '',
          tags: company.tags.join(', '),
        }
      : {
          name: '',
          nameLocal: '',
          role: '' as CompanyRole | '',
          category: '' as CompanyCategory | '',
          website: '',
          phone: '',
          email: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          description: '',
          foundedYear: '',
          employeeCount: '',
          revenue: '',
          tags: '',
        };

    // Use setTimeout to defer state update and avoid direct setState in effect
    const timeoutId = setTimeout(() => {
      setFormData(newFormData);
      setErrors({});
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [company, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.role) {
      newErrors.role = 'Company role is required';
    }
    if (!formData.category) {
      newErrors.category = 'Company category is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Website validation
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    // Year validation
    if (formData.foundedYear) {
      const year = parseInt(formData.foundedYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.foundedYear = `Year must be between 1800 and ${currentYear}`;
      }
    }

    // Employee count validation
    if (formData.employeeCount) {
      const count = parseInt(formData.employeeCount);
      if (isNaN(count) || count < 0) {
        newErrors.employeeCount = 'Employee count must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const address: Address = {
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim() || undefined,
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim(),
    };

    const tags = formData.tags
      ? formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const companyData: Company = {
      id: isEdit ? company.id : `comp-${Date.now()}`,
      name: formData.name.trim(),
      nameLocal: formData.nameLocal.trim() || undefined,
      role: formData.role as CompanyRole,
      category: formData.category as CompanyCategory,
      website: formData.website.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      address,
      description: formData.description.trim() || undefined,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
      employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
      revenue: formData.revenue.trim() || undefined,
      tags,
      isActive: isEdit ? company.isActive : true,
      createdAt: isEdit ? company.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: isEdit ? company.createdBy : 'user-001',
    };

    if (isEdit) {
      dispatch(updateCompany(companyData));
    } else {
      dispatch(addCompany(companyData));
    }

    onSuccess?.(companyData);
    onClose();
  };

  const roleOptions = Object.values(CompanyRole).map((role) => ({
    value: role,
    label: CompanyRoleLabels[role],
  }));

  const categoryOptions = Object.values(CompanyCategory).map((category) => ({
    value: category,
    label: CompanyCategoryLabels[category],
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Company' : 'Add New Company'}
      size="xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? 'Update Company' : 'Create Company'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <IconBuilding size={18} className="text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Company Name *"
                placeholder="e.g., Tokyo Medical Center"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                fullWidth
              />
            </div>

            <Input
              label="Local Name (Optional)"
              placeholder="e.g., 東京医療センター"
              value={formData.nameLocal}
              onChange={(e) => setFormData({ ...formData, nameLocal: e.target.value })}
              fullWidth
            />

            <Select
              label="Company Role *"
              placeholder="Select role"
              options={roleOptions}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as CompanyRole })}
              error={errors.role}
              fullWidth
            />

            <Select
              label="Company Category *"
              placeholder="Select category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as CompanyCategory })
              }
              error={errors.category}
              fullWidth
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200 ease-out bg-white/80 hover:bg-white hover:border-gray-400 placeholder:text-gray-400"
                placeholder="Brief description of the company..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="info@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              fullWidth
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+81-3-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />

            <div className="md:col-span-2">
              <Input
                label="Website"
                type="url"
                placeholder="https://www.company.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                error={errors.website}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Street Address *"
                placeholder="1-2-3 Street Name"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                error={errors.street}
                fullWidth
              />
            </div>

            <Input
              label="City *"
              placeholder="Tokyo"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={errors.city}
              fullWidth
            />

            <Input
              label="State/Province"
              placeholder="Optional"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              fullWidth
            />

            <Input
              label="Postal Code *"
              placeholder="100-0001"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              error={errors.postalCode}
              fullWidth
            />

            <Input
              label="Country *"
              placeholder="Japan"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              error={errors.country}
              fullWidth
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Additional Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Founded Year"
              type="number"
              placeholder="2000"
              value={formData.foundedYear}
              onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
              error={errors.foundedYear}
              fullWidth
            />

            <Input
              label="Employee Count"
              type="number"
              placeholder="100"
              value={formData.employeeCount}
              onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
              error={errors.employeeCount}
              fullWidth
            />

            <Input
              label="Revenue"
              placeholder="$10M-$50M"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              fullWidth
            />

            <div className="md:col-span-3">
              <Input
                label="Tags (comma separated)"
                placeholder="Medical Device, Oncology, Innovation"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                helperText="Separate multiple tags with commas"
                fullWidth
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
