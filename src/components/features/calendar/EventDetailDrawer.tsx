/**
 * Event Detail Drawer
 * For viewing calendar event details
 */

import { useState } from 'react';
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconVideo,
  IconPhone,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import {
  deleteEvent,
  updateEvent,
} from '../../../store/slices/calendarSlice';
import { Drawer, Badge, Button } from '../../ui';
import type {
  CalendarEvent,
  EventStatus,
  EventPriority,
  LocationType,
} from '../../../types/calendar.types';

interface EventDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onEdit?: (event: CalendarEvent) => void;
}

export default function EventDetailDrawer({
  isOpen,
  onClose,
  event,
  onEdit,
}: EventDetailDrawerProps) {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!event) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
    }
  };

  const handleDelete = () => {
    dispatch(deleteEvent(event.id));
    onClose();
  };

  const handleStatusChange = (status: EventStatus) => {
    dispatch(
      updateEvent({
        eventId: event.id,
        updates: { status },
      })
    );
  };

  const getStatusBadge = (status: EventStatus) => {
    const variants: Record<
      EventStatus,
      { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }
    > = {
      SCHEDULED: { variant: 'info', label: 'Scheduled' },
      CONFIRMED: { variant: 'success', label: 'Confirmed' },
      TENTATIVE: { variant: 'warning', label: 'Tentative' },
      CANCELLED: { variant: 'error', label: 'Cancelled' },
      COMPLETED: { variant: 'success', label: 'Completed' },
      NO_SHOW: { variant: 'error', label: 'No Show' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: EventPriority) => {
    const variants: Record<
      EventPriority,
      { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }
    > = {
      LOW: { variant: 'default', label: 'Low' },
      MEDIUM: { variant: 'info', label: 'Medium' },
      HIGH: { variant: 'warning', label: 'High' },
      URGENT: { variant: 'error', label: 'Urgent' },
    };
    const config = variants[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getLocationIcon = (type: LocationType) => {
    const icons: Record<LocationType, React.ReactElement> = {
      ONLINE: <IconVideo size={16} />,
      IN_PERSON: <IconMapPin size={16} />,
      PHONE: <IconPhone size={16} />,
      HYBRID: <IconMapPin size={16} />,
    };
    return icons[type];
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getResponseStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      ACCEPTED: { variant: 'success', label: 'Accepted' },
      DECLINED: { variant: 'error', label: 'Declined' },
      TENTATIVE: { variant: 'warning', label: 'Tentative' },
      PENDING: { variant: 'default', label: 'Pending' },
    };
    const config = variants[status] || variants.PENDING;
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const isPastEvent = new Date(event.endTime) < new Date();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Event Details"
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {event.status !== 'COMPLETED' && !isPastEvent && (
              <Button
                variant="primary"
                leftIcon={<IconCheck size={18} />}
                onClick={() => handleStatusChange('COMPLETED')}
              >
                Mark Complete
              </Button>
            )}
            {event.status !== 'CANCELLED' && !isPastEvent && (
              <Button
                variant="ghost"
                leftIcon={<IconX size={18} />}
                onClick={() => handleStatusChange('CANCELLED')}
              >
                Cancel Event
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<IconEdit size={18} />} onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/60 rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <div className="flex items-center gap-2">
                {getStatusBadge(event.status)}
                {getPriorityBadge(event.priority)}
                <Badge variant="default" size="sm">
                  {event.type.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {event.description && (
            <p className="text-gray-700 border-t border-gray-200/50 pt-4">{event.description}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <IconCalendar size={20} />
            <span className="text-sm font-medium">Date & Time</span>
          </div>
          <div className="space-y-2">
            {event.allDay ? (
              <div>
                <p className="font-semibold text-gray-900">{formatDateOnly(event.startTime)}</p>
                <p className="text-sm text-gray-600">All Day Event</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Start:</span>
                  <span className="font-semibold text-gray-900">{formatDateTime(event.startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">End:</span>
                  <span className="font-semibold text-gray-900">{formatDateTime(event.endTime)}</span>
                </div>
              </div>
            )}
          </div>
          {isPastEvent && (
            <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
              <IconAlertCircle size={16} />
              <span>This event has ended</span>
            </div>
          )}
        </div>

        {/* Location */}
        {event.location && (
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              {getLocationIcon(event.location.type)}
              <span className="text-sm font-medium">Location</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {event.location.type === 'ONLINE' && 'Online Meeting'}
                {event.location.type === 'IN_PERSON' && 'In-Person Meeting'}
                {event.location.type === 'PHONE' && 'Phone Call'}
                {event.location.type === 'HYBRID' && 'Hybrid Meeting'}
              </p>
              {event.location.meetingUrl && (
                <a
                  href={event.location.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-600 hover:text-brand-700 underline block"
                >
                  {event.location.meetingUrl}
                </a>
              )}
              {event.location.address && (
                <p className="text-sm text-gray-700">{event.location.address}</p>
              )}
            </div>
          </div>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <IconUsers size={20} />
              <span className="text-sm font-medium">
                Attendees ({event.attendees.length})
              </span>
            </div>
            <div className="space-y-2">
              {event.attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-2 hover:bg-white/40 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {attendee.name}
                      {attendee.isOrganizer && (
                        <span className="ml-2 text-xs text-gray-600">(Organizer)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">{attendee.email}</p>
                  </div>
                  {getResponseStatusBadge(attendee.responseStatus)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda */}
        {event.agenda && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Agenda</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.agenda}</p>
          </div>
        )}

        {/* Reminders */}
        {event.reminders && event.reminders.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <IconClock size={20} />
              <span className="text-sm font-medium">Reminders</span>
            </div>
            <div className="space-y-2">
              {event.reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {reminder.minutesBefore < 60
                      ? `${reminder.minutesBefore} minutes before`
                      : reminder.minutesBefore < 1440
                      ? `${Math.floor(reminder.minutesBefore / 60)} hours before`
                      : `${Math.floor(reminder.minutesBefore / 1440)} days before`}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      {reminder.method}
                    </Badge>
                    {reminder.sent && (
                      <Badge variant="success" size="sm">
                        Sent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Event Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">{formatDateTime(event.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900">{formatDateTime(event.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-900 mb-3">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<IconTrash size={16} />}
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showDeleteConfirm && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<IconTrash size={16} />}
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error-600 hover:text-error-700 hover:bg-error-50"
            >
              Delete Event
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
