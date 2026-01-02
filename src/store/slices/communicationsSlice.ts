/**
 * Communications Redux Slice
 * State management for communications and email tracking
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Communication, EmailTemplate, CommunicationStatus } from '../../types/communication.types';
import { mockCommunications, mockEmailTemplates } from '../../data/mockCommunications';

interface CommunicationsState {
  communications: Communication[];
  templates: EmailTemplate[];
}

const initialState: CommunicationsState = {
  communications: mockCommunications,
  templates: mockEmailTemplates,
};

const communicationsSlice = createSlice({
  name: 'communications',
  initialState,
  reducers: {
    // ===== Communication Management =====
    addCommunication: (state, action: PayloadAction<Communication>) => {
      state.communications.push(action.payload);
    },
    updateCommunication: (state, action: PayloadAction<Communication>) => {
      const index = state.communications.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.communications[index] = action.payload;
      }
    },
    deleteCommunication: (state, action: PayloadAction<string>) => {
      state.communications = state.communications.filter((c) => c.id !== action.payload);
    },

    // ===== Status Updates =====
    updateCommunicationStatus: (
      state,
      action: PayloadAction<{ communicationId: string; status: CommunicationStatus }>
    ) => {
      const communication = state.communications.find((c) => c.id === action.payload.communicationId);
      if (communication) {
        communication.status = action.payload.status;
        communication.updatedAt = new Date().toISOString();

        const now = new Date().toISOString();
        if (action.payload.status === 'DELIVERED' && !communication.deliveredAt) {
          communication.deliveredAt = now;
        } else if (action.payload.status === 'READ' && !communication.readAt) {
          communication.readAt = now;
        } else if (action.payload.status === 'REPLIED' && !communication.repliedAt) {
          communication.repliedAt = now;
        }
      }
    },

    // ===== Follow-Up Management =====
    toggleFollowUp: (
      state,
      action: PayloadAction<{ communicationId: string; followUpDate?: string }>
    ) => {
      const communication = state.communications.find((c) => c.id === action.payload.communicationId);
      if (communication) {
        communication.needsFollowUp = !communication.needsFollowUp;
        communication.followUpDate = action.payload.followUpDate;
        communication.updatedAt = new Date().toISOString();
      }
    },

    completeFollowUp: (state, action: PayloadAction<string>) => {
      const communication = state.communications.find((c) => c.id === action.payload);
      if (communication) {
        communication.followUpCompleted = true;
        communication.needsFollowUp = false;
        communication.updatedAt = new Date().toISOString();
      }
    },

    // ===== Archive & Pin =====
    toggleArchive: (state, action: PayloadAction<string>) => {
      const communication = state.communications.find((c) => c.id === action.payload);
      if (communication) {
        communication.isArchived = !communication.isArchived;
        communication.updatedAt = new Date().toISOString();
      }
    },

    togglePin: (state, action: PayloadAction<string>) => {
      const communication = state.communications.find((c) => c.id === action.payload);
      if (communication) {
        communication.isPinned = !communication.isPinned;
        communication.updatedAt = new Date().toISOString();
      }
    },

    // ===== Email Template Management =====
    addTemplate: (state, action: PayloadAction<EmailTemplate>) => {
      state.templates.push(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<EmailTemplate>) => {
      const index = state.templates.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
    toggleTemplateActive: (state, action: PayloadAction<string>) => {
      const template = state.templates.find((t) => t.id === action.payload);
      if (template) {
        template.isActive = !template.isActive;
      }
    },
  },
});

export const {
  addCommunication,
  updateCommunication,
  deleteCommunication,
  updateCommunicationStatus,
  toggleFollowUp,
  completeFollowUp,
  toggleArchive,
  togglePin,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateActive,
} = communicationsSlice.actions;

export default communicationsSlice.reducer;
