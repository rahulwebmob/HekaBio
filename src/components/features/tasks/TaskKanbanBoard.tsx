/**
 * Task Kanban Board
 * Drag-and-drop task management with column view
 */

import { useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { IconGripVertical, IconClock, IconFlag, IconUser } from '@tabler/icons-react';
import { Badge } from '../../ui';
import { useAppDispatch } from '../../../app/store';
import { updateTask } from '../../../store/slices/tasksSlice';
import type { Task, TaskStatus } from '../../../types/task.types';

interface TaskKanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'TODO',
    title: 'To Do',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'text-brand-700',
    bgColor: 'bg-brand-50',
  },
  {
    id: 'BLOCKED',
    title: 'Blocked',
    color: 'text-error-700',
    bgColor: 'bg-error-50',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    color: 'text-success-700',
    bgColor: 'bg-success-50',
  },
  {
    id: 'CANCELLED',
    title: 'Cancelled',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
];

export default function TaskKanbanBoard({ tasks, onTaskClick }: TaskKanbanBoardProps) {
  const dispatch = useAppDispatch();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      BLOCKED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the task
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // If status changed, update the task
    if (task.status !== newStatus) {
      dispatch(
        updateTask({
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        })
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-error-600';
      case 'HIGH':
        return 'text-warning-600';
      case 'MEDIUM':
        return 'text-brand-600';
      case 'LOW':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnTasks = tasksByStatus[column.id];

          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              {/* Column Header */}
              <div className={`rounded-t-lg ${column.bgColor} px-4 py-3 border-b-2 border-${column.color.replace('text-', '')}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
                  <Badge variant="default" size="sm">
                    {columnTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content - Droppable Area */}
              <SortableContext
                id={column.id}
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bg-gray-50 rounded-b-lg p-4 min-h-[500px] space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                          {task.title}
                        </h4>
                        <IconGripVertical
                          size={16}
                          className="text-gray-400 flex-shrink-0 ml-2 cursor-grab"
                        />
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Task Metadata */}
                      <div className="space-y-2">
                        {/* Priority */}
                        <div className="flex items-center gap-2">
                          <IconFlag size={14} className={getPriorityColor(task.priority)} />
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center gap-2">
                            <IconClock size={14} className={isOverdue(task.dueDate) ? 'text-error-600' : 'text-gray-600'} />
                            <span
                              className={`text-xs ${
                                isOverdue(task.dueDate) ? 'text-error-600 font-medium' : 'text-gray-600'
                              }`}
                            >
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        )}

                        {/* Assignee */}
                        <div className="flex items-center gap-2">
                          <IconUser size={14} className="text-gray-600" />
                          <span className="text-xs text-gray-600">Assigned</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {task.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{task.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Progress Bar (for in-progress tasks) */}
                      {task.status === 'IN_PROGRESS' && task.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-xs font-medium text-brand-600">
                              {task.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-brand-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-brand-500 w-80 opacity-90">
            <h4 className="font-medium text-gray-900 text-sm">{activeTask.title}</h4>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
