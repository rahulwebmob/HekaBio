/**
 * Projects Slice
 * Redux state management for projects and pipeline
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Project,
  ProjectFilters,
  SavedFilter,
  Stage,
  ScoreBreakdown,
  JapanMarketFit,
  NDAStatus,
  ContractStatus,
  ReachType,
  ProjectStatus,
  InternalReviewDecision,
  PartnerOutreachStatus,
} from '../../types/project.types';
import { mockProjects } from '../../data/mockProjects';

interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
  filters: ProjectFilters;
  savedFilters: SavedFilter[];
  currentSavedFilterId: string | null; // Track which saved filter is active
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: mockProjects,
  selectedProjectId: null,
  filters: {},
  savedFilters: [], // Will be populated from localStorage or backend
  currentSavedFilterId: null,
  isLoading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Project CRUD
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    duplicateProject: (state, action: PayloadAction<string>) => {
      const originalProject = state.projects.find((p) => p.id === action.payload);
      if (originalProject) {
        const now = new Date().toISOString();
        const duplicatedProject: Project = {
          ...originalProject,
          id: `project-${Date.now()}`,
          name: `${originalProject.name} (Copy)`,
          currentStage: 'NEW', // Reset to initial stage
          score: 0, // Reset score
          scoreBreakdown: undefined,
          lastScoredAt: undefined,
          isHot: false,
          isPriority: false,
          ddProgress: 0,
          ddCompletedAt: undefined,
          internalReviewDecision: 'PENDING',
          thankYouEmailSent: false,
          stageHistory: [
            {
              id: `stage-${Date.now()}`,
              projectId: `project-${Date.now()}`,
              fromStage: null,
              toStage: 'NEW',
              changedBy: 'user-001',
              changedByName: 'Current User',
              changedAt: now,
              reason: 'Project duplicated',
            },
          ],
          createdAt: now,
          updatedAt: now,
          createdBy: 'user-001',
        };
        state.projects.unshift(duplicatedProject); // Add to beginning of list
      }
    },
    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },

    // Stage Management
    moveToStage: (
      state,
      action: PayloadAction<{ projectId: string; stage: Stage; reason?: string; notes?: string }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        const now = new Date().toISOString();
        project.stageHistory.push({
          id: `stage-${Date.now()}`,
          projectId: action.payload.projectId,
          fromStage: project.currentStage,
          toStage: action.payload.stage,
          changedBy: 'user-001',
          changedByName: 'Current User',
          changedAt: now,
          reason: action.payload.reason,
          notes: action.payload.notes,
        });
        project.currentStage = action.payload.stage;
        project.updatedAt = now;
      }
    },
    bulkMoveToStage: (
      state,
      action: PayloadAction<{ projectIds: string[]; stage: Stage; reason: string; notes?: string }>
    ) => {
      const now = new Date().toISOString();
      action.payload.projectIds.forEach((projectId) => {
        const project = state.projects.find((p) => p.id === projectId);
        if (project) {
          project.stageHistory.push({
            id: `stage-${Date.now()}-${projectId}`,
            projectId,
            fromStage: project.currentStage,
            toStage: action.payload.stage,
            changedBy: 'user-001',
            changedByName: 'Current User',
            changedAt: now,
            reason: action.payload.reason,
            notes: action.payload.notes,
          });
          project.currentStage = action.payload.stage;
          project.updatedAt = now;
        }
      });
    },

    // Score Management
    updateScore: (
      state,
      action: PayloadAction<{
        projectId: string;
        score: number;
        breakdown?: ScoreBreakdown;
        scoredBy?: 'AI' | 'MANUAL';
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.score = action.payload.score;
        project.scoreBreakdown = action.payload.breakdown;
        project.autoScoredBy = action.payload.scoredBy || 'MANUAL';
        project.lastScoredAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
        // Update hot flag based on score threshold
        project.isHot = project.score > 80;
      }
    },

    // Japan Assessment
    updateJapanAssessment: (
      state,
      action: PayloadAction<{
        projectId: string;
        japanMarketFit: JapanMarketFit;
        japanSummary?: string;
        japanMarketAnalysis?: string;
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.japanMarketFit = action.payload.japanMarketFit;
        project.japanSummary = action.payload.japanSummary;
        project.japanMarketAnalysis = action.payload.japanMarketAnalysis;
        project.japanScreeningCompletedAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
      }
    },

    // Internal Review Decision
    updateInternalReview: (
      state,
      action: PayloadAction<{
        projectId: string;
        decision: InternalReviewDecision;
        notes?: string;
        reviewedBy?: string;
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.internalReviewDecision = action.payload.decision;
        project.internalReviewDate = new Date().toISOString();
        project.internalReviewNotes = action.payload.notes;
        project.internalReviewBy = action.payload.reviewedBy;
        project.updatedAt = new Date().toISOString();

        // Auto-move to appropriate stage based on decision
        if (action.payload.decision === 'MONITOR') {
          project.projectStatus = 'MONITORING';
          project.currentStage = 'MONITORING';
        } else if (action.payload.decision === 'PROCEED') {
          project.projectStatus = 'ACTIVE';
          // Move to next stage in workflow (NDA_REQUESTED)
          project.currentStage = 'NDA_REQUESTED';
        }
      }
    },

    // Missing Data Management
    updateMissingData: (
      state,
      action: PayloadAction<{
        projectId: string;
        missingDataItems?: string[];
        missingDataFromScreening?: string[];
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        if (action.payload.missingDataItems !== undefined) {
          project.missingDataItems = action.payload.missingDataItems;
        }
        if (action.payload.missingDataFromScreening !== undefined) {
          project.missingDataFromScreening = action.payload.missingDataFromScreening;
        }
        project.missingDataLastUpdated = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
      }
    },

    // Partner Matching
    updatePartnerMatching: (
      state,
      action: PayloadAction<{
        projectId: string;
        matchedPartners: string[];
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.matchedPartners = action.payload.matchedPartners;
        project.partnerMatchingCompletedAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
      }
    },

    // Partner Outreach Status
    updatePartnerOutreach: (
      state,
      action: PayloadAction<{
        projectId: string;
        partnerOutreachStatus: PartnerOutreachStatus[];
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.partnerOutreachStatus = action.payload.partnerOutreachStatus;
        project.updatedAt = new Date().toISOString();
      }
    },

    // Update single partner outreach
    updateSinglePartnerOutreach: (
      state,
      action: PayloadAction<{
        projectId: string;
        partnerId: string;
        status: PartnerOutreachStatus;
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        if (!project.partnerOutreachStatus) {
          project.partnerOutreachStatus = [];
        }
        const index = project.partnerOutreachStatus.findIndex(
          (p) => p.partnerId === action.payload.partnerId
        );
        if (index !== -1) {
          project.partnerOutreachStatus[index] = action.payload.status;
        } else {
          project.partnerOutreachStatus.push(action.payload.status);
        }
        project.updatedAt = new Date().toISOString();
      }
    },

    // Project Status Management
    updateProjectStatus: (
      state,
      action: PayloadAction<{
        projectId: string;
        projectStatus: ProjectStatus;
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.projectStatus = action.payload.projectStatus;
        project.updatedAt = new Date().toISOString();
      }
    },

    // Thank You Email Tracking
    markThankYouEmailSent: (state, action: PayloadAction<{ projectId: string }>) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.thankYouEmailSent = true;
        project.thankYouEmailSentAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
      }
    },

    // NDA Management
    updateNDAStatus: (
      state,
      action: PayloadAction<{
        projectId: string;
        status: NDAStatus;
        completedAt?: string;
      }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.ndaStatus = action.payload.status;
        if (action.payload.status === 'REQUESTED' && !project.ndaRequestedAt) {
          project.ndaRequestedAt = new Date().toISOString();
        }
        if (action.payload.status === 'COMPLETED') {
          project.ndaCompletedAt = action.payload.completedAt || new Date().toISOString();
        }
        project.updatedAt = new Date().toISOString();
      }
    },

    // Due Diligence
    updateDDProgress: (state, action: PayloadAction<{ projectId: string; progress: number }>) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.ddProgress = action.payload.progress;
        if (!project.ddStartedAt && action.payload.progress > 0) {
          project.ddStartedAt = new Date().toISOString();
        }
        if (action.payload.progress === 100 && !project.ddCompletedAt) {
          project.ddCompletedAt = new Date().toISOString();
        }
        project.updatedAt = new Date().toISOString();
      }
    },

    // Contract Decision
    updateContractStatus: (
      state,
      action: PayloadAction<{ projectId: string; status: ContractStatus }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.contractStatus = action.payload.status;
        project.contractDecisionAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
      }
    },

    // Filters
    setFilters: (state, action: PayloadAction<ProjectFilters>) => {
      state.filters = action.payload;
      state.currentSavedFilterId = null; // Clear active saved filter when manually changing filters
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentSavedFilterId = null;
    },

    // Saved Filters
    saveSavedFilter: (state, action: PayloadAction<SavedFilter>) => {
      // Check if filter with same ID exists (update) or add new
      const existingIndex = state.savedFilters.findIndex((f) => f.id === action.payload.id);
      if (existingIndex !== -1) {
        state.savedFilters[existingIndex] = action.payload;
      } else {
        state.savedFilters.push(action.payload);
      }
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hekabio_saved_filters', JSON.stringify(state.savedFilters));
      }
    },
    loadSavedFilter: (state, action: PayloadAction<string>) => {
      const savedFilter = state.savedFilters.find((f) => f.id === action.payload);
      if (savedFilter) {
        state.filters = savedFilter.filters;
        state.currentSavedFilterId = savedFilter.id;
        // Increment usage count
        savedFilter.usageCount = (savedFilter.usageCount || 0) + 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('hekabio_saved_filters', JSON.stringify(state.savedFilters));
        }
      }
    },
    deleteSavedFilter: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter((f) => f.id !== action.payload);
      if (state.currentSavedFilterId === action.payload) {
        state.currentSavedFilterId = null;
      }
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hekabio_saved_filters', JSON.stringify(state.savedFilters));
      }
    },
    setDefaultSavedFilter: (state, action: PayloadAction<string>) => {
      // Clear all defaults first
      state.savedFilters.forEach((f) => {
        f.isDefault = false;
      });
      // Set the specified filter as default
      const filter = state.savedFilters.find((f) => f.id === action.payload);
      if (filter) {
        filter.isDefault = true;
      }
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hekabio_saved_filters', JSON.stringify(state.savedFilters));
      }
    },
    loadSavedFiltersFromStorage: (state) => {
      // Load saved filters from localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('hekabio_saved_filters');
        if (stored) {
          try {
            state.savedFilters = JSON.parse(stored);
            // Auto-load default filter if exists
            const defaultFilter = state.savedFilters.find((f) => f.isDefault);
            if (defaultFilter) {
              state.filters = defaultFilter.filters;
              state.currentSavedFilterId = defaultFilter.id;
            }
          } catch (error) {
            console.error('Failed to parse saved filters from localStorage:', error);
          }
        }
      }
    },

    // Utility
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addProject,
  updateProject,
  deleteProject,
  duplicateProject,
  setSelectedProject,
  moveToStage,
  bulkMoveToStage,
  updateScore,
  updateJapanAssessment,
  updateInternalReview,
  updateMissingData,
  updatePartnerMatching,
  updatePartnerOutreach,
  updateSinglePartnerOutreach,
  updateProjectStatus,
  markThankYouEmailSent,
  updateNDAStatus,
  updateDDProgress,
  updateContractStatus,
  setFilters,
  clearFilters,
  saveSavedFilter,
  loadSavedFilter,
  deleteSavedFilter,
  setDefaultSavedFilter,
  loadSavedFiltersFromStorage,
  setLoading,
  setError,
} = projectsSlice.actions;

export default projectsSlice.reducer;
