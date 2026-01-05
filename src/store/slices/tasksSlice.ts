/**
 * Tasks Redux Slice
 * State management for task tracking
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskStatus, TaskPriority } from '../../types/task.types';
import { taskService } from '../../services/task.service';

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: taskService.getAll(),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasks: (state) => {
      state.tasks = taskService.getAll();
    },
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask = taskService.create(action.payload);
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const updated = taskService.update(action.payload.id, action.payload.updates);
      if (updated) {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const success = taskService.delete(action.payload);
      if (success) {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const updated = taskService.updateStatus(action.payload.taskId, action.payload.status);
      if (updated) {
        const index = state.tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
      }
    },
    updateTaskProgress: (state, action: PayloadAction<{ taskId: string; progress: number }>) => {
      const updated = taskService.updateProgress(action.payload.taskId, action.payload.progress);
      if (updated) {
        const index = state.tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
      }
    },
    updateTaskPriority: (
      state,
      action: PayloadAction<{ taskId: string; priority: TaskPriority }>
    ) => {
      const updated = taskService.update(action.payload.taskId, {
        priority: action.payload.priority,
        updatedAt: new Date().toISOString(),
      });
      if (updated) {
        const index = state.tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          state.tasks[index] = updated;
        }
      }
    },
    toggleChecklistItem: (
      state,
      action: PayloadAction<{ taskId: string; checklistId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task && task.checklist) {
        const item = task.checklist.find((c) => c.id === action.payload.checklistId);
        if (item) {
          item.completed = !item.completed;

          const updated = taskService.update(action.payload.taskId, {
            checklist: task.checklist,
            updatedAt: new Date().toISOString(),
          });
          if (updated) {
            const index = state.tasks.findIndex((t) => t.id === action.payload.taskId);
            if (index !== -1) {
              state.tasks[index] = updated;
            }
          }
        }
      }
    },
    clearAllTasks: (state) => {
      taskService.clear();
      state.tasks = [];
    },
  },
});

export const {
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskProgress,
  updateTaskPriority,
  toggleChecklistItem,
  clearAllTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
