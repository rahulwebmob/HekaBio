/**
 * DD Activity Service
 *
 * CRUD operations for DDActivity entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { DDActivity } from '../types/dd.types';

class DDActivityService extends BaseCRUDService<DDActivity> {
  protected storageConfig: StorageConfig = {
    key: 'dd_activities',
    version: 1,
  };

  protected entityName = 'DDActivity';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get activities by workspace
   */
  getByWorkspaceId(workspaceId: string): DDActivity[] {
    return this.search((activity) => activity.ddWorkspaceId === workspaceId)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  /**
   * Get activities by section
   */
  getBySectionId(sectionId: string): DDActivity[] {
    return this.search((activity) => activity.ddSectionId === sectionId)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  /**
   * Get activities by item
   */
  getByItemId(itemId: string): DDActivity[] {
    return this.search((activity) => activity.ddItemId === itemId)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  /**
   * Get activities by type
   */
  getByType(type: DDActivity['type']): DDActivity[] {
    return this.search((activity) => activity.type === type)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  /**
   * Get activities by actor
   */
  getByActorId(actorId: string): DDActivity[] {
    return this.search((activity) => activity.actorId === actorId)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  /**
   * Get recent activities
   */
  getRecent(limit: number = 10): DDActivity[] {
    return this.getAll()
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, limit);
  }

  /**
   * Log activity
   */
  logActivity(
    workspaceId: string,
    type: DDActivity['type'],
    description: string,
    actorId: string,
    actorName: string,
    metadata?: Record<string, any>,
    sectionId?: string,
    itemId?: string
  ): DDActivity {
    return this.create({
      ddWorkspaceId: workspaceId,
      ddSectionId: sectionId,
      ddItemId: itemId,
      type,
      description,
      actorId,
      actorName,
      metadata,
      occurredAt: new Date().toISOString(),
    });
  }
}

export const ddActivityService = new DDActivityService();
