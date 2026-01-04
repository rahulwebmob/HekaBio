/**
 * Email Template Types
 * Type definitions for email templates and variable placeholders
 */

export type EmailTemplateCategory =
  | 'INITIAL_CONTACT'
  | 'FOLLOW_UP'
  | 'PROPOSAL'
  | 'CONTRACT'
  | 'MEETING'
  | 'THANK_YOU'
  | 'UPDATE'
  | 'GENERAL';

export interface EmailTemplate {
  id: string;
  name: string;
  category: EmailTemplateCategory;
  subject: string;
  body: string;
  description?: string;
  variables: string[]; // Array of variable names used in the template
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailVariable {
  name: string;
  displayName: string;
  example: string;
  category: 'company' | 'contact' | 'user' | 'date' | 'custom';
}

// Predefined email variables available for templates
export const EMAIL_VARIABLES: EmailVariable[] = [
  // Company variables
  {
    name: 'company_name',
    displayName: 'Company Name',
    example: 'Acme Corporation',
    category: 'company',
  },
  {
    name: 'company_website',
    displayName: 'Company Website',
    example: 'www.acme.com',
    category: 'company',
  },
  {
    name: 'company_industry',
    displayName: 'Company Industry',
    example: 'Biotechnology',
    category: 'company',
  },
  {
    name: 'company_location',
    displayName: 'Company Location',
    example: 'Tokyo, Japan',
    category: 'company',
  },
  // Contact variables
  {
    name: 'contact_first_name',
    displayName: 'Contact First Name',
    example: 'John',
    category: 'contact',
  },
  {
    name: 'contact_last_name',
    displayName: 'Contact Last Name',
    example: 'Doe',
    category: 'contact',
  },
  {
    name: 'contact_full_name',
    displayName: 'Contact Full Name',
    example: 'John Doe',
    category: 'contact',
  },
  {
    name: 'contact_title',
    displayName: 'Contact Title',
    example: 'CEO',
    category: 'contact',
  },
  {
    name: 'contact_email',
    displayName: 'Contact Email',
    example: 'john@acme.com',
    category: 'contact',
  },
  // User variables
  {
    name: 'user_name',
    displayName: 'Your Name',
    example: 'Jane Smith',
    category: 'user',
  },
  {
    name: 'user_title',
    displayName: 'Your Title',
    example: 'Business Development Manager',
    category: 'user',
  },
  {
    name: 'user_email',
    displayName: 'Your Email',
    example: 'jane@hekabio.com',
    category: 'user',
  },
  {
    name: 'user_phone',
    displayName: 'Your Phone',
    example: '+1 (555) 123-4567',
    category: 'user',
  },
  // Date variables
  {
    name: 'current_date',
    displayName: 'Current Date',
    example: 'January 4, 2026',
    category: 'date',
  },
  {
    name: 'current_year',
    displayName: 'Current Year',
    example: '2026',
    category: 'date',
  },
];

export const getTemplateCategoryLabel = (category: EmailTemplateCategory): string => {
  const labels: Record<EmailTemplateCategory, string> = {
    INITIAL_CONTACT: 'Initial Contact',
    FOLLOW_UP: 'Follow-up',
    PROPOSAL: 'Proposal',
    CONTRACT: 'Contract',
    MEETING: 'Meeting',
    THANK_YOU: 'Thank You',
    UPDATE: 'Update',
    GENERAL: 'General',
  };
  return labels[category];
};

export const getTemplateCategoryColor = (category: EmailTemplateCategory): string => {
  const colors: Record<EmailTemplateCategory, string> = {
    INITIAL_CONTACT: 'bg-brand-100 text-brand-700',
    FOLLOW_UP: 'bg-blue-100 text-blue-700',
    PROPOSAL: 'bg-purple-100 text-purple-700',
    CONTRACT: 'bg-green-100 text-green-700',
    MEETING: 'bg-orange-100 text-orange-700',
    THANK_YOU: 'bg-pink-100 text-pink-700',
    UPDATE: 'bg-cyan-100 text-cyan-700',
    GENERAL: 'bg-gray-100 text-gray-700',
  };
  return colors[category];
};

/**
 * Replace template variables with actual values
 */
export const replaceTemplateVariables = (
  template: string,
  values: Record<string, string>
): string => {
  let result = template;
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || `{{${key}}}`);
  });
  return result;
};

/**
 * Extract variable names from template text
 */
export const extractTemplateVariables = (template: string): string[] => {
  const regex = /{{([^}]+)}}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)]; // Remove duplicates
};
