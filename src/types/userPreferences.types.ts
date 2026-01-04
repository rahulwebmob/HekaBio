/**
 * User Preferences Types
 * For storing user-specific configuration and settings
 */

import type { ID, Timestamp } from './common.types';

// ===== Dashboard Widget Types =====
export type DashboardWidgetType =
  | 'quick_stats'
  | 'pipeline_overview'
  | 'recent_projects'
  | 'upcoming_tasks'
  | 'recent_communications'
  | 'gate_status'
  | 'dd_progress'
  | 'notifications';

export interface DashboardWidget {
  id: DashboardWidgetType;
  label: string;
  isVisible: boolean;
  order: number;
  size?: 'small' | 'medium' | 'large' | 'full';
}

// ===== Notification Preferences =====
export interface NotificationPreferences {
  // Email notifications
  emailEnabled: boolean;
  emailOnTaskAssigned: boolean;
  emailOnTaskDue: boolean;
  emailOnProjectUpdate: boolean;
  emailOnGateDecision: boolean;
  emailOnNewCommunication: boolean;
  emailDigestFrequency: 'none' | 'daily' | 'weekly';

  // In-app notifications
  inAppEnabled: boolean;
  inAppOnTaskAssigned: boolean;
  inAppOnTaskDue: boolean;
  inAppOnProjectUpdate: boolean;
  inAppOnGateDecision: boolean;
  inAppOnNewCommunication: boolean;

  // Browser notifications
  browserEnabled: boolean;
  browserOnTaskAssigned: boolean;
  browserOnTaskDue: boolean;
}

// ===== Display Preferences =====
export interface DisplayPreferences {
  // Theme
  theme: 'light' | 'dark' | 'auto';

  // Density
  density: 'comfortable' | 'compact';

  // Default views
  defaultProjectView: 'grid' | 'list' | 'table';
  defaultTaskView: 'list' | 'kanban';

  // Items per page
  itemsPerPage: 10 | 25 | 50 | 100;

  // Date format
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

  // Time format
  timeFormat: '12h' | '24h';
}

// ===== Dashboard Configuration =====
export interface DashboardConfiguration {
  widgets: DashboardWidget[];
  layout: 'single-column' | 'two-column' | 'three-column';
}

// ===== User Preferences =====
export interface UserPreferences {
  id: ID;
  userId: ID;
  notifications: NotificationPreferences;
  display: DisplayPreferences;
  dashboard: DashboardConfiguration;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== Default Preferences =====
export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidget[] = [
  { id: 'quick_stats', label: 'Quick Stats', isVisible: true, order: 1, size: 'full' },
  { id: 'pipeline_overview', label: 'Pipeline Overview', isVisible: true, order: 2, size: 'large' },
  { id: 'recent_projects', label: 'Recent Projects', isVisible: true, order: 3, size: 'medium' },
  { id: 'upcoming_tasks', label: 'Upcoming Tasks', isVisible: true, order: 4, size: 'medium' },
  { id: 'recent_communications', label: 'Recent Communications', isVisible: true, order: 5, size: 'medium' },
  { id: 'gate_status', label: 'Gate Status', isVisible: true, order: 6, size: 'small' },
  { id: 'dd_progress', label: 'DD Progress', isVisible: true, order: 7, size: 'small' },
  { id: 'notifications', label: 'Notifications', isVisible: true, order: 8, size: 'medium' },
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailEnabled: true,
  emailOnTaskAssigned: true,
  emailOnTaskDue: true,
  emailOnProjectUpdate: false,
  emailOnGateDecision: true,
  emailOnNewCommunication: true,
  emailDigestFrequency: 'daily',
  inAppEnabled: true,
  inAppOnTaskAssigned: true,
  inAppOnTaskDue: true,
  inAppOnProjectUpdate: true,
  inAppOnGateDecision: true,
  inAppOnNewCommunication: true,
  browserEnabled: false,
  browserOnTaskAssigned: false,
  browserOnTaskDue: false,
};

export const DEFAULT_DISPLAY_PREFERENCES: DisplayPreferences = {
  theme: 'light',
  density: 'comfortable',
  defaultProjectView: 'grid',
  defaultTaskView: 'list',
  itemsPerPage: 25,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
};

export const DEFAULT_DASHBOARD_CONFIGURATION: DashboardConfiguration = {
  widgets: DEFAULT_DASHBOARD_WIDGETS,
  layout: 'two-column',
};
