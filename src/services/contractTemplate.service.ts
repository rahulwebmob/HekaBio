/**
 * Contract Template Service
 *
 * CRUD operations for ContractTemplate entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { ContractTemplate, ContractType } from '../types/contract.types';

class ContractTemplateService extends BaseCRUDService<ContractTemplate> {
  protected storageConfig: StorageConfig = {
    key: 'contract_templates',
    version: 1,
  };

  protected entityName = 'ContractTemplate';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get active templates
   */
  getActive(): ContractTemplate[] {
    return this.search((template) => template.isActive);
  }

  /**
   * Get templates by type
   */
  getByType(type: ContractType): ContractTemplate[] {
    return this.search((template) => template.type === type);
  }

  /**
   * Get most used templates
   */
  getMostUsed(limit: number = 5): ContractTemplate[] {
    return this.getAll()
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  /**
   * Increment usage count
   */
  incrementUsage(templateId: string): ContractTemplate | undefined {
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
  toggleActive(templateId: string): ContractTemplate | undefined {
    const template = this.getById(templateId);
    if (!template) return undefined;

    return this.update(templateId, {
      isActive: !template.isActive,
      updatedAt: new Date().toISOString(),
    });
  }
}

export const contractTemplateService = new ContractTemplateService();
