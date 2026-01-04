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
import { calculateDDCompletion } from '../../types/dd.types';

interface DDState {
  workspaces: DDWorkspace[];
  templates: DDTemplate[];
  activities: DDActivity[];
}

const initialState: DDState = {
  workspaces: [],
  templates: [],
  activities: [],
};

const ddSlice = createSlice({
  name: 'dd',
  initialState,
  reducers: {
    // Create DD workspace
    createDDWorkspace: (
      state,
      action: PayloadAction<{
        projectId: string;
        projectName: string;
        companyId: string;
        companyName: string;
        title: string;
        description?: string;
      }>
    ) => {
      const now = new Date().toISOString();
      const newWorkspace: DDWorkspace = {
        id: `dd-${Date.now()}`,
        ...action.payload,
        status: 'NOT_STARTED',
        sections: [],
        overallCompletionPercentage: 0,
        totalItems: 0,
        completedItems: 0,
        blockedItems: 0,
        approvalRequired: true,
        createdAt: now,
        createdBy: 'user-001',
      };

      state.workspaces.push(newWorkspace);

      state.activities.push({
        id: `activity-${Date.now()}`,
        ddWorkspaceId: newWorkspace.id,
        type: 'CREATED',
        description: `DD Workspace created: ${action.payload.title}`,
        actorId: 'user-001',
        actorName: 'Current User',
        occurredAt: now,
      });
    },

    // Update DD workspace
    updateDDWorkspace: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        updates: Partial<Omit<DDWorkspace, 'id' | 'sections' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        Object.assign(workspace, action.payload.updates);
        workspace.updatedAt = new Date().toISOString();
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
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const now = new Date().toISOString();
        const newSection: DDSection = {
          id: `section-${Date.now()}-${Math.random()}`,
          ddWorkspaceId: action.payload.workspaceId,
          name: action.payload.name,
          type: action.payload.type,
          description: action.payload.description,
          items: [],
          completionPercentage: 0,
          totalItems: 0,
          completedItems: 0,
          blockedItems: 0,
          order: workspace.sections.length,
          createdAt: now,
          createdBy: 'user-001',
        };

        workspace.sections.push(newSection);
        workspace.updatedAt = now;
      }
    },

    // Update DD section
    updateDDSection: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        updates: Partial<Omit<DDSection, 'id' | 'items' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const section = workspace.sections.find((s) => s.id === action.payload.sectionId);
        if (section) {
          Object.assign(section, action.payload.updates);
          section.updatedAt = new Date().toISOString();
          workspace.updatedAt = new Date().toISOString();
        }
      }
    },

    // Add DD item
    addDDItem: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        item: Omit<DDItem, 'id' | 'ddSectionId' | 'documents' | 'createdAt' | 'createdBy'>;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const section = workspace.sections.find((s) => s.id === action.payload.sectionId);
        if (section) {
          const now = new Date().toISOString();
          const newItem: DDItem = {
            ...action.payload.item,
            id: `item-${Date.now()}-${Math.random()}`,
            ddSectionId: action.payload.sectionId,
            documents: [],
            order: section.items.length,
            createdAt: now,
            createdBy: 'user-001',
          };

          section.items.push(newItem);
          section.totalItems = section.items.length;
          section.completionPercentage = calculateDDCompletion(section.items);
          section.updatedAt = now;
          workspace.updatedAt = now;

          // Recalculate workspace totals
          workspace.totalItems = workspace.sections.reduce((sum, s) => sum + s.totalItems, 0);
          workspace.completedItems = workspace.sections.reduce(
            (sum, s) => sum + s.completedItems,
            0
          );
          workspace.overallCompletionPercentage = calculateDDCompletion(
            workspace.sections.flatMap((s) => s.items)
          );
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
        updates: Partial<Omit<DDItem, 'id' | 'ddSectionId' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const section = workspace.sections.find((s) => s.id === action.payload.sectionId);
        if (section) {
          const item = section.items.find((i) => i.id === action.payload.itemId);
          if (item) {
            const now = new Date().toISOString();
            const oldStatus = item.status;

            Object.assign(item, action.payload.updates);
            item.updatedAt = now;

            // Handle completion
            if (action.payload.updates.status === 'COMPLETED' && !item.completedAt) {
              item.completedAt = now;
              item.completedBy = 'user-001';
            }

            // Recalculate section stats
            section.completedItems = section.items.filter(
              (i) => i.status === 'COMPLETED' || i.status === 'NOT_APPLICABLE'
            ).length;
            section.blockedItems = section.items.filter((i) => i.status === 'BLOCKED').length;
            section.completionPercentage = calculateDDCompletion(section.items);
            section.updatedAt = now;

            // Recalculate workspace totals
            workspace.completedItems = workspace.sections.reduce(
              (sum, s) => sum + s.completedItems,
              0
            );
            workspace.blockedItems = workspace.sections.reduce((sum, s) => sum + s.blockedItems, 0);
            workspace.overallCompletionPercentage = calculateDDCompletion(
              workspace.sections.flatMap((s) => s.items)
            );
            workspace.updatedAt = now;

            // Log activity if status changed
            if (action.payload.updates.status && oldStatus !== action.payload.updates.status) {
              state.activities.push({
                id: `activity-${Date.now()}`,
                ddWorkspaceId: workspace.id,
                ddSectionId: section.id,
                ddItemId: item.id,
                type: 'STATUS_CHANGED',
                description: `Item status changed: ${item.question}`,
                actorId: 'user-001',
                actorName: 'Current User',
                occurredAt: now,
                metadata: {
                  oldStatus,
                  newStatus: action.payload.updates.status,
                },
              });
            }
          }
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
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const section = workspace.sections.find((s) => s.id === action.payload.sectionId);
        if (section) {
          const item = section.items.find((i) => i.id === action.payload.itemId);
          if (item) {
            const now = new Date().toISOString();
            const newDocument: DDDocument = {
              ...action.payload.document,
              id: `doc-${Date.now()}-${Math.random()}`,
              ddItemId: action.payload.itemId,
              uploadedAt: now,
              uploadedBy: 'user-001',
            };

            item.documents.push(newDocument);
            item.updatedAt = now;
            section.updatedAt = now;
            workspace.updatedAt = now;

            if (workspace.documentCount !== undefined) {
              workspace.documentCount += 1;
            }

            state.activities.push({
              id: `activity-${Date.now()}`,
              ddWorkspaceId: workspace.id,
              ddSectionId: section.id,
              ddItemId: item.id,
              type: 'DOCUMENT_UPLOADED',
              description: `Document uploaded: ${newDocument.name}`,
              actorId: 'user-001',
              actorName: 'Current User',
              occurredAt: now,
            });
          }
        }
      }
    },

    // Remove document from DD item
    removeDDDocument: (
      state,
      action: PayloadAction<{
        workspaceId: string;
        sectionId: string;
        itemId: string;
        documentId: string;
      }>
    ) => {
      const workspace = state.workspaces.find((w) => w.id === action.payload.workspaceId);
      if (workspace) {
        const section = workspace.sections.find((s) => s.id === action.payload.sectionId);
        if (section) {
          const item = section.items.find((i) => i.id === action.payload.itemId);
          if (item) {
            item.documents = item.documents.filter((d) => d.id !== action.payload.documentId);
            item.updatedAt = new Date().toISOString();
            section.updatedAt = new Date().toISOString();
            workspace.updatedAt = new Date().toISOString();

            if (workspace.documentCount !== undefined && workspace.documentCount > 0) {
              workspace.documentCount -= 1;
            }
          }
        }
      }
    },

    // Delete DD workspace
    deleteDDWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
      state.activities = state.activities.filter((a) => a.ddWorkspaceId !== action.payload);
    },

    // Template management
    createDDTemplate: (
      state,
      action: PayloadAction<
        Omit<DDTemplate, 'id' | 'isActive' | 'usageCount' | 'createdAt' | 'createdBy'>
      >
    ) => {
      const now = new Date().toISOString();
      const newTemplate: DDTemplate = {
        ...action.payload,
        id: `template-${Date.now()}`,
        isActive: true,
        usageCount: 0,
        createdAt: now,
        createdBy: 'user-001',
      };

      state.templates.push(newTemplate);
    },

    updateDDTemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        updates: Partial<Omit<DDTemplate, 'id' | 'createdAt' | 'createdBy'>>;
      }>
    ) => {
      const template = state.templates.find((t) => t.id === action.payload.templateId);
      if (template) {
        Object.assign(template, action.payload.updates);
        template.updatedAt = new Date().toISOString();
      }
    },

    deleteDDTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  createDDWorkspace,
  updateDDWorkspace,
  addDDSection,
  updateDDSection,
  addDDItem,
  updateDDItem,
  addDDDocument,
  removeDDDocument,
  deleteDDWorkspace,
  createDDTemplate,
  updateDDTemplate,
  deleteDDTemplate,
} = ddSlice.actions;

export default ddSlice.reducer;
