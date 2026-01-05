/**
 * Saved Filter Service
 *
 * CRUD operations for SavedFilter entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { SavedFilter } from '../types/project.types';

class SavedFilterService extends BaseCRUDService<SavedFilter> {
  protected storageConfig: StorageConfig = {
    key: 'saved_filters',
    version: 1,
  };

  protected entityName = 'SavedFilter';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get filters created by a specific user
   */
  getByCreator(userId: string): SavedFilter[] {
    return this.search((filter) => filter.createdBy === userId);
  }

  /**
   * Get public filters (visible to all users)
   */
  getPublicFilters(): SavedFilter[] {
    return this.search((filter) => filter.isPublic);
  }

  /**
   * Get private filters for a user
   */
  getPrivateFilters(userId: string): SavedFilter[] {
    return this.search((filter) => !filter.isPublic && filter.createdBy === userId);
  }

  /**
   * Get default filter (if any)
   */
  getDefaultFilter(): SavedFilter | undefined {
    return this.findOne((filter) => filter.isDefault === true);
  }

  /**
   * Set a filter as default (unsets others)
   */
  setAsDefault(filterId: string): SavedFilter | undefined {
    // Clear all defaults first
    this.items.forEach((filter) => {
      if (filter.isDefault && filter.id !== filterId) {
        this.update(filter.id, { isDefault: false });
      }
    });

    // Set the specified filter as default
    return this.update(filterId, { isDefault: true });
  }

  /**
   * Increment usage count for a filter
   */
  incrementUsage(filterId: string): SavedFilter | undefined {
    const filter = this.getById(filterId);
    if (!filter) return undefined;

    return this.update(filterId, {
      usageCount: (filter.usageCount || 0) + 1,
    });
  }

  /**
   * Search filters by name
   */
  searchByName(query: string): SavedFilter[] {
    const lowerQuery = query.toLowerCase();
    return this.search((filter) =>
      filter.name.toLowerCase().includes(lowerQuery) ||
      (filter.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }

  /**
   * Get most used filters
   */
  getMostUsed(limit: number = 5): SavedFilter[] {
    return this.getAll()
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, limit);
  }

  /**
   * Get recently created filters
   */
  getRecent(limit: number = 5): SavedFilter[] {
    return this.getAll()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Duplicate a filter
   */
  duplicate(filterId: string, newName: string, userId: string, userName: string): SavedFilter | undefined {
    const original = this.getById(filterId);
    if (!original) return undefined;

    const duplicated = this.create({
      name: newName,
      description: original.description,
      filters: original.filters,
      isPublic: false, // Duplicates are private by default
      isDefault: false,
      createdBy: userId,
      createdByName: userName,
    });

    return duplicated;
  }
}

export const savedFilterService = new SavedFilterService();
