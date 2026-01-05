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
} from '../../types/project.types';
import { projectService } from '../../services/project.service';
import { savedFilterService } from '../../services/savedFilter.service';

interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
  filters: ProjectFilters;
  savedFilters: SavedFilter[];
  currentSavedFilterId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: projectService.getAll(),
  selectedProjectId: null,
  filters: {},
  savedFilters: savedFilterService.getAll(),
  currentSavedFilterId: null,
  isLoading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Project CRUD
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newProject = projectService.create(action.payload);
      state.projects.push(newProject);
    },

    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const updated = projectService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      }
    },

    deleteProject: (state, action: PayloadAction<string>) => {
      const success = projectService.delete(action.payload);
      if (success) {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      }
    },

    duplicateProject: (state, action: PayloadAction<string>) => {
      const originalProject = projectService.getById(action.payload);
      if (originalProject) {
        const now = new Date().toISOString();
        const duplicatedProjectData = {
          ...originalProject,
          name: `${originalProject.name} (Copy)`,
          currentStage: 'LOBBY' as Stage,
          score: 0,
          scoreBreakdown: undefined,
          lastScoredAt: undefined,
          isHot: false,
          ddProgress: 0,
          ddCompletedAt: undefined,
          stageHistory: [
            {
              id: `stage-${Date.now()}`,
              projectId: `project-${Date.now()}`, // Will be replaced by service
              fromStage: null,
              toStage: 'LOBBY' as Stage,
              changedBy: 'user-001',
              changedByName: 'Current User',
              changedAt: now,
              reason: 'Project duplicated',
            },
          ],
          createdBy: 'user-001',
        };

        // Remove fields that will be auto-generated
        const { id, createdAt, updatedAt, ...dataToCreate } = duplicatedProjectData;
        const duplicatedProject = projectService.create(dataToCreate);
        state.projects.unshift(duplicatedProject);
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
      const updated = projectService.moveToStage(
        action.payload.projectId,
        action.payload.stage,
        'user-001',
        'Current User',
        action.payload.reason,
        action.payload.notes
      );
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      }
    },

    bulkMoveToStage: (
      state,
      action: PayloadAction<{ projectIds: string[]; stage: Stage; reason: string; notes?: string }>
    ) => {
      action.payload.projectIds.forEach((projectId) => {
        const updated = projectService.moveToStage(
          projectId,
          action.payload.stage,
          'user-001',
          'Current User',
          action.payload.reason,
          action.payload.notes
        );
        if (updated) {
          const index = state.projects.findIndex((p) => p.id === projectId);
          if (index !== -1) {
            state.projects[index] = updated;
          }
        }
      });
    },

    // Score Management
    updateScore: (
      state,
      action: PayloadAction<{ projectId: string; score: number; breakdown?: ScoreBreakdown }>
    ) => {
      const updated = projectService.updateScore(
        action.payload.projectId,
        action.payload.score,
        action.payload.breakdown
      );
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      }
    },

    // Japan Assessment
    updateJapanAssessment: (
      state,
      action: PayloadAction<{
        projectId: string;
        japanMarketFit: JapanMarketFit;
        japanSummary?: string;
      }>
    ) => {
      const updated = projectService.updateJapanAssessment(
        action.payload.projectId,
        action.payload.japanMarketFit,
        action.payload.japanSummary
      );
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = updated;
        }
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
      const updated = projectService.updateNDAStatus(
        action.payload.projectId,
        action.payload.status,
        action.payload.completedAt
      );
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      }
    },

    // Due Diligence
    updateDDProgress: (state, action: PayloadAction<{ projectId: string; progress: number }>) => {
      const updated = projectService.updateDDProgress(action.payload.projectId, action.payload.progress);
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      }
    },

    // Contract Decision
    updateContractStatus: (
      state,
      action: PayloadAction<{ projectId: string; status: ContractStatus }>
    ) => {
      const updated = projectService.updateContractStatus(action.payload.projectId, action.payload.status);
      if (updated) {
        const index = state.projects.findIndex((p) => p.id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      }
    },

    // Filters
    setFilters: (state, action: PayloadAction<ProjectFilters>) => {
      state.filters = action.payload;
      state.currentSavedFilterId = null;
    },

    clearFilters: (state) => {
      state.filters = {};
      state.currentSavedFilterId = null;
    },

    // Saved Filters
    saveSavedFilter: (
      state,
      action: PayloadAction<Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newFilter = savedFilterService.create(action.payload);
      state.savedFilters.push(newFilter);
    },

    updateSavedFilter: (state, action: PayloadAction<{ id: string; updates: Partial<SavedFilter> }>) => {
      const updated = savedFilterService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.savedFilters.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.savedFilters[index] = updated;
        }
      }
    },

    loadSavedFilter: (state, action: PayloadAction<string>) => {
      const savedFilter = savedFilterService.getById(action.payload);
      if (savedFilter) {
        state.filters = savedFilter.filters;
        state.currentSavedFilterId = savedFilter.id;
        // Increment usage count
        savedFilterService.incrementUsage(savedFilter.id);
        state.savedFilters = savedFilterService.getAll();
      }
    },

    deleteSavedFilter: (state, action: PayloadAction<string>) => {
      const success = savedFilterService.delete(action.payload);
      if (success) {
        state.savedFilters = state.savedFilters.filter((f) => f.id !== action.payload);
        if (state.currentSavedFilterId === action.payload) {
          state.currentSavedFilterId = null;
        }
      }
    },

    setDefaultSavedFilter: (state, action: PayloadAction<string>) => {
      savedFilterService.setAsDefault(action.payload);
      state.savedFilters = savedFilterService.getAll();
    },

    loadSavedFiltersFromStorage: (state) => {
      state.savedFilters = savedFilterService.getAll();
      // Auto-load default filter if exists
      const defaultFilter = savedFilterService.getDefaultFilter();
      if (defaultFilter) {
        state.filters = defaultFilter.filters;
        state.currentSavedFilterId = defaultFilter.id;
      }
    },

    // Load projects from storage
    loadProjects: (state) => {
      state.projects = projectService.getAll();
    },

    // Update stalled status for all projects
    updateStalledStatus: (state) => {
      projectService.updateStalledStatus();
      state.projects = projectService.getAll();
    },

    // Utility
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all data (for testing/reset)
    clearAll: (state) => {
      projectService.clear();
      savedFilterService.clear();
      state.projects = [];
      state.savedFilters = [];
      state.selectedProjectId = null;
      state.filters = {};
      state.currentSavedFilterId = null;
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
  updateNDAStatus,
  updateDDProgress,
  updateContractStatus,
  setFilters,
  clearFilters,
  saveSavedFilter,
  updateSavedFilter,
  loadSavedFilter,
  deleteSavedFilter,
  setDefaultSavedFilter,
  loadSavedFiltersFromStorage,
  loadProjects,
  updateStalledStatus,
  setLoading,
  setError,
  clearAll,
} = projectsSlice.actions;

export default projectsSlice.reducer;
