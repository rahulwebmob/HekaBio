/**
 * Notifications Page
 * View and manage all notifications
 */

import type { ReactElement } from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconBell,
  IconCheck,
  IconTrash,
  IconArchive,
  IconMail,
  IconChecklist,
  IconFlask,
  IconAlertCircle,
  IconAt,
  IconSparkles,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { markAsRead, markAllAsRead, archiveNotification, deleteNotification } from '../store/slices/notificationsSlice';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button } from '../components/ui';
import type { NotificationType } from '../types/notification.types';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.notifications);

  const [showArchived, setShowArchived] = useState(false);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => showArchived || !notif.isArchived);
  }, [notifications, showArchived]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      archived: notifications.filter((n) => n.isArchived).length,
    };
  }, [notifications]);

  const getNotificationIcon = (type: NotificationType) => {
    const iconMap: Record<NotificationType, ReactElement> = {
      TASK_ASSIGNED: <IconChecklist size={20} />,
      TASK_DUE: <IconAlertCircle size={20} />,
      TASK_COMPLETED: <IconCheck size={20} />,
      SURVEY_SUBMITTED: <IconCheck size={20} />,
      SURVEY_DUE: <IconAlertCircle size={20} />,
      PROJECT_UPDATED: <IconFlask size={20} />,
      COMMUNICATION_RECEIVED: <IconMail size={20} />,
      FOLLOW_UP_REMINDER: <IconBell size={20} />,
      SYSTEM: <IconSparkles size={20} />,
      MENTION: <IconAt size={20} />,
    };
    return iconMap[type] || <IconBell size={20} />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-error-100 text-error-600';
      case 'HIGH':
        return 'bg-warning-100 text-warning-600';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    if (!notif.isRead) {
      dispatch(markAsRead(notif.id));
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your activities and alerts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconCheck size={16} />}
              onClick={() => dispatch(markAllAsRead())}
              disabled={stats.unread === 0}
            >
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconBell size={20} className="text-gray-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-brand-600">{stats.unread}</p>
              </div>
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconBell size={20} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconArchive size={20} className="text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Show Archived Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showArchived"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
          />
          <label htmlFor="showArchived" className="text-sm text-gray-700">
            Show Archived
          </label>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              padding="md"
              shadow="sm"
              className={`transition-all cursor-pointer ${
                !notif.isRead
                  ? 'bg-brand-50 hover:bg-brand-100 border-l-4 border-brand-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getPriorityColor(notif.priority)}`}>
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`font-semibold ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(archiveNotification(notif.id));
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Archive"
                      >
                        <IconArchive size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteNotification(notif.id));
                        }}
                        className="p-1 hover:bg-error-100 rounded transition-colors"
                        title="Delete"
                      >
                        <IconTrash size={16} className="text-error-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{notif.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatDate(notif.createdAt)}</span>
                    {notif.priority !== 'LOW' && (
                      <Badge
                        variant={
                          notif.priority === 'URGENT'
                            ? 'error'
                            : notif.priority === 'HIGH'
                            ? 'warning'
                            : 'info'
                        }
                        size="sm"
                      >
                        {notif.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredNotifications.length === 0 && (
            <Card padding="lg" shadow="sm">
              <div className="text-center py-12">
                <IconBell size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {showArchived ? 'No archived notifications' : 'No notifications'}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
      </div>
    </AppLayout>
  );
}
