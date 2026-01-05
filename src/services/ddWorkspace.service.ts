/**
 * DD Workspace Service
 *
 * CRUD operations for DDWorkspace entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { DDWorkspace, DDSection, DDItem, DDDocument, DDSectionType, DDItemStatus, DDAssessmentRating, DDRiskLevel } from '../types/dd.types';
import { calculateDDCompletion } from '../types/dd.types';

class DDWorkspaceService extends BaseCRUDService<DDWorkspace> {
  protected storageConfig: StorageConfig = {
    key: 'dd_workspaces',
    version: 1,
  };

  protected entityName = 'DDWorkspace';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get workspaces by project
   */
  getByProjectId(projectId: string): DDWorkspace[] {
    return this.search((workspace) => workspace.projectId === projectId);
  }

  /**
   * Get workspaces by company
   */
  getByCompanyId(companyId: string): DDWorkspace[] {
    return this.search((workspace) => workspace.companyId === companyId);
  }

  /**
   * Get workspaces by status
   */
  getByStatus(status: DDWorkspace['status']): DDWorkspace[] {
    return this.search((workspace) => workspace.status === status);
  }

  /**
   * Get workspaces assigned to user
   */
  getByAssignedTo(userId: string): DDWorkspace[] {
    return this.search((workspace) => workspace.leadAssignee === userId);
  }

  /**
   * Get in-progress workspaces
   */
  getInProgress(): DDWorkspace[] {
    return this.search((workspace) => workspace.status === 'IN_PROGRESS');
  }

  /**
   * Get pending review workspaces
   */
  getPendingReview(): DDWorkspace[] {
    return this.search((workspace) => workspace.status === 'REVIEW' && !workspace.approvedBy);
  }

  /**
   * Add section to workspace
   */
  addSection(workspaceId: string, section: Omit<DDSection, 'id' | 'ddWorkspaceId' | 'createdAt' | 'updatedAt' | 'createdBy'>): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const now = new Date().toISOString();
    const newSection: DDSection = {
      ...section,
      id: `section-${Date.now()}`,
      ddWorkspaceId: workspaceId,
      items: [],
      completionPercentage: 0,
      totalItems: 0,
      completedItems: 0,
      blockedItems: 0,
      order: workspace.sections.length,
      createdAt: now,
      createdBy: 'user-001',
    };

    const sections = [...workspace.sections, newSection];
    return this.update(workspaceId, { sections, updatedAt: now });
  }

  /**
   * Update section
   */
  updateSection(workspaceId: string, sectionId: string, updates: Partial<DDSection>): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const sectionIndex = workspace.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return undefined;

    const sections = [...workspace.sections];
    sections[sectionIndex] = { ...sections[sectionIndex], ...updates, updatedAt: new Date().toISOString() };

    // Recalculate workspace totals
    const totalItems = sections.reduce((sum, s) => sum + s.totalItems, 0);
    const completedItems = sections.reduce((sum, s) => sum + s.completedItems, 0);
    const blockedItems = sections.reduce((sum, s) => sum + s.blockedItems, 0);
    const overallCompletionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return this.update(workspaceId, {
      sections,
      totalItems,
      completedItems,
      blockedItems,
      overallCompletionPercentage,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete section
   */
  deleteSection(workspaceId: string, sectionId: string): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const sections = workspace.sections.filter((s) => s.id !== sectionId);
    return this.update(workspaceId, { sections, updatedAt: new Date().toISOString() });
  }

  /**
   * Add item to section
   */
  addItem(workspaceId: string, sectionId: string, item: Omit<DDItem, 'id' | 'ddSectionId' | 'createdAt' | 'updatedAt' | 'createdBy'>): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const sectionIndex = workspace.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return undefined;

    const now = new Date().toISOString();
    const newItem: DDItem = {
      ...item,
      id: `item-${Date.now()}`,
      ddSectionId: sectionId,
      documents: [],
      reviewRequired: item.reviewRequired ?? false,
      order: workspace.sections[sectionIndex].items.length,
      createdAt: now,
      createdBy: 'user-001',
    };

    const sections = [...workspace.sections];
    sections[sectionIndex] = {
      ...sections[sectionIndex],
      items: [...sections[sectionIndex].items, newItem],
      totalItems: sections[sectionIndex].totalItems + 1,
      updatedAt: now,
    };

    return this.update(workspaceId, {
      sections,
      totalItems: workspace.totalItems + 1,
      updatedAt: now,
    });
  }

  /**
   * Update item
   */
  updateItem(workspaceId: string, sectionId: string, itemId: string, updates: Partial<DDItem>): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const sectionIndex = workspace.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return undefined;

    const itemIndex = workspace.sections[sectionIndex].items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return undefined;

    const sections = [...workspace.sections];
    const items = [...sections[sectionIndex].items];
    const oldStatus = items[itemIndex].status;
    items[itemIndex] = { ...items[itemIndex], ...updates, updatedAt: new Date().toISOString() };

    // Update completion if status changed
    const completedItems = items.filter((i) => i.status === 'COMPLETED' || i.status === 'NOT_APPLICABLE').length;
    const blockedItems = items.filter((i) => i.status === 'BLOCKED').length;
    const completionPercentage = calculateDDCompletion(items);

    sections[sectionIndex] = {
      ...sections[sectionIndex],
      items,
      completedItems,
      blockedItems,
      completionPercentage,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate workspace totals
    const totalCompleted = sections.reduce((sum, s) => sum + s.completedItems, 0);
    const totalBlocked = sections.reduce((sum, s) => sum + s.blockedItems, 0);
    const overallCompletionPercentage = workspace.totalItems > 0 ? Math.round((totalCompleted / workspace.totalItems) * 100) : 0;

    return this.update(workspaceId, {
      sections,
      completedItems: totalCompleted,
      blockedItems: totalBlocked,
      overallCompletionPercentage,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete item
   */
  deleteItem(workspaceId: string, sectionId: string, itemId: string): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const sectionIndex = workspace.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return undefined;

    const sections = [...workspace.sections];
    const items = sections[sectionIndex].items.filter((i) => i.id !== itemId);

    sections[sectionIndex] = {
      ...sections[sectionIndex],
      items,
      totalItems: items.length,
      completedItems: items.filter((i) => i.status === 'COMPLETED' || i.status === 'NOT_APPLICABLE').length,
      blockedItems: items.filter((i) => i.status === 'BLOCKED').length,
      completionPercentage: calculateDDCompletion(items),
      updatedAt: new Date().toISOString(),
    };

    return this.update(workspaceId, { sections, updatedAt: new Date().toISOString() });
  }

  /**
   * Add document to item
   */
  addDocument(workspaceId: string, sectionId: string, itemId: string, document: Omit<DDDocument, 'id' | 'ddItemId' | 'uploadedAt' | 'uploadedBy'>): DDWorkspace | undefined {
    const workspace = this.getById(workspaceId);
    if (!workspace) return undefined;

    const sectionIndex = workspace.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return undefined;

    const itemIndex = workspace.sections[sectionIndex].items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return undefined;

    const now = new Date().toISOString();
    const newDocument: DDDocument = {
      ...document,
      id: `doc-${Date.now()}`,
      ddItemId: itemId,
      uploadedAt: now,
      uploadedBy: 'user-001',
    };

    const sections = [...workspace.sections];
    const items = [...sections[sectionIndex].items];
    items[itemIndex] = {
      ...items[itemIndex],
      documents: [...items[itemIndex].documents, newDocument],
      updatedAt: now,
    };
    sections[sectionIndex] = { ...sections[sectionIndex], items, updatedAt: now };

    return this.update(workspaceId, { sections, updatedAt: now });
  }

  /**
   * Approve workspace
   */
  approve(workspaceId: string, approvedBy: string): DDWorkspace | undefined {
    const now = new Date().toISOString();
    return this.update(workspaceId, {
      status: 'COMPLETED',
      approvedBy,
      approvedAt: now,
      actualCompletionDate: now,
      updatedAt: now,
    });
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const workspaces = this.getAll();

    const byStatus: Record<string, number> = {
      NOT_STARTED: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
      COMPLETED: 0,
      ON_HOLD: 0,
    };

    let totalItems = 0;
    let totalCompleted = 0;
    let totalBlocked = 0;
    let pendingReview = 0;

    workspaces.forEach((workspace) => {
      byStatus[workspace.status]++;
      totalItems += workspace.totalItems;
      totalCompleted += workspace.completedItems;
      totalBlocked += workspace.blockedItems;

      if (workspace.status === 'REVIEW' && !workspace.approvedBy) {
        pendingReview++;
      }
    });

    return {
      total: workspaces.length,
      byStatus,
      totalItems,
      totalCompleted,
      totalBlocked,
      pendingReview,
      overallCompletion: totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0,
    };
  }
}

export const ddWorkspaceService = new DDWorkspaceService();
