/**
 * User Preferences Redux Slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  UserPreferences,
  NotificationPreferences,
  DisplayPreferences,
  DashboardConfiguration,
  DashboardWidget,
} from '../../types/userPreferences.types';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_DISPLAY_PREFERENCES,
  DEFAULT_DASHBOARD_CONFIGURATION,
} from '../../types/userPreferences.types';

interface UserPreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserPreferencesState = {
  preferences: null,
  isLoading: false,
  error: null,
};

// Helper to save to localStorage
const saveToLocalStorage = (preferences: UserPreferences) => {
  try {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences to localStorage:', error);
  }
};

// Helper to load from localStorage
const loadFromLocalStorage = (): UserPreferences | null => {
  try {
    const stored = localStorage.getItem('userPreferences');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load preferences from localStorage:', error);
    return null;
  }
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    // Initialize preferences
    initializePreferences: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const stored = loadFromLocalStorage();

      if (stored && stored.userId === userId) {
        state.preferences = stored;
      } else {
        // Create default preferences
        const now = new Date().toISOString();
        const defaultPreferences: UserPreferences = {
          id: `pref-${Date.now()}`,
          userId,
          notifications: DEFAULT_NOTIFICATION_PREFERENCES,
          display: DEFAULT_DISPLAY_PREFERENCES,
          dashboard: DEFAULT_DASHBOARD_CONFIGURATION,
          createdAt: now,
          updatedAt: now,
        };
        state.preferences = defaultPreferences;
        saveToLocalStorage(defaultPreferences);
      }
    },

    // Update notification preferences
    updateNotificationPreferences: (
      state,
      action: PayloadAction<Partial<NotificationPreferences>>
    ) => {
      if (state.preferences) {
        state.preferences.notifications = {
          ...state.preferences.notifications,
          ...action.payload,
        };
        state.preferences.updatedAt = new Date().toISOString();
        saveToLocalStorage(state.preferences);
      }
    },

    // Update display preferences
    updateDisplayPreferences: (
      state,
      action: PayloadAction<Partial<DisplayPreferences>>
    ) => {
      if (state.preferences) {
        state.preferences.display = {
          ...state.preferences.display,
          ...action.payload,
        };
        state.preferences.updatedAt = new Date().toISOString();
        saveToLocalStorage(state.preferences);
      }
    },

    // Update dashboard configuration
    updateDashboardConfiguration: (
      state,
      action: PayloadAction<Partial<DashboardConfiguration>>
    ) => {
      if (state.preferences) {
        state.preferences.dashboard = {
          ...state.preferences.dashboard,
          ...action.payload,
        };
        state.preferences.updatedAt = new Date().toISOString();
        saveToLocalStorage(state.preferences);
      }
    },

    // Toggle widget visibility
    toggleWidgetVisibility: (state, action: PayloadAction<string>) => {
      if (state.preferences) {
        const widgetId = action.payload;
        const widget = state.preferences.dashboard.widgets.find((w) => w.id === widgetId);
        if (widget) {
          widget.isVisible = !widget.isVisible;
          state.preferences.updatedAt = new Date().toISOString();
          saveToLocalStorage(state.preferences);
        }
      }
    },

    // Reorder widgets
    reorderWidgets: (state, action: PayloadAction<DashboardWidget[]>) => {
      if (state.preferences) {
        state.preferences.dashboard.widgets = action.payload;
        state.preferences.updatedAt = new Date().toISOString();
        saveToLocalStorage(state.preferences);
      }
    },

    // Reset to defaults
    resetToDefaults: (state) => {
      if (state.preferences) {
        const now = new Date().toISOString();
        state.preferences = {
          ...state.preferences,
          notifications: DEFAULT_NOTIFICATION_PREFERENCES,
          display: DEFAULT_DISPLAY_PREFERENCES,
          dashboard: DEFAULT_DASHBOARD_CONFIGURATION,
          updatedAt: now,
        };
        saveToLocalStorage(state.preferences);
      }
    },

    // Clear preferences
    clearPreferences: (state) => {
      state.preferences = null;
      localStorage.removeItem('userPreferences');
    },
  },
});

export const {
  initializePreferences,
  updateNotificationPreferences,
  updateDisplayPreferences,
  updateDashboardConfiguration,
  toggleWidgetVisibility,
  reorderWidgets,
  resetToDefaults,
  clearPreferences,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
