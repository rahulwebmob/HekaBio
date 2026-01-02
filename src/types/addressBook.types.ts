/**
 * Address Book Type Definitions
 * Companies and Contacts
 */

import type { ID, Timestamp, Email } from './auth.types';

// ===== Company Types =====
export enum CompanyRole {
  HOSPITAL = 'HOSPITAL',
  DISTRIBUTOR = 'DISTRIBUTOR',
  LICENSE_HOLDER = 'LICENSE_HOLDER',
  MANUFACTURER = 'MANUFACTURER',
  PRODUCT_OWNER = 'PRODUCT_OWNER',
  RESEARCH_INSTITUTION = 'RESEARCH_INSTITUTION',
  VENTURE_CAPITAL = 'VENTURE_CAPITAL',
  OTHER = 'OTHER',
}

export enum CompanyCategory {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  PROSPECT = 'PROSPECT',
  SUPPLIER = 'SUPPLIER',
  INVESTOR = 'INVESTOR',
  OTHER = 'OTHER',
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Company {
  id: ID;
  name: string;
  nameLocal?: string; // Local language name (e.g., Japanese name)
  role: CompanyRole;
  category: CompanyCategory;
  website?: string;
  phone?: string;
  email?: Email;
  address: Address;
  description?: string;
  foundedYear?: number;
  employeeCount?: number;
  revenue?: string; // e.g., "$10M-$50M"
  tags: string[]; // e.g., ["Medical Device", "Oncology"]
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

// ===== Contact Types =====
export enum ContactRole {
  CEO = 'CEO',
  CTO = 'CTO',
  CFO = 'CFO',
  COO = 'COO',
  VP_SALES = 'VP_SALES',
  VP_RND = 'VP_RND',
  VP_REGULATORY = 'VP_REGULATORY',
  BD_MANAGER = 'BD_MANAGER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  CLINICAL_DIRECTOR = 'CLINICAL_DIRECTOR',
  PROCUREMENT_MANAGER = 'PROCUREMENT_MANAGER',
  QUALITY_MANAGER = 'QUALITY_MANAGER',
  OTHER = 'OTHER',
}

export interface Contact {
  id: ID;
  companyId: ID;
  firstName: string;
  lastName: string;
  fullName: string;
  role: ContactRole;
  title?: string; // Job title (e.g., "Senior Business Development Manager")
  email: Email;
  phone?: string;
  mobilePhone?: string;
  linkedIn?: string;
  isPrimaryContact: boolean;
  department?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

// ===== Display Labels =====
export const CompanyRoleLabels: Record<CompanyRole, string> = {
  [CompanyRole.HOSPITAL]: 'Hospital',
  [CompanyRole.DISTRIBUTOR]: 'Distributor',
  [CompanyRole.LICENSE_HOLDER]: 'License Holder',
  [CompanyRole.MANUFACTURER]: 'Manufacturer',
  [CompanyRole.PRODUCT_OWNER]: 'Product Owner / Innovator',
  [CompanyRole.RESEARCH_INSTITUTION]: 'Research Institution',
  [CompanyRole.VENTURE_CAPITAL]: 'Venture Capital',
  [CompanyRole.OTHER]: 'Other',
};

export const CompanyCategoryLabels: Record<CompanyCategory, string> = {
  [CompanyCategory.CUSTOMER]: 'Customer',
  [CompanyCategory.PARTNER]: 'Partner',
  [CompanyCategory.PROSPECT]: 'Prospect',
  [CompanyCategory.SUPPLIER]: 'Supplier',
  [CompanyCategory.INVESTOR]: 'Investor',
  [CompanyCategory.OTHER]: 'Other',
};

export const ContactRoleLabels: Record<ContactRole, string> = {
  [ContactRole.CEO]: 'CEO',
  [ContactRole.CTO]: 'CTO',
  [ContactRole.CFO]: 'CFO',
  [ContactRole.COO]: 'COO',
  [ContactRole.VP_SALES]: 'VP of Sales',
  [ContactRole.VP_RND]: 'VP of R&D',
  [ContactRole.VP_REGULATORY]: 'VP of Regulatory Affairs',
  [ContactRole.BD_MANAGER]: 'Business Development Manager',
  [ContactRole.PROJECT_MANAGER]: 'Project Manager',
  [ContactRole.CLINICAL_DIRECTOR]: 'Clinical Director',
  [ContactRole.PROCUREMENT_MANAGER]: 'Procurement Manager',
  [ContactRole.QUALITY_MANAGER]: 'Quality Manager',
  [ContactRole.OTHER]: 'Other',
};
