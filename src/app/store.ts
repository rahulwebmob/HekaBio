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
import surveysReducer from '../store/slices/surveysSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    addressBook: addressBookReducer,
    projects: projectsReducer,
    surveys: surveysReducer,
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
