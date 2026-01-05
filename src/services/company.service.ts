/**
 * Company Service
 *
 * CRUD operations for Company entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { Company, CompanyRole, CompanyCategory } from '../types/addressBook.types';

class CompanyService extends BaseCRUDService<Company> {
  protected storageConfig: StorageConfig = {
    key: 'companies',
    version: 1,
  };

  protected entityName = 'Company';

  constructor() {
    super();
    this.init();
  }

  /**
   * Search companies by name
   */
  searchByName(query: string): Company[] {
    const lowerQuery = query.toLowerCase();
    return this.search((company) =>
      company.name.toLowerCase().includes(lowerQuery) ||
      (company.nameLocal?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }

  /**
   * Get companies by role
   */
  getByRole(role: CompanyRole): Company[] {
    return this.search((company) => company.role === role);
  }

  /**
   * Get companies by category
   */
  getByCategory(category: CompanyCategory): Company[] {
    return this.search((company) => company.category === category);
  }

  /**
   * Get companies by modality
   */
  getByModality(modality: string): Company[] {
    return this.search((company) => company.modality === modality);
  }

  /**
   * Get companies by tag
   */
  getByTag(tag: string): Company[] {
    return this.search((company) => company.tags.includes(tag));
  }

  /**
   * Get active companies only
   */
  getActive(): Company[] {
    return this.search((company) => company.isActive);
  }

  /**
   * Get companies by country
   */
  getByCountry(country: string): Company[] {
    return this.search((company) => company.address.country === country);
  }

  /**
   * Advanced search with multiple filters
   */
  advancedSearch(filters: {
    name?: string;
    role?: CompanyRole;
    category?: CompanyCategory;
    modality?: string;
    tags?: string[];
    country?: string;
    isActive?: boolean;
  }): Company[] {
    return this.search((company) => {
      // Name filter
      if (filters.name) {
        const lowerQuery = filters.name.toLowerCase();
        const nameMatch =
          company.name.toLowerCase().includes(lowerQuery) ||
          company.nameLocal?.toLowerCase().includes(lowerQuery);
        if (!nameMatch) return false;
      }

      // Role filter
      if (filters.role && company.role !== filters.role) {
        return false;
      }

      // Category filter
      if (filters.category && company.category !== filters.category) {
        return false;
      }

      // Modality filter
      if (filters.modality && company.modality !== filters.modality) {
        return false;
      }

      // Tags filter (company must have at least one of the tags)
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => company.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Country filter
      if (filters.country && company.address.country !== filters.country) {
        return false;
      }

      // Active filter
      if (filters.isActive !== undefined && company.isActive !== filters.isActive) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tagsSet = new Set<string>();
    this.items.forEach((company) => {
      company.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }

  /**
   * Get all unique countries
   */
  getAllCountries(): string[] {
    const countriesSet = new Set<string>();
    this.items.forEach((company) => {
      countriesSet.add(company.address.country);
    });
    return Array.from(countriesSet).sort();
  }

  /**
   * Deactivate company (soft delete)
   */
  deactivate(id: string): Company | undefined {
    return this.update(id, { isActive: false });
  }

  /**
   * Activate company
   */
  activate(id: string): Company | undefined {
    return this.update(id, { isActive: true });
  }
}

export const companyService = new CompanyService();
