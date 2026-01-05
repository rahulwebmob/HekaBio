/**
 * Screening Service
 *
 * CRUD operations for ScreeningAssessment entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type {
  ScreeningAssessment,
  ScreeningStatus,
  ScreeningDecision,
  TherapeuticArea,
  TRL,
} from '../types/screening.types';

class ScreeningService extends BaseCRUDService<ScreeningAssessment> {
  protected storageConfig: StorageConfig = {
    key: 'screenings',
    version: 1,
  };

  protected entityName = 'ScreeningAssessment';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get screenings by status
   */
  getByStatus(status: ScreeningStatus): ScreeningAssessment[] {
    return this.search((screening) => screening.status === status);
  }

  /**
   * Get screenings by company
   */
  getByCompanyId(companyId: string): ScreeningAssessment[] {
    return this.search((screening) => screening.companyId === companyId);
  }

  /**
   * Get screenings by opportunity
   */
  getByOpportunityId(opportunityId: string): ScreeningAssessment[] {
    return this.search((screening) => screening.opportunityId === opportunityId);
  }

  /**
   * Get screenings by therapeutic area
   */
  getByTherapeuticArea(area: TherapeuticArea): ScreeningAssessment[] {
    return this.search((screening) => screening.therapeuticArea === area);
  }

  /**
   * Get screenings by TRL
   */
  getByTRL(trl: TRL): ScreeningAssessment[] {
    return this.search((screening) => screening.trl === trl);
  }

  /**
   * Get screenings assigned to user
   */
  getByAssignedTo(userId: string): ScreeningAssessment[] {
    return this.search((screening) => screening.assignedTo === userId);
  }

  /**
   * Get completed screenings
   */
  getCompleted(): ScreeningAssessment[] {
    return this.search((screening) => screening.status === 'COMPLETED' || screening.status === 'APPROVED' || screening.status === 'REJECTED');
  }

  /**
   * Get screenings by decision
   */
  getByDecision(decision: ScreeningDecision): ScreeningAssessment[] {
    return this.search((screening) => screening.decision === decision);
  }

  /**
   * Get screenings by score range
   */
  getByScoreRange(min: number, max: number): ScreeningAssessment[] {
    return this.search((screening) => screening.overallScore >= min && screening.overallScore <= max);
  }

  /**
   * Get high-scoring screenings (>= 70)
   */
  getHighScoring(): ScreeningAssessment[] {
    return this.search((screening) => screening.overallScore >= 70);
  }

  /**
   * Get pending reviews
   */
  getPendingReviews(): ScreeningAssessment[] {
    return this.search((screening) => screening.status === 'COMPLETED' && !screening.reviewedBy);
  }

  /**
   * Update screening status
   */
  updateStatus(screeningId: string, status: ScreeningStatus): ScreeningAssessment | undefined {
    const now = new Date().toISOString();
    const updates: Partial<ScreeningAssessment> = {
      status,
      updatedAt: now,
    };

    // Set completion timestamp if moving to completed status
    if ((status === 'COMPLETED' || status === 'APPROVED' || status === 'REJECTED')) {
      const screening = this.getById(screeningId);
      if (screening && !screening.completedAt) {
        updates.completedAt = now;
      }
    }

    return this.update(screeningId, updates);
  }

  /**
   * Make screening decision
   */
  makeDecision(
    screeningId: string,
    decision: ScreeningDecision,
    rationale: string,
    completedBy: string
  ): ScreeningAssessment | undefined {
    const now = new Date().toISOString();
    return this.update(screeningId, {
      decision,
      decisionRationale: rationale,
      status: decision === 'PROCEED_TO_GATE_1' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'COMPLETED',
      completedBy,
      completedAt: now,
      updatedAt: now,
    });
  }

  /**
   * Review screening
   */
  reviewScreening(
    screeningId: string,
    reviewedBy: string
  ): ScreeningAssessment | undefined {
    const now = new Date().toISOString();
    return this.update(screeningId, {
      reviewedBy,
      reviewedAt: now,
      updatedAt: now,
    });
  }

  /**
   * Assign screening
   */
  assignTo(screeningId: string, assignedTo: string): ScreeningAssessment | undefined {
    return this.update(screeningId, {
      assignedTo,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Update overall score
   */
  updateScore(screeningId: string, score: number, recommendation?: string): ScreeningAssessment | undefined {
    const updates: Partial<ScreeningAssessment> = {
      overallScore: score,
      updatedAt: new Date().toISOString(),
    };

    if (recommendation) {
      updates.recommendation = recommendation;
    }

    return this.update(screeningId, updates);
  }

  /**
   * Advanced search with filters
   */
  advancedSearch(filters: {
    status?: ScreeningStatus[];
    therapeuticArea?: TherapeuticArea[];
    trl?: TRL[];
    assignedTo?: string[];
    decision?: ScreeningDecision[];
    scoreMin?: number;
    scoreMax?: number;
    companyId?: string;
    opportunityId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): ScreeningAssessment[] {
    return this.search((screening) => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(screening.status)) {
          return false;
        }
      }

      // Therapeutic area filter
      if (filters.therapeuticArea && filters.therapeuticArea.length > 0) {
        if (!filters.therapeuticArea.includes(screening.therapeuticArea)) {
          return false;
        }
      }

      // TRL filter
      if (filters.trl && filters.trl.length > 0) {
        if (!filters.trl.includes(screening.trl)) {
          return false;
        }
      }

      // Assigned to filter
      if (filters.assignedTo && filters.assignedTo.length > 0) {
        if (!screening.assignedTo || !filters.assignedTo.includes(screening.assignedTo)) {
          return false;
        }
      }

      // Decision filter
      if (filters.decision && filters.decision.length > 0) {
        if (!screening.decision || !filters.decision.includes(screening.decision)) {
          return false;
        }
      }

      // Score range filter
      if (filters.scoreMin !== undefined && screening.overallScore < filters.scoreMin) {
        return false;
      }
      if (filters.scoreMax !== undefined && screening.overallScore > filters.scoreMax) {
        return false;
      }

      // Company filter
      if (filters.companyId && screening.companyId !== filters.companyId) {
        return false;
      }

      // Opportunity filter
      if (filters.opportunityId && screening.opportunityId !== filters.opportunityId) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        const searchMatch =
          screening.innovationName.toLowerCase().includes(lowerQuery) ||
          screening.innovationDescription.toLowerCase().includes(lowerQuery) ||
          screening.company.name.toLowerCase().includes(lowerQuery);
        if (!searchMatch) return false;
      }

      // Date range filter
      if (filters.dateFrom && screening.createdAt < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && screening.createdAt > filters.dateTo) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const screenings = this.getAll();

    const byStatus: Record<ScreeningStatus, number> = {
      NOT_STARTED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    const byDecision: Record<string, number> = {
      PROCEED_TO_GATE_1: 0,
      REQUEST_MORE_INFO: 0,
      REJECT: 0,
      DEFER: 0,
      NONE: 0,
    };

    let totalScore = 0;
    let completedCount = 0;
    let pendingReviews = 0;
    let highScoring = 0;

    screenings.forEach((screening) => {
      byStatus[screening.status]++;
      totalScore += screening.overallScore;

      if (screening.decision) {
        byDecision[screening.decision]++;
      } else {
        byDecision.NONE++;
      }

      if (screening.status === 'COMPLETED' || screening.status === 'APPROVED' || screening.status === 'REJECTED') {
        completedCount++;
      }

      if (screening.status === 'COMPLETED' && !screening.reviewedBy) {
        pendingReviews++;
      }

      if (screening.overallScore >= 70) {
        highScoring++;
      }
    });

    return {
      total: screenings.length,
      byStatus,
      byDecision,
      averageScore: screenings.length > 0 ? totalScore / screenings.length : 0,
      completedCount,
      completionRate: screenings.length > 0 ? (completedCount / screenings.length) * 100 : 0,
      pendingReviews,
      highScoring,
      approvalRate: completedCount > 0 ? (byStatus.APPROVED / completedCount) * 100 : 0,
    };
  }
}

export const screeningService = new ScreeningService();
