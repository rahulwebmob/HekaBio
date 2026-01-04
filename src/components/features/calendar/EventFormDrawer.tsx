/**
 * Event Form Drawer
 * For creating and editing calendar events
 */

import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch } from '../../../app/store';
import { addEvent, updateEvent } from '../../../store/slices/calendarSlice';
import { Drawer, Input, Select, Button } from '../../ui';
import type {
  CalendarEvent,
  EventType,
  EventStatus,
  EventPriority,
  LocationType,
} from '../../../types/calendar.types';

interface EventFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
}

export default function EventFormDrawer({ isOpen, onClose, event }: EventFormDrawerProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!event;

  // Initialize form data from event prop
  const initialFormData = useMemo(() => {
    if (event) {
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);

      return {
        title: event.title,
        description: event.description || '',
        type: event.type,
        status: event.status,
        priority: event.priority,
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        allDay: event.allDay,
        locationType: event.location?.type || 'ONLINE' as LocationType,
        locationUrl: event.location?.meetingUrl || '',
        locationAddress: event.location?.address || '',
        agenda: event.agenda || '',
      };
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    return {
      title: '',
      description: '',
      type: 'MEETING' as EventType,
      status: 'SCHEDULED' as EventStatus,
      priority: 'MEDIUM' as EventPriority,
      startDate: now.toISOString().split('T')[0],
      startTime: now.toTimeString().slice(0, 5),
      endDate: oneHourLater.toISOString().split('T')[0],
      endTime: oneHourLater.toTimeString().slice(0, 5),
      allDay: false,
      locationType: 'ONLINE' as LocationType,
      locationUrl: '',
      locationAddress: '',
      agenda: '',
    };
  }, [event]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when drawer closes or event changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen, initialFormData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.allDay && !formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Combine date and time
    const startDateTime = formData.allDay
      ? new Date(formData.startDate).toISOString()
      : new Date(`${formData.startDate}T${formData.startTime}`).toISOString();

    const endDateTime = formData.allDay
      ? new Date(formData.endDate || formData.startDate).toISOString()
      : new Date(`${formData.endDate || formData.startDate}T${formData.endTime}`).toISOString();

    if (isEdit && event) {
      // Update existing event
      dispatch(
        updateEvent({
          eventId: event.id,
          updates: {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            status: formData.status,
            priority: formData.priority,
            startTime: startDateTime,
            endTime: endDateTime,
            allDay: formData.allDay,
            location: {
              type: formData.locationType,
              meetingUrl: formData.locationUrl || undefined,
              address: formData.locationAddress || undefined,
            },
            agenda: formData.agenda,
          },
        })
      );
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        startTime: startDateTime,
        endTime: endDateTime,
        allDay: formData.allDay,
        location: {
          type: formData.locationType,
          meetingUrl: formData.locationUrl || undefined,
          address: formData.locationAddress || undefined,
        },
        attendees: [
          {
            id: 'user-001',
            name: 'Current User',
            email: 'user@hekabio.com',
            responseStatus: 'ACCEPTED',
            isOrganizer: true,
          },
        ],
        reminders: [
          {
            id: `reminder-${Date.now()}`,
            minutesBefore: 15,
            method: 'EMAIL',
            sent: false,
          },
        ],
        isRecurring: false,
        agenda: formData.agenda,
        organizerId: 'user-001',
        organizerName: 'Current User',
        tags: [],
        createdBy: 'user-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addEvent(newEvent));
    }

    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Event' : 'New Event'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title <span className="text-error-600">*</span>
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
            fullWidth
            error={errors.title}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter event description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Type, Status, Priority - Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={[
                { value: 'MEETING', label: 'Meeting' },
                { value: 'CALL', label: 'Call' },
                { value: 'TASK_DEADLINE', label: 'Deadline' },
                { value: 'FOLLOW_UP', label: 'Follow Up' },
                { value: 'PRESENTATION', label: 'Presentation' },
                { value: 'CONFERENCE', label: 'Conference' },
                { value: 'TRAINING', label: 'Training' },
                { value: 'REMINDER', label: 'Reminder' },
                { value: 'OTHER', label: 'Other' },
              ]}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={[
                { value: 'SCHEDULED', label: 'Scheduled' },
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'TENTATIVE', label: 'Tentative' },
                { value: 'CANCELLED', label: 'Cancelled' },
                { value: 'COMPLETED', label: 'Completed' },
              ]}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <Select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* All Day Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allDay"
            checked={formData.allDay}
            onChange={(e) => handleInputChange('allDay', e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
          />
          <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
            All Day Event
          </label>
        </div>

        {/* Start Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-error-600">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
            {errors.startDate && <p className="mt-1 text-sm text-error-600">{errors.startDate}</p>}
          </div>

          {!formData.allDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-error-600">*</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
              {errors.startTime && <p className="mt-1 text-sm text-error-600">{errors.startTime}</p>}
            </div>
          )}
        </div>

        {/* End Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          {!formData.allDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
          <Select
            value={formData.locationType}
            onChange={(e) => handleInputChange('locationType', e.target.value)}
            options={[
              { value: 'ONLINE', label: 'Online' },
              { value: 'IN_PERSON', label: 'In Person' },
              { value: 'PHONE', label: 'Phone' },
              { value: 'HYBRID', label: 'Hybrid' },
            ]}
            fullWidth
          />
        </div>

        {/* Location Details */}
        {formData.locationType === 'ONLINE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting URL (Zoom, Teams, etc.)
            </label>
            <Input
              value={formData.locationUrl}
              onChange={(e) => handleInputChange('locationUrl', e.target.value)}
              placeholder="https://zoom.us/j/..."
              fullWidth
            />
          </div>
        )}

        {(formData.locationType === 'IN_PERSON' || formData.locationType === 'HYBRID') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <Input
              value={formData.locationAddress}
              onChange={(e) => handleInputChange('locationAddress', e.target.value)}
              placeholder="Enter meeting address"
              fullWidth
            />
          </div>
        )}

        {/* Agenda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
          <textarea
            value={formData.agenda}
            onChange={(e) => handleInputChange('agenda', e.target.value)}
            placeholder="Meeting agenda..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>
      </div>
    </Drawer>
  );
}
