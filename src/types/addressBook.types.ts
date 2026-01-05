/**
 * Address Book Type Definitions
 * Companies and Contacts
 */

import type { ID, Timestamp, Email } from './common.types';

// ===== Therapeutic Area =====
// Broad medical specialties for partner matching
export const TherapeuticArea = {
  ONCOLOGY: 'ONCOLOGY',
  CARDIOLOGY: 'CARDIOLOGY',
  NEUROLOGY: 'NEUROLOGY',
  IMMUNOLOGY: 'IMMUNOLOGY',
  INFECTIOUS_DISEASE: 'INFECTIOUS_DISEASE',
  METABOLIC_DISORDERS: 'METABOLIC_DISORDERS',
  RESPIRATORY: 'RESPIRATORY',
  GASTROENTEROLOGY: 'GASTROENTEROLOGY',
  NEPHROLOGY: 'NEPHROLOGY',
  HEMATOLOGY: 'HEMATOLOGY',
  OPHTHALMOLOGY: 'OPHTHALMOLOGY',
  DERMATOLOGY: 'DERMATOLOGY',
  ORTHOPEDICS: 'ORTHOPEDICS',
  RARE_DISEASES: 'RARE_DISEASES',
  OTHER: 'OTHER',
} as const;

export type TherapeuticArea = (typeof TherapeuticArea)[keyof typeof TherapeuticArea];

export const TherapeuticAreaLabels: Record<TherapeuticArea, string> = {
  [TherapeuticArea.ONCOLOGY]: 'Oncology',
  [TherapeuticArea.CARDIOLOGY]: 'Cardiology',
  [TherapeuticArea.NEUROLOGY]: 'Neurology',
  [TherapeuticArea.IMMUNOLOGY]: 'Immunology',
  [TherapeuticArea.INFECTIOUS_DISEASE]: 'Infectious Disease',
  [TherapeuticArea.METABOLIC_DISORDERS]: 'Metabolic Disorders',
  [TherapeuticArea.RESPIRATORY]: 'Respiratory',
  [TherapeuticArea.GASTROENTEROLOGY]: 'Gastroenterology',
  [TherapeuticArea.NEPHROLOGY]: 'Nephrology',
  [TherapeuticArea.HEMATOLOGY]: 'Hematology',
  [TherapeuticArea.OPHTHALMOLOGY]: 'Ophthalmology',
  [TherapeuticArea.DERMATOLOGY]: 'Dermatology',
  [TherapeuticArea.ORTHOPEDICS]: 'Orthopedics',
  [TherapeuticArea.RARE_DISEASES]: 'Rare Diseases',
  [TherapeuticArea.OTHER]: 'Other',
};

// ===== Disease Area =====
// Specific disease indications for partner matching
// This is a sample list - should be extended based on actual needs
export const DiseaseArea = {
  BREAST_CANCER: 'BREAST_CANCER',
  LUNG_CANCER: 'LUNG_CANCER',
  COLORECTAL_CANCER: 'COLORECTAL_CANCER',
  LEUKEMIA: 'LEUKEMIA',
  LYMPHOMA: 'LYMPHOMA',
  DIABETES_TYPE_1: 'DIABETES_TYPE_1',
  DIABETES_TYPE_2: 'DIABETES_TYPE_2',
  ALZHEIMERS: 'ALZHEIMERS',
  PARKINSONS: 'PARKINSONS',
  MULTIPLE_SCLEROSIS: 'MULTIPLE_SCLEROSIS',
  RHEUMATOID_ARTHRITIS: 'RHEUMATOID_ARTHRITIS',
  LUPUS: 'LUPUS',
  CROHNS_DISEASE: 'CROHNS_DISEASE',
  ULCERATIVE_COLITIS: 'ULCERATIVE_COLITIS',
  ASTHMA: 'ASTHMA',
  COPD: 'COPD',
  HYPERTENSION: 'HYPERTENSION',
  HEART_FAILURE: 'HEART_FAILURE',
  COVID_19: 'COVID_19',
  HIV: 'HIV',
  HEPATITIS_C: 'HEPATITIS_C',
  OTHER: 'OTHER',
} as const;

export type DiseaseArea = (typeof DiseaseArea)[keyof typeof DiseaseArea];

export const DiseaseAreaLabels: Record<DiseaseArea, string> = {
  [DiseaseArea.BREAST_CANCER]: 'Breast Cancer',
  [DiseaseArea.LUNG_CANCER]: 'Lung Cancer',
  [DiseaseArea.COLORECTAL_CANCER]: 'Colorectal Cancer',
  [DiseaseArea.LEUKEMIA]: 'Leukemia',
  [DiseaseArea.LYMPHOMA]: 'Lymphoma',
  [DiseaseArea.DIABETES_TYPE_1]: 'Diabetes Type 1',
  [DiseaseArea.DIABETES_TYPE_2]: 'Diabetes Type 2',
  [DiseaseArea.ALZHEIMERS]: "Alzheimer's Disease",
  [DiseaseArea.PARKINSONS]: "Parkinson's Disease",
  [DiseaseArea.MULTIPLE_SCLEROSIS]: 'Multiple Sclerosis',
  [DiseaseArea.RHEUMATOID_ARTHRITIS]: 'Rheumatoid Arthritis',
  [DiseaseArea.LUPUS]: 'Lupus',
  [DiseaseArea.CROHNS_DISEASE]: "Crohn's Disease",
  [DiseaseArea.ULCERATIVE_COLITIS]: 'Ulcerative Colitis',
  [DiseaseArea.ASTHMA]: 'Asthma',
  [DiseaseArea.COPD]: 'COPD',
  [DiseaseArea.HYPERTENSION]: 'Hypertension',
  [DiseaseArea.HEART_FAILURE]: 'Heart Failure',
  [DiseaseArea.COVID_19]: 'COVID-19',
  [DiseaseArea.HIV]: 'HIV/AIDS',
  [DiseaseArea.HEPATITIS_C]: 'Hepatitis C',
  [DiseaseArea.OTHER]: 'Other',
};

