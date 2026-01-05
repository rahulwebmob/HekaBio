/**
 * Base CRUD Service
 *
 * Generic CRUD operations for any entity with localStorage persistence
 * All specific services will extend this base class
 */

import { localStorageService } from './localStorage.service';
import type { StorageConfig } from './localStorage.service';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export type { StorageConfig };

export interface CRUDOperations<T extends BaseEntity> {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => T;
  update: (id: string, updates: Partial<T>) => T | undefined;
  delete: (id: string) => boolean;
  bulkCreate: (items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]) => T[];
  bulkDelete: (ids: string[]) => number;
  search: (predicate: (item: T) => boolean) => T[];
  count: () => number;
  clear: () => void;
}

export abstract class BaseCRUDService<T extends BaseEntity>
  implements CRUDOperations<T>
{
  protected items: T[] = [];
  protected abstract storageConfig: StorageConfig;
  protected abstract entityName: string;

  constructor() {
    // loadFromStorage will be called by child class after storageConfig is set
  }

  /**
   * Initialize the service (load from storage)
   * Must be called by child class constructor after properties are set
   */
  protected init(): void {
    this.loadFromStorage();
  }

  /**
   * Get all items
   */
  getAll(): T[] {
    return [...this.items];
  }

  /**
   * Get item by ID
   */
  getById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  /**
   * Create new item
   */
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;

    this.items.push(newItem);
    this.saveToStorage();

    console.log(`[${this.entityName}] Created:`, newItem.id);
    return newItem;
  }

  /**
   * Update existing item
   */
  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      console.warn(`[${this.entityName}] Item not found for update:`, id);
      return undefined;
    }

    const updatedItem = {
      ...this.items[index],
      ...updates,
      id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updatedItem;
    this.saveToStorage();

    console.log(`[${this.entityName}] Updated:`, id);
    return updatedItem;
  }

  /**
   * Delete item
   */
  delete(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);

    if (this.items.length === initialLength) {
      console.warn(`[${this.entityName}] Item not found for deletion:`, id);
      return false;
    }

    this.saveToStorage();
    console.log(`[${this.entityName}] Deleted:`, id);
    return true;
  }

  /**
   * Bulk create items
   */
  bulkCreate(items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): T[] {
    const now = new Date().toISOString();
    const newItems = items.map(
      (item) =>
        ({
          ...item,
          id: this.generateId(),
          createdAt: now,
          updatedAt: now,
        } as T)
    );

    this.items.push(...newItems);
    this.saveToStorage();

    console.log(`[${this.entityName}] Bulk created:`, newItems.length);
    return newItems;
  }

  /**
   * Bulk delete items
   */
  bulkDelete(ids: string[]): number {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => !ids.includes(item.id));
    const deletedCount = initialLength - this.items.length;

    if (deletedCount > 0) {
      this.saveToStorage();
      console.log(`[${this.entityName}] Bulk deleted:`, deletedCount);
    }

    return deletedCount;
  }

  /**
   * Search items with predicate
   */
  search(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  /**
   * Get total count
   */
  count(): number {
    return this.items.length;
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items = [];
    this.saveToStorage();
    console.log(`[${this.entityName}] Cleared all items`);
  }

  /**
   * Check if item exists
   */
  exists(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  /**
   * Get items by IDs
   */
  getByIds(ids: string[]): T[] {
    return this.items.filter((item) => ids.includes(item.id));
  }

  /**
   * Find one item matching predicate
   */
  findOne(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  /**
   * Load data from localStorage
   */
  protected loadFromStorage(): void {
    this.items = localStorageService.load<T[]>(this.storageConfig, []);
    console.log(`[${this.entityName}] Loaded ${this.items.length} items from storage`);
  }

  /**
   * Save data to localStorage
   */
  protected saveToStorage(): void {
    const success = localStorageService.save(this.storageConfig, this.items);
    if (!success) {
      console.error(`[${this.entityName}] Failed to save to storage`);
    }
  }

  /**
   * Generate unique ID
   */
  protected generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${this.entityName.toLowerCase()}-${timestamp}-${random}`;
  }

  /**
   * Seed initial data (for development/testing)
   */
  seed(data: T[]): void {
    if (this.items.length > 0) {
      console.warn(`[${this.entityName}] Cannot seed - data already exists`);
      return;
    }

    this.items = data;
    this.saveToStorage();
    console.log(`[${this.entityName}] Seeded ${data.length} items`);
  }

  /**
   * Export data as JSON
   */
  export(): T[] {
    return this.getAll();
  }

  /**
   * Import data from JSON
   */
  import(data: T[], merge: boolean = false): void {
    if (merge) {
      // Merge: Add new items, update existing
      data.forEach((item) => {
        const existingIndex = this.items.findIndex((i) => i.id === item.id);
        if (existingIndex !== -1) {
          this.items[existingIndex] = item;
        } else {
          this.items.push(item);
        }
      });
    } else {
      // Replace all
      this.items = data;
    }

    this.saveToStorage();
    console.log(`[${this.entityName}] Imported ${data.length} items (merge: ${merge})`);
  }
}
