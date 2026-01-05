/**
 * CSV Utility Functions
 * Import and export data as CSV files
 */

import type { Contact } from '../types/addressBook.types';
import type { Project } from '../types/project.types';

/**
 * Convert array of objects to CSV string
 */
// Generic CSV record type - intentionally flexible
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  // Create header row
  const headerRow = headers.map((h) => h.label).join(',');

  // Create data rows
  const dataRows = data.map((item) => {
    return headers
      .map((header) => {
        const value = item[header.key];
        // Handle arrays, objects, null, undefined
        if (value === null || value === undefined) {
          return '';
        }
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value)}"`;
        }
        // Escape quotes and wrap in quotes if contains comma or quotes
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Parse CSV string to array of objects
 */
export function csvToArray<T>(csv: string, headers: string[]): Partial<T>[] {
  const lines = csv.split('\n').filter((line) => line.trim());

  // Skip header row
  const dataLines = lines.slice(1);

  return dataLines.map((line) => {
    const values = parseCSVLine(line);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      obj[header] = value;
    });

    return obj;
  });
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last value
  values.push(current);

  return values;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export contacts to CSV
 */
export function exportContactsToCSV(contacts: Contact[]): void {
  const headers = [
    { key: 'firstName' as keyof Contact, label: 'First Name' },
    { key: 'lastName' as keyof Contact, label: 'Last Name' },
    { key: 'email' as keyof Contact, label: 'Email' },
    { key: 'phone' as keyof Contact, label: 'Phone' },
    { key: 'title' as keyof Contact, label: 'Title' },
    { key: 'department' as keyof Contact, label: 'Department' },
    { key: 'companyName' as keyof Contact, label: 'Company' },
    { key: 'isPrimary' as keyof Contact, label: 'Primary Contact' },
    { key: 'notes' as keyof Contact, label: 'Notes' },
  ];

  const csvContent = arrayToCSV(contacts, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `contacts-export-${timestamp}.csv`);
}

/**
 * Parse imported contacts CSV
 */
export function parseContactsCSV(csvContent: string): Partial<Contact>[] {
  const headers = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'title',
    'department',
    'companyName',
    'isPrimary',
    'notes',
  ];

  const rawData = csvToArray<Contact>(csvContent, headers);

  // Transform and validate data
  return rawData.map((row) => {
    // Type assertion for CSV parsing - Partial<Contact> to any for flexible access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyRow = row as any;
    return {
      firstName: row.firstName || '',
      lastName: row.lastName || '',
      email: row.email || '',
      phone: row.phone,
      title: row.title,
      department: row.department,
      companyName: anyRow.companyName,
      isPrimary:
        anyRow.isPrimary === 'true' || anyRow.isPrimary === 'TRUE' || anyRow.isPrimary === '1',
      notes: row.notes,
    };
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate contact data
 */
export interface ContactValidationError {
  row: number;
  field: string;
  message: string;
}

export function validateContactsData(contacts: Partial<Contact>[]): ContactValidationError[] {
  const errors: ContactValidationError[] = [];

  contacts.forEach((contact, index) => {
    const rowNumber = index + 2; // +2 because of header row and 0-index

    // Required fields
    if (!contact.firstName?.trim()) {
      errors.push({
        row: rowNumber,
        field: 'firstName',
        message: 'First name is required',
      });
    }

    if (!contact.lastName?.trim()) {
      errors.push({
        row: rowNumber,
        field: 'lastName',
        message: 'Last name is required',
      });
    }

    if (!contact.email?.trim()) {
      errors.push({
        row: rowNumber,
        field: 'email',
        message: 'Email is required',
      });
    } else if (!isValidEmail(contact.email)) {
      errors.push({
        row: rowNumber,
        field: 'email',
        message: 'Invalid email format',
      });
    }
  });

  return errors;
}

/**
 * Export projects to CSV
 */
export function exportProjectsToCSV(projects: Project[]): void {
  // Transform projects to flatten nested properties
  const flattenedProjects = projects.map((project) => ({
    name: project.name,
    company: project.company.name,
    currentStage: project.currentStage,
    score: project.score,
    tags: project.tags,
    japanInterest: project.japanInterest ? 'Yes' : 'No',
    japanMarketFit: project.japanMarketFit || 'N/A',
    ndaStatus: project.ndaStatus,
    contractStatus: project.contractStatus || 'N/A',
    ddProgress: project.ddProgress !== undefined ? `${project.ddProgress}%` : 'N/A',
    assignedTo: project.assignedTo,
    partnerTags: project.partnerTags,
    isHot: project.isHot ? 'Yes' : 'No',
    isStalled: project.isStalled ? 'Yes' : 'No',
    createdAt: project.createdAt,
  }));

  const headers = [
    { key: 'name' as const, label: 'Project Name' },
    { key: 'company' as const, label: 'Company' },
    { key: 'currentStage' as const, label: 'Current Stage' },
    { key: 'score' as const, label: 'Score' },
    { key: 'tags' as const, label: 'Tags' },
    { key: 'japanInterest' as const, label: 'Japan Interest' },
    { key: 'japanMarketFit' as const, label: 'Japan Market Fit' },
    { key: 'ndaStatus' as const, label: 'NDA Status' },
    { key: 'contractStatus' as const, label: 'Contract Status' },
    { key: 'ddProgress' as const, label: 'DD Progress' },
    { key: 'assignedTo' as const, label: 'Assigned To' },
    { key: 'partnerTags' as const, label: 'Partner Tags' },
    { key: 'isHot' as const, label: 'Hot Prospect' },
    { key: 'isStalled' as const, label: 'Stalled' },
    { key: 'createdAt' as const, label: 'Created Date' },
  ];

  const csvContent = arrayToCSV(flattenedProjects, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csvContent, `projects-export-${timestamp}.csv`);
}
