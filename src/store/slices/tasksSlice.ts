/**
 * Tasks Redux Slice
 * State management for task tracking
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskStatus, TaskPriority } from '../../types/task.types';
import { mockTasks } from '../../data/mockTasks';

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: mockTasks,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString();

        const now = new Date().toISOString();
        if (action.payload.status === 'IN_PROGRESS' && !task.startedAt) {
          task.startedAt = now;
        } else if (action.payload.status === 'COMPLETED' && !task.completedAt) {
          task.completedAt = now;
          task.progress = 100;
        }
      }
    },
    updateTaskProgress: (state, action: PayloadAction<{ taskId: string; progress: number }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.progress = action.payload.progress;
        task.updatedAt = new Date().toISOString();

        if (action.payload.progress === 100 && task.status !== 'COMPLETED') {
          task.status = 'COMPLETED';
          task.completedAt = new Date().toISOString();
        }
      }
    },
    updateTaskPriority: (
      state,
      action: PayloadAction<{ taskId: string; priority: TaskPriority }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.priority = action.payload.priority;
        task.updatedAt = new Date().toISOString();
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
          task.updatedAt = new Date().toISOString();
        }
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskProgress,
  updateTaskPriority,
  toggleChecklistItem,
} = tasksSlice.actions;

export default tasksSlice.reducer;
