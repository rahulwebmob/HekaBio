/**
 * Contract Activity Service
 *
 * CRUD operations for ContractActivity entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { ContractActivity } from '../types/contract.types';

class ContractActivityService extends BaseCRUDService<ContractActivity> {
  protected storageConfig: StorageConfig = {
    key: 'contract_activities',
    version: 1,
  };

  protected entityName = 'ContractActivity';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get activities by contract
   */
  getByContractId(contractId: string): ContractActivity[] {
    return this.search((activity) => activity.contractId === contractId).sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  /**
   * Get activities by type
   */
  getByType(type: ContractActivity['type']): ContractActivity[] {
    return this.search((activity) => activity.type === type).sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  /**
   * Get activities by actor
   */
  getByActorId(actorId: string): ContractActivity[] {
    return this.search((activity) => activity.actorId === actorId).sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }

  /**
   * Get recent activities
   */
  getRecent(limit: number = 10): ContractActivity[] {
    return this.getAll()
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, limit);
  }

  /**
   * Log activity
   */
  logActivity(
    contractId: string,
    type: ContractActivity['type'],
    description: string,
    actorName: string,
    actorId?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>
  ): ContractActivity {
    return this.create({
      contractId,
      type,
      description,
      actorId,
      actorName,
      metadata,
      occurredAt: new Date().toISOString(),
    });
  }
}

export const contractActivityService = new ContractActivityService();
