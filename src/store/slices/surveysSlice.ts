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
import { surveyTemplateService } from '../../services/surveyTemplate.service';
import { surveyInstanceService } from '../../services/surveyInstance.service';

interface SurveysState {
  templates: SurveyTemplate[];
  instances: SurveyInstance[];
}

const initialState: SurveysState = {
  templates: surveyTemplateService.getAll(),
  instances: surveyInstanceService.getAll(),
};

const surveysSlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    // ===== Load Data =====
    loadTemplates: (state) => {
      state.templates = surveyTemplateService.getAll();
    },
    loadInstances: (state) => {
      state.instances = surveyInstanceService.getAll();
    },

    // ===== Template Management =====
    addTemplate: (state, action: PayloadAction<Omit<SurveyTemplate, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTemplate = surveyTemplateService.create(action.payload);
      state.templates.push(newTemplate);
    },
    updateTemplate: (state, action: PayloadAction<{ id: string; updates: Partial<SurveyTemplate> }>) => {
      const updated = surveyTemplateService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      const success = surveyTemplateService.delete(action.payload);
      if (success) {
        state.templates = state.templates.filter((t) => t.id !== action.payload);
      }
    },
    toggleTemplateActive: (state, action: PayloadAction<string>) => {
      const updated = surveyTemplateService.toggleActive(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    // ===== Survey Instance Management =====
    addSurveyInstance: (state, action: PayloadAction<Omit<SurveyInstance, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newInstance = surveyInstanceService.create(action.payload);
      state.instances.push(newInstance);
    },
    updateSurveyInstance: (state, action: PayloadAction<{ id: string; updates: Partial<SurveyInstance> }>) => {
      const updated = surveyInstanceService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.instances[index] = updated;
        }
      }
    },
    deleteSurveyInstance: (state, action: PayloadAction<string>) => {
      const success = surveyInstanceService.delete(action.payload);
      if (success) {
        state.instances = state.instances.filter((i) => i.id !== action.payload);
      }
    },

    // ===== Status Updates =====
    updateInstanceStatus: (
      state,
      action: PayloadAction<{ instanceId: string; status: SubmissionStatus }>
    ) => {
      const updated = surveyInstanceService.updateStatus(
        action.payload.instanceId,
        action.payload.status
      );
      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.instanceId);
        if (index !== -1) {
          state.instances[index] = updated;
        }
      }
    },

    updateCompletionPercentage: (
      state,
      action: PayloadAction<{ instanceId: string; percentage: number }>
    ) => {
      const updated = surveyInstanceService.updateCompletionPercentage(
        action.payload.instanceId,
        action.payload.percentage
      );
      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.instanceId);
        if (index !== -1) {
          state.instances[index] = updated;
        }
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
      const updated = surveyInstanceService.reviewSurvey(
        action.payload.instanceId,
        action.payload.reviewedBy,
        action.payload.reviewNotes,
        action.payload.flaggedQuestions
      );
      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.instanceId);
        if (index !== -1) {
          state.instances[index] = updated;
        }
      }
    },

    // ===== Due Date Management =====
    updateDueDate: (state, action: PayloadAction<{ instanceId: string; dueDate: string }>) => {
      const updated = surveyInstanceService.updateDueDate(
        action.payload.instanceId,
        action.payload.dueDate
      );
      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.instanceId);
        if (index !== -1) {
          state.instances[index] = updated;
        }
      }
    },

    // ===== Assignment =====
    reassignSurvey: (state, action: PayloadAction<{ instanceId: string; assignedTo: string }>) => {
      const updated = surveyInstanceService.reassignSurvey(
        action.payload.instanceId,
        action.payload.assignedTo
      );
      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.instanceId);
        if (index !== -1) {
          state.instances[index] = updated;
        }
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
      const updated = surveyInstanceService.updateResponses(
        action.payload.surveyId,
        action.payload.responses,
        action.payload.completionPercentage
      );

      if (updated) {
        const index = state.instances.findIndex((i) => i.id === action.payload.surveyId);
        if (index !== -1) {
          state.instances[index] = updated;
        }

        // Handle additional status update if provided
        if (action.payload.status && action.payload.status !== updated.status) {
          const statusUpdated = surveyInstanceService.updateStatus(
            action.payload.surveyId,
            action.payload.status
          );
          if (statusUpdated) {
            state.instances[index] = statusUpdated;
          }
        }
      }
    },

    // ===== Clear All Data =====
    clearAllSurveys: (state) => {
      surveyTemplateService.clear();
      surveyInstanceService.clear();
      state.templates = [];
      state.instances = [];
    },
  },
});

export const {
  loadTemplates,
  loadInstances,
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
  clearAllSurveys,
} = surveysSlice.actions;

export default surveysSlice.reducer;
