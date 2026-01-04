/**
 * Documents Slice
 * Redux state management for document repository
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Document,
  DocumentStatus,
  DocumentCategory,
  DocumentComment,
} from '../../types/document.types';
import { mockDocuments } from '../../data/mockDocuments';

interface DocumentsState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  documents: mockDocuments,
  isLoading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    // Add new document
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
    },

    // Update document
    updateDocument: (
      state,
      action: PayloadAction<{ documentId: string; updates: Partial<Document> }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        Object.assign(document, action.payload.updates);
        document.updatedAt = new Date().toISOString();
      }
    },

    // Delete document
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload);
    },

    // Update document status
    updateDocumentStatus: (
      state,
      action: PayloadAction<{ documentId: string; status: DocumentStatus }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.status = action.payload.status;
        document.updatedAt = new Date().toISOString();
      }
    },

    // Approve document
    approveDocument: (
      state,
      action: PayloadAction<{ documentId: string; approvedBy: string; approvedByName: string }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.status = 'APPROVED';
        document.approvedBy = action.payload.approvedBy;
        document.approvedByName = action.payload.approvedByName;
        document.approvedAt = new Date().toISOString();
        document.updatedAt = new Date().toISOString();
      }
    },

    // Reject document
    rejectDocument: (
      state,
      action: PayloadAction<{
        documentId: string;
        rejectedBy: string;
        rejectedByName: string;
        reason: string;
      }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.status = 'REJECTED';
        document.rejectedBy = action.payload.rejectedBy;
        document.rejectedByName = action.payload.rejectedByName;
        document.rejectionReason = action.payload.reason;
        document.rejectedAt = new Date().toISOString();
        document.updatedAt = new Date().toISOString();
      }
    },

    // Archive document
    archiveDocument: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((doc) => doc.id === action.payload);
      if (document) {
        document.status = 'ARCHIVED';
        document.updatedAt = new Date().toISOString();
      }
    },

    // Add document version
    addDocumentVersion: (
      state,
      action: PayloadAction<{ documentId: string; version: Document['versions'][0] }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        // Mark all previous versions as not current
        document.versions.forEach((v) => (v.isCurrent = false));

        // Add new version
        document.versions.push(action.payload.version);
        document.currentVersion = action.payload.version.versionNumber;
        document.fileUrl = action.payload.version.fileUrl;
        document.fileSize = action.payload.version.fileSize;
        document.updatedAt = new Date().toISOString();
      }
    },

    // Restore document version
    restoreDocumentVersion: (
      state,
      action: PayloadAction<{ documentId: string; versionId: string }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        const version = document.versions.find((v) => v.id === action.payload.versionId);
        if (version) {
          // Mark all versions as not current
          document.versions.forEach((v) => (v.isCurrent = false));

          // Mark selected version as current
          version.isCurrent = true;
          document.currentVersion = version.versionNumber;
          document.fileUrl = version.fileUrl;
          document.fileSize = version.fileSize;
          document.updatedAt = new Date().toISOString();
        }
      }
    },

    // Add comment
    addComment: (
      state,
      action: PayloadAction<{ documentId: string; comment: DocumentComment }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.comments.push(action.payload.comment);
        document.updatedAt = new Date().toISOString();
      }
    },

    // Update comment
    updateComment: (
      state,
      action: PayloadAction<{ documentId: string; commentId: string; content: string }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        const comment = document.comments.find((c) => c.id === action.payload.commentId);
        if (comment) {
          comment.content = action.payload.content;
          comment.updatedAt = new Date().toISOString();
        }
      }
    },

    // Delete comment
    deleteComment: (state, action: PayloadAction<{ documentId: string; commentId: string }>) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.comments = document.comments.filter((c) => c.id !== action.payload.commentId);
      }
    },

    // Increment view count
    incrementViewCount: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((doc) => doc.id === action.payload);
      if (document) {
        document.viewCount += 1;
        document.lastViewedAt = new Date().toISOString();
      }
    },

    // Increment download count
    incrementDownloadCount: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((doc) => doc.id === action.payload);
      if (document) {
        document.downloadCount += 1;
        document.lastDownloadedAt = new Date().toISOString();
      }
    },

    // Update tags
    updateTags: (state, action: PayloadAction<{ documentId: string; tags: string[] }>) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.tags = action.payload.tags;
        document.updatedAt = new Date().toISOString();
      }
    },

    // Update category
    updateCategory: (
      state,
      action: PayloadAction<{ documentId: string; category: DocumentCategory }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.category = action.payload.category;
        document.updatedAt = new Date().toISOString();
      }
    },

    // Add permission
    addPermission: (
      state,
      action: PayloadAction<{ documentId: string; permission: Document['permissions'][0] }>
    ) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.permissions.push(action.payload.permission);
        document.updatedAt = new Date().toISOString();
      }
    },

    // Remove permission
    removePermission: (state, action: PayloadAction<{ documentId: string; userId: string }>) => {
      const document = state.documents.find((doc) => doc.id === action.payload.documentId);
      if (document) {
        document.permissions = document.permissions.filter(
          (p) => p.userId !== action.payload.userId
        );
        document.updatedAt = new Date().toISOString();
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addDocument,
  updateDocument,
  deleteDocument,
  updateDocumentStatus,
  approveDocument,
  rejectDocument,
  archiveDocument,
  addDocumentVersion,
  restoreDocumentVersion,
  addComment,
  updateComment,
  deleteComment,
  incrementViewCount,
  incrementDownloadCount,
  updateTags,
  updateCategory,
  addPermission,
  removePermission,
  setLoading,
  setError,
} = documentsSlice.actions;

export default documentsSlice.reducer;
