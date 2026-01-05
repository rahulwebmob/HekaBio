/**
 * Contract Redux Slice
 * Manages contract state and workflows
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Contract,
  ContractParty,
  ContractPayment,
  ContractMilestone,
  ContractDocument,
  ContractActivity,
  ContractTemplate,
  ContractStatus,
} from '../../types/contract.types';
import { contractService } from '../../services/contract.service';
import { contractTemplateService } from '../../services/contractTemplate.service';
import { contractActivityService } from '../../services/contractActivity.service';

interface ContractState {
  contracts: Contract[];
  templates: ContractTemplate[];
  activities: ContractActivity[];
}

const initialState: ContractState = {
  contracts: contractService.getAll(),
  templates: contractTemplateService.getAll(),
  activities: contractActivityService.getAll(),
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    // Load data
    loadContracts: (state) => {
      state.contracts = contractService.getAll();
    },
    loadTemplates: (state) => {
      state.templates = contractTemplateService.getAll();
    },
    loadActivities: (state) => {
      state.activities = contractActivityService.getAll();
    },

    // Create contract
    createContract: (
      state,
      action: PayloadAction<Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newContract = contractService.create(action.payload);
      state.contracts.push(newContract);

      // Log activity
      const activity = contractActivityService.logActivity(
        newContract.id,
        'CREATED',
        `Contract created: ${newContract.title}`,
        'Current User',
        'user-001'
      );
      state.activities.unshift(activity);
    },

    // Update contract
    updateContract: (
      state,
      action: PayloadAction<{
        contractId: string;
        updates: Partial<Contract>;
      }>
    ) => {
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      const oldStatus = contract?.status;

      const updated = contractService.update(action.payload.contractId, action.payload.updates);
      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }

        // Log status change
        if (action.payload.updates.status && oldStatus !== action.payload.updates.status) {
          const activity = contractActivityService.logActivity(
            action.payload.contractId,
            'STATUS_CHANGED',
            `Status changed from ${oldStatus} to ${action.payload.updates.status}`,
            'Current User',
            'user-001',
            { oldStatus, newStatus: action.payload.updates.status }
          );
          state.activities.unshift(activity);
        }
      }
    },

    // Update contract status
    updateContractStatus: (
      state,
      action: PayloadAction<{
        contractId: string;
        status: ContractStatus;
      }>
    ) => {
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      const oldStatus = contract?.status;

      const updated = contractService.update(action.payload.contractId, {
        status: action.payload.status,
        updatedAt: new Date().toISOString(),
      });

      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }

        // Log activity
        const activity = contractActivityService.logActivity(
          action.payload.contractId,
          'STATUS_CHANGED',
          `Status changed from ${oldStatus} to ${action.payload.status}`,
          'Current User',
          'user-001',
          { oldStatus, newStatus: action.payload.status }
        );
        state.activities.unshift(activity);
      }
    },

    // Add party
    addContractParty: (
      state,
      action: PayloadAction<{
        contractId: string;
        party: Omit<ContractParty, 'id' | 'contractId' | 'createdAt'>;
      }>
    ) => {
      const updated = contractService.addParty(action.payload.contractId, action.payload.party);
      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }
      }
    },

    // Update party
    updateContractParty: (
      state,
      action: PayloadAction<{
        contractId: string;
        partyId: string;
        updates: Partial<ContractParty>;
      }>
    ) => {
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      const party = contract?.parties.find((p) => p.id === action.payload.partyId);

      const updated = contractService.updateParty(
        action.payload.contractId,
        action.payload.partyId,
        action.payload.updates
      );

      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }

        // Log signature
        if (action.payload.updates.signedDate && party && !party.signedDate) {
          const activity = contractActivityService.logActivity(
            action.payload.contractId,
            'SIGNED',
            `Signed by ${party.name}`,
            party.contactName
          );
          state.activities.unshift(activity);
        }
      }
    },

    // Add payment
    addContractPayment: (
      state,
      action: PayloadAction<{
        contractId: string;
        payment: Omit<ContractPayment, 'id' | 'contractId' | 'createdAt'>;
      }>
    ) => {
      const updated = contractService.addPayment(action.payload.contractId, action.payload.payment);
      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }
      }
    },

    // Update payment
    updateContractPayment: (
      state,
      action: PayloadAction<{
        contractId: string;
        paymentId: string;
        updates: Partial<ContractPayment>;
      }>
    ) => {
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      const payment = contract?.payments.find((p) => p.id === action.payload.paymentId);
      const oldStatus = payment?.status;

      const updated = contractService.updatePayment(
        action.payload.contractId,
        action.payload.paymentId,
        action.payload.updates
      );

      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }

        // Log payment completion
        if (action.payload.updates.status === 'PAID' && oldStatus !== 'PAID' && payment) {
          const activity = contractActivityService.logActivity(
            action.payload.contractId,
            'PAYMENT_MADE',
            `Payment received: ${payment.description} (${payment.amount} ${payment.currency})`,
            'Current User',
            'user-001'
          );
          state.activities.unshift(activity);
        }
      }
    },

    // Add milestone
    addContractMilestone: (
      state,
      action: PayloadAction<{
        contractId: string;
        milestone: Omit<ContractMilestone, 'id' | 'contractId' | 'createdAt'>;
      }>
    ) => {
      const updated = contractService.addMilestone(
        action.payload.contractId,
        action.payload.milestone
      );
      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }
      }
    },

    // Update milestone
    updateContractMilestone: (
      state,
      action: PayloadAction<{
        contractId: string;
        milestoneId: string;
        updates: Partial<ContractMilestone>;
      }>
    ) => {
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      const milestone = contract?.milestones.find((m) => m.id === action.payload.milestoneId);
      const oldStatus = milestone?.status;

      const updated = contractService.updateMilestone(
        action.payload.contractId,
        action.payload.milestoneId,
        action.payload.updates
      );

      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }

        // Log milestone completion
        if (action.payload.updates.status === 'COMPLETED' && oldStatus !== 'COMPLETED' && milestone) {
          const activity = contractActivityService.logActivity(
            action.payload.contractId,
            'MILESTONE_COMPLETED',
            `Milestone completed: ${milestone.title}`,
            'Current User',
            'user-001'
          );
          state.activities.unshift(activity);
        }
      }
    },

    // Add document
    addContractDocument: (
      state,
      action: PayloadAction<{
        contractId: string;
        document: Omit<ContractDocument, 'id' | 'contractId' | 'uploadedAt' | 'uploadedBy'>;
      }>
    ) => {
      const updated = contractService.addDocument(
        action.payload.contractId,
        action.payload.document
      );
      if (updated) {
        const index = state.contracts.findIndex((c) => c.id === action.payload.contractId);
        if (index !== -1) {
          state.contracts[index] = updated;
        }

        // Log activity
        const activity = contractActivityService.logActivity(
          action.payload.contractId,
          'DOCUMENT_UPLOADED',
          `Document uploaded: ${action.payload.document.name}`,
          'Current User',
          'user-001'
        );
        state.activities.unshift(activity);
      }
    },

    // Delete contract
    deleteContract: (state, action: PayloadAction<string>) => {
      const success = contractService.delete(action.payload);
      if (success) {
        state.contracts = state.contracts.filter((c) => c.id !== action.payload);

        // Also clean up activities for this contract
        const contractActivities = state.activities.filter((a) => a.contractId === action.payload);
        contractActivities.forEach((a) => contractActivityService.delete(a.id));
        state.activities = state.activities.filter((a) => a.contractId !== action.payload);
      }
    },

    // Template management
    createContractTemplate: (
      state,
      action: PayloadAction<Omit<ContractTemplate, 'id' | 'isActive' | 'usageCount' | 'createdAt' | 'updatedAt' | 'createdBy'>>
    ) => {
      const newTemplate = contractTemplateService.create({
        ...action.payload,
        isActive: true,
        usageCount: 0,
        createdBy: 'user-001',
      });
      state.templates.push(newTemplate);
    },

    updateContractTemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        updates: Partial<ContractTemplate>;
      }>
    ) => {
      const updated = contractTemplateService.update(
        action.payload.templateId,
        action.payload.updates
      );
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload.templateId);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    deleteContractTemplate: (state, action: PayloadAction<string>) => {
      const success = contractTemplateService.delete(action.payload);
      if (success) {
        state.templates = state.templates.filter((t) => t.id !== action.payload);
      }
    },

    toggleTemplateActive: (state, action: PayloadAction<string>) => {
      const updated = contractTemplateService.toggleActive(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    incrementTemplateUsage: (state, action: PayloadAction<string>) => {
      const updated = contractTemplateService.incrementUsage(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    // Clear all contract data
    clearAllContracts: (state) => {
      contractService.clear();
      contractTemplateService.clear();
      contractActivityService.clear();
      state.contracts = [];
      state.templates = [];
      state.activities = [];
    },
  },
});

export const {
  loadContracts,
  loadTemplates,
  loadActivities,
  createContract,
  updateContract,
  updateContractStatus,
  addContractParty,
  updateContractParty,
  addContractPayment,
  updateContractPayment,
  addContractMilestone,
  updateContractMilestone,
  addContractDocument,
  deleteContract,
  createContractTemplate,
  updateContractTemplate,
  deleteContractTemplate,
  toggleTemplateActive,
  incrementTemplateUsage,
  clearAllContracts,
} = contractSlice.actions;

export default contractSlice.reducer;
