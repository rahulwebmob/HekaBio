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
const ContactsPage = lazy(() => import('../pages/ContactsPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const OpportunitiesPage = lazy(() => import('../pages/OpportunitiesPage'));
const SurveysPage = lazy(() => import('../pages/SurveysPage'));
const SurveyDetailPage = lazy(() => import('../pages/SurveyDetailPage'));
const PublicSurveyPage = lazy(() => import('../pages/PublicSurveyPage'));
const SurveyTemplatesPage = lazy(() => import('../pages/SurveyTemplatesPage'));
const SurveyBuilderPage = lazy(() => import('../pages/SurveyBuilderPage'));
const LeadScorePage = lazy(() => import('../pages/LeadScorePage'));
const JapanScreeningPage = lazy(() => import('../pages/JapanScreeningPage'));
const ScreeningsPage = lazy(() => import('../pages/ScreeningsPage'));
const AutomationPage = lazy(() => import('../pages/AutomationPage'));
const CommunicationsPage = lazy(() => import('../pages/CommunicationsPage'));
const TasksPage = lazy(() => import('../pages/TasksPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const PipelinePage = lazy(() => import('../pages/PipelinePage'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const DocumentsPage = lazy(() => import('../pages/DocumentsPage'));
const ContractsPage = lazy(() => import('../pages/ContractsPage'));
const NDAPage = lazy(() => import('../pages/NDAPage'));
const DDWorkspacePage = lazy(() => import('../pages/DDWorkspacePage'));

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

  // Phase 1: Opportunities
  {
    path: '/opportunities',
    element: OpportunitiesPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst'],
    title: 'Opportunities - HekaBio',
  },

  // Phase 1: Surveys
  {
    path: '/surveys',
    element: SurveysPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst'],
    title: 'Surveys - HekaBio',
  },
  {
    path: '/surveys/:id',
    element: SurveyDetailPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst'],
    title: 'Survey Detail - HekaBio',
  },

  // Lead Scoring
  {
    path: '/lead-scoring',
    element: LeadScorePage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Lead Scoring - HekaBio',
  },

  // Japan Market Screening
  {
    path: '/projects/:projectId/japan-screening',
    element: JapanScreeningPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Japan Market Screening - HekaBio',
  },

  // General Screenings
  {
    path: '/screenings',
    element: ScreeningsPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Pre-Project Screenings - HekaBio',
  },

  // Automation
  {
    path: '/automation',
    element: AutomationPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner'],
    title: 'Automation Rules - HekaBio',
  },

  // Pipeline
  {
    path: '/pipeline',
    element: PipelinePage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Sales Pipeline - HekaBio',
  },

  // Communications
  {
    path: '/communications',
    element: CommunicationsPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Communications - HekaBio',
  },

  // Tasks
  {
    path: '/tasks',
    element: TasksPage,
    isPublic: false,
    title: 'Tasks - HekaBio',
  },

  // Notifications
  {
    path: '/notifications',
    element: NotificationsPage,
    isPublic: false,
    title: 'Notifications - HekaBio',
  },

  // Settings
  {
    path: '/settings',
    element: SettingsPage,
    isPublic: false,
    title: 'Settings - HekaBio',
  },

  // Calendar
  {
    path: '/calendar',
    element: CalendarPage,
    isPublic: false,
    title: 'Calendar - HekaBio',
  },

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
    allowedRoles: ['super_admin', 'crm_owner', 'gate_3_decision_maker'],
    title: 'Contracts - HekaBio',
  },

  // NDAs
  {
    path: '/ndas',
    element: NDAPage,
    isPublic: false,
    allowedRoles: ['super_admin', 'crm_owner', 'gate_2_analyst', 'gate_3_decision_maker'],
    title: 'NDAs - HekaBio',
  },

  // Due Diligence
  {
    path: '/dd-workspace',
    element: DDWorkspacePage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'dd_specialist_scientific',
      'dd_specialist_regulatory',
      'dd_specialist_commercial',
      'dd_specialist_financial',
    ],
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
    path: '/companies',
    element: CompaniesPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Companies - HekaBio',
  },
  {
    path: '/companies/new',
    element: CompanyFormPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Add Company - HekaBio',
  },
  {
    path: '/companies/:id/edit',
    element: CompanyFormPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Edit Company - HekaBio',
  },
  {
    path: '/companies/:id',
    element: CompanyDetailPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Company Detail - HekaBio',
  },
  {
    path: '/contacts',
    element: ContactsPage,
    isPublic: false,
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
    title: 'Contacts - HekaBio',
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
