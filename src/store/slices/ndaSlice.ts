/**
 * NDA Redux Slice
 * Manages NDA state and workflows
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  NDA,
  NDASignatory,
  NDADocument,
  NDAActivity,
  NDATemplate,
  NDAType,
  NDAStatus,
} from '../../types/nda.types';

interface NDAState {
  ndas: NDA[];
  templates: NDATemplate[];
  activities: NDAActivity[];
}

const initialState: NDAState = {
  ndas: [],
  templates: [],
  activities: [],
};

const ndaSlice = createSlice({
  name: 'nda',
  initialState,
  reducers: {
    // Create a new NDA
    createNDA: (
      state,
      action: PayloadAction<{
        companyId: string;
        companyName: string;
        projectId?: string;
        projectName?: string;
        title: string;
        type: NDAType;
        purpose: string;
        termYears?: number;
      }>
    ) => {
      const now = new Date().toISOString();
      const {
        companyId,
        companyName,
        projectId,
        projectName,
        title,
        type,
        purpose,
        termYears = 2,
      } = action.payload;

      const newNDA: NDA = {
        id: `nda-${Date.now()}`,
        companyId,
        companyName,
        projectId,
        projectName,
        title,
        type,
        status: 'DRAFT',
        purpose,
        termYears,
        draftedDate: now,
        documents: [],
        signatories: [],
        createdAt: now,
        createdBy: 'user-001',
      };

      state.ndas.push(newNDA);

      // Log activity
      state.activities.push({
        id: `activity-${Date.now()}`,
        ndaId: newNDA.id,
        type: 'CREATED',
        description: `NDA created: ${title}`,
        actorName: 'Current User',
        occurredAt: now,
      });
    },

    // Update NDA status
    updateNDAStatus: (
      state,
      action: PayloadAction<{
        ndaId: string;
        status: NDAStatus;
        note?: string;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        const oldStatus = nda.status;
        nda.status = action.payload.status;
        nda.updatedAt = new Date().toISOString();
        nda.updatedBy = 'user-001';

        // Update relevant dates
        const now = new Date().toISOString();
        if (action.payload.status === 'PENDING_SIGNATURES' && !nda.sentDate) {
          nda.sentDate = now;
        }
        if (action.payload.status === 'FULLY_SIGNED' && !nda.signedDate) {
          nda.signedDate = now;
        }
        if (action.payload.status === 'TERMINATED' && !nda.terminatedDate) {
          nda.terminatedDate = now;
        }

        // Log activity
        state.activities.push({
          id: `activity-${Date.now()}`,
          ndaId: nda.id,
          type: 'STATUS_CHANGED',
          description: `Status changed from ${oldStatus} to ${action.payload.status}${
            action.payload.note ? `: ${action.payload.note}` : ''
          }`,
          actorName: 'Current User',
          occurredAt: now,
        });
      }
    },

    // Update NDA details
    updateNDA: (
      state,
      action: PayloadAction<{
        ndaId: string;
        updates: Partial<Omit<NDA, 'id' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        Object.assign(nda, action.payload.updates);
        nda.updatedAt = new Date().toISOString();
        nda.updatedBy = 'user-001';
      }
    },

    // Add signatory
    addSignatory: (
      state,
      action: PayloadAction<{
        ndaId: string;
        signatory: Omit<NDASignatory, 'id' | 'ndaId' | 'createdAt' | 'createdBy'>;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        const now = new Date().toISOString();
        const newSignatory: NDASignatory = {
          id: `signatory-${Date.now()}-${Math.random()}`,
          ndaId: action.payload.ndaId,
          ...action.payload.signatory,
          createdAt: now,
          createdBy: 'user-001',
        };

        nda.signatories.push(newSignatory);
        nda.updatedAt = now;
      }
    },

    // Update signatory
    updateSignatory: (
      state,
      action: PayloadAction<{
        ndaId: string;
        signatoryId: string;
        updates: Partial<NDASignatory>;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        const signatory = nda.signatories.find((s) => s.id === action.payload.signatoryId);
        if (signatory) {
          Object.assign(signatory, action.payload.updates);
          signatory.updatedAt = new Date().toISOString();
          nda.updatedAt = new Date().toISOString();

          // Log signature if status changed to SIGNED
          if (action.payload.updates.status === 'SIGNED') {
            const now = new Date().toISOString();
            state.activities.push({
              id: `activity-${Date.now()}`,
              ndaId: nda.id,
              type: 'SIGNED',
              description: `Signed by ${signatory.name} (${signatory.organization})`,
              actorName: signatory.name,
              actorEmail: signatory.email,
              occurredAt: now,
            });

            // Check if all signatories have signed
            const allSigned = nda.signatories.every((s) => s.status === 'SIGNED');
            if (allSigned && nda.status !== 'FULLY_SIGNED') {
              nda.status = 'FULLY_SIGNED';
              nda.signedDate = now;
            } else if (nda.signatories.some((s) => s.status === 'SIGNED')) {
              nda.status = 'PARTIALLY_SIGNED';
            }
          }

          // Log decline if status changed to DECLINED
          if (action.payload.updates.status === 'DECLINED') {
            state.activities.push({
              id: `activity-${Date.now()}`,
              ndaId: nda.id,
              type: 'DECLINED',
              description: `Declined by ${signatory.name} (${signatory.organization})${
                action.payload.updates.declinedReason
                  ? `: ${action.payload.updates.declinedReason}`
                  : ''
              }`,
              actorName: signatory.name,
              actorEmail: signatory.email,
              occurredAt: new Date().toISOString(),
            });

            // Update NDA status
            if (nda.status !== 'DECLINED') {
              nda.status = 'DECLINED';
            }
          }
        }
      }
    },

    // Remove signatory
    removeSignatory: (
      state,
      action: PayloadAction<{
        ndaId: string;
        signatoryId: string;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        nda.signatories = nda.signatories.filter((s) => s.id !== action.payload.signatoryId);
        nda.updatedAt = new Date().toISOString();
      }
    },

    // Add document
    addDocument: (
      state,
      action: PayloadAction<{
        ndaId: string;
        document: Omit<NDADocument, 'id' | 'ndaId' | 'uploadedAt' | 'uploadedBy'>;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        const now = new Date().toISOString();
        const newDocument: NDADocument = {
          id: `doc-${Date.now()}-${Math.random()}`,
          ndaId: action.payload.ndaId,
          ...action.payload.document,
          uploadedAt: now,
          uploadedBy: 'user-001',
        };

        nda.documents.push(newDocument);
        nda.updatedAt = now;

        // Log activity
        state.activities.push({
          id: `activity-${Date.now()}`,
          ndaId: nda.id,
          type: 'DOCUMENT_UPLOADED',
          description: `Document uploaded: ${newDocument.name}`,
          actorName: 'Current User',
          occurredAt: now,
        });
      }
    },

    // Remove document
    removeDocument: (
      state,
      action: PayloadAction<{
        ndaId: string;
        documentId: string;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        nda.documents = nda.documents.filter((d) => d.id !== action.payload.documentId);
        nda.updatedAt = new Date().toISOString();
      }
    },

    // Send reminder
    sendReminder: (
      state,
      action: PayloadAction<{
        ndaId: string;
        signatoryId?: string;
      }>
    ) => {
      const nda = state.ndas.find((n) => n.id === action.payload.ndaId);
      if (nda) {
        const now = new Date().toISOString();

        if (action.payload.signatoryId) {
          // Remind specific signatory
          const signatory = nda.signatories.find((s) => s.id === action.payload.signatoryId);
          if (signatory) {
            signatory.lastReminderSent = now;
            signatory.reminderCount = (signatory.reminderCount || 0) + 1;

            state.activities.push({
              id: `activity-${Date.now()}`,
              ndaId: nda.id,
              type: 'REMINDED',
              description: `Reminder sent to ${signatory.name}`,
              actorName: 'Current User',
              occurredAt: now,
            });
          }
        } else {
          // Remind all pending signatories
          nda.signatories
            .filter((s) => s.status === 'PENDING')
            .forEach((signatory) => {
              signatory.lastReminderSent = now;
              signatory.reminderCount = (signatory.reminderCount || 0) + 1;
            });

          nda.lastReminderSent = now;

          state.activities.push({
            id: `activity-${Date.now()}`,
            ndaId: nda.id,
            type: 'REMINDED',
            description: 'Reminder sent to all pending signatories',
            actorName: 'Current User',
            occurredAt: now,
          });
        }

        nda.updatedAt = now;
      }
    },

    // Delete NDA
    deleteNDA: (state, action: PayloadAction<string>) => {
      state.ndas = state.ndas.filter((n) => n.id !== action.payload);
      state.activities = state.activities.filter((a) => a.ndaId !== action.payload);
    },

    // Template management
    createTemplate: (
      state,
      action: PayloadAction<{
        name: string;
        description: string;
        type: NDAType;
        defaultTermYears: number;
        defaultPurpose?: string;
        defaultJurisdiction?: string;
        defaultGoverningLaw?: string;
      }>
    ) => {
      const now = new Date().toISOString();
      const newTemplate: NDATemplate = {
        id: `template-${Date.now()}`,
        ...action.payload,
        isActive: true,
        usageCount: 0,
        createdAt: now,
        createdBy: 'user-001',
      };

      state.templates.push(newTemplate);
    },

    updateTemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        updates: Partial<Omit<NDATemplate, 'id' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const template = state.templates.find((t) => t.id === action.payload.templateId);
      if (template) {
        Object.assign(template, action.payload.updates);
        template.updatedAt = new Date().toISOString();
      }
    },

    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  createNDA,
  updateNDAStatus,
  updateNDA,
  addSignatory,
  updateSignatory,
  removeSignatory,
  addDocument,
  removeDocument,
  sendReminder,
  deleteNDA,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = ndaSlice.actions;

export default ndaSlice.reducer;
