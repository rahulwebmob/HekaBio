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
import { mockOpportunities } from '../../data/mockOpportunities';

interface OpportunitiesState {
  opportunities: Opportunity[];
  selectedOpportunityId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OpportunitiesState = {
  opportunities: mockOpportunities,
  selectedOpportunityId: null,
  isLoading: false,
  error: null,
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    // Create new opportunity
    createOpportunity: (
      state,
      action: PayloadAction<{
        name: string;
        company: Company;
        description?: string;
        tags: ProjectTag[];
        source: OpportunitySource;
        sourceDetails?: string;
        priority?: OpportunityPriority;
        primaryContactName?: string;
        primaryContactEmail?: string;
      }>
    ) => {
      const now = new Date().toISOString();
      const newOpportunity: Opportunity = {
        id: `opp-${Date.now()}`,
        ...action.payload,
        status: 'NEW',
        priority: action.payload.priority || 'MEDIUM',
        createdAt: now,
        updatedAt: now,
        createdBy: 'user-001',
        createdByName: 'Current User',
      };
      state.opportunities.unshift(newOpportunity);
    },

    // Update opportunity
    updateOpportunity: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        updates: Partial<Omit<Opportunity, 'id' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity) {
        Object.assign(opportunity, action.payload.updates);
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Delete opportunity
    deleteOpportunity: (state, action: PayloadAction<string>) => {
      state.opportunities = state.opportunities.filter((o) => o.id !== action.payload);
      if (state.selectedOpportunityId === action.payload) {
        state.selectedOpportunityId = null;
      }
    },

    // Change status
    changeOpportunityStatus: (
      state,
      action: PayloadAction<{ opportunityId: string; status: OpportunityStatus }>
    ) => {
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity) {
        opportunity.status = action.payload.status;
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Submit quick assessment
    submitQuickAssessment: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        assessment: Omit<
          QuickAssessment,
          'id' | 'opportunityId' | 'assessedBy' | 'assessedByName' | 'assessedAt' | 'createdAt'
        >;
      }>
    ) => {
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity) {
        const now = new Date().toISOString();
        const quickAssessment: QuickAssessment = {
          ...action.payload.assessment,
          id: `assess-${Date.now()}`,
          opportunityId: action.payload.opportunityId,
          assessedBy: 'user-001',
          assessedByName: 'Current User',
          assessedAt: now,
          createdAt: now,
        };

        opportunity.quickAssessment = quickAssessment;
        opportunity.assessmentCompletedAt = now;
        opportunity.status = 'AWAITING_DECISION';
        opportunity.updatedAt = now;
      }
    },

    // Update quick assessment
    updateQuickAssessment: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        updates: Partial<Omit<QuickAssessment, 'id' | 'opportunityId' | 'createdAt'>>;
      }>
    ) => {
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity && opportunity.quickAssessment) {
        Object.assign(opportunity.quickAssessment, action.payload.updates);
        opportunity.quickAssessment.updatedAt = new Date().toISOString();
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Make go/no-go decision
    makeGoNoGoDecision: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        decision: Omit<
          GoNoGoDecision,
          'id' | 'opportunityId' | 'decidedBy' | 'decidedByName' | 'decisionDate' | 'createdAt'
        >;
      }>
    ) => {
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity) {
        const now = new Date().toISOString();
        const decision: GoNoGoDecision = {
          ...action.payload.decision,
          id: `decision-${Date.now()}`,
          opportunityId: action.payload.opportunityId,
          decidedBy: 'user-001',
          decidedByName: 'Current User',
          decisionDate: now,
          createdAt: now,
        };

        opportunity.goNoGoDecision = decision;
        opportunity.decisionMadeAt = now;
        opportunity.updatedAt = now;

        // Update status based on decision
        if (decision.decision === 'GO') {
          opportunity.status = 'APPROVED';
        } else if (decision.decision === 'NO_GO') {
          opportunity.status = 'DECLINED';
        } else if (decision.decision === 'DEFER') {
          opportunity.status = 'ON_HOLD';
        } else if (decision.decision === 'REQUEST_MORE_INFO') {
          opportunity.status = 'REVIEWING';
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
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity) {
        const now = new Date().toISOString();
        opportunity.convertedToProjectId = action.payload.projectId;
        opportunity.convertedAt = now;
        opportunity.status = 'CONVERTED';
        opportunity.updatedAt = now;
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
      const opportunity = state.opportunities.find((o) => o.id === action.payload.opportunityId);
      if (opportunity) {
        opportunity.assignedTo = action.payload.assignedTo;
        opportunity.assignedToName = action.payload.assignedToName;
        opportunity.updatedAt = new Date().toISOString();
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
      const now = new Date().toISOString();
      action.payload.opportunityIds.forEach((id) => {
        const opportunity = state.opportunities.find((o) => o.id === id);
        if (opportunity) {
          opportunity.status = action.payload.status;
          opportunity.updatedAt = now;
        }
      });
    },

    // Archive opportunity
    archiveOpportunity: (state, action: PayloadAction<string>) => {
      const opportunity = state.opportunities.find((o) => o.id === action.payload);
      if (opportunity) {
        opportunity.status = 'ARCHIVED';
        opportunity.updatedAt = new Date().toISOString();
      }
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
  setLoading,
  setError,
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;
