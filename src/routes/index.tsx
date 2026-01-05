/**
 * Route Configuration
 */

import { lazy, type LazyExoticComponent, type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '../types/auth.types';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const CompanyDetailPage = lazy(() => import('../pages/CompanyDetailPage'));
const CompanyFormPage = lazy(() => import('../pages/CompanyFormPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
// const OpportunitiesPage = lazy(() => import('../pages/OpportunitiesPage')); // REMOVED: Out of scope
const SurveysPage = lazy(() => import('../pages/SurveysPage'));
const SurveyDetailPage = lazy(() => import('../pages/SurveyDetailPage'));
const PublicSurveyPage = lazy(() => import('../pages/PublicSurveyPage'));
const SurveyTemplatesPage = lazy(() => import('../pages/SurveyTemplatesPage'));
const SurveyBuilderPage = lazy(() => import('../pages/SurveyBuilderPage'));
const JapanScreeningPage = lazy(() => import('../pages/JapanScreeningPage'));
const AutomationPage = lazy(() => import('../pages/AutomationPage'));
// const CommunicationsPage = lazy(() => import('../pages/CommunicationsPage')); // REMOVED: Utils out of scope
// const TasksPage = lazy(() => import('../pages/TasksPage')); // REMOVED: Utils out of scope
// const NotificationsPage = lazy(() => import('../pages/NotificationsPage')); // REMOVED: Utils out of scope
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
// const PipelinePage = lazy(() => import('../pages/PipelinePage')); // REMOVED: Out of scope
// const CalendarPage = lazy(() => import('../pages/CalendarPage')); // REMOVED: Utils out of scope
const DocumentsPage = lazy(() => import('../pages/DocumentsPage'));
const ContractsPage = lazy(() => import('../pages/ContractsPage'));
const NDAPage = lazy(() => import('../pages/NDAPage'));
const DDWorkspacePage = lazy(() => import('../pages/DDWorkspacePage'));
const AddressBookPage = lazy(() => import('../pages/AddressBookPage'));

// 404 Page
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Redirect component helper
const RedirectComponent = ({ to }: { to: string }) => <Navigate to={to} replace />;

export interface RouteConfig {
  path: string;
  element: LazyExoticComponent<() => ReactElement> | (() => React.ReactElement);
  isPublic?: boolean;
  allowedRoles?: UserRole[];
  title?: string;
  children?: RouteConfig[];
}

// eslint-disable-next-line react-refresh/only-export-components
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
  {
    path: '/survey/:surveyId',
    element: PublicSurveyPage,
    isPublic: true,
    title: 'Survey - HekaBio',
  },

  // Protected Routes
  {
    path: '/dashboard',
    element: DashboardPage,
    isPublic: false,
    title: 'Dashboard - HekaBio',
  },

  // Phase 1: Projects & Pipeline
  {
    path: '/projects',
    element: ProjectsPage,
    isPublic: false,
    title: 'Projects - HekaBio',
  },
  {
    path: '/projects/:id',
    element: ProjectDetailPage,
    isPublic: false,
    title: 'Project Detail - HekaBio',
  },

  // Opportunities REMOVED - out of scope (auto-create projects from surveys instead)

  // Phase 1: Surveys
  {
    path: '/surveys',
    element: SurveysPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Surveys - HekaBio',
  },
  {
    path: '/surveys/:id',
    element: SurveyDetailPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Survey Detail - HekaBio',
  },

  // Lead Scoring (REDIRECT to Opportunities)
  {
    path: '/lead-scoring',
    element: () => RedirectComponent({ to: '/opportunities' }),
    isPublic: false,
    title: 'Redirect - HekaBio',
  },

  // Japan Market Screening
  {
    path: '/projects/:projectId/japan-screening',
    element: JapanScreeningPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Japan Market Screening - HekaBio',
  },

  // General Screenings (REDIRECT to Opportunities)
  {
    path: '/screenings',
    element: () => RedirectComponent({ to: '/opportunities' }),
    isPublic: false,
    title: 'Redirect - HekaBio',
  },

  // Automation
  {
    path: '/automation',
    element: AutomationPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner'],
    title: 'Automation Rules - HekaBio',
  },

  // Pipeline - REMOVED: Out of scope
  // {
  //   path: '/pipeline',
  //   element: PipelinePage,
  //   isPublic: false,
  //   allowedRoles: [
  //     'super_admin',
  //     'crm_owner',
  //     'gate_1_analyst',
  //     'gate_2_analyst',
  //     'gate_3_decision_maker',
  //   ],
  //   title: 'Sales Pipeline - HekaBio',
  // },

  // Communications - REMOVED: Utils out of scope
  // {
  //   path: '/communications',
  //   element: CommunicationsPage,
  //   isPublic: false,
  //   allowedRoles: [
  //     'super_admin',
  //     'crm_owner',
  //     'gate_1_analyst',
  //     'gate_2_analyst',
  //     'gate_3_decision_maker',
  //   ],
  //   title: 'Communications - HekaBio',
  // },

  // Tasks - REMOVED: Utils out of scope
  // {
  //   path: '/tasks',
  //   element: TasksPage,
  //   isPublic: false,
  //   title: 'Tasks - HekaBio',
  // },

  // Notifications - REMOVED: Utils out of scope
  // {
  //   path: '/notifications',
  //   element: NotificationsPage,
  //   isPublic: false,
  //   title: 'Notifications - HekaBio',
  // },

  // Settings
  {
    path: '/settings',
    element: SettingsPage,
    isPublic: false,
    title: 'Settings - HekaBio',
  },

  // Calendar - REMOVED: Utils out of scope
  // {
  //   path: '/calendar',
  //   element: CalendarPage,
  //   isPublic: false,
  //   title: 'Calendar - HekaBio',
  // },

  // Documents
  {
    path: '/documents',
    element: DocumentsPage,
    isPublic: false,
    title: 'Documents - HekaBio',
  },

  // Contracts
  {
    path: '/contracts',
    element: ContractsPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Contracts - HekaBio',
  },

  // NDAs
  {
    path: '/ndas',
    element: NDAPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'NDAs - HekaBio',
  },

  // Due Diligence
  {
    path: '/dd-workspace',
    element: DDWorkspacePage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst', 'dd_specialist'],
    title: 'Due Diligence - HekaBio',
  },

  // Admin: Survey Templates & Builder
  {
    path: '/admin/survey-templates',
    element: SurveyTemplatesPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner'],
    title: 'Survey Templates - HekaBio',
  },
  {
    path: '/admin/survey-builder/:templateId',
    element: SurveyBuilderPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner'],
    title: 'Survey Builder - HekaBio',
  },

  // Phase 1: Address Book
  {
    path: '/address-book',
    element: AddressBookPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Address Book - HekaBio',
  },

  // Company routes (specific routes BEFORE redirect)
  {
    path: '/companies/new',
    element: CompanyFormPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Add Company - HekaBio',
  },
  {
    path: '/companies/:id/edit',
    element: CompanyFormPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Edit Company - HekaBio',
  },
  {
    path: '/companies/:id',
    element: CompanyDetailPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
    title: 'Company Detail - HekaBio',
  },
  // OLD: Companies main route (REDIRECT to Address Book) - MUST be AFTER specific routes
  {
    path: '/companies',
    element: () => RedirectComponent({ to: '/address-book?tab=companies' }),
    isPublic: false,
    title: 'Redirect - HekaBio',
  },

  // OLD: Contacts route (REDIRECT to Address Book)
  {
    path: '/contacts',
    element: () => RedirectComponent({ to: '/address-book?tab=contacts' }),
    isPublic: false,
    title: 'Redirect - HekaBio',
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

// Re-export route paths from constants for easy reference
export { ROUTES } from './constants';
