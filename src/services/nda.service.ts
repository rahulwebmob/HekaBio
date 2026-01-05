/**
 * NDA Service
 *
 * CRUD operations for NDA entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type { NDA, NDASignatory, NDADocument, NDAStatus } from '../types/nda.types';

class NDAService extends BaseCRUDService<NDA> {
  protected storageConfig: StorageConfig = {
    key: 'ndas',
    version: 1,
  };

  protected entityName = 'NDA';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get NDAs by company
   */
  getByCompanyId(companyId: string): NDA[] {
    return this.search((nda) => nda.companyId === companyId);
  }

  /**
   * Get NDAs by project
   */
  getByProjectId(projectId: string): NDA[] {
    return this.search((nda) => nda.projectId === projectId);
  }

  /**
   * Get NDAs by status
   */
  getByStatus(status: NDAStatus): NDA[] {
    return this.search((nda) => nda.status === status);
  }

  /**
   * Get NDAs pending signatures
   */
  getPendingSignatures(): NDA[] {
    return this.search(
      (nda) => nda.status === 'PENDING_SIGNATURES' || nda.status === 'PARTIALLY_SIGNED'
    );
  }

  /**
   * Get NDAs pending review
   */
  getPendingReview(): NDA[] {
    return this.search((nda) => nda.status === 'PENDING_REVIEW');
  }

  /**
   * Get expired NDAs
   */
  getExpired(): NDA[] {
    const now = new Date();
    return this.search(
      (nda) =>
        nda.expiryDate &&
        new Date(nda.expiryDate) < now &&
        nda.status !== 'EXPIRED' &&
        nda.status !== 'TERMINATED'
    );
  }

  /**
   * Update NDA status
   */
  updateStatus(ndaId: string, status: NDAStatus): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const now = new Date().toISOString();
    const updates: Partial<NDA> = {
      status,
      updatedAt: now,
      updatedBy: 'user-001',
    };

    // Update relevant dates based on status
    if (status === 'PENDING_SIGNATURES' && !nda.sentDate) {
      updates.sentDate = now;
    }
    if (status === 'FULLY_SIGNED' && !nda.signedDate) {
      updates.signedDate = now;
    }
    if (status === 'TERMINATED' && !nda.terminatedDate) {
      updates.terminatedDate = now;
    }

    return this.update(ndaId, updates);
  }

  /**
   * Add signatory to NDA
   */
  addSignatory(
    ndaId: string,
    signatory: Omit<NDASignatory, 'id' | 'ndaId' | 'createdAt' | 'createdBy'>
  ): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const now = new Date().toISOString();
    const newSignatory: NDASignatory = {
      id: `signatory-${Date.now()}-${Math.random()}`,
      ndaId,
      ...signatory,
      createdAt: now,
      createdBy: 'user-001',
    };

    const signatories = [...nda.signatories, newSignatory];
    return this.update(ndaId, { signatories, updatedAt: now });
  }

  /**
   * Update signatory
   */
  updateSignatory(
    ndaId: string,
    signatoryId: string,
    updates: Partial<NDASignatory>
  ): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const signatoryIndex = nda.signatories.findIndex((s) => s.id === signatoryId);
    if (signatoryIndex === -1) return undefined;

    const signatories = [...nda.signatories];
    signatories[signatoryIndex] = {
      ...signatories[signatoryIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update NDA status if all signed
    let status = nda.status;
    const now = new Date().toISOString();
    let signedDate = nda.signedDate;

    if (updates.status === 'SIGNED') {
      const allSigned = signatories.every((s) => s.status === 'SIGNED');
      if (allSigned) {
        status = 'FULLY_SIGNED';
        signedDate = now;
      } else if (signatories.some((s) => s.status === 'SIGNED')) {
        status = 'PARTIALLY_SIGNED';
      }
    } else if (updates.status === 'DECLINED') {
      status = 'DECLINED';
    }

    return this.update(ndaId, { signatories, status, signedDate, updatedAt: now });
  }

  /**
   * Remove signatory
   */
  removeSignatory(ndaId: string, signatoryId: string): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const signatories = nda.signatories.filter((s) => s.id !== signatoryId);
    return this.update(ndaId, { signatories, updatedAt: new Date().toISOString() });
  }

  /**
   * Add document to NDA
   */
  addDocument(
    ndaId: string,
    document: Omit<NDADocument, 'id' | 'ndaId' | 'uploadedAt' | 'uploadedBy'>
  ): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const now = new Date().toISOString();
    const newDocument: NDADocument = {
      id: `doc-${Date.now()}-${Math.random()}`,
      ndaId,
      ...document,
      uploadedAt: now,
      uploadedBy: 'user-001',
    };

    const documents = [...nda.documents, newDocument];
    return this.update(ndaId, { documents, updatedAt: now });
  }

  /**
   * Remove document
   */
  removeDocument(ndaId: string, documentId: string): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const documents = nda.documents.filter((d) => d.id !== documentId);
    return this.update(ndaId, { documents, updatedAt: new Date().toISOString() });
  }

  /**
   * Send reminder - update last reminder sent timestamp
   */
  sendReminder(ndaId: string, signatoryId?: string): NDA | undefined {
    const nda = this.getById(ndaId);
    if (!nda) return undefined;

    const now = new Date().toISOString();
    const signatories = [...nda.signatories];

    if (signatoryId) {
      // Update specific signatory
      const signatoryIndex = signatories.findIndex((s) => s.id === signatoryId);
      if (signatoryIndex !== -1) {
        signatories[signatoryIndex] = {
          ...signatories[signatoryIndex],
          lastReminderSent: now,
          reminderCount: (signatories[signatoryIndex].reminderCount || 0) + 1,
        };
      }
    } else {
      // Update all pending signatories
      signatories.forEach((signatory, index) => {
        if (signatory.status === 'PENDING') {
          signatories[index] = {
            ...signatory,
            lastReminderSent: now,
            reminderCount: (signatory.reminderCount || 0) + 1,
          };
        }
      });
    }

    return this.update(ndaId, {
      signatories,
      lastReminderSent: now,
      updatedAt: now,
    });
  }

  /**
   * Get NDA statistics
   */
  getStatistics() {
    const ndas = this.getAll();

    const byStatus: Record<string, number> = {
      DRAFT: 0,
      PENDING_REVIEW: 0,
      PENDING_SIGNATURES: 0,
      PARTIALLY_SIGNED: 0,
      FULLY_SIGNED: 0,
      EXPIRED: 0,
      DECLINED: 0,
      TERMINATED: 0,
      SUPERSEDED: 0,
    };

    let pendingSignatures = 0;
    let needingReminders = 0;

    ndas.forEach((nda) => {
      byStatus[nda.status]++;

      if (nda.status === 'PENDING_SIGNATURES' || nda.status === 'PARTIALLY_SIGNED') {
        pendingSignatures++;

        // Check if reminders needed (no reminder sent in last 7 days)
        const lastReminder = nda.lastReminderSent ? new Date(nda.lastReminderSent) : null;
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (!lastReminder || lastReminder < sevenDaysAgo) {
          needingReminders++;
        }
      }
    });

    return {
      total: ndas.length,
      byStatus,
      pendingSignatures,
      needingReminders,
    };
  }
}

export const ndaService = new NDAService();
