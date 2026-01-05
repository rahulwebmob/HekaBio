

import { lazy, type LazyExoticComponent, type ReactElement } from 'react';
import type { UserRole } from '../types/auth.types';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
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
  {
    path: '/',
    element: LandingPage,
    isPublic: true,
    title: 'Home',
  },
  {
    path: '/login',
    element: LoginPage,
    isPublic: true,
    title: 'Login',
  },
  {
    path: '/dashboard',
    element: DashboardPage,
    isPublic: false,
    title: 'Dashboard',
  },
  {
    path: '*',
    element: NotFoundPage,
    isPublic: true,
    title: 'Page Not Found',
  },
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SETTINGS: '/settings',
} as const;
