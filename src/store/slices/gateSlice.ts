/**
 * Gate Review Redux Slice
 * Manages gate reviews and decisions
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GateReview, GateNumber, GateDecision } from '../../types/gate.types';
import { getGateChecklistTemplate } from '../../types/gate.types';

interface GateState {
  reviews: GateReview[];
}

const initialState: GateState = {
  reviews: [],
};

const gateSlice = createSlice({
  name: 'gate',
  initialState,
  reducers: {
    // Create a new gate review
    createGateReview: (
      state,
      action: PayloadAction<{
        projectId: string;
        gateNumber: GateNumber;
        reviewerName: string;
        reviewerRole: string;
      }>
    ) => {
      const { projectId, gateNumber, reviewerName, reviewerRole } = action.payload;
      const now = new Date().toISOString();
      const checklistTemplate = getGateChecklistTemplate(gateNumber);

      const newReview: GateReview = {
        id: `gate-review-${Date.now()}`,
        projectId,
        gateNumber,
        decision: 'PENDING',
        reviewDate: now,
        reviewedBy: 'user-001',
        reviewerName,
        reviewerRole,
        checklist: checklistTemplate.map((item, index) => ({
          ...item,
          id: `checklist-${gateNumber}-${index}`,
          completed: false,
        })),
        checklistCompletionRate: 0,
        comments: '',
        followUpRequired: false,
        createdAt: now,
        updatedAt: now,
        createdBy: 'user-001',
      };

      state.reviews.push(newReview);
    },

    // Update gate review decision
    updateGateDecision: (
      state,
      action: PayloadAction<{
        reviewId: string;
        decision: GateDecision;
        comments: string;
        strengths?: string[];
        concerns?: string[];
        recommendations?: string[];
        conditions?: string[];
        projectId?: string;
        companyId?: string;
      }>
    ) => {
      const review = state.reviews.find((r) => r.id === action.payload.reviewId);
      if (review) {
        review.decision = action.payload.decision;
        review.comments = action.payload.comments;
        review.strengths = action.payload.strengths;
        review.concerns = action.payload.concerns;
        review.recommendations = action.payload.recommendations;
        review.conditions = action.payload.conditions;
        review.reviewDate = new Date().toISOString();
        review.updatedAt = new Date().toISOString();

        // Auto-create follow-up task based on decision
        // Note: Task creation is handled via middleware in real implementation
        // Here we just mark that a task should be created
        if (action.payload.decision !== 'PENDING' && action.payload.decision !== 'REJECTED') {
          review.followUpRequired = true;
        }
      }
    },

    // Update checklist item
    toggleChecklistItem: (
      state,
      action: PayloadAction<{
        reviewId: string;
        checklistItemId: string;
        completed: boolean;
        notes?: string;
      }>
    ) => {
      const review = state.reviews.find((r) => r.id === action.payload.reviewId);
      if (review) {
        const item = review.checklist.find((i) => i.id === action.payload.checklistItemId);
        if (item) {
          item.completed = action.payload.completed;
          item.notes = action.payload.notes;
          if (action.payload.completed) {
            item.completedBy = 'user-001';
            item.completedAt = new Date().toISOString();
          } else {
            item.completedBy = undefined;
            item.completedAt = undefined;
          }

          // Recalculate completion rate
          const completedCount = review.checklist.filter((i) => i.completed).length;
          review.checklistCompletionRate = Math.round(
            (completedCount / review.checklist.length) * 100
          );
          review.updatedAt = new Date().toISOString();
        }
      }
    },

    // Update scores
    updateGateScores: (
      state,
      action: PayloadAction<{
        reviewId: string;
        technicalScore?: number;
        marketScore?: number;
        teamScore?: number;
        fitScore?: number;
      }>
    ) => {
      const review = state.reviews.find((r) => r.id === action.payload.reviewId);
      if (review) {
        review.technicalScore = action.payload.technicalScore;
        review.marketScore = action.payload.marketScore;
        review.teamScore = action.payload.teamScore;
        review.fitScore = action.payload.fitScore;

        // Calculate overall score
        const scores = [
          action.payload.technicalScore,
          action.payload.marketScore,
          action.payload.teamScore,
          action.payload.fitScore,
        ].filter((s) => s !== undefined) as number[];

        if (scores.length > 0) {
          review.overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        }

        review.updatedAt = new Date().toISOString();
      }
    },

    // Set follow-up
    setFollowUp: (
      state,
      action: PayloadAction<{
        reviewId: string;
        required: boolean;
        nextReviewDate?: string;
        tasks?: string[];
      }>
    ) => {
      const review = state.reviews.find((r) => r.id === action.payload.reviewId);
      if (review) {
        review.followUpRequired = action.payload.required;
        review.nextReviewDate = action.payload.nextReviewDate;
        review.followUpTasks = action.payload.tasks;
        review.updatedAt = new Date().toISOString();
      }
    },

    // Add a complete gate review (for direct submission from review panels)
    addGateReview: (
      state,
      action: PayloadAction<Omit<GateReview, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const now = new Date().toISOString();
      const newReview: GateReview = {
        ...action.payload,
        id: `gate-review-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      state.reviews.push(newReview);
    },

    // Delete gate review
    deleteGateReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  createGateReview,
  updateGateDecision,
  toggleChecklistItem,
  updateGateScores,
  setFollowUp,
  addGateReview,
  deleteGateReview,
} = gateSlice.actions;

export default gateSlice.reducer;
