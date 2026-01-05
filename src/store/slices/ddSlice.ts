/**
 * Due Diligence Redux Slice
 * Manages DD workspace state
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  DDWorkspace,
  DDSection,
  DDItem,
  DDDocument,
  DDActivity,
  DDTemplate,
  DDSectionType,
} from '../../types/dd.types';
import { ddWorkspaceService } from '../../services/ddWorkspace.service';
import { ddTemplateService } from '../../services/ddTemplate.service';
import { ddActivityService } from '../../services/ddActivity.service';

interface DDState {
  workspaces: DDWorkspace[];
  templates: DDTemplate[];
  activities: DDActivity[];
}

const initialState: DDState = {
  workspaces: ddWorkspaceService.getAll(),
  templates: ddTemplateService.getAll(),
  activities: ddActivityService.getAll(),
};

const ddSlice = createSlice({
  name: 'dd',
  initialState,
  reducers: {
    // Load data
    loadWorkspaces: (state) => {
      state.workspaces = ddWorkspaceService.getAll();
    },
    loadTemplates: (state) => {
      state.templates = ddTemplateService.getAll();
    },
    loadActivities: (state) => {
      state.activities = ddActivityService.getAll();
    },

    // Create DD workspace
    createDDWorkspace: (
      state,
      action: PayloadAction<Omit<DDWorkspace, 'id' | 'createdAt' | 'updatedAt'>>
    ) => {
      const newWorkspace = ddWorkspaceService.create(action.payload);
      state.workspaces.push(newWorkspace);

      // Log activity
      const activity = ddActivityService.logActivity(
        newWorkspace.id,
        'CREATED',
        `DD Workspace created: ${newWorkspace.title}`,
        'user-001',
        'Current User'
      );
      state.activities.unshift(activity);
    },

    // Update DD workspace
    updateDDWorkspace: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        updates: Partial<DDWorkspace>;
      }>
    ) => {
      const updated = ddWorkspaceService.update(action.payload.workspaceId, action.payload.updates);
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Add DD section
    addDDSection: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        name: string;
        type: DDSectionType;
        description?: string;
      }>
    ) => {
      const updated = ddWorkspaceService.addSection(action.payload.workspaceId, {
        name: action.payload.name,
        type: action.payload.type,
        description: action.payload.description,
      });
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Update DD section
    updateDDSection: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        updates: Partial<DDSection>;
      }>
    ) => {
      const updated = ddWorkspaceService.updateSection(
        action.payload.workspaceId,
        action.payload.sectionId,
        action.payload.updates
      );
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Delete DD section
    deleteDDSection: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
      }>
    ) => {
      const updated = ddWorkspaceService.deleteSection(
        action.payload.workspaceId,
        action.payload.sectionId
      );
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Add DD item
    addDDItem: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        item: Omit<DDItem, 'id' | 'ddSectionId' | 'documents' | 'createdAt' | 'createdBy' | 'updatedAt'>;
      }>
    ) => {
      const updated = ddWorkspaceService.addItem(
        action.payload.workspaceId,
        action.payload.sectionId,
        action.payload.item
      );
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Update DD item
    updateDDItem: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        itemId: string;
        updates: Partial<DDItem>;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      const section = workspace?.sections.find((s) => s.id === action.payload.sectionId);
      const item = section?.items.find((i) => i.id === action.payload.itemId);
      const oldStatus = item?.status;

      const updated = ddWorkspaceService.updateItem(
        action.payload.workspaceId,
        action.payload.sectionId,
        action.payload.itemId,
        action.payload.updates
      );
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }

        // Log activity if status changed
        if (action.payload.updates.status && oldStatus !== action.payload.updates.status) {
          const activity = ddActivityService.logActivity(
            action.payload.workspaceId,
            'STATUS_CHANGED',
            `Item status changed: ${item?.question}`,
            'user-001',
            'Current User',
            {
              oldStatus,
              newStatus: action.payload.updates.status,
            },
            action.payload.sectionId,
            action.payload.itemId
          );
          state.activities.unshift(activity);
        }
      }
    },

    // Delete DD item
    deleteDDItem: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        itemId: string;
      }>
    ) => {
      const updated = ddWorkspaceService.deleteItem(
        action.payload.workspaceId,
        action.payload.sectionId,
        action.payload.itemId
      );
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Add document to DD item
    addDDDocument: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        itemId: string;
        document: Omit<DDDocument, 'id' | 'ddItemId' | 'uploadedAt' | 'uploadedBy'>;
      }>
    ) => {
      const updated = ddWorkspaceService.addDocument(
        action.payload.workspaceId,
        action.payload.sectionId,
        action.payload.itemId,
        action.payload.document
      );
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }

        // Log activity
        const activity = ddActivityService.logActivity(
          action.payload.workspaceId,
          'DOCUMENT_UPLOADED',
          `Document uploaded: ${action.payload.document.name}`,
          'user-001',
          'Current User',
          undefined,
          action.payload.sectionId,
          action.payload.itemId
        );
        state.activities.unshift(activity);
      }
    },

    // Delete DD workspace
    deleteDDWorkspace: (state, action: PayloadAction<string>) => {
      const success = ddWorkspaceService.delete(action.payload);
      if (success) {
        state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
        // Also clean up activities for this workspace
        const workspaceActivities = state.activities.filter((a) => a.ddWorkspaceId === action.payload);
        workspaceActivities.forEach((a) => ddActivityService.delete(a.id));
        state.activities = state.activities.filter((a) => a.ddWorkspaceId !== action.payload);
      }
    },

    // Approve workspace
    approveDDWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; approvedBy: string }>
    ) => {
      const updated = ddWorkspaceService.approve(action.payload.workspaceId, action.payload.approvedBy);
      if (updated) {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.workspaceId);
        if (index !== -1) {
          state.workspaces[index] = updated;
        }
      }
    },

    // Template management
    createDDTemplate: (
      state,
      action: PayloadAction<Omit<DDTemplate, 'id' | 'isActive' | 'usageCount' | 'createdAt' | 'updatedAt' | 'createdBy'>>
    ) => {
      const newTemplate = ddTemplateService.create({
        ...action.payload,
        isActive: true,
        usageCount: 0,
        createdBy: 'user-001',
      });
      state.templates.push(newTemplate);
    },

    updateDDTemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        updates: Partial<DDTemplate>;
      }>
    ) => {
      const updated = ddTemplateService.update(action.payload.templateId, action.payload.updates);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload.templateId);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    deleteDDTemplate: (state, action: PayloadAction<string>) => {
      const success = ddTemplateService.delete(action.payload);
      if (success) {
        state.templates = state.templates.filter((t) => t.id !== action.payload);
      }
    },

    toggleDDTemplateActive: (state, action: PayloadAction<string>) => {
      const updated = ddTemplateService.toggleActive(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    incrementTemplateUsage: (state, action: PayloadAction<string>) => {
      const updated = ddTemplateService.incrementUsage(action.payload);
      if (updated) {
        const index = state.templates.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.templates[index] = updated;
        }
      }
    },

    // Clear all
    clearAllDD: (state) => {
      ddWorkspaceService.clear();
      ddTemplateService.clear();
      ddActivityService.clear();
      state.workspaces = [];
      state.templates = [];
      state.activities = [];
    },
  },
});

export const {
  loadWorkspaces,
  loadTemplates,
  loadActivities,
  createDDWorkspace,
  updateDDWorkspace,
  addDDSection,
  updateDDSection,
  deleteDDSection,
  addDDItem,
  updateDDItem,
  deleteDDItem,
  addDDDocument,
  deleteDDWorkspace,
  approveDDWorkspace,
  createDDTemplate,
  updateDDTemplate,
  deleteDDTemplate,
  toggleDDTemplateActive,
  incrementTemplateUsage,
  clearAllDD,
} = ddSlice.actions;

export default ddSlice.reducer;
