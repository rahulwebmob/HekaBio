/**
 * Contact Service
 *
 * CRUD operations for Contact entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { Contact, ContactRole } from '../types/addressBook.types';

class ContactService extends BaseCRUDService<Contact> {
  protected storageConfig: StorageConfig = {
    key: 'contacts',
    version: 1,
  };

  protected entityName = 'Contact';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get contacts by company ID
   */
  getByCompanyId(companyId: string): Contact[] {
    return this.search((contact) => contact.companyId === companyId);
  }

  /**
   * Get primary contact for a company
   */
  getPrimaryContact(companyId: string): Contact | undefined {
    return this.findOne(
      (contact) => contact.companyId === companyId && contact.isPrimaryContact
    );
  }

  /**
   * Get contacts by role
   */
  getByRole(role: ContactRole): Contact[] {
    return this.search((contact) => contact.role === role);
  }

  /**
   * Search contacts by name
   */
  searchByName(query: string): Contact[] {
    const lowerQuery = query.toLowerCase();
    return this.search((contact) =>
      contact.fullName.toLowerCase().includes(lowerQuery) ||
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search contacts by email
   */
  searchByEmail(query: string): Contact[] {
    const lowerQuery = query.toLowerCase();
    return this.search((contact) => contact.email.toLowerCase().includes(lowerQuery));
  }

  /**
   * Get active contacts only
   */
  getActive(): Contact[] {
    return this.search((contact) => contact.isActive);
  }

  /**
   * Get active contacts for a company
   */
  getActiveByCompany(companyId: string): Contact[] {
    return this.search(
      (contact) => contact.companyId === companyId && contact.isActive
    );
  }

  /**
   * Set primary contact for a company (unsets other primaries)
   */
  setPrimaryContact(contactId: string, companyId: string): Contact | undefined {
    // First, unset all primary contacts for this company
    const companyContacts = this.getByCompanyId(companyId);
    companyContacts.forEach((contact) => {
      if (contact.isPrimaryContact && contact.id !== contactId) {
        this.update(contact.id, { isPrimaryContact: false });
      }
    });

    // Then set the new primary contact
    return this.update(contactId, { isPrimaryContact: true });
  }

  /**
   * Delete all contacts for a company
   */
  deleteByCompanyId(companyId: string): number {
    const contactIds = this.getByCompanyId(companyId).map((c) => c.id);
    return this.bulkDelete(contactIds);
  }

  /**
   * Advanced search with multiple filters
   */
  advancedSearch(filters: {
    companyId?: string;
    name?: string;
    email?: string;
    role?: ContactRole;
    isPrimaryContact?: boolean;
    isActive?: boolean;
  }): Contact[] {
    return this.search((contact) => {
      // Company filter
      if (filters.companyId && contact.companyId !== filters.companyId) {
        return false;
      }

      // Name filter
      if (filters.name) {
        const lowerQuery = filters.name.toLowerCase();
        const nameMatch =
          contact.fullName.toLowerCase().includes(lowerQuery) ||
          contact.firstName.toLowerCase().includes(lowerQuery) ||
          contact.lastName.toLowerCase().includes(lowerQuery);
        if (!nameMatch) return false;
      }

      // Email filter
      if (filters.email) {
        const lowerQuery = filters.email.toLowerCase();
        if (!contact.email.toLowerCase().includes(lowerQuery)) {
          return false;
        }
      }

      // Role filter
      if (filters.role && contact.role !== filters.role) {
        return false;
      }

      // Primary contact filter
      if (
        filters.isPrimaryContact !== undefined &&
        contact.isPrimaryContact !== filters.isPrimaryContact
      ) {
        return false;
      }

      // Active filter
      if (filters.isActive !== undefined && contact.isActive !== filters.isActive) {
        return false;
      }

      return true;
    });
  }

  /**
   * Deactivate contact (soft delete)
   */
  deactivate(id: string): Contact | undefined {
    return this.update(id, { isActive: false });
  }

  /**
   * Activate contact
   */
  activate(id: string): Contact | undefined {
    return this.update(id, { isActive: true });
  }

  /**
   * Get contact count by company
   */
  getCountByCompany(companyId: string): number {
    return this.getByCompanyId(companyId).length;
  }
}

export const contactService = new ContactService();
