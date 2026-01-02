/**
 * Route Constants
 * Centralized route paths for the application
 */

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',

  // Main
  DASHBOARD: '/dashboard',

  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',

  // Surveys
  SURVEYS: '/surveys',
  SURVEY_DETAIL: '/surveys/:id',

  // Address Book
  COMPANIES: '/companies',
  COMPANIES_NEW: '/companies/new',
  COMPANY_DETAIL: '/companies/:id',
  COMPANY_EDIT: '/companies/:id/edit',
  CONTACTS: '/contacts',

  // Pipeline
  PIPELINE: '/pipeline',

  // Communications & Tasks
  COMMUNICATIONS: '/communications',
  TASKS: '/tasks',
  NOTIFICATIONS: '/notifications',
  CALENDAR: '/calendar',
  DOCUMENTS: '/documents',

  // Future Phase 1 Routes (Not Yet Implemented)

  // Future Phase 2 Routes (Not Yet Implemented)
  // ORDERS: '/orders',
  // ORDER_DETAIL: '/orders/:id',
  // MANUFACTURING: '/manufacturing',
  // TRANSPORTATION: '/transportation',
  // INVENTORY: '/inventory',
  // COLLECTION: '/collection',
  // DOCUMENTS: '/documents',
  // CALENDAR: '/calendar',
  // REPORTS: '/reports',

  // Future Admin Routes (Not Yet Implemented)
  // ADMIN: '/admin',
  // ADMIN_USERS: '/admin/users',
  // ADMIN_SETTINGS: '/admin/settings',
} as const;
