/**
 * Opportunity Service
 *
 * CRUD operations for Opportunity entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type {
  Opportunity,
  OpportunityStatus,
  OpportunityPriority,
  OpportunitySource,
  StrategicFitRating,
  QuickAssessment,
  GoNoGoDecision,
  DecisionType,
} from '../types/opportunity.types';
import type { ProjectTag } from '../types/project.types';

class OpportunityService extends BaseCRUDService<Opportunity> {
  protected storageConfig: StorageConfig = {
    key: 'opportunities',
    version: 1,
  };

  protected entityName = 'Opportunity';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get opportunities by status
   */
  getByStatus(status: OpportunityStatus): Opportunity[] {
    return this.search((opp) => opp.status === status);
  }

  /**
   * Get opportunities by priority
   */
  getByPriority(priority: OpportunityPriority): Opportunity[] {
    return this.search((opp) => opp.priority === priority);
  }

  /**
   * Get opportunities by source
   */
  getBySource(source: OpportunitySource): Opportunity[] {
    return this.search((opp) => opp.source === source);
  }

  /**
   * Get opportunities by tag
   */
  getByTag(tag: ProjectTag): Opportunity[] {
    return this.search((opp) => opp.tags.includes(tag));
  }

  /**
   * Get opportunities assigned to a user
   */
  getByAssignedTo(userId: string): Opportunity[] {
    return this.search((opp) => opp.assignedTo === userId);
  }

  /**
   * Get opportunities by company
   */
  getByCompanyId(companyId: string): Opportunity[] {
    return this.search((opp) => opp.company.id === companyId);
  }

  /**
   * Get opportunities that need attention
   */
  getNeedingAttention(): Opportunity[] {
    const now = new Date();
    return this.search((opp) => {
      // Needs attention if:
      // 1. Priority is URGENT
      // 2. Status is AWAITING_DECISION
      // 3. Follow-up date is past
      // 4. Status is NEW or REVIEWING for more than 7 days

      if (opp.priority === 'URGENT') return true;
      if (opp.status === 'AWAITING_DECISION') return true;

      if (opp.followUpDate) {
        const followUp = new Date(opp.followUpDate);
        if (followUp < now) return true;
      }

      if (opp.status === 'NEW' || opp.status === 'REVIEWING') {
        const created = new Date(opp.createdAt);
        const daysSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated > 7) return true;
      }

      return false;
    });
  }

  /**
   * Get opportunities with assessment completed
   */
  getWithAssessment(): Opportunity[] {
    return this.search((opp) => !!opp.quickAssessment);
  }

  /**
   * Get opportunities by strategic fit rating
   */
  getByStrategicFit(rating: StrategicFitRating): Opportunity[] {
    return this.search((opp) => opp.quickAssessment?.strategicFit === rating);
  }

  /**
   * Get converted opportunities
   */
  getConverted(): Opportunity[] {
    return this.search((opp) => opp.status === 'CONVERTED');
  }

  /**
   * Get declined opportunities
   */
  getDeclined(): Opportunity[] {
    return this.search((opp) => opp.status === 'DECLINED');
  }

  /**
   * Update opportunity status
   */
  updateStatus(opportunityId: string, status: OpportunityStatus): Opportunity | undefined {
    return this.update(opportunityId, {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Update opportunity priority
   */
  updatePriority(opportunityId: string, priority: OpportunityPriority): Opportunity | undefined {
    return this.update(opportunityId, {
      priority,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Assign opportunity to user
   */
  assignTo(opportunityId: string, assignedTo: string, assignedToName: string): Opportunity | undefined {
    return this.update(opportunityId, {
      assignedTo,
      assignedToName,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Submit quick assessment
   */
  submitAssessment(
    opportunityId: string,
    assessment: QuickAssessment,
    assessedBy: string,
    assessedByName: string
  ): Opportunity | undefined {
    const opp = this.getById(opportunityId);
    if (!opp) return undefined;

    const now = new Date().toISOString();
    const quickAssessment: QuickAssessment = {
      ...assessment,
      id: `assess-${Date.now()}`,
      opportunityId,
      assessedBy,
      assessedByName,
      assessedAt: now,
      createdAt: now,
    };

    return this.update(opportunityId, {
      quickAssessment,
      assessmentCompletedAt: now,
      status: 'AWAITING_DECISION',
      updatedAt: now,
    });
  }

  /**
   * Update quick assessment
   */
  updateAssessment(
    opportunityId: string,
    updates: Partial<QuickAssessment>
  ): Opportunity | undefined {
    const opp = this.getById(opportunityId);
    if (!opp || !opp.quickAssessment) return undefined;

    const updatedAssessment = {
      ...opp.quickAssessment,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.update(opportunityId, {
      quickAssessment: updatedAssessment,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Make go/no-go decision
   */
  makeDecision(
    opportunityId: string,
    decision: GoNoGoDecision,
    decidedBy: string,
    decidedByName: string
  ): Opportunity | undefined {
    const opp = this.getById(opportunityId);
    if (!opp) return undefined;

    const now = new Date().toISOString();
    const goNoGoDecision: GoNoGoDecision = {
      ...decision,
      id: `decision-${Date.now()}`,
      opportunityId,
      decidedBy,
      decidedByName,
      decisionDate: now,
      createdAt: now,
    };

    // Determine new status based on decision
    let newStatus: OpportunityStatus = opp.status;
    if (decision.decision === 'GO') {
      newStatus = 'APPROVED';
    } else if (decision.decision === 'NO_GO') {
      newStatus = 'DECLINED';
    } else if (decision.decision === 'DEFER') {
      newStatus = 'ON_HOLD';
    } else if (decision.decision === 'REQUEST_MORE_INFO') {
      newStatus = 'REVIEWING';
    }

    return this.update(opportunityId, {
      goNoGoDecision,
      decisionMadeAt: now,
      status: newStatus,
      updatedAt: now,
    });
  }

  /**
   * Convert to project
   */
  convertToProject(opportunityId: string, projectId: string): Opportunity | undefined {
    const now = new Date().toISOString();
    return this.update(opportunityId, {
      convertedToProjectId: projectId,
      convertedAt: now,
      status: 'CONVERTED',
      updatedAt: now,
    });
  }

  /**
   * Archive opportunity
   */
  archive(opportunityId: string): Opportunity | undefined {
    return this.update(opportunityId, {
      status: 'ARCHIVED',
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Bulk update status
   */
  bulkUpdateStatus(opportunityIds: string[], status: OpportunityStatus): number {
    let count = 0;
    const now = new Date().toISOString();

    opportunityIds.forEach((id) => {
      const updated = this.update(id, { status, updatedAt: now });
      if (updated) count++;
    });

    return count;
  }

  /**
   * Update follow-up date
   */
  updateFollowUpDate(opportunityId: string, followUpDate: string): Opportunity | undefined {
    return this.update(opportunityId, {
      followUpDate,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Advanced search with filters
   */
  advancedSearch(filters: {
    status?: OpportunityStatus[];
    priority?: OpportunityPriority[];
    tags?: ProjectTag[];
    source?: OpportunitySource[];
    assignedTo?: string[];
    strategicFit?: StrategicFitRating[];
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Opportunity[] {
    return this.search((opp) => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(opp.status)) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(opp.priority)) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => opp.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Source filter
      if (filters.source && filters.source.length > 0) {
        if (!filters.source.includes(opp.source)) {
          return false;
        }
      }

      // Assigned to filter
      if (filters.assignedTo && filters.assignedTo.length > 0) {
        if (!opp.assignedTo || !filters.assignedTo.includes(opp.assignedTo)) {
          return false;
        }
      }

      // Strategic fit filter
      if (filters.strategicFit && filters.strategicFit.length > 0) {
        if (!opp.quickAssessment || !filters.strategicFit.includes(opp.quickAssessment.strategicFit)) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        const searchMatch =
          opp.name.toLowerCase().includes(lowerQuery) ||
          opp.company.name.toLowerCase().includes(lowerQuery) ||
          (opp.description?.toLowerCase().includes(lowerQuery) ?? false);
        if (!searchMatch) return false;
      }

      // Date range filter
      if (filters.dateFrom && opp.createdAt < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && opp.createdAt > filters.dateTo) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const opportunities = this.getAll();

    const byStatus: Record<OpportunityStatus, number> = {
      NEW: 0,
      REVIEWING: 0,
      ASSESSING: 0,
      AWAITING_DECISION: 0,
      APPROVED: 0,
      CONVERTED: 0,
      DECLINED: 0,
      ON_HOLD: 0,
      ARCHIVED: 0,
    };

    const byPriority: Record<OpportunityPriority, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    let withAssessment = 0;
    let withDecision = 0;
    let needingAttention = 0;

    opportunities.forEach((opp) => {
      byStatus[opp.status]++;
      byPriority[opp.priority]++;

      if (opp.quickAssessment) withAssessment++;
      if (opp.goNoGoDecision) withDecision++;

      // Check if needs attention
      if (this.checkNeedsAttention(opp)) needingAttention++;
    });

    return {
      total: opportunities.length,
      byStatus,
      byPriority,
      withAssessment,
      withDecision,
      needingAttention,
      conversionRate: opportunities.length > 0 ? (byStatus.CONVERTED / opportunities.length) * 100 : 0,
      declineRate: opportunities.length > 0 ? (byStatus.DECLINED / opportunities.length) * 100 : 0,
    };
  }

  /**
   * Helper to check if opportunity needs attention
   */
  private checkNeedsAttention(opp: Opportunity): boolean {
    const now = new Date();

    if (opp.priority === 'URGENT') return true;
    if (opp.status === 'AWAITING_DECISION') return true;

    if (opp.followUpDate) {
      const followUp = new Date(opp.followUpDate);
      if (followUp < now) return true;
    }

    if (opp.status === 'NEW' || opp.status === 'REVIEWING') {
      const created = new Date(opp.createdAt);
      const daysSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated > 7) return true;
    }

    return false;
  }
}

export const opportunityService = new OpportunityService();
