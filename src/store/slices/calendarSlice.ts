/**
 * Calendar Slice
 * Redux state management for calendar events and scheduling
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CalendarEvent, EventStatus, CalendarView } from '../../types/calendar.types';
import { mockCalendarEvents } from '../../data/mockCalendar';

interface CalendarState {
  events: CalendarEvent[];
  selectedView: CalendarView;
  selectedDate: string; // ISO date string
  isLoading: boolean;
  error: string | null;
}

const initialState: CalendarState = {
  events: mockCalendarEvents,
  selectedView: 'MONTH',
  selectedDate: new Date().toISOString(),
  isLoading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Add new event
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },

    // Update event
    updateEvent: (
      state,
      action: PayloadAction<{ eventId: string; updates: Partial<CalendarEvent> }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        Object.assign(event, action.payload.updates);
        event.updatedAt = new Date().toISOString();
      }
    },

    // Delete event
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },

    // Update event status
    updateEventStatus: (
      state,
      action: PayloadAction<{ eventId: string; status: EventStatus }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.status = action.payload.status;
        event.updatedAt = new Date().toISOString();
      }
    },

    // Update attendee response
    updateAttendeeResponse: (
      state,
      action: PayloadAction<{
        eventId: string;
        attendeeId: string;
        responseStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
      }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        const attendee = event.attendees.find((a) => a.id === action.payload.attendeeId);
        if (attendee) {
          attendee.responseStatus = action.payload.responseStatus;
          event.updatedAt = new Date().toISOString();
        }
      }
    },

    // Reschedule event
    rescheduleEvent: (
      state,
      action: PayloadAction<{ eventId: string; startTime: string; endTime: string }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.startTime = action.payload.startTime;
        event.endTime = action.payload.endTime;
        event.updatedAt = new Date().toISOString();
      }
    },

    // Cancel event
    cancelEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.status = 'CANCELLED';
        event.updatedAt = new Date().toISOString();
      }
    },

    // Complete event
    completeEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.status = 'COMPLETED';
        event.updatedAt = new Date().toISOString();
      }
    },

    // Add event note
    addEventNote: (state, action: PayloadAction<{ eventId: string; note: string }>) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.notes = action.payload.note;
        event.updatedAt = new Date().toISOString();
      }
    },

    // Update event agenda
    updateEventAgenda: (state, action: PayloadAction<{ eventId: string; agenda: string }>) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.agenda = action.payload.agenda;
        event.updatedAt = new Date().toISOString();
      }
    },

    // Add attendee
    addAttendee: (
      state,
      action: PayloadAction<{
        eventId: string;
        attendee: CalendarEvent['attendees'][0];
      }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.attendees.push(action.payload.attendee);
        event.updatedAt = new Date().toISOString();
      }
    },

    // Remove attendee
    removeAttendee: (
      state,
      action: PayloadAction<{ eventId: string; attendeeId: string }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.attendees = event.attendees.filter((a) => a.id !== action.payload.attendeeId);
        event.updatedAt = new Date().toISOString();
      }
    },

    // Update location
    updateLocation: (
      state,
      action: PayloadAction<{ eventId: string; location: CalendarEvent['location'] }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.location = action.payload.location;
        event.updatedAt = new Date().toISOString();
      }
    },

    // Set calendar view
    setCalendarView: (state, action: PayloadAction<CalendarView>) => {
      state.selectedView = action.payload;
    },

    // Set selected date
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },

    // Navigate to today
    navigateToToday: (state) => {
      state.selectedDate = new Date().toISOString();
    },

    // Navigate to previous period (depends on view)
    navigatePrevious: (state) => {
      const currentDate = new Date(state.selectedDate);
      switch (state.selectedView) {
        case 'DAY':
          currentDate.setDate(currentDate.getDate() - 1);
          break;
        case 'WEEK':
          currentDate.setDate(currentDate.getDate() - 7);
          break;
        case 'MONTH':
          currentDate.setMonth(currentDate.getMonth() - 1);
          break;
        case 'AGENDA':
          currentDate.setDate(currentDate.getDate() - 7);
          break;
      }
      state.selectedDate = currentDate.toISOString();
    },

    // Navigate to next period (depends on view)
    navigateNext: (state) => {
      const currentDate = new Date(state.selectedDate);
      switch (state.selectedView) {
        case 'DAY':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'WEEK':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'MONTH':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'AGENDA':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
      }
      state.selectedDate = currentDate.toISOString();
    },

    // Mark reminder as sent
    markReminderSent: (
      state,
      action: PayloadAction<{ eventId: string; reminderId: string }>
    ) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        const reminder = event.reminders.find((r) => r.id === action.payload.reminderId);
        if (reminder) {
          reminder.sent = true;
        }
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  updateAttendeeResponse,
  rescheduleEvent,
  cancelEvent,
  completeEvent,
  addEventNote,
  updateEventAgenda,
  addAttendee,
  removeAttendee,
  updateLocation,
  setCalendarView,
  setSelectedDate,
  navigateToToday,
  navigatePrevious,
  navigateNext,
  markReminderSent,
  setLoading,
  setError,
} = calendarSlice.actions;

export default calendarSlice.reducer;
