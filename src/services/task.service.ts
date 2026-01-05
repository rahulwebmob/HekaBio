/**
 * Task Service
 *
 * CRUD operations for Task entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { Task, TaskStatus, TaskPriority } from '../types/task.types';

class TaskService extends BaseCRUDService<Task> {
  protected storageConfig: StorageConfig = {
    key: 'tasks',
    version: 1,
  };

  protected entityName = 'Task';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get tasks by assignee
   */
  getByAssignee(assigneeId: string): Task[] {
    return this.search((task) => task.assignedTo === assigneeId);
  }

  /**
   * Get tasks by status
   */
  getByStatus(status: TaskStatus): Task[] {
    return this.search((task) => task.status === status);
  }

  /**
   * Get tasks by priority
   */
  getByPriority(priority: TaskPriority): Task[] {
    return this.search((task) => task.priority === priority);
  }

  /**
   * Get tasks by entity (company, project, etc.)
   */
  getByEntityId(entityId: string, entityType: string): Task[] {
    return this.search(
      (task) => task.relatedEntityId === entityId && task.relatedEntityType === entityType
    );
  }

  /**
   * Get overdue tasks
   */
  getOverdue(): Task[] {
    const now = new Date();
    return this.search(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== 'COMPLETED' &&
        task.status !== 'CANCELLED'
    );
  }

  /**
   * Get tasks due soon (within 7 days)
   */
  getDueSoon(): Task[] {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return this.search(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) > now &&
        new Date(task.dueDate) <= sevenDaysFromNow &&
        task.status !== 'COMPLETED' &&
        task.status !== 'CANCELLED'
    );
  }

  /**
   * Update task status
   */
  updateStatus(taskId: string, status: TaskStatus): Task | undefined {
    const task = this.getById(taskId);
    if (!task) return undefined;

    const now = new Date().toISOString();
    const updates: Partial<Task> = {
      status,
      updatedAt: now,
    };

    // Update relevant dates based on status
    if (status === 'IN_PROGRESS' && !task.startedAt) {
      updates.startedAt = now;
    } else if (status === 'COMPLETED' && !task.completedAt) {
      updates.completedAt = now;
      updates.progress = 100;
    }

    return this.update(taskId, updates);
  }

  /**
   * Update task progress
   */
  updateProgress(taskId: string, progress: number): Task | undefined {
    const updates: Partial<Task> = {
      progress,
      updatedAt: new Date().toISOString(),
    };

    // Auto-update status based on progress
    if (progress === 100) {
      updates.status = 'COMPLETED';
      updates.completedAt = new Date().toISOString();
    } else if (progress > 0) {
      const task = this.getById(taskId);
      if (task && task.status === 'NOT_STARTED') {
        updates.status = 'IN_PROGRESS';
        updates.startedAt = new Date().toISOString();
      }
    }

    return this.update(taskId, updates);
  }
}

export const taskService = new TaskService();
