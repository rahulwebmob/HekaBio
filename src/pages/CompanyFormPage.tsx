/**
 * Company Form Page
 * Add or Edit company information
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconBuilding } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { addCompany, updateCompany } from '../store/slices/addressBookSlice';
import { AppLayout } from '../components/layout';
import { Button, Card, Input, Select } from '../components/ui';
import {
  CompanyRole,
  CompanyCategory,
  // Modality, // REMOVED: Now uses modalities array
  CompanyRoleLabels,
  CompanyCategoryLabels,
  // ModalityLabels, // REMOVED: Now uses modalities array
} from '../types/addressBook.types';
import type { Company, Address } from '../types/addressBook.types';

export default function CompanyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const existingCompany = useAppSelector((state) =>
    id ? state.addressBook.companies.find((c) => c.id === id) : null
  );

  const isEdit = !!id && !!existingCompany;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameLocal: '',
    role: '' as CompanyRole | '',
    category: '' as CompanyCategory | '',
    // modality: '' as Modality | '', // REMOVED: Now uses modalities array in partner matching
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
    // Key Contacts
    managementContactName: '',
    managementContactEmail: '',
    bdContactName: '',
    bdContactEmail: '',
    rdContactName: '',
    rdContactEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing company data if editing
  useEffect(() => {
    if (existingCompany) {
      const newFormData = {
        name: existingCompany.name,
        nameLocal: existingCompany.nameLocal || '',
        role: existingCompany.role,
        category: existingCompany.category,
        // modality: existingCompany.modality || ('' as const), // REMOVED
        website: existingCompany.website || '',
        phone: existingCompany.phone || '',
        email: existingCompany.email || '',
        street: existingCompany.address.street,
        city: existingCompany.address.city,
        state: existingCompany.address.state || '',
        postalCode: existingCompany.address.postalCode,
        country: existingCompany.address.country,
        description: existingCompany.description || '',
        foundedYear: existingCompany.foundedYear?.toString() || '',
        employeeCount: existingCompany.employeeCount?.toString() || '',
        revenue: existingCompany.revenue || '',
        tags: existingCompany.tags.join(', '),
        // Key Contacts
        managementContactName: existingCompany.managementContact?.name || '',
        managementContactEmail: existingCompany.managementContact?.email || '',
        bdContactName: existingCompany.bdContact?.name || '',
        bdContactEmail: existingCompany.bdContact?.email || '',
        rdContactName: existingCompany.rdContact?.name || '',
        rdContactEmail: existingCompany.rdContact?.email || '',
      };

      // Defer state update to avoid direct setState in effect
      const timeoutId = setTimeout(() => setFormData(newFormData), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [existingCompany]);

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

    // Build key contact objects
    const managementContact =
      formData.managementContactName.trim() && formData.managementContactEmail.trim()
        ? {
            name: formData.managementContactName.trim(),
            email: formData.managementContactEmail.trim(),
          }
        : undefined;

    const bdContact =
      formData.bdContactName.trim() && formData.bdContactEmail.trim()
        ? {
            name: formData.bdContactName.trim(),
            email: formData.bdContactEmail.trim(),
          }
        : undefined;

    const rdContact =
      formData.rdContactName.trim() && formData.rdContactEmail.trim()
        ? {
            name: formData.rdContactName.trim(),
            email: formData.rdContactEmail.trim(),
          }
        : undefined;

    const companyData: Company = {
      id: isEdit ? existingCompany.id : `comp-${Date.now()}`,
      name: formData.name.trim(),
      nameLocal: formData.nameLocal.trim() || undefined,
      role: formData.role as CompanyRole,
      category: formData.category as CompanyCategory,
      // modality: formData.modality ? (formData.modality as Modality) : undefined, // REMOVED: Now uses modalities array
      website: formData.website.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      email: formData.email.trim() || undefined,
      address,
      description: formData.description.trim() || undefined,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
      employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
      revenue: formData.revenue.trim() || undefined,
      tags,
      // Key Contacts
      managementContact,
      bdContact,
      rdContact,
      isActive: isEdit ? existingCompany.isActive : true,
      createdAt: isEdit ? existingCompany.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: isEdit ? existingCompany.createdBy : 'user-001',
    };

    if (isEdit) {
      dispatch(updateCompany(companyData));
    } else {
      dispatch(addCompany(companyData));
    }

    navigate(`/companies/${companyData.id}`);
  };

  const roleOptions = Object.values(CompanyRole).map((role) => ({
    value: role,
    label: CompanyRoleLabels[role],
  }));

  const categoryOptions = Object.values(CompanyCategory).map((category) => ({
    value: category,
    label: CompanyCategoryLabels[category],
  }));

  // const modalityOptions = [ // REMOVED: Modality field removed
  //   { value: '', label: 'Select modality (optional)' },
  //   ...Object.values(Modality).map((modality) => ({
  //     value: modality,
  //     label: ModalityLabels[modality],
  //   })),
  // ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IconArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {isEdit ? 'Edit Company' : 'Add New Company'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update company information' : 'Enter company details below'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card
            padding="lg"
            shadow="sm"
            header={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <IconBuilding size={20} className="text-brand-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Modality field removed - now uses modalities array in partner matching fields */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Brief description of the company..."
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card
            padding="lg"
            shadow="sm"
            header={<h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </Card>

          {/* Address */}
          <Card
            padding="lg"
            shadow="sm"
            header={<h2 className="text-xl font-semibold text-gray-900">Address</h2>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </Card>

          {/* Additional Details */}
          <Card
            padding="lg"
            shadow="sm"
            header={<h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </Card>

          {/* Key Contacts */}
          <Card
            padding="lg"
            shadow="sm"
            header={<h2 className="text-xl font-semibold text-gray-900">Key Contacts</h2>}
          >
            <div className="space-y-6">
              {/* Management Contact */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Management Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g., John Smith"
                    value={formData.managementContactName}
                    onChange={(e) =>
                      setFormData({ ...formData, managementContactName: e.target.value })
                    }
                    fullWidth
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="e.g., john.smith@company.com"
                    value={formData.managementContactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, managementContactEmail: e.target.value })
                    }
                    fullWidth
                  />
                </div>
              </div>

              {/* Business Development Contact */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Business Development Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g., Jane Doe"
                    value={formData.bdContactName}
                    onChange={(e) => setFormData({ ...formData, bdContactName: e.target.value })}
                    fullWidth
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="e.g., jane.doe@company.com"
                    value={formData.bdContactEmail}
                    onChange={(e) => setFormData({ ...formData, bdContactEmail: e.target.value })}
                    fullWidth
                  />
                </div>
              </div>

              {/* R&D Contact */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">R&D Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g., Dr. Robert Johnson"
                    value={formData.rdContactName}
                    onChange={(e) => setFormData({ ...formData, rdContactName: e.target.value })}
                    fullWidth
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="e.g., robert.johnson@company.com"
                    value={formData.rdContactEmail}
                    onChange={(e) => setFormData({ ...formData, rdContactEmail: e.target.value })}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? 'Update Company' : 'Create Company'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