// ===== Modality =====
export const Modality = {
  SMALL_MOLECULE: 'SMALL_MOLECULE',
  BIOLOGICS: 'BIOLOGICS',
  ANTIBODY: 'ANTIBODY',
  CELL_THERAPY: 'CELL_THERAPY',
  GENE_THERAPY: 'GENE_THERAPY',
  RNA_THERAPY: 'RNA_THERAPY',
  VACCINE: 'VACCINE',
  MEDICAL_DEVICE: 'MEDICAL_DEVICE',
  DIAGNOSTIC: 'DIAGNOSTIC',
  DIGITAL_HEALTH: 'DIGITAL_HEALTH',
  OTHER: 'OTHER',
} as const;

export type Modality = (typeof Modality)[keyof typeof Modality];

export const ModalityLabels: Record<Modality, string> = {
  [Modality.SMALL_MOLECULE]: 'Small Molecule Drug',
  [Modality.BIOLOGICS]: 'Biologics',
  [Modality.ANTIBODY]: 'Antibody',
  [Modality.CELL_THERAPY]: 'Cell Therapy',
  [Modality.GENE_THERAPY]: 'Gene Therapy',
  [Modality.RNA_THERAPY]: 'RNA Therapy',
  [Modality.VACCINE]: 'Vaccine',
  [Modality.MEDICAL_DEVICE]: 'Medical Device',
  [Modality.DIAGNOSTIC]: 'Diagnostic',
  [Modality.DIGITAL_HEALTH]: 'Digital Health',
  [Modality.OTHER]: 'Other',
};

// ===== Key Contact =====
export interface KeyContact {
  name: string;
  email: Email;
}

// ===== Company Types =====
export const CompanyRole = {
  HOSPITAL: 'HOSPITAL',
  DISTRIBUTOR: 'DISTRIBUTOR',
  LICENSE_HOLDER: 'LICENSE_HOLDER',
  MANUFACTURER: 'MANUFACTURER',
  PRODUCT_OWNER: 'PRODUCT_OWNER',
  RESEARCH_INSTITUTION: 'RESEARCH_INSTITUTION',
  VENTURE_CAPITAL: 'VENTURE_CAPITAL',
  OTHER: 'OTHER',
} as const;

export type CompanyRole = (typeof CompanyRole)[keyof typeof CompanyRole];

export const CompanyCategory = {
  CUSTOMER: 'CUSTOMER',
  PARTNER: 'PARTNER',
  PROSPECT: 'PROSPECT',
  SUPPLIER: 'SUPPLIER',
  INVESTOR: 'INVESTOR',
  OTHER: 'OTHER',
} as const;

export type CompanyCategory = (typeof CompanyCategory)[keyof typeof CompanyCategory];

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

  // Partner Matching Fields (for AI matching algorithm)
  focusedTherapeuticAreas?: TherapeuticArea[]; // e.g., [ONCOLOGY, CARDIOLOGY]
  focusedDiseaseAreas?: DiseaseArea[]; // e.g., [BREAST_CANCER, LUNG_CANCER]
  modalities?: Modality[]; // e.g., [SMALL_MOLECULE, BIOLOGICS]

  // Partner Capabilities (for distributors, investors, consultants, etc.)
  partnerType?: ('DISTRIBUTOR' | 'INVESTOR' | 'CONSULTANT' | 'SERVICE_PROVIDER' | 'OTHER')[];
  geographicFocus?: string[]; // e.g., ["Japan", "Asia-Pacific", "Global"]
  capabilities?: string[]; // e.g., ["Clinical Development", "Regulatory Affairs", "Distribution"]

  // Key Contacts
  managementContact?: KeyContact; // Management Contact
  bdContact?: KeyContact; // Business Development Contact
  rdContact?: KeyContact; // R&D Contact

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: ID;
}

// ===== Contact Types =====
export const ContactRole = {
  CEO: 'CEO',
  CTO: 'CTO',
  CFO: 'CFO',
  COO: 'COO',
  VP_SALES: 'VP_SALES',
  VP_RND: 'VP_RND',
  VP_REGULATORY: 'VP_REGULATORY',
  BD_MANAGER: 'BD_MANAGER',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  CLINICAL_DIRECTOR: 'CLINICAL_DIRECTOR',
  PROCUREMENT_MANAGER: 'PROCUREMENT_MANAGER',
  QUALITY_MANAGER: 'QUALITY_MANAGER',
  OTHER: 'OTHER',
} as const;

export type ContactRole = (typeof ContactRole)[keyof typeof ContactRole];

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
