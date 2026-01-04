/**
 * Mock Calendar Data
 * Sample calendar events for development
 */

import type { CalendarEvent } from '../types/calendar.types';
import { mockCompanies } from './mockCompanies';
import { mockProjects } from './mockProjects';

// Helper to create dates relative to today
const getDate = (daysOffset: number, hour: number, minute: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const mockCalendarEvents: CalendarEvent[] = [
  // Today's Events
  {
    id: 'event-001',
    title: 'Team Standup',
    description: 'Daily team sync and project updates',
    type: 'MEETING',
    status: 'CONFIRMED',
    priority: 'MEDIUM',
    startTime: getDate(0, 9, 0),
    endTime: getDate(0, 9, 30),
    allDay: false,
    isRecurring: true,
    recurrenceRule: {
      frequency: 'DAILY',
      interval: 1,
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    },
    location: {
      type: 'ONLINE',
      meetingUrl: 'https://zoom.us/j/123456789',
    },
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
      {
        id: 'user-002',
        name: 'Team Members',
        email: 'team@hekabio.com',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    reminders: [
      {
        id: 'reminder-001',
        minutesBefore: 15,
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['daily', 'team'],
    color: '#3B82F6',
    createdAt: '2025-01-01T09:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-01T09:00:00Z',
  },
  {
    id: 'event-002',
    title: 'Discovery Call with BioTech Innovations',
    description: 'Initial discussion about immunotherapy platform licensing',
    type: 'CALL',
    status: 'SCHEDULED',
    priority: 'HIGH',
    startTime: getDate(0, 14, 0),
    endTime: getDate(0, 15, 0),
    allDay: false,
    isRecurring: false,
    location: {
      type: 'PHONE',
      phoneNumber: '+1 (555) 123-4567',
    },
    companyId: mockCompanies[0].id,
    company: mockCompanies[0],
    projectId: mockProjects[0]?.id,
    project: mockProjects[0],
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
      {
        id: 'contact-001',
        name: 'Dr. Emily Chen',
        email: 'e.chen@biotechinnovations.com',
        company: 'BioTech Innovations',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    agenda: '1. Introduction\n2. Platform overview\n3. Licensing terms discussion\n4. Next steps',
    reminders: [
      {
        id: 'reminder-002',
        minutesBefore: 30,
        method: 'EMAIL',
        sent: false,
      },
      {
        id: 'reminder-003',
        minutesBefore: 10,
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['discovery', 'licensing', 'high-priority'],
    color: '#10B981',
    createdAt: '2025-01-06T10:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-06T10:00:00Z',
  },

  // Tomorrow's Events
  {
    id: 'event-003',
    title: 'Q1 Partnership Review Presentation',
    description: 'Quarterly business review with executive team',
    type: 'PRESENTATION',
    status: 'CONFIRMED',
    priority: 'URGENT',
    startTime: getDate(1, 10, 0),
    endTime: getDate(1, 11, 30),
    allDay: false,
    isRecurring: false,
    location: {
      type: 'HYBRID',
      address: '123 Innovation Drive, Boston, MA',
      room: 'Executive Boardroom',
      building: 'HekaBio HQ',
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/...',
    },
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
      {
        id: 'exec-001',
        name: 'CEO',
        email: 'ceo@hekabio.com',
        role: 'Chief Executive Officer',
        responseStatus: 'ACCEPTED',
      },
      {
        id: 'exec-002',
        name: 'CFO',
        email: 'cfo@hekabio.com',
        role: 'Chief Financial Officer',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    agenda: '1. Q1 Performance Overview\n2. Pipeline Status\n3. Win/Loss Analysis\n4. Q2 Strategy',
    attachments: [
      {
        id: 'attach-001',
        name: 'Q1_Partnership_Report.pdf',
        url: '/documents/q1-partnership-report.pdf',
        type: 'application/pdf',
      },
    ],
    reminders: [
      {
        id: 'reminder-004',
        minutesBefore: 60,
        method: 'EMAIL',
        sent: false,
      },
      {
        id: 'reminder-005',
        minutesBefore: 15,
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['executive', 'quarterly-review', 'presentation'],
    color: '#8B5CF6',
    createdAt: '2025-01-02T09:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-05T14:30:00Z',
  },
  {
    id: 'event-004',
    title: 'Follow-up: MedTech Solutions Contract',
    description: 'Follow up on Japan market entry contract status',
    type: 'FOLLOW_UP',
    status: 'SCHEDULED',
    priority: 'HIGH',
    startTime: getDate(1, 15, 0),
    endTime: getDate(1, 15, 30),
    allDay: false,
    isRecurring: false,
    companyId: mockCompanies[1].id,
    company: mockCompanies[1],
    projectId: mockProjects[1]?.id,
    project: mockProjects[1],
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    notes: 'Check on contract signature status and timeline for Japan entry',
    reminders: [
      {
        id: 'reminder-006',
        minutesBefore: 30,
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['follow-up', 'contract', 'japan'],
    color: '#F59E0B',
    createdAt: '2025-01-07T11:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-07T11:00:00Z',
  },

  // Next Week Events
  {
    id: 'event-005',
    title: 'BioPharm Innovation Conference',
    description: 'Annual industry conference in San Francisco',
    type: 'CONFERENCE',
    status: 'CONFIRMED',
    priority: 'MEDIUM',
    startTime: getDate(5, 8, 0),
    endTime: getDate(7, 18, 0),
    allDay: true,
    isRecurring: false,
    location: {
      type: 'IN_PERSON',
      address: 'Moscone Center, San Francisco, CA',
      instructions: 'Badge pickup at registration desk',
    },
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: false,
      },
      {
        id: 'user-002',
        name: 'John Doe',
        email: 'john@hekabio.com',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'external-001',
    organizerName: 'Conference Organizers',
    reminders: [
      {
        id: 'reminder-013',
        minutesBefore: 1440, // 1 day
        method: 'EMAIL',
        sent: false,
      },
    ],
    tags: ['conference', 'networking', 'industry'],
    color: '#6366F1',
    createdAt: '2024-12-01T09:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'event-006',
    title: 'Clinical Trial Protocol Review',
    description: 'Review and approval of Phase 2 clinical trial protocol',
    type: 'MEETING',
    status: 'TENTATIVE',
    priority: 'HIGH',
    startTime: getDate(3, 13, 0),
    endTime: getDate(3, 15, 0),
    allDay: false,
    isRecurring: false,
    location: {
      type: 'ONLINE',
      meetingUrl: 'https://zoom.us/j/987654321',
    },
    companyId: mockCompanies[2].id,
    company: mockCompanies[2],
    projectId: mockProjects[2]?.id,
    project: mockProjects[2],
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
      {
        id: 'contact-002',
        name: 'Dr. Robert Wilson',
        email: 'r.wilson@pharmaglobal.com',
        company: 'Pharma Global Inc',
        responseStatus: 'TENTATIVE',
      },
      {
        id: 'user-003',
        name: 'Clinical Team',
        email: 'clinical@hekabio.com',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    agenda:
      '1. Protocol Overview\n2. Patient Enrollment Strategy\n3. Safety Monitoring\n4. Timeline and Budget',
    reminders: [
      {
        id: 'reminder-007',
        minutesBefore: 1440, // 1 day
        method: 'EMAIL',
        sent: false,
      },
      {
        id: 'reminder-008',
        minutesBefore: 30,
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['clinical-trial', 'protocol', 'review'],
    color: '#3B82F6',
    createdAt: '2025-01-04T14:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-06T09:30:00Z',
  },

  // Recurring Weekly Meeting
  {
    id: 'event-007',
    title: 'Weekly Pipeline Review',
    description: 'Review active opportunities and update pipeline status',
    type: 'MEETING',
    status: 'CONFIRMED',
    priority: 'MEDIUM',
    startTime: getDate(4, 11, 0),
    endTime: getDate(4, 12, 0),
    allDay: false,
    isRecurring: true,
    recurrenceRule: {
      frequency: 'WEEKLY',
      interval: 1,
      daysOfWeek: [5], // Fridays
    },
    location: {
      type: 'ONLINE',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
    },
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
      {
        id: 'user-002',
        name: 'Business Development Team',
        email: 'bd@hekabio.com',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    reminders: [
      {
        id: 'reminder-009',
        minutesBefore: 15,
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['weekly', 'pipeline', 'recurring'],
    color: '#3B82F6',
    createdAt: '2025-01-01T09:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-01T09:00:00Z',
  },

  // Training Session
  {
    id: 'event-008',
    title: 'CRM Platform Training',
    description: 'Training session on new CRM features and best practices',
    type: 'TRAINING',
    status: 'SCHEDULED',
    priority: 'MEDIUM',
    startTime: getDate(6, 14, 0),
    endTime: getDate(6, 16, 0),
    allDay: false,
    isRecurring: false,
    location: {
      type: 'ONLINE',
      meetingUrl: 'https://zoom.us/j/training123',
    },
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
      },
      {
        id: 'user-002',
        name: 'All Team Members',
        email: 'team@hekabio.com',
        responseStatus: 'PENDING',
        isOptional: false,
      },
    ],
    organizerId: 'admin-001',
    organizerName: 'IT Admin',
    agenda: '1. New Features Overview\n2. Hands-on Practice\n3. Q&A Session',
    reminders: [
      {
        id: 'reminder-010',
        minutesBefore: 1440, // 1 day
        method: 'EMAIL',
        sent: false,
      },
    ],
    tags: ['training', 'crm', 'all-hands'],
    color: '#14B8A6',
    createdAt: '2025-01-03T10:00:00Z',
    createdBy: 'admin-001',
    updatedAt: '2025-01-03T10:00:00Z',
  },

  // Task Deadline
  {
    id: 'event-009',
    title: 'Q1 Report Submission Deadline',
    description: 'Final deadline for Q1 partnership report submission',
    type: 'TASK_DEADLINE',
    status: 'SCHEDULED',
    priority: 'URGENT',
    startTime: getDate(8, 17, 0),
    endTime: getDate(8, 17, 0),
    allDay: false,
    isRecurring: false,
    taskId: 'task-005',
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    notes: 'Ensure all metrics and visualizations are complete',
    reminders: [
      {
        id: 'reminder-011',
        minutesBefore: 2880, // 2 days
        method: 'EMAIL',
        sent: false,
      },
      {
        id: 'reminder-012',
        minutesBefore: 1440, // 1 day
        method: 'NOTIFICATION',
        sent: false,
      },
    ],
    tags: ['deadline', 'report', 'urgent'],
    color: '#EF4444',
    createdAt: '2025-01-02T09:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-02T09:00:00Z',
  },

  // Past Event (Completed)
  {
    id: 'event-010',
    title: 'Kickoff Meeting - Pharma Global Partnership',
    description: 'Project kickoff for oncology clinical trial collaboration',
    type: 'MEETING',
    status: 'COMPLETED',
    priority: 'HIGH',
    startTime: getDate(-2, 10, 0),
    endTime: getDate(-2, 11, 30),
    allDay: false,
    isRecurring: false,
    location: {
      type: 'IN_PERSON',
      address: 'Pharma Global HQ, New York, NY',
      room: 'Conference Room A',
    },
    companyId: mockCompanies[2].id,
    company: mockCompanies[2],
    projectId: mockProjects[2]?.id,
    project: mockProjects[2],
    attendees: [
      {
        id: 'user-001',
        name: 'Sarah Johnson',
        email: 'sarah@hekabio.com',
        responseStatus: 'ACCEPTED',
        isOrganizer: true,
      },
      {
        id: 'contact-002',
        name: 'Dr. Robert Wilson',
        email: 'r.wilson@pharmaglobal.com',
        company: 'Pharma Global Inc',
        responseStatus: 'ACCEPTED',
      },
    ],
    organizerId: 'user-001',
    organizerName: 'Sarah Johnson',
    reminders: [
      {
        id: 'reminder-014',
        minutesBefore: 30,
        method: 'NOTIFICATION',
        sent: true,
      },
    ],
    notes: 'Great kickoff! All stakeholders aligned on objectives and timeline.',
    tags: ['kickoff', 'partnership', 'completed'],
    color: '#3B82F6',
    createdAt: '2025-01-03T09:00:00Z',
    createdBy: 'user-001',
    updatedAt: '2025-01-06T15:00:00Z',
  },
];
