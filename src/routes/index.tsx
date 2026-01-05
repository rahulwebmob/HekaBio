

/**
 * Route Configuration
 */

import { lazy, type LazyExoticComponent, type ReactElement } from 'react';
import type { UserRole } from '../types/auth.types';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// 404 Page
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export interface RouteConfig {
  path: string;
  element: LazyExoticComponent<() => ReactElement>;
  isPublic?: boolean;
  allowedRoles?: UserRole[];
  title?: string;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  // Public Routes
  {
    path: '/',
    element: LandingPage,
    isPublic: true,
    title: 'Home - HekaBio',
  },
  {
    path: '/login',
    element: LoginPage,
    isPublic: true,
    title: 'Login - HekaBio',
  },

  // Protected Routes
  {
    path: '/dashboard',
    element: DashboardPage,
    isPublic: false,
    title: 'Dashboard - HekaBio',
  },

  // Catch-all 404
  {
    path: '*',
    element: NotFoundPage,
    isPublic: true,
    title: 'Page Not Found - HekaBio',
  },
];

// Route paths as constants for easy reference
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SETTINGS: '/settings',
} as const;
