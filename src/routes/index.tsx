

/**
 * Route Configuration
 */

import { lazy, type LazyExoticComponent, type ReactElement } from 'react';
import type { UserRole } from '../types/auth.types';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const CompaniesPage = lazy(() => import('../pages/CompaniesPage'));
const CompanyDetailPage = lazy(() => import('../pages/CompanyDetailPage'));
const CompanyFormPage = lazy(() => import('../pages/CompanyFormPage'));

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

  // Phase 2: Address Book
  {
    path: '/companies',
    element: CompaniesPage,
    isPublic: false,
    title: 'Companies - HekaBio',
  },
  {
    path: '/companies/new',
    element: CompanyFormPage,
    isPublic: false,
    title: 'Add Company - HekaBio',
  },
  {
    path: '/companies/:id/edit',
    element: CompanyFormPage,
    isPublic: false,
    title: 'Edit Company - HekaBio',
  },
  {
    path: '/companies/:id',
    element: CompanyDetailPage,
    isPublic: false,
    title: 'Company Detail - HekaBio',
  },

  // Phase 1 Routes (will be added as we build)
  // {
  //   path: '/projects',
  //   element: ProjectsListPage,
  //   isPublic: false,
  //   title: 'Projects - HekaBio',
  // },
  // {
  //   path: '/projects/:id',
  //   element: ProjectDetailPage,
  //   isPublic: false,
  //   title: 'Project Detail - HekaBio',
  // },

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

  // Phase 1
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  ADDRESS_BOOK: '/address-book',
  COMPANIES: '/address-book/companies',
  CONTACTS: '/address-book/contacts',
  SURVEYS: '/surveys',
  PIPELINE: '/pipeline',
  LEAD_SCORE: '/lead-score',
  COMMUNICATIONS: '/communications',
  TASKS: '/tasks',
  NOTIFICATIONS: '/notifications',

  // Phase 2
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  MANUFACTURING: '/manufacturing',
  TRANSPORTATION: '/transportation',
  INVENTORY: '/inventory',
  COLLECTION: '/collection',
  DOCUMENTS: '/documents',
  CALENDAR: '/calendar',
  REPORTS: '/reports',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
} as const;
