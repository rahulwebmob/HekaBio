/**
 * Calendar Page
 * Event scheduling and calendar management
 */

import { useMemo, useState } from 'react';
import {
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconPhone,
  IconVideo,
  IconCheck,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { navigatePrevious, navigateNext, navigateToToday } from '../store/slices/calendarSlice';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button } from '../components/ui';
import type { CalendarEvent } from '../types/calendar.types';
import { getEventTypeColor } from '../types/calendar.types';
import EventFormDrawer from '../components/features/calendar/EventFormDrawer';
import EventDetailDrawer from '../components/features/calendar/EventDetailDrawer';

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const { events, selectedDate } = useAppSelector((state) => state.calendar);

  // Drawer states
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Get current month and year from selectedDate
  const currentDate = useMemo(() => new Date(selectedDate), [selectedDate]);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get calendar days for month view
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentYear, currentMonth]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};

    events.forEach((event) => {
      const eventDate = new Date(event.startTime);
      const dateKey = eventDate.toISOString().split('T')[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    // Sort events by start time within each date
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    return grouped;
  }, [events]);

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return events
      .filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate >= today && eventDate <= nextWeek && event.status !== 'CANCELLED';
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 10);
  }, [events]);

  // Get today's events
  const todayEvents = useMemo(() => {
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    return eventsByDate[todayKey] || [];
  }, [eventsByDate]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: events.length,
      today: todayEvents.length,
      upcoming: events.filter((e) => new Date(e.startTime) > today && e.status !== 'CANCELLED')
        .length,
      completed: events.filter((e) => e.status === 'COMPLETED').length,
    };
  }, [events, todayEvents]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateKey = date.toISOString().split('T')[0];
    return eventsByDate[dateKey] || [];
  };

  const getLocationIcon = (event: CalendarEvent) => {
    if (!event.location) return null;
    if (event.location.type === 'ONLINE') {
      return <IconVideo size={14} className="text-blue-600" />;
    }
    if (event.location.type === 'PHONE') {
      return <IconPhone size={14} className="text-green-600" />;
    }
    return <IconMapPin size={14} className="text-gray-600" />;
  };

  // Handler functions for drawers
  const handleOpenNewEvent = () => {
    setSelectedEvent(null);
    setIsEditMode(false);
    setIsFormDrawerOpen(true);
  };

  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailDrawerOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setIsDetailDrawerOpen(false);
    setIsFormDrawerOpen(true);
  };

  const handleCloseFormDrawer = () => {
    setIsFormDrawerOpen(false);
    setSelectedEvent(null);
    setIsEditMode(false);
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedEvent(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">Manage meetings, calls, and events</p>
          </div>
          <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={handleOpenNewEvent}>
            New Event
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconCalendar size={20} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconClock size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-orange-600">{stats.upcoming}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <IconCalendar size={20} className="text-orange-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <IconCheck size={20} className="text-success-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card padding="md" shadow="sm">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{formatMonthYear()}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => dispatch(navigateToToday())}>
                    Today
                  </Button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => dispatch(navigatePrevious())}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <IconChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => dispatch(navigateNext())}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <IconChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const today = isToday(day);

                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] border rounded-lg p-2 transition-colors ${
                          day
                            ? 'hover:bg-gray-50 bg-white cursor-pointer'
                            : 'bg-gray-50 cursor-default'
                        } ${today ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}
                      >
                        {day && (
                          <>
                            <div
                              className={`text-sm font-medium mb-1 ${
                                today ? 'text-brand-600' : 'text-gray-700'
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(
                                    event.type
                                  )}`}
                                  title={event.title}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewEvent(event);
                                  }}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-4">
            <Card padding="md" shadow="sm">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 pl-3 py-2 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    style={{
                      borderLeftColor: event.color || '#3B82F6',
                    }}
                    onClick={() => handleViewEvent(event)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-900">{event.title}</h4>
                      <Badge
                        variant={
                          event.priority === 'URGENT'
                            ? 'error'
                            : event.priority === 'HIGH'
                              ? 'warning'
                              : 'default'
                        }
                        size="sm"
                      >
                        {event.type}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <IconClock size={12} />
                        <span>
                          {formatDate(event.startTime)} at {formatTime(event.startTime)}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          {getLocationIcon(event)}
                          <span className="truncate">
                            {event.location.type === 'ONLINE'
                              ? 'Online Meeting'
                              : event.location.type === 'PHONE'
                                ? 'Phone Call'
                                : event.location.address || 'In Person'}
                          </span>
                        </div>
                      )}

                      {event.attendees.length > 1 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <IconUsers size={12} />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      )}

                      {event.status === 'TENTATIVE' && (
                        <Badge variant="warning" size="sm">
                          Tentative
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {upcomingEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No upcoming events</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <EventFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={handleCloseFormDrawer}
        event={isEditMode ? selectedEvent : null}
      />

      <EventDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        event={selectedEvent}
        onEdit={handleEditEvent}
      />
    </AppLayout>
  );
}
