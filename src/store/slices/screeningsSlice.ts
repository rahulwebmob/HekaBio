/**
 * Screenings Redux Slice
 * State management for general pre-project screenings
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScreeningAssessment, ScreeningStatus, ScreeningDecision } from '../../types/screening.types';
import { mockScreenings } from '../../data/mockScreenings';

interface ScreeningsState {
  screenings: ScreeningAssessment[];
  loading: boolean;
  error: string | null;
}

const initialState: ScreeningsState = {
  screenings: mockScreenings,
  loading: false,
  error: null,
};

const screeningsSlice = createSlice({
  name: 'screenings',
  initialState,
  reducers: {
    addScreening: (state, action: PayloadAction<ScreeningAssessment>) => {
      state.screenings.push(action.payload);
    },
    updateScreening: (state, action: PayloadAction<ScreeningAssessment>) => {
      const index = state.screenings.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.screenings[index] = action.payload;
      }
    },
    updateScreeningStatus: (
      state,
      action: PayloadAction<{ id: string; status: ScreeningStatus }>
    ) => {
      const screening = state.screenings.find((s) => s.id === action.payload.id);
      if (screening) {
        screening.status = action.payload.status;
        screening.updatedAt = new Date().toISOString();
      }
    },
    updateScreeningDecision: (
      state,
      action: PayloadAction<{
        id: string;
        decision: ScreeningDecision;
        rationale: string;
      }>
    ) => {
      const screening = state.screenings.find((s) => s.id === action.payload.id);
      if (screening) {
        screening.decision = action.payload.decision;
        screening.decisionRationale = action.payload.rationale;
        screening.status = 'COMPLETED';
        screening.completedAt = new Date().toISOString();
        screening.updatedAt = new Date().toISOString();
      }
    },
    deleteScreening: (state, action: PayloadAction<string>) => {
      state.screenings = state.screenings.filter((s) => s.id !== action.payload);
    },
  },
});

export const {
  addScreening,
  updateScreening,
  updateScreeningStatus,
  updateScreeningDecision,
  deleteScreening,
} = screeningsSlice.actions;

export default screeningsSlice.reducer;
