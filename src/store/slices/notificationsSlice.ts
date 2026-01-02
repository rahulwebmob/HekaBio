/**
 * Notifications Redux Slice
 * State management for user notifications
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../../types/notification.types';
import { mockNotifications } from '../../data/mockNotifications';

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: mockNotifications,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload); // Add to beginning
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
    },
    markAllAsRead: (state) => {
      const now = new Date().toISOString();
      state.notifications.forEach((n) => {
        if (!n.isRead) {
          n.isRead = true;
          n.readAt = now;
        }
      });
    },
    archiveNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isArchived = true;
        notification.archivedAt = new Date().toISOString();
      }
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
