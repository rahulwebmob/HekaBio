/**
 * Survey Instance Service
 *
 * CRUD operations for SurveyInstance entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type {
  SurveyInstance,
  SubmissionStatus,
  SurveyResponse,
} from '../types/survey.types';

class SurveyInstanceService extends BaseCRUDService<SurveyInstance> {
  protected storageConfig: StorageConfig = {
    key: 'survey_instances',
    version: 1,
  };

  protected entityName = 'SurveyInstance';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get instances by company
   */
  getByCompanyId(companyId: string): SurveyInstance[] {
    return this.search((instance) => instance.companyId === companyId);
  }

  /**
   * Get instances by project
   */
  getByProjectId(projectId: string): SurveyInstance[] {
    return this.search((instance) => instance.projectId === projectId);
  }

  /**
   * Get instances by status
   */
  getByStatus(status: SubmissionStatus): SurveyInstance[] {
    return this.search((instance) => instance.status === status);
  }

  /**
   * Get instances assigned to a contact
   */
  getByAssignedTo(contactId: string): SurveyInstance[] {
    return this.search((instance) => instance.assignedTo === contactId);
  }

  /**
   * Get instances by template
   */
  getByTemplateId(templateId: string): SurveyInstance[] {
    return this.search((instance) => instance.templateId === templateId);
  }

  /**
   * Get overdue instances
   */
  getOverdueInstances(): SurveyInstance[] {
    const now = new Date().toISOString();
    return this.search(
      (instance) =>
        !!instance.dueDate &&
        instance.dueDate < now &&
        instance.status !== 'SUBMITTED' &&
        instance.status !== 'REVIEWED'
    );
  }

  /**
   * Get instances due soon (within X days)
   */
  getDueSoon(days: number = 7): SurveyInstance[] {
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    const thresholdStr = threshold.toISOString();

    return this.search(
      (instance) =>
        !!instance.dueDate &&
        instance.dueDate > now.toISOString() &&
        instance.dueDate <= thresholdStr &&
        instance.status !== 'SUBMITTED' &&
        instance.status !== 'REVIEWED'
    );
  }

  /**
   * Update instance status
   */
  updateStatus(instanceId: string, status: SubmissionStatus): SurveyInstance | undefined {
    const instance = this.getById(instanceId);
    if (!instance) return undefined;

    const now = new Date().toISOString();
    const updates: Partial<SurveyInstance> = {
      status,
      updatedAt: now,
    };

    // Update timestamps based on status
    if (status === 'IN_PROGRESS' && !instance.startedAt) {
      updates.startedAt = now;
    } else if (status === 'SUBMITTED' && !instance.submittedAt) {
      updates.submittedAt = now;
    } else if (status === 'REVIEWED' && !instance.reviewedAt) {
      updates.reviewedAt = now;
    }

    return this.update(instanceId, updates);
  }

  /**
   * Update completion percentage
   */
  updateCompletionPercentage(instanceId: string, percentage: number): SurveyInstance | undefined {
    const instance = this.getById(instanceId);
    if (!instance) return undefined;

    const now = new Date().toISOString();
    const updates: Partial<SurveyInstance> = {
      completionPercentage: percentage,
      updatedAt: now,
    };

    // Auto-update status based on completion
    if (percentage > 0 && instance.status === 'NOT_STARTED') {
      updates.status = 'IN_PROGRESS';
      updates.startedAt = now;
    } else if (percentage === 100 && instance.status === 'IN_PROGRESS') {
      updates.status = 'SUBMITTED';
      updates.submittedAt = now;
    }

    return this.update(instanceId, updates);
  }

  /**
   * Update responses
   */
  updateResponses(
    instanceId: string,
    responses: SurveyResponse[],
    completionPercentage?: number
  ): SurveyInstance | undefined {
    const instance = this.getById(instanceId);
    if (!instance) return undefined;

    const updates: Partial<SurveyInstance> = {
      responses,
      updatedAt: new Date().toISOString(),
    };

    if (completionPercentage !== undefined) {
      updates.completionPercentage = completionPercentage;

      // Auto-update status
      if (completionPercentage > 0 && instance.status === 'NOT_STARTED') {
        updates.status = 'IN_PROGRESS';
        updates.startedAt = new Date().toISOString();
      } else if (completionPercentage === 100 && instance.status === 'IN_PROGRESS') {
        updates.status = 'SUBMITTED';
        updates.submittedAt = new Date().toISOString();
      }
    }

    return this.update(instanceId, updates);
  }

  /**
   * Review survey
   */
  reviewSurvey(
    instanceId: string,
    reviewedBy: string,
    reviewNotes?: string,
    flaggedQuestions?: string[]
  ): SurveyInstance | undefined {
    const now = new Date().toISOString();
    return this.update(instanceId, {
      status: 'REVIEWED',
      reviewedBy,
      reviewedAt: now,
      reviewNotes,
      flaggedQuestions,
      updatedAt: now,
    });
  }

  /**
   * Update due date
   */
  updateDueDate(instanceId: string, dueDate: string): SurveyInstance | undefined {
    return this.update(instanceId, {
      dueDate,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Reassign survey
   */
  reassignSurvey(instanceId: string, assignedTo: string): SurveyInstance | undefined {
    return this.update(instanceId, {
      assignedTo,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Get statistics for surveys
   */
  getStatistics() {
    const instances = this.getAll();

    const byStatus: Record<SubmissionStatus, number> = {
      NOT_STARTED: 0,
      IN_PROGRESS: 0,
      SUBMITTED: 0,
      REVIEWED: 0,
    };

    let totalCompletion = 0;
    let submittedCount = 0;
    let overdueCount = 0;

    const now = new Date().toISOString();

    instances.forEach((instance) => {
      byStatus[instance.status]++;
      totalCompletion += instance.completionPercentage;

      if (instance.status === 'SUBMITTED' || instance.status === 'REVIEWED') {
        submittedCount++;
      }

      if (
        instance.dueDate &&
        instance.dueDate < now &&
        instance.status !== 'SUBMITTED' &&
        instance.status !== 'REVIEWED'
      ) {
        overdueCount++;
      }
    });

    return {
      total: instances.length,
      byStatus,
      averageCompletion: instances.length > 0 ? totalCompletion / instances.length : 0,
      submittedCount,
      completionRate: instances.length > 0 ? (submittedCount / instances.length) * 100 : 0,
      overdueCount,
    };
  }

  /**
   * Advanced search with filters
   */
  advancedSearch(filters: {
    companyId?: string;
    projectId?: string;
    status?: SubmissionStatus[];
    assignedTo?: string;
    templateId?: string;
    sentDateFrom?: string;
    sentDateTo?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    completionMin?: number;
    completionMax?: number;
  }): SurveyInstance[] {
    return this.search((instance) => {
      // Company filter
      if (filters.companyId && instance.companyId !== filters.companyId) {
        return false;
      }

      // Project filter
      if (filters.projectId && instance.projectId !== filters.projectId) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(instance.status)) {
          return false;
        }
      }

      // Assigned to filter
      if (filters.assignedTo && instance.assignedTo !== filters.assignedTo) {
        return false;
      }

      // Template filter
      if (filters.templateId && instance.templateId !== filters.templateId) {
        return false;
      }

      // Sent date range
      if (filters.sentDateFrom && instance.sentAt < filters.sentDateFrom) {
        return false;
      }
      if (filters.sentDateTo && instance.sentAt > filters.sentDateTo) {
        return false;
      }

      // Due date range
      if (filters.dueDateFrom && instance.dueDate && instance.dueDate < filters.dueDateFrom) {
        return false;
      }
      if (filters.dueDateTo && instance.dueDate && instance.dueDate > filters.dueDateTo) {
        return false;
      }

      // Completion percentage range
      if (filters.completionMin !== undefined && instance.completionPercentage < filters.completionMin) {
        return false;
      }
      if (filters.completionMax !== undefined && instance.completionPercentage > filters.completionMax) {
        return false;
      }

      return true;
    });
  }
}

export const surveyInstanceService = new SurveyInstanceService();
