/**
 * Projects Slice
 * Redux state management for projects and pipeline
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Project,
  ProjectFilters,
  Stage,
  ScoreBreakdown,
  JapanMarketFit,
  NDAStatus,
  ContractStatus,
} from '../../types/project.types';
import { mockProjects } from '../../data/mockProjects';

interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
  filters: ProjectFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: mockProjects,
  selectedProjectId: null,
  filters: {},
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
          currentStage: 'LOBBY', // Reset to initial stage
          score: 0, // Reset score
          scoreBreakdown: undefined,
          lastScoredAt: undefined,
          isHot: false,
          ddProgress: 0,
          ddCompletedAt: undefined,
          stageHistory: [
            {
              id: `stage-${Date.now()}`,
              projectId: `project-${Date.now()}`,
              fromStage: null,
              toStage: 'LOBBY',
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
      action: PayloadAction<{ projectId: string; score: number; breakdown?: ScoreBreakdown }>
    ) => {
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.score = action.payload.score;
        project.scoreBreakdown = action.payload.breakdown;
        project.lastScoredAt = new Date().toISOString();
        project.updatedAt = new Date().toISOString();
        // Update hot flag
        project.isHot = project.score > 80 && project.japanInterest;
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
      const project = state.projects.find((p) => p.id === action.payload.projectId);
      if (project) {
        project.japanMarketFit = action.payload.japanMarketFit;
        project.japanSummary = action.payload.japanSummary;
        project.japanScreeningCompletedAt = new Date().toISOString();
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
    },
    clearFilters: (state) => {
      state.filters = {};
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
  updateNDAStatus,
  updateDDProgress,
  updateContractStatus,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = projectsSlice.actions;

export default projectsSlice.reducer;
