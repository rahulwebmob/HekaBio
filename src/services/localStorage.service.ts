/**
 * LocalStorage Service
 *
 * Centralized service for all localStorage operations with:
 * - Error handling
 * - Data validation
 * - Versioning support
 * - Migration helpers
 */

export interface StorageConfig {
  key: string;
  version: number;
}

export interface StorageData<T> {
  version: number;
  data: T;
  timestamp: string;
}

class LocalStorageService {
  private readonly APP_PREFIX = 'hekabio_';

  /**
   * Save data to localStorage
   */
  save<T>(config: StorageConfig, data: T): boolean {
    try {
      const storageData: StorageData<T> = {
        version: config.version,
        data,
        timestamp: new Date().toISOString(),
      };

      const key = this.getKey(config.key);
      localStorage.setItem(key, JSON.stringify(storageData));
      return true;
    } catch (error) {
      console.error(`[LocalStorage] Failed to save ${config.key}:`, error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  load<T>(config: StorageConfig, defaultValue: T): T {
    try {
      const key = this.getKey(config.key);
      const item = localStorage.getItem(key);

      if (!item) {
        return defaultValue;
      }

      const storageData: StorageData<T> = JSON.parse(item);

      // Version mismatch - return default and clear old data
      if (storageData.version !== config.version) {
        console.warn(
          `[LocalStorage] Version mismatch for ${config.key}. Expected ${config.version}, got ${storageData.version}`
        );
        this.remove(config.key);
        return defaultValue;
      }

      return storageData.data;
    } catch (error) {
      console.error(`[LocalStorage] Failed to load ${config.key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`[LocalStorage] Failed to remove ${key}:`, error);
    }
  }

  /**
   * Clear all app data from localStorage
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.APP_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[LocalStorage] Failed to clear all data:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = `${this.APP_PREFIX}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage size in KB
   */
  getSize(): number {
    try {
      let size = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(this.APP_PREFIX)) {
          size += localStorage[key].length + key.length;
        }
      }
      return Math.round(size / 1024); // KB
    } catch {
      return 0;
    }
  }

  /**
   * Get all keys with app prefix
   */
  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage).filter((key) =>
        key.startsWith(this.APP_PREFIX)
      );
    } catch {
      return [];
    }
  }

  /**
   * Export all data as JSON
   */
  exportAll(): Record<string, any> {
    try {
      const data: Record<string, any> = {};
      const keys = this.getAllKeys();

      keys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = JSON.parse(value);
        }
      });

      return data;
    } catch (error) {
      console.error('[LocalStorage] Failed to export data:', error);
      return {};
    }
  }

  /**
   * Import data from JSON
   */
  importAll(data: Record<string, any>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      return true;
    } catch (error) {
      console.error('[LocalStorage] Failed to import data:', error);
      return false;
    }
  }

  /**
   * Get full key with prefix
   */
  private getKey(key: string): string {
    return `${this.APP_PREFIX}${key}`;
  }
}

export const localStorageService = new LocalStorageService();
