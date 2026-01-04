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
  ContractType,
} from '../../types/contract.types';

interface ContractState {
  contracts: Contract[];
  templates: ContractTemplate[];
  activities: ContractActivity[];
}

const initialState: ContractState = {
  contracts: [],
  templates: [],
  activities: [],
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    // Create contract
    createContract: (
      state,
      action: PayloadAction<{
        title: string;
        type: ContractType;
        projectId?: string;
        projectName?: string;
        companyId?: string;
        companyName?: string;
        description?: string;
      }>
    ) => {
      const now = new Date().toISOString();
      const newContract: Contract = {
        id: `contract-${Date.now()}`,
        ...action.payload,
        status: 'DRAFT',
        parties: [],
        payments: [],
        milestones: [],
        documents: [],
        requiresLegalReview: true,
        requiresFinanceApproval: false,
        createdAt: now,
        createdBy: 'user-001',
      };

      state.contracts.push(newContract);

      state.activities.push({
        id: `activity-${Date.now()}`,
        contractId: newContract.id,
        type: 'CREATED',
        description: `Contract created: ${action.payload.title}`,
        actorId: 'user-001',
        actorName: 'Current User',
        occurredAt: now,
      });
    },

    // Update contract
    updateContract: (
      state,
      action: PayloadAction<{
        contractId: string;
        updates: Partial<Omit<Contract, 'id' | 'parties' | 'payments' | 'milestones' | 'documents' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      if (contract) {
        const oldStatus = contract.status;
        Object.assign(contract, action.payload.updates);
        contract.updatedAt = new Date().toISOString();

        // Log status change
        if (action.payload.updates.status && oldStatus !== action.payload.updates.status) {
          const now = new Date().toISOString();
          state.activities.push({
            id: `activity-${Date.now()}`,
            contractId: contract.id,
            type: 'STATUS_CHANGED',
            description: `Status changed from ${oldStatus} to ${action.payload.updates.status}`,
            actorId: 'user-001',
            actorName: 'Current User',
            occurredAt: now,
            metadata: { oldStatus, newStatus: action.payload.updates.status },
          });
        }
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
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      if (contract) {
        const newParty: ContractParty = {
          ...action.payload.party,
          id: `party-${Date.now()}-${Math.random()}`,
          contractId: action.payload.contractId,
          createdAt: new Date().toISOString(),
        };

        contract.parties.push(newParty);
        contract.updatedAt = new Date().toISOString();
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
      if (contract) {
        const party = contract.parties.find((p) => p.id === action.payload.partyId);
        if (party) {
          Object.assign(party, action.payload.updates);
          contract.updatedAt = new Date().toISOString();

          // Log signature
          if (action.payload.updates.signedDate && !party.signedDate) {
            state.activities.push({
              id: `activity-${Date.now()}`,
              contractId: contract.id,
              type: 'SIGNED',
              description: `Signed by ${party.name}`,
              actorName: party.contactName,
              occurredAt: new Date().toISOString(),
            });
          }
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
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      if (contract) {
        const newPayment: ContractPayment = {
          ...action.payload.payment,
          id: `payment-${Date.now()}-${Math.random()}`,
          contractId: action.payload.contractId,
          createdAt: new Date().toISOString(),
        };

        contract.payments.push(newPayment);
        contract.updatedAt = new Date().toISOString();
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
      if (contract) {
        const payment = contract.payments.find((p) => p.id === action.payload.paymentId);
        if (payment) {
          const oldStatus = payment.status;
          Object.assign(payment, action.payload.updates);
          payment.updatedAt = new Date().toISOString();
          contract.updatedAt = new Date().toISOString();

          // Log payment completion
          if (action.payload.updates.status === 'PAID' && oldStatus !== 'PAID') {
            state.activities.push({
              id: `activity-${Date.now()}`,
              contractId: contract.id,
              type: 'PAYMENT_MADE',
              description: `Payment received: ${payment.description} (${payment.amount} ${payment.currency})`,
              actorId: 'user-001',
              actorName: 'Current User',
              occurredAt: new Date().toISOString(),
            });
          }
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
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      if (contract) {
        const newMilestone: ContractMilestone = {
          ...action.payload.milestone,
          id: `milestone-${Date.now()}-${Math.random()}`,
          contractId: action.payload.contractId,
          createdAt: new Date().toISOString(),
        };

        contract.milestones.push(newMilestone);
        contract.updatedAt = new Date().toISOString();
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
      if (contract) {
        const milestone = contract.milestones.find((m) => m.id === action.payload.milestoneId);
        if (milestone) {
          const oldStatus = milestone.status;
          Object.assign(milestone, action.payload.updates);
          milestone.updatedAt = new Date().toISOString();
          contract.updatedAt = new Date().toISOString();

          // Log milestone completion
          if (action.payload.updates.status === 'COMPLETED' && oldStatus !== 'COMPLETED') {
            state.activities.push({
              id: `activity-${Date.now()}`,
              contractId: contract.id,
              type: 'MILESTONE_COMPLETED',
              description: `Milestone completed: ${milestone.title}`,
              actorId: 'user-001',
              actorName: 'Current User',
              occurredAt: new Date().toISOString(),
            });
          }
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
      const contract = state.contracts.find((c) => c.id === action.payload.contractId);
      if (contract) {
        const now = new Date().toISOString();
        const newDocument: ContractDocument = {
          ...action.payload.document,
          id: `doc-${Date.now()}-${Math.random()}`,
          contractId: action.payload.contractId,
          uploadedAt: now,
          uploadedBy: 'user-001',
        };

        contract.documents.push(newDocument);
        contract.updatedAt = now;

        state.activities.push({
          id: `activity-${Date.now()}`,
          contractId: contract.id,
          type: 'DOCUMENT_UPLOADED',
          description: `Document uploaded: ${newDocument.name}`,
          actorId: 'user-001',
          actorName: 'Current User',
          occurredAt: now,
        });
      }
    },

    // Delete contract
    deleteContract: (state, action: PayloadAction<string>) => {
      state.contracts = state.contracts.filter((c) => c.id !== action.payload);
      state.activities = state.activities.filter((a) => a.contractId !== action.payload);
    },

    // Template management
    createContractTemplate: (
      state,
      action: PayloadAction<Omit<ContractTemplate, 'id' | 'isActive' | 'usageCount' | 'createdAt' | 'createdBy'>>
    ) => {
      const now = new Date().toISOString();
      const newTemplate: ContractTemplate = {
        ...action.payload,
        id: `template-${Date.now()}`,
        isActive: true,
        usageCount: 0,
        createdAt: now,
        createdBy: 'user-001',
      };

      state.templates.push(newTemplate);
    },

    updateContractTemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        updates: Partial<Omit<ContractTemplate, 'id' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const template = state.templates.find((t) => t.id === action.payload.templateId);
      if (template) {
        Object.assign(template, action.payload.updates);
        template.updatedAt = new Date().toISOString();
      }
    },

    deleteContractTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  createContract,
  updateContract,
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
} = contractSlice.actions;

export default contractSlice.reducer;
