/**
 * useAuth Hook
 * Provides authentication state and methods
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { login, logout, loginAsRole } from '../features/auth/authSlice';
import type { LoginCredentials, UserRole } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(login(credentials));
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    return dispatch(logout());
  },  [dispatch]
  );

  const switchRole = useCallback(
    (role: UserRole) => {
      dispatch(loginAsRole(role));
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    switchRole, // For demo purposes - quick role switching
  };
};
