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
import { ndaService } from '../../services/nda.service';
import { ndaTemplateService } from '../../services/ndaTemplate.service';
import { ndaActivityService } from '../../services/ndaActivity.service';

interface NDAState {
  ndas: NDA[];
  templates: NDATemplate[];
  activities: NDAActivity[];
}

const initialState: NDAState = {
  ndas: ndaService.getAll(),
  templates: ndaTemplateService.getAll(),
  activities: ndaActivityService.getAll(),
};

const ndaSlice = createSlice({
  name: 'nda',
  initialState,
  reducers: {
    // Load data
    loadNDAs: (state) => {
      state.ndas = ndaService.getAll();
    },
    loadTemplates: (state) => {
      state.templates = ndaTemplateService.getAll();
    },
    loadActivities: (state) => {
      state.activities = ndaActivityService.getAll();
    },

    // Create a new NDA
    createNDA: (
      state,
      action: PayloadAction<Omit<NDA, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newNDA = ndaService.create(action.payload);
      state.ndas.push(newNDA);

      // Log activity
      const activity = ndaActivityService.logActivity(
        newNDA.id,
        'CREATED',
        `NDA created: ${newNDA.title}`,
        'Current User',
        'user-001'
      );
      state.activities.unshift(activity);
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
      const oldStatus = nda?.status;

      const updated = ndaService.updateStatus(action.payload.ndaId, action.payload.status);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }

        // Log activity
        const activity = ndaActivityService.logActivity(
          action.payload.ndaId,
          'STATUS_CHANGED',
          `Status changed from ${oldStatus} to ${action.payload.status}${
            action.payload.note ? `: ${action.payload.note}` : ''
          }`,
          'Current User',
          'user-001'
        );
        state.activities.unshift(activity);
      }
    },

    // Update NDA details
    updateNDA: (
      state,
      action: PayloadAction<{
        ndaId: string;
        updates: Partial<NDA>;
      }>
    ) => {
      const updated = ndaService.update(action.payload.ndaId, action.payload.updates);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }
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
      const updated = ndaService.addSignatory(action.payload.ndaId, action.payload.signatory);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }
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
      const signatory = nda?.signatories.find((s) => s.id === action.payload.signatoryId);

      const updated = ndaService.updateSignatory(
        action.payload.ndaId,
        action.payload.signatoryId,
        action.payload.updates
      );

      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }

        // Log signature if status changed to SIGNED
        if (action.payload.updates.status === 'SIGNED' && signatory) {
          const activity = ndaActivityService.logActivity(
            action.payload.ndaId,
            'SIGNED',
            `Signed by ${signatory.name} (${signatory.organization})`,
            signatory.name,
            undefined,
            signatory.email
          );
          state.activities.unshift(activity);
        }

        // Log decline if status changed to DECLINED
        if (action.payload.updates.status === 'DECLINED' && signatory) {
          const activity = ndaActivityService.logActivity(
            action.payload.ndaId,
            'DECLINED',
            `Declined by ${signatory.name} (${signatory.organization})${
              action.payload.updates.declinedReason
                ? `: ${action.payload.updates.declinedReason}`
                : ''
            }`,
            signatory.name,
            undefined,
            signatory.email
          );
          state.activities.unshift(activity);
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
      const updated = ndaService.removeSignatory(action.payload.ndaId, action.payload.signatoryId);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }
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
      const updated = ndaService.addDocument(action.payload.ndaId, action.payload.document);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }

        // Log activity
        const activity = ndaActivityService.logActivity(
          action.payload.ndaId,
          'DOCUMENT_UPLOADED',
          `Document uploaded: ${action.payload.document.name}`,
          'Current User',
          'user-001'
        );
        state.activities.unshift(activity);
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
      const updated = ndaService.removeDocument(action.payload.ndaId, action.payload.documentId);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }
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
      const updated = ndaService.sendReminder(action.payload.ndaId, action.payload.signatoryId);
      if (updated) {
        const index = state.ndas.findIndex((n) => n.id === action.payload.ndaId);
        if (index !== -1) {
          state.ndas[index] = updated;
        }

        // Log activity
        const nda = updated;
        const signatory = action.payload.signatoryId
          ? nda.signatories.find((s) => s.id === action.payload.signatoryId)
          : null;

        const description = signatory
          ? `Reminder sent to ${signatory.name}`
          : 'Reminder sent to all pending signatories';

        const activity = ndaActivityService.logActivity(
          action.payload.ndaId,
          'REMINDED',
          description,
          'Current User',
          'user-001'
        );
        state.activities.unshift(activity);
      }
    },

    // Delete NDA
    deleteNDA: (state, action: PayloadAction<string>) => {
      const success = ndaService.delete(action.payload);
      if (success) {
        state.ndas = state.ndas.filter((n) => n.id !== action.payload);

        // Also clean up activities for this NDA
        const ndaActivities = state.activities.filter((a) => a.ndaId === action.payload);
        ndaActivities.forEach((a) => ndaActivityService.delete(a.id));
        state.activities = state.activities.filter((a) => a.ndaId !== action.payload);
      }
    },

    // Template management
    createTemplate: (
      state,
      action: PayloadAction<Omit<NDATemplate, 'id' | 'isActive' | 'usageCount' | 'createdAt' | 'updatedAt' | 'createdBy'>>
    ) => {
      const newTemplate = ndaTemplateService.create({
        ...action.payload,
        isActive: true,
        usageCount: 0,
        createdBy: 'user-001',
      });
      state.templates.push(newTemplate);
    },

    updateTemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        updates: Partial<NDATemplate>;
      }>
    ) => {
      const updated = ndaTemplateService.update(action.payload.templateId, action.payload.updates);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload.templateId);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    deleteTemplate: (state, action: PayloadAction<string>) => {
      const success = ndaTemplateService.delete(action.payload);
      if (success) {
        state.templates = state.templates.filter((t) => t.id !== action.payload);
      }
    },

    toggleTemplateActive: (state, action: PayloadAction<string>) => {
      const updated = ndaTemplateService.toggleActive(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    incrementTemplateUsage: (state, action: PayloadAction<string>) => {
      const updated = ndaTemplateService.incrementUsage(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    // Clear all NDA data
    clearAllNDAs: (state) => {
      ndaService.clear();
      ndaTemplateService.clear();
      ndaActivityService.clear();
      state.ndas = [];
      state.templates = [];
      state.activities = [];
    },
  },
});

export const {
  loadNDAs,
  loadTemplates,
  loadActivities,
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
  toggleTemplateActive,
  incrementTemplateUsage,
  clearAllNDAs,
} = ndaSlice.actions;

export default ndaSlice.reducer;
