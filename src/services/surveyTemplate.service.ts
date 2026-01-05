/**
 * Survey Template Service
 *
 * CRUD operations for SurveyTemplate entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { SurveyTemplate, SurveyType } from '../types/survey.types';

class SurveyTemplateService extends BaseCRUDService<SurveyTemplate> {
  protected storageConfig: StorageConfig = {
    key: 'survey_templates',
    version: 1,
  };

  protected entityName = 'SurveyTemplate';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get templates by type
   */
  getByType(type: SurveyType): SurveyTemplate[] {
    return this.search((template) => template.type === type);
  }

  /**
   * Get active templates only
   */
  getActiveTemplates(): SurveyTemplate[] {
    return this.search((template) => template.isActive);
  }

  /**
   * Get latest version of a template type
   */
  getLatestVersion(type: SurveyType): SurveyTemplate | undefined {
    const templates = this.getByType(type);
    if (templates.length === 0) return undefined;

    return templates.sort((a, b) => {
      const versionA = parseFloat(a.version);
      const versionB = parseFloat(b.version);
      return versionB - versionA;
    })[0];
  }

  /**
   * Get template by type and version
   */
  getByTypeAndVersion(type: SurveyType, version: string): SurveyTemplate | undefined {
    return this.findOne((template) => template.type === type && template.version === version);
  }

  /**
   * Activate/Deactivate template
   */
  toggleActive(templateId: string): SurveyTemplate | undefined {
    const template = this.getById(templateId);
    if (!template) return undefined;

    return this.update(templateId, { isActive: !template.isActive });
  }

  /**
   * Create new version of a template
   */
  createNewVersion(
    templateId: string,
    newVersionNumber: string,
    userId: string
  ): SurveyTemplate | undefined {
    const original = this.getById(templateId);
    if (!original) return undefined;

    const newTemplate = this.create({
      name: `${original.name} v${newVersionNumber}`,
      type: original.type,
      description: original.description,
      version: newVersionNumber,
      isActive: false,
      sections: original.sections,
      createdBy: userId,
    });

    return newTemplate;
  }

  /**
   * Get all template versions for a type
   */
  getAllVersions(type: SurveyType): SurveyTemplate[] {
    return this.getByType(type).sort((a, b) => {
      const versionA = parseFloat(a.version);
      const versionB = parseFloat(b.version);
      return versionB - versionA;
    });
  }

  /**
   * Get question count for a template
   */
  getQuestionCount(templateId: string): number {
    const template = this.getById(templateId);
    if (!template) return 0;

    return template.sections.reduce(
      (total, section) => total + section.questions.length,
      0
    );
  }

  /**
   * Get required question count
   */
  getRequiredQuestionCount(templateId: string): number {
    const template = this.getById(templateId);
    if (!template) return 0;

    return template.sections.reduce(
      (total, section) =>
        total + section.questions.filter((q) => q.isRequired).length,
      0
    );
  }

  /**
   * Search templates by name
   */
  searchByName(query: string): SurveyTemplate[] {
    const lowerQuery = query.toLowerCase();
    return this.search((template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      (template.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }
}

export const surveyTemplateService = new SurveyTemplateService();
