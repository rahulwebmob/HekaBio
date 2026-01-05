/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// Import reducers (will be added as we build features)
import authReducer from '../features/auth/authSlice';
import addressBookReducer from '../store/slices/addressBookSlice';
import projectsReducer from '../store/slices/projectsSlice';
// import opportunitiesReducer from '../store/slices/opportunitiesSlice'; // REMOVED: Out of scope
import surveysReducer from '../store/slices/surveysSlice';
// import communicationsReducer from '../store/slices/communicationsSlice'; // REMOVED: Out of scope (Utils)
// import tasksReducer from '../store/slices/tasksSlice'; // REMOVED: Out of scope (Utils)
// import notificationsReducer from '../store/slices/notificationsSlice'; // REMOVED: Out of scope (Utils)
// import pipelineReducer from '../store/slices/pipelineSlice'; // REMOVED: Out of scope
// import calendarReducer from '../store/slices/calendarSlice'; // REMOVED: Out of scope (Utils)
import documentsReducer from '../store/slices/documentsSlice';
// import gateReducer from '../store/slices/gateSlice'; // REMOVED: Replaced with internal review
import ndaReducer from '../store/slices/ndaSlice';
import ddReducer from '../store/slices/ddSlice';
import contractReducer from '../store/slices/contractSlice';
import extractionReducer from '../store/slices/extractionSlice';
import userPreferencesReducer from '../store/slices/userPreferencesSlice';
import emailTemplatesReducer from '../store/slices/emailTemplatesSlice';
import screeningsReducer from '../store/slices/screeningsSlice';
import automationReducer from '../store/slices/automationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    addressBook: addressBookReducer,
    projects: projectsReducer,
    // opportunities: opportunitiesReducer, // REMOVED: Out of scope
    surveys: surveysReducer,
    // communications: communicationsReducer, // REMOVED: Out of scope (Utils)
    // tasks: tasksReducer, // REMOVED: Out of scope (Utils)
    // notifications: notificationsReducer, // REMOVED: Out of scope (Utils)
    // pipeline: pipelineReducer, // REMOVED: Out of scope
    // calendar: calendarReducer, // REMOVED: Out of scope (Utils)
    documents: documentsReducer,
    // gate: gateReducer, // REMOVED: Replaced with internal review in projects
    nda: ndaReducer,
    dd: ddReducer,
    contract: contractReducer,
    extraction: extractionReducer,
    userPreferences: userPreferencesReducer,
    emailTemplates: emailTemplatesReducer,
    screenings: screeningsReducer,
    automation: automationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export pre-typed hooks for use throughout the app
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
