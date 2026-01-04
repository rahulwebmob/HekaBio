/**
 * Extraction Redux Slice
 * Manages AI data extraction and gap analysis state
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ExtractionResult,
  ExtractedField,
  GapAnalysisResult,
} from '../../types/extraction.types';

interface ExtractionState {
  extractions: ExtractionResult[];
  gapAnalyses: GapAnalysisResult[];
}

const initialState: ExtractionState = {
  extractions: [],
  gapAnalyses: [],
};

const extractionSlice = createSlice({
  name: 'extraction',
  initialState,
  reducers: {
    // Add extraction result
    addExtraction: (state, action: PayloadAction<ExtractionResult>) => {
      state.extractions.push(action.payload);
    },

    // Update extraction status
    updateExtractionStatus: (
      state,
      action: PayloadAction<{ id: string; status: ExtractionResult['status']; error?: string }>
    ) => {
      const extraction = state.extractions.find((e) => e.id === action.payload.id);
      if (extraction) {
        extraction.status = action.payload.status;
        if (action.payload.error) {
          extraction.processingError = action.payload.error;
        }
      }
    },

    // Update extracted field
    updateExtractedField: (
      state,
      action: PayloadAction<{
        extractionId: string;
        fieldName: string;
        updates: Partial<ExtractedField>;
      }>
    ) => {
      const extraction = state.extractions.find((e) => e.id === action.payload.extractionId);
      if (extraction) {
        const field = extraction.extractedFields.find(
          (f) => f.fieldName === action.payload.fieldName
        );
        if (field) {
          Object.assign(field, action.payload.updates);
        }
      }
    },

    // Verify field
    // editedValue is intentionally flexible for dynamic extraction data
    verifyField: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: PayloadAction<{ extractionId: string; fieldName: string; editedValue?: any }>
    ) => {
      const extraction = state.extractions.find((e) => e.id === action.payload.extractionId);
      if (extraction) {
        const field = extraction.extractedFields.find(
          (f) => f.fieldName === action.payload.fieldName
        );
        if (field) {
          field.isVerified = true;
          if (action.payload.editedValue !== undefined) {
            field.editedValue = action.payload.editedValue;
          }
        }
      }
    },

    // Verify all fields
    verifyAllFields: (state, action: PayloadAction<string>) => {
      const extraction = state.extractions.find((e) => e.id === action.payload);
      if (extraction) {
        extraction.extractedFields.forEach((field) => {
          field.isVerified = true;
        });
        extraction.status = 'VERIFIED';
      }
    },

    // Add gap analysis
    addGapAnalysis: (state, action: PayloadAction<GapAnalysisResult>) => {
      // Remove existing gap analysis for the project
      state.gapAnalyses = state.gapAnalyses.filter((g) => g.projectId !== action.payload.projectId);
      state.gapAnalyses.push(action.payload);
    },

    // Delete extraction
    deleteExtraction: (state, action: PayloadAction<string>) => {
      state.extractions = state.extractions.filter((e) => e.id !== action.payload);
    },
  },
});

export const {
  addExtraction,
  updateExtractionStatus,
  updateExtractedField,
  verifyField,
  verifyAllFields,
  addGapAnalysis,
  deleteExtraction,
} = extractionSlice.actions;

export default extractionSlice.reducer;
