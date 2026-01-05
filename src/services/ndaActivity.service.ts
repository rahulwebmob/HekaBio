/**
 * NDA Activity Service
 *
 * CRUD operations for NDAActivity entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { NDAActivity } from '../types/nda.types';

class NDAActivityService extends BaseCRUDService<NDAActivity> {
  protected storageConfig: StorageConfig = {
    key: 'nda_activities',
    version: 1,
  };

  protected entityName = 'NDAActivity';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get activities by NDA
   */
  getByNDAId(ndaId: string): NDAActivity[] {
    return this.search((activity) => activity.ndaId === ndaId).sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  /**
   * Get activities by type
   */
  getByType(type: NDAActivity['type']): NDAActivity[] {
    return this.search((activity) => activity.type === type).sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  /**
   * Get activities by actor
   */
  getByActorId(actorId: string): NDAActivity[] {
    return this.search((activity) => activity.actorId === actorId).sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  /**
   * Get recent activities
   */
  getRecent(limit: number = 10): NDAActivity[] {
    return this.getAll()
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, limit);
  }

  /**
   * Log activity
   */
  logActivity(
    ndaId: string,
    type: NDAActivity['type'],
    description: string,
    actorName: string,
    actorId?: string,
    actorEmail?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>
  ): NDAActivity {
    return this.create({
      ndaId,
      type,
      description,
      actorId,
      actorName,
      actorEmail,
      metadata,
      occurredAt: new Date().toISOString(),
    });
  }
}

export const ndaActivityService = new NDAActivityService();
