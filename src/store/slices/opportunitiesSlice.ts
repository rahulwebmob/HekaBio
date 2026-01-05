/**
 * Opportunities Redux Slice
 * State management for opportunity assessment workflow
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Opportunity,
  QuickAssessment,
  GoNoGoDecision,
  OpportunityStatus,
  OpportunityPriority,
  OpportunitySource,
} from '../../types/opportunity.types';
import type { Company } from '../../types/addressBook.types';
import type { ProjectTag } from '../../types/project.types';
import { opportunityService } from '../../services/opportunity.service';

interface OpportunitiesState {
  opportunities: Opportunity[];
  selectedOpportunityId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OpportunitiesState = {
  opportunities: opportunityService.getAll(),
  selectedOpportunityId: null,
  isLoading: false,
  error: null,
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    // Load opportunities
    loadOpportunities: (state) => {
      state.opportunities = opportunityService.getAll();
    },

    // Create new opportunity
    createOpportunity: (
      state,
      action: PayloadAction<Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newOpportunity = opportunityService.create({
        ...action.payload,
        status: 'NEW',
        priority: action.payload.priority || 'MEDIUM',
      });
      state.opportunities.unshift(newOpportunity);
    },

    // Update opportunity
    updateOpportunity: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        updates: Partial<Opportunity>;
      }>
    ) => {
      const updated = opportunityService.update(action.payload.opportunityId, action.payload.updates);
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Delete opportunity
    deleteOpportunity: (state, action: PayloadAction<string>) => {
      const success = opportunityService.delete(action.payload);
      if (success) {
        state.opportunities = state.opportunities.filter((o) => o.id !== action.payload);
        if (state.selectedOpportunityId === action.payload) {
          state.selectedOpportunityId = null;
        }
      }
    },

    // Change status
    changeOpportunityStatus: (
      state,
      action: PayloadAction<{ opportunityId: string; status: OpportunityStatus }>
    ) => {
      const updated = opportunityService.updateStatus(
        action.payload.opportunityId,
        action.payload.status
      );
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Submit quick assessment
    submitQuickAssessment: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        assessment: QuickAssessment;
        assessedBy: string;
        assessedByName: string;
      }>
    ) => {
      const updated = opportunityService.submitAssessment(
        action.payload.opportunityId,
        action.payload.assessment,
        action.payload.assessedBy,
        action.payload.assessedByName
      );
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Update quick assessment
    updateQuickAssessment: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        updates: Partial<QuickAssessment>;
      }>
    ) => {
      const updated = opportunityService.updateAssessment(
        action.payload.opportunityId,
        action.payload.updates
      );
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Make go/no-go decision
    makeGoNoGoDecision: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        decision: GoNoGoDecision;
        decidedBy: string;
        decidedByName: string;
      }>
    ) => {
      const updated = opportunityService.makeDecision(
        action.payload.opportunityId,
        action.payload.decision,
        action.payload.decidedBy,
        action.payload.decidedByName
      );
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Convert to project
    convertToProject: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        projectId: string;
      }>
    ) => {
      const updated = opportunityService.convertToProject(
        action.payload.opportunityId,
        action.payload.projectId
      );
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Assign opportunity
    assignOpportunity: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        assignedTo: string;
        assignedToName: string;
      }>
    ) => {
      const updated = opportunityService.assignTo(
        action.payload.opportunityId,
        action.payload.assignedTo,
        action.payload.assignedToName
      );
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload.opportunityId);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Set selected opportunity
    setSelectedOpportunity: (state, action: PayloadAction<string | null>) => {
      state.selectedOpportunityId = action.payload;
    },

    // Bulk status update
    bulkUpdateStatus: (
      state,
      action: PayloadAction<{
        opportunityIds: string[];
        status: OpportunityStatus;
      }>
    ) => {
      const count = opportunityService.bulkUpdateStatus(
        action.payload.opportunityIds,
        action.payload.status
      );
      if (count > 0) {
        // Reload all opportunities to reflect changes
        state.opportunities = opportunityService.getAll();
      }
    },

    // Archive opportunity
    archiveOpportunity: (state, action: PayloadAction<string>) => {
      const updated = opportunityService.archive(action.payload);
      if (updated) {
        const index = state.opportunities.findIndex((o) => o.id === action.payload);
        if (index !== -1) {
          state.opportunities[index] = updated;
        }
      }
    },

    // Clear all opportunities
    clearAllOpportunities: (state) => {
      opportunityService.clear();
      state.opportunities = [];
    },

    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  loadOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  changeOpportunityStatus,
  submitQuickAssessment,
  updateQuickAssessment,
  makeGoNoGoDecision,
  convertToProject,
  assignOpportunity,
  setSelectedOpportunity,
  bulkUpdateStatus,
  archiveOpportunity,
  clearAllOpportunities,
  setLoading,
  setError,
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;
