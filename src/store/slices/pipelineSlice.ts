/**
 * Pipeline Slice
 * Redux state management for business development pipeline
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  PipelineOpportunity,
  PipelineStage,
  OpportunityProbability,
  WinReason,
  LossReason,
} from '../../types/pipeline.types';
import { mockPipelineOpportunities } from '../../data/mockPipeline';

interface PipelineState {
  opportunities: PipelineOpportunity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PipelineState = {
  opportunities: mockPipelineOpportunities,
  isLoading: false,
  error: null,
};

const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState,
  reducers: {
    // Add new opportunity
    addOpportunity: (state, action: PayloadAction<PipelineOpportunity>) => {
      state.opportunities.push(action.payload);
    },

    // Update opportunity
    updateOpportunity: (
      state,
      action: PayloadAction<{ opportunityId: string; updates: Partial<PipelineOpportunity> }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        Object.assign(opportunity, action.payload.updates);
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Delete opportunity
    deleteOpportunity: (state, action: PayloadAction<string>) => {
      state.opportunities = state.opportunities.filter((opp) => opp.id !== action.payload);
    },

    // Move opportunity to new stage
    moveOpportunityToStage: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        newStage: PipelineStage;
        probability?: OpportunityProbability;
      }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        const now = new Date().toISOString();
        const oldStage = opportunity.stage;

        // Update current stage's exit time and duration
        const currentStageHistory = opportunity.stageHistory.find(
          (history) => history.stage === oldStage && !history.exitedAt
        );
        if (currentStageHistory) {
          currentStageHistory.exitedAt = now;
          const enteredDate = new Date(currentStageHistory.enteredAt);
          const exitedDate = new Date(now);
          currentStageHistory.durationDays = Math.floor(
            (exitedDate.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        // Add new stage to history
        opportunity.stageHistory.push({
          stage: action.payload.newStage,
          enteredAt: now,
        });

        // Update stage and probability
        opportunity.stage = action.payload.newStage;
        if (action.payload.probability !== undefined) {
          opportunity.probability = action.payload.probability;
        }

        opportunity.updatedAt = now;
      }
    },

    // Update probability
    updateProbability: (
      state,
      action: PayloadAction<{ opportunityId: string; probability: OpportunityProbability }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        opportunity.probability = action.payload.probability;
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Mark as won
    markAsWon: (
      state,
      action: PayloadAction<{ opportunityId: string; winReason: WinReason; actualValue?: number }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        const now = new Date().toISOString();

        // Update current stage history
        const currentStageHistory = opportunity.stageHistory.find(
          (history) => history.stage === opportunity.stage && !history.exitedAt
        );
        if (currentStageHistory) {
          currentStageHistory.exitedAt = now;
          const enteredDate = new Date(currentStageHistory.enteredAt);
          const exitedDate = new Date(now);
          currentStageHistory.durationDays = Math.floor(
            (exitedDate.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        // Add WON stage to history
        opportunity.stageHistory.push({
          stage: 'WON',
          enteredAt: now,
        });

        // Update opportunity
        opportunity.stage = 'WON';
        opportunity.probability = 100;
        opportunity.outcome = 'WON';
        opportunity.winReason = action.payload.winReason;
        opportunity.actualCloseDate = now;
        if (action.payload.actualValue !== undefined) {
          opportunity.estimatedValue = action.payload.actualValue;
        }
        opportunity.updatedAt = now;
      }
    },

    // Mark as lost
    markAsLost: (
      state,
      action: PayloadAction<{
        opportunityId: string;
        lossReason: LossReason;
        competitorInfo?: string;
      }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        const now = new Date().toISOString();

        // Update current stage history
        const currentStageHistory = opportunity.stageHistory.find(
          (history) => history.stage === opportunity.stage && !history.exitedAt
        );
        if (currentStageHistory) {
          currentStageHistory.exitedAt = now;
          const enteredDate = new Date(currentStageHistory.enteredAt);
          const exitedDate = new Date(now);
          currentStageHistory.durationDays = Math.floor(
            (exitedDate.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        // Add LOST stage to history
        opportunity.stageHistory.push({
          stage: 'LOST',
          enteredAt: now,
        });

        // Update opportunity
        opportunity.stage = 'LOST';
        opportunity.probability = 0;
        opportunity.outcome = 'LOST';
        opportunity.lossReason = action.payload.lossReason;
        if (action.payload.competitorInfo) {
          opportunity.competitorInfo = action.payload.competitorInfo;
        }
        opportunity.actualCloseDate = now;
        opportunity.updatedAt = now;
      }
    },

    // Update follow-up date
    updateFollowUpDate: (
      state,
      action: PayloadAction<{ opportunityId: string; nextFollowUpDate: string }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        opportunity.nextFollowUpDate = action.payload.nextFollowUpDate;
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Record contact
    recordContact: (state, action: PayloadAction<string>) => {
      const opportunity = state.opportunities.find((opp) => opp.id === action.payload);
      if (opportunity) {
        const now = new Date().toISOString();
        opportunity.contactCount += 1;
        opportunity.lastContactDate = now;
        opportunity.updatedAt = now;
      }
    },

    // Update team members
    updateTeamMembers: (
      state,
      action: PayloadAction<{ opportunityId: string; teamMembers: string[] }>
    ) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        opportunity.teamMembers = action.payload.teamMembers;
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Add note
    addNote: (state, action: PayloadAction<{ opportunityId: string; note: string }>) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        opportunity.notes = action.payload.note;
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Update tags
    updateTags: (state, action: PayloadAction<{ opportunityId: string; tags: string[] }>) => {
      const opportunity = state.opportunities.find(
        (opp) => opp.id === action.payload.opportunityId
      );
      if (opportunity) {
        opportunity.tags = action.payload.tags;
        opportunity.updatedAt = new Date().toISOString();
      }
    },

    // Set loading state
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
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  moveOpportunityToStage,
  updateProbability,
  markAsWon,
  markAsLost,
  updateFollowUpDate,
  recordContact,
  updateTeamMembers,
  addNote,
  updateTags,
  setLoading,
  setError,
} = pipelineSlice.actions;

export default pipelineSlice.reducer;
