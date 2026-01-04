/**
 * Task Detail Drawer
 * For viewing task details and progress
 */

import { useState } from 'react';
import {
  IconCheck,
  IconClock,
  IconUser,
  IconEdit,
  IconTrash,
  IconProgress,
  IconCalendar,
} from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import {
  deleteTask,
  updateTaskStatus,
  updateTaskProgress,
  toggleChecklistItem,
} from '../../../store/slices/tasksSlice';
import { Drawer, Badge, Button } from '../../ui';
import type { Task, TaskStatus, TaskPriority } from '../../../types/task.types';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export default function TaskDetailDrawer({ isOpen, onClose, task, onEdit }: TaskDetailDrawerProps) {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    onClose();
  };

  const handleStatusChange = (status: TaskStatus) => {
    dispatch(updateTaskStatus({ taskId: task.id, status }));
  };

  const handleProgressChange = (progress: number) => {
    dispatch(updateTaskProgress({ taskId: task.id, progress }));
  };

  const handleChecklistToggle = (checklistId: string) => {
    dispatch(toggleChecklistItem({ taskId: task.id, checklistId }));
  };

  const getStatusBadge = (status: TaskStatus) => {
    const variants: Record<
      TaskStatus,
      { variant: 'default' | 'info' | 'success' | 'warning' | 'error'; label: string }
    > = {
      TODO: { variant: 'default', label: 'To Do' },
      IN_PROGRESS: { variant: 'info', label: 'In Progress' },
      BLOCKED: { variant: 'error', label: 'Blocked' },
      COMPLETED: { variant: 'success', label: 'Completed' },
      CANCELLED: { variant: 'default', label: 'Cancelled' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    const variants: Record<
      TaskPriority,
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="xl"
      footer={
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {task.status !== 'COMPLETED' && (
              <Button
                variant="primary"
                leftIcon={<IconCheck size={18} />}
                onClick={() => handleStatusChange('COMPLETED')}
              >
                Mark Complete
              </Button>
            )}
            {task.status === 'TODO' && (
              <Button
                variant="secondary"
                leftIcon={<IconProgress size={18} />}
                onClick={() => handleStatusChange('IN_PROGRESS')}
              >
                Start Task
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{task.title}</h3>
              <div className="flex items-center gap-2">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
                <Badge variant="default" size="sm">
                  {task.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-700 border-t border-gray-200/50 pt-4">{task.description}</p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-200/50 pt-4">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white/60 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-gray-900">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300 rounded-full"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={task.progress}
            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
            className="w-full mt-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          {task.dueDate && (
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <IconCalendar size={16} />
                <span className="text-sm font-medium">Due Date</span>
              </div>
              <p className={`font-semibold ${isOverdue ? 'text-error-600' : 'text-gray-900'}`}>
                {formatDate(task.dueDate)}
                {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
              </p>
            </div>
          )}

          {task.estimatedHours && (
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <IconClock size={16} />
                <span className="text-sm font-medium">Estimated Hours</span>
              </div>
              <p className="text-gray-900 font-semibold">{task.estimatedHours}h</p>
            </div>
          )}

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconUser size={16} />
              <span className="text-sm font-medium">Assigned To</span>
            </div>
            <p className="text-gray-900">Current User</p>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <IconClock size={16} />
              <span className="text-sm font-medium">Created</span>
            </div>
            <p className="text-gray-900">{formatDate(task.createdAt)}</p>
          </div>
        </div>

        {/* Company/Project */}
        {(task.company || task.project) && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Related To</h4>
            <div className="space-y-2">
              {task.company && (
                <div>
                  <span className="text-xs text-gray-600">Company:</span>
                  <p className="text-sm font-medium text-gray-900">{task.company.name}</p>
                </div>
              )}
              {task.project && (
                <div>
                  <span className="text-xs text-gray-600">Project:</span>
                  <p className="text-sm font-medium text-gray-900">{task.project.name}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Checklist ({task.checklist.filter((item) => item.completed).length}/
              {task.checklist.length})
            </h4>
            <div className="space-y-2">
              {task.checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-white/40 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(item.id)}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span
                    className={`text-sm ${
                      item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {task.notes && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.notes}</p>
          </div>
        )}

        {/* Timing Info */}
        {(task.startedAt || task.completedAt) && (
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h4>
            <div className="space-y-2 text-sm">
              {task.startedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Started:</span>
                  <span className="text-gray-900">{formatDate(task.startedAt)}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Completed:</span>
                  <span className="text-gray-900">{formatDate(task.completedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-900 mb-3">
              Are you sure you want to delete this task? This action cannot be undone.
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
              Delete Task
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
