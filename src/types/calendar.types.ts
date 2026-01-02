/**
 * Calendar Types
 * Event scheduling and calendar management
 */

import type { ID, Timestamp, Email } from './common.types';
import type { Company } from './addressBook.types';
import type { Project } from './project.types';

/**
 * Event Type
 */
export type EventType =
  | 'MEETING'
  | 'CALL'
  | 'TASK_DEADLINE'
  | 'FOLLOW_UP'
  | 'PRESENTATION'
  | 'CONFERENCE'
  | 'TRAINING'
  | 'REMINDER'
  | 'OTHER';

/**
 * Event Status
 */
export type EventStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'TENTATIVE'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

/**
 * Event Priority
 */
export type EventPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Meeting Location Type
 */
export type LocationType = 'IN_PERSON' | 'ONLINE' | 'PHONE' | 'HYBRID';

/**
 * Recurrence Pattern
 */
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number; // Every N days/weeks/months/years
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  endDate?: Timestamp;
  occurrences?: number; // Number of times to repeat
}

/**
 * Event Attendee
 */
export interface EventAttendee {
  id: ID;
  name: string;
  email: Email;
  role?: string;
  company?: string;
  responseStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
  isOrganizer?: boolean;
  isOptional?: boolean;
}

/**
 * Meeting Location
 */
export interface MeetingLocation {
  type: LocationType;
  address?: string;
  room?: string;
  building?: string;
  meetingUrl?: string; // For online meetings (Zoom, Teams, etc.)
  phoneNumber?: string;
  instructions?: string;
}

/**
 * Calendar Event
 */
export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  priority: EventPriority;

  // Timing
  startTime: Timestamp;
  endTime: Timestamp;
  allDay: boolean;
  timezone?: string;

  // Recurrence
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  recurrenceId?: ID; // Links to parent recurring event
  recurrenceExceptions?: Timestamp[]; // Dates when recurrence is skipped

  // Location and attendees
  location?: MeetingLocation;
  attendees: EventAttendee[];

  // Related entities
  companyId?: ID;
  company?: Company;
  projectId?: ID;
  project?: Project;
  taskId?: ID;
  communicationId?: ID;

  // Organizer
  organizerId: ID;
  organizerName: string;

  // Meeting details
  agenda?: string;
  notes?: string;
  attachments?: {
    id: ID;
    name: string;
    url: string;
    type: string;
  }[];

  // Reminders
  reminders: {
    id: ID;
    minutesBefore: number;
    method: 'EMAIL' | 'NOTIFICATION' | 'SMS';
    sent: boolean;
  }[];

  // Metadata
  tags: string[];
  color?: string;

  // System fields
  createdAt: Timestamp;
  createdBy: ID;
  updatedAt: Timestamp;
  updatedBy?: ID;
}

/**
 * Calendar View Type
 */
export type CalendarView = 'MONTH' | 'WEEK' | 'DAY' | 'AGENDA';

/**
 * Calendar Filters
 */
export interface CalendarFilters {
  eventTypes?: EventType[];
  statuses?: EventStatus[];
  priorities?: EventPriority[];
  companyId?: ID;
  projectId?: ID;
  attendeeId?: ID;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  tags?: string[];
}

/**
 * Time Slot
 * For availability checking
 */
export interface TimeSlot {
  start: Timestamp;
  end: Timestamp;
  available: boolean;
  event?: CalendarEvent;
}

/**
 * Availability
 */
export interface Availability {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

/**
 * Calendar Statistics
 */
export interface CalendarStats {
  totalEvents: number;
  upcomingEvents: number;
  todayEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  eventsByType: Record<EventType, number>;
  eventsByStatus: Record<EventStatus, number>;
}

/**
 * Event Type Configuration
 */
export interface EventTypeConfig {
  type: EventType;
  label: string;
  color: string;
  icon: string;
  defaultDuration: number; // minutes
  requiresLocation: boolean;
}

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  MEETING: {
    type: 'MEETING',
    label: 'Meeting',
    color: 'blue',
    icon: 'calendar',
    defaultDuration: 60,
    requiresLocation: true,
  },
  CALL: {
    type: 'CALL',
    label: 'Call',
    color: 'green',
    icon: 'phone',
    defaultDuration: 30,
    requiresLocation: false,
  },
  TASK_DEADLINE: {
    type: 'TASK_DEADLINE',
    label: 'Task Deadline',
    color: 'red',
    icon: 'checklist',
    defaultDuration: 0,
    requiresLocation: false,
  },
  FOLLOW_UP: {
    type: 'FOLLOW_UP',
    label: 'Follow-up',
    color: 'orange',
    icon: 'clock',
    defaultDuration: 30,
    requiresLocation: false,
  },
  PRESENTATION: {
    type: 'PRESENTATION',
    label: 'Presentation',
    color: 'purple',
    icon: 'presentation',
    defaultDuration: 90,
    requiresLocation: true,
  },
  CONFERENCE: {
    type: 'CONFERENCE',
    label: 'Conference',
    color: 'indigo',
    icon: 'users',
    defaultDuration: 480,
    requiresLocation: true,
  },
  TRAINING: {
    type: 'TRAINING',
    label: 'Training',
    color: 'teal',
    icon: 'school',
    defaultDuration: 120,
    requiresLocation: true,
  },
  REMINDER: {
    type: 'REMINDER',
    label: 'Reminder',
    color: 'yellow',
    icon: 'bell',
    defaultDuration: 0,
    requiresLocation: false,
  },
  OTHER: {
    type: 'OTHER',
    label: 'Other',
    color: 'gray',
    icon: 'calendar',
    defaultDuration: 60,
    requiresLocation: false,
  },
};

/**
 * Get event type color classes
 */
export const getEventTypeColor = (type: EventType): string => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    teal: 'bg-teal-100 text-teal-700 border-teal-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
  };
  const config = EVENT_TYPE_CONFIG[type];
  return colorMap[config.color] || colorMap.gray;
};
