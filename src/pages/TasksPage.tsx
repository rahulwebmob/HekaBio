/**
 * Tasks Page
 * Task management and tracking
 */

import { useState, useMemo } from 'react';
import {
  IconChecklist,
  IconSearch,
  IconClock,
  IconCheck,
  IconProgress,
  IconAlertCircle,
  IconPlus,
  IconCalendar,
  IconUser,
  IconEdit,
  IconEye,
  IconLayoutKanban,
  IconList,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { updateTaskStatus, toggleChecklistItem } from '../store/slices/tasksSlice';
import { AppLayout } from '../components/layout';
import { Input, Select, Card, Badge, Button } from '../components/ui';
import type { Task, TaskStatus, TaskPriority } from '../types/task.types';
import { TaskFormDrawer, TaskDetailDrawer, TaskKanbanBoard } from '../components/features/tasks';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [view, setView] = useState<'list' | 'kanban'>('list');

  // Drawer states
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.company?.name.toLowerCase().includes(searchLower);

      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesCompleted = showCompleted || task.status !== 'COMPLETED';

      return matchesSearch && matchesStatus && matchesPriority && matchesCompleted;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, showCompleted]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'TODO').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      completed: tasks.filter((t) => t.status === 'COMPLETED').length,
      overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length,
    };
  }, [tasks]);

  const getStatusBadge = (status: TaskStatus) => {
    const variants: Record<TaskStatus, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      TODO: { variant: 'default', label: 'To Do' },
      IN_PROGRESS: { variant: 'info', label: 'In Progress' },
      BLOCKED: { variant: 'error', label: 'Blocked' },
      COMPLETED: { variant: 'success', label: 'Completed' },
      CANCELLED: { variant: 'default', label: 'Cancelled' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const variants: Record<TaskPriority, { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
      LOW: { variant: 'default', label: 'Low' },
      MEDIUM: { variant: 'info', label: 'Medium' },
      HIGH: { variant: 'warning', label: 'High' },
      URGENT: { variant: 'error', label: 'Urgent' },
    };
    const config = variants[priority];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const isOverdue = d < now;
    return (
      <span className={isOverdue ? 'text-error-600 font-semibold' : 'text-gray-600'}>
        {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    );
  };

  const handleToggleStatus = (taskId: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'TODO';
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  // Handler functions for drawers
  const handleOpenNewTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsFormDrawerOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDrawerOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsDetailDrawerOpen(false);
    setIsFormDrawerOpen(true);
  };

  const handleCloseFormDrawer = () => {
    setIsFormDrawerOpen(false);
    setSelectedTask(null);
    setIsEditMode(false);
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedTask(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">
              Manage and track your tasks and to-dos
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  view === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <IconList size={18} />
                <span className="text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  view === 'kanban'
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Kanban View"
              >
                <IconLayoutKanban size={18} />
                <span className="text-sm font-medium">Kanban</span>
              </button>
            </div>
            <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={handleOpenNewTask}>
              New Task
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconChecklist size={20} className="text-gray-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-700">{stats.todo}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <IconClock size={20} className="text-gray-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconProgress size={20} className="text-blue-600" />
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

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-error-600">{stats.overdue}</p>
              </div>
              <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
                <IconAlertCircle size={20} className="text-error-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<IconSearch size={18} />}
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                placeholder="Filter by status"
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'TODO', label: 'To Do' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'BLOCKED', label: 'Blocked' },
                  { value: 'COMPLETED', label: 'Completed' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                fullWidth
              />
              <Select
                placeholder="Filter by priority"
                options={[
                  { value: '', label: 'All Priorities' },
                  { value: 'URGENT', label: 'Urgent' },
                  { value: 'HIGH', label: 'High' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'LOW', label: 'Low' },
                ]}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                fullWidth
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCompleted"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="showCompleted" className="text-sm text-gray-700">
                  Show Completed
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Tasks Display - List or Kanban View */}
        {view === 'list' ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                padding="md"
                shadow="sm"
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleStatus(task.id, task.status)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                      task.status === 'COMPLETED'
                        ? 'bg-success-500 border-success-500'
                        : 'border-gray-300 hover:border-brand-500'
                    }`}
                  >
                    {task.status === 'COMPLETED' && <IconCheck size={16} className="text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>

                    {task.checklist && task.checklist.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {task.checklist.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => dispatch(toggleChecklistItem({ taskId: task.id, checklistId: item.id }))}
                              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                            />
                            <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Progress Bar */}
                    {task.progress > 0 && task.status !== 'COMPLETED' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-gray-700">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-brand-500 h-2 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.company && (
                          <span className="flex items-center gap-1">
                            <IconUser size={12} />
                            {task.company.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <IconCalendar size={12} />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        {task.estimatedHours && (
                          <span className="flex items-center gap-1">
                            <IconClock size={12} />
                            {task.estimatedHours}h
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {task.tags.length > 0 && (
                          <div className="flex gap-2">
                            {task.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-1 ml-auto">
                          <button
                            onClick={() => handleViewTask(task)}
                            className="p-1.5 hover:bg-white/80 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <IconEye size={16} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-1.5 hover:bg-white/80 rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <IconEdit size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredTasks.length === 0 && (
              <Card padding="lg" shadow="sm">
                <div className="text-center py-12">
                  <IconChecklist size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No tasks found</p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <TaskKanbanBoard tasks={filteredTasks} onTaskClick={handleViewTask} />
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Drawers */}
      <TaskFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={handleCloseFormDrawer}
        task={isEditMode ? selectedTask : null}
      />

      <TaskDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
        task={selectedTask}
        onEdit={handleEditTask}
      />
    </AppLayout>
  );
}
