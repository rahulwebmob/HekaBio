/**
 * Contract Service
 *
 * CRUD operations for Contract entities with localStorage persistence
 */

import { BaseCRUDService } from './baseCRUD.service';
import type { StorageConfig } from './baseCRUD.service';
import type {
  Contract,
  ContractStatus,
  ContractParty,
  ContractPayment,
  ContractMilestone,
  ContractDocument,
} from '../types/contract.types';

class ContractService extends BaseCRUDService<Contract> {
  protected storageConfig: StorageConfig = {
    key: 'contracts',
    version: 1,
  };

  protected entityName = 'Contract';

  constructor() {
    super();
    this.init();
  }

  /**
   * Get contracts by company
   */
  getByCompanyId(companyId: string): Contract[] {
    return this.search((contract) => contract.companyId === companyId);
  }

  /**
   * Get contracts by project
   */
  getByProjectId(projectId: string): Contract[] {
    return this.search((contract) => contract.projectId === projectId);
  }

  /**
   * Get contracts by status
   */
  getByStatus(status: ContractStatus): Contract[] {
    return this.search((contract) => contract.status === status);
  }

  /**
   * Get active contracts
   */
  getActive(): Contract[] {
    return this.search((contract) => contract.status === 'ACTIVE');
  }

  /**
   * Get contracts pending review
   */
  getPendingReview(): Contract[] {
    return this.search((contract) => contract.status === 'PENDING_REVIEW');
  }

  /**
   * Get contracts expiring soon (within 30 days)
   */
  getExpiringSoon(): Contract[] {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return this.search((contract) => {
      if (!contract.endDate) return false;
      const endDate = new Date(contract.endDate);
      return endDate <= thirtyDaysFromNow && endDate > now;
    });
  }

  /**
   * Add party to contract
   */
  addParty(
    contractId: string,
    party: Omit<ContractParty, 'id' | 'contractId' | 'createdAt'>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const now = new Date().toISOString();
    const newParty: ContractParty = {
      ...party,
      id: `party-${Date.now()}-${Math.random()}`,
      contractId,
      createdAt: now,
    };

    const parties = [...contract.parties, newParty];
    return this.update(contractId, { parties, updatedAt: now });
  }

  /**
   * Update party
   */
  updateParty(
    contractId: string,
    partyId: string,
    updates: Partial<ContractParty>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const partyIndex = contract.parties.findIndex((p) => p.id === partyId);
    if (partyIndex === -1) return undefined;

    const parties = [...contract.parties];
    parties[partyIndex] = { ...parties[partyIndex], ...updates };

    return this.update(contractId, { parties, updatedAt: new Date().toISOString() });
  }

  /**
   * Add payment to contract
   */
  addPayment(
    contractId: string,
    payment: Omit<ContractPayment, 'id' | 'contractId' | 'createdAt'>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const now = new Date().toISOString();
    const newPayment: ContractPayment = {
      ...payment,
      id: `payment-${Date.now()}-${Math.random()}`,
      contractId,
      createdAt: now,
    };

    const payments = [...contract.payments, newPayment];
    return this.update(contractId, { payments, updatedAt: now });
  }

  /**
   * Update payment
   */
  updatePayment(
    contractId: string,
    paymentId: string,
    updates: Partial<ContractPayment>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const paymentIndex = contract.payments.findIndex((p) => p.id === paymentId);
    if (paymentIndex === -1) return undefined;

    const payments = [...contract.payments];
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.update(contractId, { payments, updatedAt: new Date().toISOString() });
  }

  /**
   * Add milestone to contract
   */
  addMilestone(
    contractId: string,
    milestone: Omit<ContractMilestone, 'id' | 'contractId' | 'createdAt'>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const now = new Date().toISOString();
    const newMilestone: ContractMilestone = {
      ...milestone,
      id: `milestone-${Date.now()}-${Math.random()}`,
      contractId,
      createdAt: now,
    };

    const milestones = [...contract.milestones, newMilestone];
    return this.update(contractId, { milestones, updatedAt: now });
  }

  /**
   * Update milestone
   */
  updateMilestone(
    contractId: string,
    milestoneId: string,
    updates: Partial<ContractMilestone>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const milestoneIndex = contract.milestones.findIndex((m) => m.id === milestoneId);
    if (milestoneIndex === -1) return undefined;

    const milestones = [...contract.milestones];
    milestones[milestoneIndex] = {
      ...milestones[milestoneIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.update(contractId, { milestones, updatedAt: new Date().toISOString() });
  }

  /**
   * Add document to contract
   */
  addDocument(
    contractId: string,
    document: Omit<ContractDocument, 'id' | 'contractId' | 'uploadedAt' | 'uploadedBy'>
  ): Contract | undefined {
    const contract = this.getById(contractId);
    if (!contract) return undefined;

    const now = new Date().toISOString();
    const newDocument: ContractDocument = {
      ...document,
      id: `doc-${Date.now()}-${Math.random()}`,
      contractId,
      uploadedAt: now,
      uploadedBy: 'user-001',
    };

    const documents = [...contract.documents, newDocument];
    return this.update(contractId, { documents, updatedAt: now });
  }

  /**
   * Get contract statistics
   */
  getStatistics() {
    const contracts = this.getAll();

    const byStatus: Record<string, number> = {
      DRAFT: 0,
      PENDING_REVIEW: 0,
      PENDING_APPROVAL: 0,
      PENDING_SIGNATURES: 0,
      ACTIVE: 0,
      SUSPENDED: 0,
      TERMINATED: 0,
      EXPIRED: 0,
      COMPLETED: 0,
    };

    let totalValue = 0;
    let activeContracts = 0;
    let expiringSoon = 0;

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    contracts.forEach((contract) => {
      byStatus[contract.status]++;

      if (contract.status === 'ACTIVE') {
        activeContracts++;
      }

      if (contract.totalValue) {
        totalValue += contract.totalValue;
      }

      if (contract.endDate) {
        const endDate = new Date(contract.endDate);
        if (endDate <= thirtyDaysFromNow && endDate > now) {
          expiringSoon++;
        }
      }
    });

    return {
      total: contracts.length,
      byStatus,
      activeContracts,
      totalValue,
      expiringSoon,
    };
  }
}

export const contractService = new ContractService();
