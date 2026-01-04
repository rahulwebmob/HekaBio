/**
 * Settings Page
 * User preferences and configuration
 */

import { useState, useEffect, type ReactNode } from 'react';
import {
  IconSettings,
  IconBell,
  IconPalette,
  IconLayoutDashboard,
  IconDeviceFloppy,
  IconRefresh,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../app/store';
import {
  initializePreferences,
  updateNotificationPreferences,
  updateDisplayPreferences,
  updateDashboardConfiguration,
  toggleWidgetVisibility,
  resetToDefaults,
} from '../store/slices/userPreferencesSlice';
import { Card, Button, Badge } from '../components/ui';
import type {
  NotificationPreferences,
  DisplayPreferences,
  DashboardWidget,
  DashboardConfiguration,
} from '../types/userPreferences.types';

type TabId = 'notifications' | 'display' | 'dashboard';

interface NotificationsTabProps {
  preferences: NotificationPreferences;
  onChange: (updates: Partial<NotificationPreferences>) => void;
}

interface DisplayTabProps {
  preferences: DisplayPreferences;
  onChange: (updates: Partial<DisplayPreferences>) => void;
}

interface DashboardTabProps {
  widgets: DashboardWidget[];
  layout: DashboardConfiguration['layout'];
  onToggleWidget: (widgetId: string) => void;
  onLayoutChange: (layout: DashboardConfiguration['layout']) => void;
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.userPreferences);
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<TabId>('notifications');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize preferences on mount
  useEffect(() => {
    if (user && !preferences) {
      dispatch(initializePreferences(user.id));
    }
  }, [user, preferences, dispatch]);

  const handleSave = () => {
    // In a real app, this would save to backend API
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      dispatch(resetToDefaults());
      setHasChanges(false);
    }
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading preferences...</p>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: 'notifications', label: 'Notifications', icon: <IconBell size={20} /> },
    { id: 'display', label: 'Display', icon: <IconPalette size={20} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={20} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100">
              <IconSettings size={24} className="text-brand-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600">Manage your preferences and configuration</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleReset} leftIcon={<IconRefresh size={18} />}>
              Reset to Defaults
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              leftIcon={<IconDeviceFloppy size={18} />}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl">
          {activeTab === 'notifications' && (
            <NotificationsTab
              preferences={preferences.notifications}
              onChange={(updates) => {
                dispatch(updateNotificationPreferences(updates));
                setHasChanges(true);
              }}
            />
          )}
          {activeTab === 'display' && (
            <DisplayTab
              preferences={preferences.display}
              onChange={(updates) => {
                dispatch(updateDisplayPreferences(updates));
                setHasChanges(true);
              }}
            />
          )}
          {activeTab === 'dashboard' && (
            <DashboardTab
              widgets={preferences.dashboard.widgets}
              layout={preferences.dashboard.layout}
              onToggleWidget={(widgetId) => {
                dispatch(toggleWidgetVisibility(widgetId));
                setHasChanges(true);
              }}
              onLayoutChange={(layout) => {
                dispatch(updateDashboardConfiguration({ layout }));
                setHasChanges(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Notifications Tab Component
function NotificationsTab({ preferences, onChange }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailEnabled}
              onChange={(e) => onChange({ emailEnabled: e.target.checked })}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Email me when:</p>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A task is assigned to me</span>
              <input
                type="checkbox"
                checked={preferences.emailOnTaskAssigned}
                onChange={(e) => onChange({ emailOnTaskAssigned: e.target.checked })}
                disabled={!preferences.emailEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A task is due soon</span>
              <input
                type="checkbox"
                checked={preferences.emailOnTaskDue}
                onChange={(e) => onChange({ emailOnTaskDue: e.target.checked })}
                disabled={!preferences.emailEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A project is updated</span>
              <input
                type="checkbox"
                checked={preferences.emailOnProjectUpdate}
                onChange={(e) => onChange({ emailOnProjectUpdate: e.target.checked })}
                disabled={!preferences.emailEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A gate decision is made</span>
              <input
                type="checkbox"
                checked={preferences.emailOnGateDecision}
                onChange={(e) => onChange({ emailOnGateDecision: e.target.checked })}
                disabled={!preferences.emailEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">I receive a new communication</span>
              <input
                type="checkbox"
                checked={preferences.emailOnNewCommunication}
                onChange={(e) => onChange({ emailOnNewCommunication: e.target.checked })}
                disabled={!preferences.emailEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Digest Frequency
            </label>
            <select
              value={preferences.emailDigestFrequency}
              onChange={(e) => onChange({ emailDigestFrequency: e.target.value as 'none' | 'daily' | 'weekly' })}
              disabled={!preferences.emailEnabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="none">Never</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* In-App Notifications */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">In-App Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable In-App Notifications</p>
              <p className="text-sm text-gray-600">Show notifications within the application</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.inAppEnabled}
              onChange={(e) => onChange({ inAppEnabled: e.target.checked })}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Notify me when:</p>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A task is assigned to me</span>
              <input
                type="checkbox"
                checked={preferences.inAppOnTaskAssigned}
                onChange={(e) => onChange({ inAppOnTaskAssigned: e.target.checked })}
                disabled={!preferences.inAppEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A task is due soon</span>
              <input
                type="checkbox"
                checked={preferences.inAppOnTaskDue}
                onChange={(e) => onChange({ inAppOnTaskDue: e.target.checked })}
                disabled={!preferences.inAppEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A project is updated</span>
              <input
                type="checkbox"
                checked={preferences.inAppOnProjectUpdate}
                onChange={(e) => onChange({ inAppOnProjectUpdate: e.target.checked })}
                disabled={!preferences.inAppEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A gate decision is made</span>
              <input
                type="checkbox"
                checked={preferences.inAppOnGateDecision}
                onChange={(e) => onChange({ inAppOnGateDecision: e.target.checked })}
                disabled={!preferences.inAppEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">I receive a new communication</span>
              <input
                type="checkbox"
                checked={preferences.inAppOnNewCommunication}
                onChange={(e) => onChange({ inAppOnNewCommunication: e.target.checked })}
                disabled={!preferences.inAppEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Browser Notifications */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Browser Notifications</p>
              <p className="text-sm text-gray-600">Show desktop notifications</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.browserEnabled}
              onChange={(e) => onChange({ browserEnabled: e.target.checked })}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Notify me when:</p>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A task is assigned to me</span>
              <input
                type="checkbox"
                checked={preferences.browserOnTaskAssigned}
                onChange={(e) => onChange({ browserOnTaskAssigned: e.target.checked })}
                disabled={!preferences.browserEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pl-4">
              <span className="text-sm text-gray-700">A task is due soon</span>
              <input
                type="checkbox"
                checked={preferences.browserOnTaskDue}
                onChange={(e) => onChange({ browserOnTaskDue: e.target.checked })}
                disabled={!preferences.browserEnabled}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Display Tab Component
function DisplayTab({ preferences, onChange }: DisplayTabProps) {
  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'auto'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onChange({ theme })}
                  className={`px-4 py-3 border-2 rounded-lg capitalize transition-colors ${
                    preferences.theme === theme
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Density</label>
            <div className="grid grid-cols-2 gap-3">
              {(['comfortable', 'compact'] as const).map((density) => (
                <button
                  key={density}
                  onClick={() => onChange({ density })}
                  className={`px-4 py-3 border-2 rounded-lg capitalize transition-colors ${
                    preferences.density === density
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Views</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project View
            </label>
            <select
              value={preferences.defaultProjectView}
              onChange={(e) => onChange({ defaultProjectView: e.target.value as 'grid' | 'list' | 'table' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="table">Table</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task View</label>
            <select
              value={preferences.defaultTaskView}
              onChange={(e) => onChange({ defaultTaskView: e.target.value as 'list' | 'kanban' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="list">List</option>
              <option value="kanban">Kanban</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items Per Page
            </label>
            <select
              value={preferences.itemsPerPage}
              onChange={(e) => onChange({ itemsPerPage: parseInt(e.target.value) as 10 | 25 | 50 | 100 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Formats</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => onChange({ dateFormat: e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => onChange({ timeFormat: e.target.value as '12h' | '24h' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="12h">12-hour (2:30 PM)</option>
              <option value="24h">24-hour (14:30)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ widgets, layout, onToggleWidget, onLayoutChange }: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['single-column', 'two-column', 'three-column'] as const).map((l) => (
            <button
              key={l}
              onClick={() => onLayoutChange(l)}
              className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                layout === l
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {l === 'single-column' && 'Single'}
              {l === 'two-column' && 'Two Columns'}
              {l === 'three-column' && 'Three Columns'}
            </button>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Widgets</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose which widgets to display on your dashboard
        </p>
        <div className="space-y-2">
          {widgets.map((widget: any) => (
            <div
              key={widget.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={widget.isVisible}
                  onChange={() => onToggleWidget(widget.id)}
                  className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                />
                <span className="font-medium text-gray-900">{widget.label}</span>
              </div>
              <Badge variant={widget.isVisible ? 'success' : 'default'} size="sm">
                {widget.isVisible ? 'Visible' : 'Hidden'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
