/**
 * DD Template Service
 *
 * CRUD operations for DDTemplate entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { DDTemplate } from '../types/dd.types';

class DDTemplateService extends BaseCRUDService<DDTemplate> {
  protected storageConfig: StorageConfig = {
    key: 'dd_templates',
    version: 1,
  };

  protected entityName = 'DDTemplate';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get active templates
   */
  getActive(): DDTemplate[] {
    return this.search((template) => template.isActive);
  }

  /**
   * Get templates by category
   */
  getByCategory(category: DDTemplate['category']): DDTemplate[] {
    return this.search((template) => template.category === category);
  }

  /**
   * Get most used templates
   */
  getMostUsed(limit: number = 5): DDTemplate[] {
    return this.getAll()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Increment usage count
   */
  incrementUsage(templateId: string): DDTemplate | undefined {
    const template = this.getById(templateId);
    if (!template) return undefined;

    return this.update(templateId, {
      usageCount: template.usageCount + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Toggle active status
   */
  toggleActive(templateId: string): DDTemplate | undefined {
    const template = this.getById(templateId);
    if (!template) return undefined;

    return this.update(templateId, {
      isActive: !template.isActive,
      updatedAt: new Date().toISOString(),
    });
  }
}

export const ddTemplateService = new DDTemplateService();
