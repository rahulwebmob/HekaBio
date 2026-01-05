/**
 * NDA Template Service
 *
 * CRUD operations for NDATemplate entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { NDATemplate, NDAType } from '../types/nda.types';

class NDATemplateService extends BaseCRUDService<NDATemplate> {
  protected storageConfig: StorageConfig = {
    key: 'nda_templates',
    version: 1,
  };

  protected entityName = 'NDATemplate';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get active templates
   */
  getActive(): NDATemplate[] {
    return this.search((template) => template.isActive);
  }

  /**
   * Get templates by type
   */
  getByType(type: NDAType): NDATemplate[] {
    return this.search((template) => template.type === type);
  }

  /**
   * Get most used templates
   */
  getMostUsed(limit: number = 5): NDATemplate[] {
    return this.getAll()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Increment usage count
   */
  incrementUsage(templateId: string): NDATemplate | undefined {
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
  toggleActive(templateId: string): NDATemplate | undefined {
    const template = this.getById(templateId);
    if (!template) return undefined;

    return this.update(templateId, {
      isActive: !template.isActive,
      updatedAt: new Date().toISOString(),
    });
  }
}

export const ndaTemplateService = new NDATemplateService();
