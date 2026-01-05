/**
 * Company & Contact Types
 */

import type { ID, Timestamp, Email, PhoneNumber, URL, Address } from './common.types';

// ===== Modality =====
export type Modality = 'DRUG' | 'DEVICE' | 'DIAGNOSTIC' | 'DIGITAL_HEALTH';

export const ModalityLabels: Record<Modality, string> = {
  DRUG: 'Drug',
  DEVICE: 'Device',
  DIAGNOSTIC: 'Diagnostic',
  DIGITAL_HEALTH: 'Digital Health',
};

// ===== Key Contact =====
export interface KeyContact {
  name: string;
  email: Email;
}

// ===== Company Role =====
export type CompanyRole =
  | 'PRODUCT_OWNER'
  | 'BUYER'
  | 'DISTRIBUTOR'
  | 'CHANNEL_PARTNER'
  | 'SUPPLIER'
  | 'HOSPITAL'
  | 'MANUFACTURER';

export const CompanyRoleLabels: Record<CompanyRole, string> = {
  PRODUCT_OWNER: 'Product Owner / Innovator',
  BUYER: 'Buyer',
  DISTRIBUTOR: 'Distributor',
  CHANNEL_PARTNER: 'Channel Partner',
  SUPPLIER: 'Supplier',
  HOSPITAL: 'Hospital / Healthcare Facility',
  MANUFACTURER: 'Manufacturer',
};

// ===== Company =====
export interface Company {
  id: ID;
  name: string;
  roles: CompanyRole[];
  country: string;
  address?: Address;
  website?: URL;
  description?: string;

  // Categorization
  category?: string;
  modality?: Modality;
  diseaseArea?: string[];
  productCategory?: string[];
  focusAreas?: string[];

  // Key Contacts
  managementContact?: KeyContact;
  bdContact?: KeyContact; // Business Development Contact
  rdContact?: KeyContact; // R&D Contact

  // Additional Info
  foundedYear?: number;
  employeeCount?: number;
  revenue?: number;
  fundingStage?: string;

  // Metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;

  // Relationships
  contactCount?: number;
  projectCount?: number;
}

// ===== Contact Role =====
export type ContactRole =
  | 'CEO'
  | 'CTO'
  | 'CSO'
  | 'CFO'
  | 'VP_BUSINESS_DEVELOPMENT'
  | 'VP_REGULATORY'
  | 'VP_CLINICAL'
  | 'PRODUCT_MANAGER'
  | 'PROJECT_MANAGER'
  | 'REGULATORY_AFFAIRS'
  | 'CLINICAL_OPERATIONS'
  | 'SALES'
  | 'MARKETING'
  | 'OTHER';

export const ContactRoleLabels: Record<ContactRole, string> = {
  CEO: 'Chief Executive Officer',
  CTO: 'Chief Technology Officer',
  CSO: 'Chief Scientific Officer',
  CFO: 'Chief Financial Officer',
  VP_BUSINESS_DEVELOPMENT: 'VP Business Development',
  VP_REGULATORY: 'VP Regulatory Affairs',
  VP_CLINICAL: 'VP Clinical',
  PRODUCT_MANAGER: 'Product Manager',
  PROJECT_MANAGER: 'Project Manager',
  REGULATORY_AFFAIRS: 'Regulatory Affairs',
  CLINICAL_OPERATIONS: 'Clinical Operations',
  SALES: 'Sales',
  MARKETING: 'Marketing',
  OTHER: 'Other',
};

// ===== Contact =====
export interface Contact {
  id: ID;
  companyId: ID;
  companyName: string;

  firstName: string;
  lastName: string;
  fullName: string;

  role: ContactRole;
  title?: string;
  department?: string;

  email: Email;
  phone?: PhoneNumber;
  mobile?: PhoneNumber;

  isPrimary: boolean;
  isActive: boolean;

  notes?: string;
  linkedInUrl?: URL;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: ID;
}

// ===== Company Filters =====
export interface CompanyFilters {
  roles?: CompanyRole[];
  countries?: string[];
  categories?: string[];
  diseaseAreas?: string[];
  productCategories?: string[];
  search?: string;
}

// ===== Contact Filters =====
export interface ContactFilters {
  companyIds?: ID[];
  roles?: ContactRole[];
  isPrimary?: boolean;
  isActive?: boolean;
  search?: string;
}
