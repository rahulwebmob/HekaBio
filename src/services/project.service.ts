/**
 * Project Service
 *
 * CRUD operations for Project entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type {
  Project,
  ProjectTag,
  Stage,
  JapanMarketFit,
  NDAStatus,
  ContractStatus,
  ProjectFilters,
  ScoreBreakdown,
} from '../types/project.types';

class ProjectService extends BaseCRUDService<Project> {
  protected storageConfig: StorageConfig = {
    key: 'projects',
    version: 1,
  };

  protected entityName = 'Project';

  constructor() {
    super();
    this.init();
  }

  /**
   * Search projects by name or company name
   */
  searchByName(query: string): Project[] {
    const lowerQuery = query.toLowerCase();
    return this.search((project) =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.company.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get projects by tag
   */
  getByTag(tag: ProjectTag): Project[] {
    return this.search((project) => project.tags.includes(tag));
  }

  /**
   * Get projects by stage
   */
  getByStage(stage: Stage): Project[] {
    return this.search((project) => project.currentStage === stage);
  }

  /**
   * Get projects by score range
   */
  getByScoreRange(min: number, max: number): Project[] {
    return this.search((project) => project.score >= min && project.score <= max);
  }

  /**
   * Get projects with Japan interest
   */
  getJapanInterestProjects(): Project[] {
    return this.search((project) => project.japanInterest);
  }

  /**
   * Get hot projects (score > 80 && Japan interest)
   */
  getHotProjects(): Project[] {
    return this.search((project) => project.isHot === true);
  }

  /**
   * Get diamond projects (strategic + high potential)
   */
  getDiamondProjects(): Project[] {
    return this.search((project) => project.isDiamond === true);
  }

  /**
   * Get stalled projects (no activity > 30 days)
   */
  getStalledProjects(): Project[] {
    return this.search((project) => project.isStalled === true);
  }

  /**
   * Get projects by NDA status
   */
  getByNDAStatus(status: NDAStatus): Project[] {
    return this.search((project) => project.ndaStatus === status);
  }

  /**
   * Get projects by contract status
   */
  getByContractStatus(status: ContractStatus): Project[] {
    return this.search((project) => project.contractStatus === status);
  }

  /**
   * Get projects by company ID
   */
  getByCompanyId(companyId: string): Project[] {
    return this.search((project) => project.company.id === companyId);
  }

  /**
   * Advanced search with multiple filters
   */
  advancedSearch(filters: ProjectFilters): Project[] {
    return this.search((project) => {
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => project.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Stages filter
      if (filters.stages && filters.stages.length > 0) {
        if (!filters.stages.includes(project.currentStage)) {
          return false;
        }
      }

      // Score range filter
      if (filters.scoreMin !== undefined && project.score < filters.scoreMin) {
        return false;
      }
      if (filters.scoreMax !== undefined && project.score > filters.scoreMax) {
        return false;
      }

      // Japan interest filter
      if (filters.japanInterest !== undefined && project.japanInterest !== filters.japanInterest) {
        return false;
      }

      // Japan market fit filter
      if (filters.japanMarketFit && filters.japanMarketFit.length > 0) {
        if (!project.japanMarketFit || !filters.japanMarketFit.includes(project.japanMarketFit)) {
          return false;
        }
      }

      // NDA status filter
      if (filters.ndaStatus && filters.ndaStatus.length > 0) {
        if (!filters.ndaStatus.includes(project.ndaStatus)) {
          return false;
        }
      }

      // Contract status filter
      if (filters.contractStatus && filters.contractStatus.length > 0) {
        if (!project.contractStatus || !filters.contractStatus.includes(project.contractStatus)) {
          return false;
        }
      }

      // Assigned to filter
      if (filters.assignedTo && filters.assignedTo.length > 0) {
        if (!project.assignedTo || !filters.assignedTo.some((id) => project.assignedTo?.includes(id))) {
          return false;
        }
      }

      // Partner tags filter
      if (filters.partnerTags && filters.partnerTags.length > 0) {
        const hasPartnerTag = filters.partnerTags.some((tag) => project.partnerTags.includes(tag));
        if (!hasPartnerTag) return false;
      }

      // Hot flag filter
      if (filters.isHot !== undefined && project.isHot !== filters.isHot) {
        return false;
      }

      // Diamond flag filter
      if (filters.isDiamond !== undefined && project.isDiamond !== filters.isDiamond) {
        return false;
      }

      // Stalled flag filter
      if (filters.isStalled !== undefined && project.isStalled !== filters.isStalled) {
        return false;
      }

      // Search filter (name, company name)
      if (filters.search) {
        const lowerQuery = filters.search.toLowerCase();
        const nameMatch =
          project.name.toLowerCase().includes(lowerQuery) ||
          project.company.name.toLowerCase().includes(lowerQuery) ||
          project.description?.toLowerCase().includes(lowerQuery);
        if (!nameMatch) return false;
      }

      // Date range filter
      if (filters.dateFrom && project.createdAt < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && project.createdAt > filters.dateTo) {
        return false;
      }

      return true;
    });
  }

  /**
   * Move project to a new stage
   */
  moveToStage(projectId: string, stage: Stage, changedBy: string, changedByName: string, reason?: string, notes?: string): Project | undefined {
    const project = this.getById(projectId);
    if (!project) return undefined;

    const now = new Date().toISOString();
    const stageHistory = [
      ...project.stageHistory,
      {
        id: `stage-${Date.now()}`,
        projectId,
        fromStage: project.currentStage,
        toStage: stage,
        changedBy,
        changedByName,
        changedAt: now,
        reason,
        notes,
      },
    ];

    return this.update(projectId, {
      currentStage: stage,
      stageHistory,
      updatedAt: now,
    });
  }

  /**
   * Update project score
   */
  updateScore(projectId: string, score: number, breakdown?: ScoreBreakdown): Project | undefined {
    const project = this.getById(projectId);
    if (!project) return undefined;

    const now = new Date().toISOString();
    const isHot = score > 80 && project.japanInterest;

    return this.update(projectId, {
      score,
      scoreBreakdown: breakdown,
      lastScoredAt: now,
      isHot,
      updatedAt: now,
    });
  }

  /**
   * Update Japan assessment
   */
  updateJapanAssessment(
    projectId: string,
    japanMarketFit: JapanMarketFit,
    japanSummary?: string
  ): Project | undefined {
    const now = new Date().toISOString();
    return this.update(projectId, {
      japanMarketFit,
      japanSummary,
      japanScreeningCompletedAt: now,
      updatedAt: now,
    });
  }

  /**
   * Update NDA status
   */
  updateNDAStatus(projectId: string, status: NDAStatus, completedAt?: string): Project | undefined {
    const project = this.getById(projectId);
    if (!project) return undefined;

    const now = new Date().toISOString();
    const updates: Partial<Project> = {
      ndaStatus: status,
      updatedAt: now,
    };

    if (status === 'REQUESTED' && !project.ndaRequestedAt) {
      updates.ndaRequestedAt = now;
    }

    if (status === 'COMPLETED') {
      updates.ndaCompletedAt = completedAt || now;
    }

    return this.update(projectId, updates);
  }

  /**
   * Update Due Diligence progress
   */
  updateDDProgress(projectId: string, progress: number): Project | undefined {
    const project = this.getById(projectId);
    if (!project) return undefined;

    const now = new Date().toISOString();
    const updates: Partial<Project> = {
      ddProgress: progress,
      updatedAt: now,
    };

    if (!project.ddStartedAt && progress > 0) {
      updates.ddStartedAt = now;
    }

    if (progress === 100 && !project.ddCompletedAt) {
      updates.ddCompletedAt = now;
    }

    return this.update(projectId, updates);
  }

  /**
   * Update contract status
   */
  updateContractStatus(projectId: string, status: ContractStatus): Project | undefined {
    const now = new Date().toISOString();
    return this.update(projectId, {
      contractStatus: status,
      contractDecisionAt: now,
      updatedAt: now,
    });
  }

  /**
   * Mark project as hot
   */
  markAsHot(projectId: string): Project | undefined {
    return this.update(projectId, { isHot: true });
  }

  /**
   * Mark project as diamond
   */
  markAsDiamond(projectId: string): Project | undefined {
    return this.update(projectId, { isDiamond: true });
  }

  /**
   * Mark project as stalled
   */
  markAsStalled(projectId: string): Project | undefined {
    return this.update(projectId, { isStalled: true });
  }

  /**
   * Check and update stalled status (no activity > 30 days)
   */
  updateStalledStatus(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const threshold = thirtyDaysAgo.toISOString();

    this.items.forEach((project) => {
      const isStalled = (project.updatedAt || project.createdAt) < threshold;
      if (project.isStalled !== isStalled) {
        this.update(project.id, { isStalled });
      }
    });
  }

  /**
   * Get project statistics
   */
  getStatistics() {
    const projects = this.getAll();

    const byStage: Record<string, number> = {};
    const byTag: Record<string, number> = {};
    const byJapanFit: Record<string, number> = {
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      NOT_ASSESSED: 0,
    };

    let totalScore = 0;
    let hotCount = 0;
    let diamondCount = 0;
    let stalledCount = 0;

    projects.forEach((project) => {
      // By stage
      byStage[project.currentStage] = (byStage[project.currentStage] || 0) + 1;

      // By tag
      project.tags.forEach((tag) => {
        byTag[tag] = (byTag[tag] || 0) + 1;
      });

      // By Japan fit
      const fit = project.japanMarketFit || 'NOT_ASSESSED';
      byJapanFit[fit] = (byJapanFit[fit] || 0) + 1;

      // Scores and flags
      totalScore += project.score;
      if (project.isHot) hotCount++;
      if (project.isDiamond) diamondCount++;
      if (project.isStalled) stalledCount++;
    });

    return {
      total: projects.length,
      byStage,
      byTag,
      byJapanFit,
      averageScore: projects.length > 0 ? totalScore / projects.length : 0,
      hotCount,
      diamondCount,
      stalledCount,
    };
  }
}

export const projectService = new ProjectService();
