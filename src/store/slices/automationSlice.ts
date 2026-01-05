/**
 * Automation Redux Slice
 * State management for automation rules and execution logs
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AutomationRule,
  AutomationExecutionLog,
  AutomationStatus,
} from '../../types/automation.types';

interface AutomationState {
  rules: AutomationRule[];
  executionLogs: AutomationExecutionLog[];
  loading: boolean;
  error: string | null;
}

const initialState: AutomationState = {
  rules: [],
  executionLogs: [],
  loading: false,
  error: null,
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    // Rules management
    setRules: (state, action: PayloadAction<AutomationRule[]>) => {
      state.rules = action.payload;
    },

    addRule: (state, action: PayloadAction<AutomationRule>) => {
      state.rules.push(action.payload);
    },

    updateRule: (state, action: PayloadAction<AutomationRule>) => {
      const index = state.rules.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
    },

    deleteRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter((r) => r.id !== action.payload);
    },

    toggleRuleStatus: (state, action: PayloadAction<string>) => {
      const rule = state.rules.find((r) => r.id === action.payload);
      if (rule) {
        rule.isActive = !rule.isActive;
        rule.status = rule.isActive ? 'ACTIVE' : 'INACTIVE';
        rule.updatedAt = new Date().toISOString();
      }
    },

    updateRuleStatus: (
      state,
      action: PayloadAction<{ id: string; status: AutomationStatus }>
    ) => {
      const rule = state.rules.find((r) => r.id === action.payload.id);
      if (rule) {
        rule.status = action.payload.status;
        rule.isActive = action.payload.status === 'ACTIVE';
        rule.updatedAt = new Date().toISOString();
      }
    },

    incrementRuleExecution: (
      state,
      action: PayloadAction<{ id: string; success: boolean }>
    ) => {
      const rule = state.rules.find((r) => r.id === action.payload.id);
      if (rule) {
        rule.executionCount++;
        if (action.payload.success) {
          rule.successCount++;
        } else {
          rule.failureCount++;
        }
        rule.lastExecutedAt = new Date().toISOString();
      }
    },

    // Execution logs
    addExecutionLog: (state, action: PayloadAction<AutomationExecutionLog>) => {
      state.executionLogs.unshift(action.payload); // Add to beginning
      // Keep only last 100 logs
      if (state.executionLogs.length > 100) {
        state.executionLogs = state.executionLogs.slice(0, 100);
      }
    },

    addExecutionLogs: (state, action: PayloadAction<AutomationExecutionLog[]>) => {
      state.executionLogs.unshift(...action.payload);
      // Keep only last 100 logs
      if (state.executionLogs.length > 100) {
        state.executionLogs = state.executionLogs.slice(0, 100);
      }
    },

    clearExecutionLogs: (state) => {
      state.executionLogs = [];
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  toggleRuleStatus,
  updateRuleStatus,
  incrementRuleExecution,
  addExecutionLog,
  addExecutionLogs,
  clearExecutionLogs,
  setLoading,
  setError,
} = automationSlice.actions;

export default automationSlice.reducer;
