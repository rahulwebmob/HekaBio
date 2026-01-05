/**
 * Screenings Redux Slice
 * State management for general pre-project screenings
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScreeningAssessment, ScreeningStatus, ScreeningDecision } from '../../types/screening.types';
import { screeningService } from '../../services/screening.service';

interface ScreeningsState {
  screenings: ScreeningAssessment[];
  loading: boolean;
  error: string | null;
}

const initialState: ScreeningsState = {
  screenings: screeningService.getAll(),
  loading: false,
  error: null,
};

const screeningsSlice = createSlice({
  name: 'screenings',
  initialState,
  reducers: {
    // Load screenings
    loadScreenings: (state) => {
      state.screenings = screeningService.getAll();
    },

    // Add screening
    addScreening: (state, action: PayloadAction<Omit<ScreeningAssessment, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newScreening = screeningService.create(action.payload);
      state.screenings.push(newScreening);
    },

    // Update screening
    updateScreening: (state, action: PayloadAction<{ id: string; updates: Partial<ScreeningAssessment> }>) => {
      const updated = screeningService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.screenings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.screenings[index] = updated;
        }
      }
    },

    // Update status
    updateScreeningStatus: (
      state,
      action: PayloadAction<{ id: string; status: ScreeningStatus }>
    ) => {
      const updated = screeningService.updateStatus(action.payload.id, action.payload.status);
      if (updated) {
        const index = state.screenings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.screenings[index] = updated;
        }
      }
    },

    // Make decision
    updateScreeningDecision: (
      state,
      action: PayloadAction<{
        id: string;
        decision: ScreeningDecision;
        rationale: string;
        completedBy: string;
      }>
    ) => {
      const updated = screeningService.makeDecision(
        action.payload.id,
        action.payload.decision,
        action.payload.rationale,
        action.payload.completedBy
      );
      if (updated) {
        const index = state.screenings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.screenings[index] = updated;
        }
      }
    },

    // Review screening
    reviewScreening: (
      state,
      action: PayloadAction<{ id: string; reviewedBy: string }>
    ) => {
      const updated = screeningService.reviewScreening(
        action.payload.id,
        action.payload.reviewedBy
      );
      if (updated) {
        const index = state.screenings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.screenings[index] = updated;
        }
      }
    },

    // Assign screening
    assignScreening: (
      state,
      action: PayloadAction<{ id: string; assignedTo: string }>
    ) => {
      const updated = screeningService.assignTo(action.payload.id, action.payload.assignedTo);
      if (updated) {
        const index = state.screenings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.screenings[index] = updated;
        }
      }
    },

    // Delete screening
    deleteScreening: (state, action: PayloadAction<string>) => {
      const success = screeningService.delete(action.payload);
      if (success) {
        state.screenings = state.screenings.filter((s) => s.id !== action.payload);
      }
    },

    // Clear all screenings
    clearAllScreenings: (state) => {
      screeningService.clear();
      state.screenings = [];
    },
  },
});

export const {
  loadScreenings,
  addScreening,
  updateScreening,
  updateScreeningStatus,
  updateScreeningDecision,
  reviewScreening,
  assignScreening,
  deleteScreening,
  clearAllScreenings,
} = screeningsSlice.actions;

export default screeningsSlice.reducer;
