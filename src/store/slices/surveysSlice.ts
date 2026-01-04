/**
 * Surveys Redux Slice
 * State management for survey templates and instances
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  SurveyTemplate,
  SurveyInstance,
  SubmissionStatus,
  SurveyResponse,
} from '../../types/survey.types';
import { mockSurveyTemplates, mockSurveyInstances } from '../../data/mockSurveys';

interface SurveysState {
  templates: SurveyTemplate[];
  instances: SurveyInstance[];
}

// Load survey instances from localStorage if available
const loadSurveyInstances = (): SurveyInstance[] => {
  try {
    const stored = localStorage.getItem('surveyInstances');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load survey instances from localStorage:', error);
  }
  return mockSurveyInstances;
};

// Save survey instances to localStorage
const saveSurveyInstances = (instances: SurveyInstance[]) => {
  try {
    localStorage.setItem('surveyInstances', JSON.stringify(instances));
  } catch (error) {
    console.error('Failed to save survey instances to localStorage:', error);
  }
};

const initialState: SurveysState = {
  templates: mockSurveyTemplates,
  instances: loadSurveyInstances(),
};

const surveysSlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    // ===== Template Management =====
    addTemplate: (state, action: PayloadAction<SurveyTemplate>) => {
      state.templates.push(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<SurveyTemplate>) => {
      const index = state.templates.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
    toggleTemplateActive: (state, action: PayloadAction<string>) => {
      const template = state.templates.find((t) => t.id === action.payload);
      if (template) {
        template.isActive = !template.isActive;
      }
    },

    // ===== Survey Instance Management =====
    addSurveyInstance: (state, action: PayloadAction<SurveyInstance>) => {
      state.instances.push(action.payload);
      saveSurveyInstances(state.instances);
    },
    updateSurveyInstance: (state, action: PayloadAction<SurveyInstance>) => {
      const index = state.instances.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.instances[index] = action.payload;
        saveSurveyInstances(state.instances);
      }
    },
    deleteSurveyInstance: (state, action: PayloadAction<string>) => {
      state.instances = state.instances.filter((i) => i.id !== action.payload);
      saveSurveyInstances(state.instances);
    },

    // ===== Status Updates =====
    updateInstanceStatus: (
      state,
      action: PayloadAction<{ instanceId: string; status: SubmissionStatus }>
    ) => {
      const instance = state.instances.find((i) => i.id === action.payload.instanceId);
      if (instance) {
        instance.status = action.payload.status;
        instance.updatedAt = new Date().toISOString();

        // Update timestamps based on status
        const now = new Date().toISOString();
        if (action.payload.status === 'IN_PROGRESS' && !instance.startedAt) {
          instance.startedAt = now;
        } else if (action.payload.status === 'SUBMITTED' && !instance.submittedAt) {
          instance.submittedAt = now;
        } else if (action.payload.status === 'REVIEWED' && !instance.reviewedAt) {
          instance.reviewedAt = now;
        }
        saveSurveyInstances(state.instances);
      }
    },

    updateCompletionPercentage: (
      state,
      action: PayloadAction<{ instanceId: string; percentage: number }>
    ) => {
      const instance = state.instances.find((i) => i.id === action.payload.instanceId);
      if (instance) {
        instance.completionPercentage = action.payload.percentage;
        instance.updatedAt = new Date().toISOString();

        // Auto-update status based on completion
        if (action.payload.percentage > 0 && instance.status === 'NOT_STARTED') {
          instance.status = 'IN_PROGRESS';
          instance.startedAt = new Date().toISOString();
        } else if (action.payload.percentage === 100 && instance.status === 'IN_PROGRESS') {
          instance.status = 'SUBMITTED';
          instance.submittedAt = new Date().toISOString();
        }
        saveSurveyInstances(state.instances);
      }
    },

    // ===== Review Management =====
    reviewSurvey: (
      state,
      action: PayloadAction<{
        instanceId: string;
        reviewedBy: string;
        reviewNotes?: string;
        flaggedQuestions?: string[];
      }>
    ) => {
      const instance = state.instances.find((i) => i.id === action.payload.instanceId);
      if (instance) {
        instance.status = 'REVIEWED';
        instance.reviewedBy = action.payload.reviewedBy;
        instance.reviewedAt = new Date().toISOString();
        instance.reviewNotes = action.payload.reviewNotes;
        instance.flaggedQuestions = action.payload.flaggedQuestions;
        instance.updatedAt = new Date().toISOString();
        saveSurveyInstances(state.instances);
      }
    },

    // ===== Due Date Management =====
    updateDueDate: (state, action: PayloadAction<{ instanceId: string; dueDate: string }>) => {
      const instance = state.instances.find((i) => i.id === action.payload.instanceId);
      if (instance) {
        instance.dueDate = action.payload.dueDate;
        instance.updatedAt = new Date().toISOString();
        saveSurveyInstances(state.instances);
      }
    },

    // ===== Assignment =====
    reassignSurvey: (state, action: PayloadAction<{ instanceId: string; assignedTo: string }>) => {
      const instance = state.instances.find((i) => i.id === action.payload.instanceId);
      if (instance) {
        instance.assignedTo = action.payload.assignedTo;
        instance.updatedAt = new Date().toISOString();
        saveSurveyInstances(state.instances);
      }
    },

    // ===== Response Management =====
    updateSurveyResponse: (
      state,
      action: PayloadAction<{
        surveyId: string;
        responses: SurveyResponse[];
        status?: SubmissionStatus;
        completionPercentage?: number;
      }>
    ) => {
      const instance = state.instances.find((i) => i.id === action.payload.surveyId);
      if (instance) {
        instance.responses = action.payload.responses;
        instance.updatedAt = new Date().toISOString();

        if (action.payload.completionPercentage !== undefined) {
          instance.completionPercentage = action.payload.completionPercentage;
        }

        if (action.payload.status) {
          instance.status = action.payload.status;

          const now = new Date().toISOString();
          if (action.payload.status === 'IN_PROGRESS' && !instance.startedAt) {
            instance.startedAt = now;
          } else if (action.payload.status === 'SUBMITTED' && !instance.submittedAt) {
            instance.submittedAt = now;
          } else if (action.payload.status === 'REVIEWED' && !instance.reviewedAt) {
            instance.reviewedAt = now;
          }
        }
        saveSurveyInstances(state.instances);
      }
    },
  },
});

export const {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateActive,
  addSurveyInstance,
  updateSurveyInstance,
  deleteSurveyInstance,
  updateInstanceStatus,
  updateCompletionPercentage,
  reviewSurvey,
  updateDueDate,
  reassignSurvey,
  updateSurveyResponse,
} = surveysSlice.actions;

export default surveysSlice.reducer;
