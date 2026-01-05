/**
 * LocalStorage Middleware
 *
 * Automatically saves Redux state to localStorage when specific actions are dispatched
 */

import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Actions that should trigger localStorage save
const SAVE_ACTIONS = [
  // Address Book
  'addressBook/addCompany',
  'addressBook/updateCompany',
  'addressBook/deleteCompany',
  'addressBook/addContact',
  'addressBook/updateContact',
  'addressBook/deleteContact',

  // Projects
  'projects/addProject',
  'projects/updateProject',
  'projects/deleteProject',
  'projects/moveToStage',
  'projects/updateScore',

  // Surveys
  'surveys/addSurveyTemplate',
  'surveys/updateSurveyTemplate',
  'surveys/deleteSurveyTemplate',
  'surveys/addSurveyInstance',
  'surveys/updateSurveyInstance',
  'surveys/submitSurvey',

  // Opportunities
  'opportunities/addOpportunity',
  'opportunities/updateOpportunity',
  'opportunities/deleteOpportunity',
  'opportunities/updateQuickAssessment',
  'opportunities/recordGoNoGoDecision',

  // Screenings
  'screenings/addScreening',
  'screenings/updateScreening',
  'screenings/deleteScreening',

  // Pipeline
  'pipeline/addOpportunity',
  'pipeline/updateOpportunity',
  'pipeline/deleteOpportunity',
  'pipeline/moveToStage',

  // Tasks
  'tasks/addTask',
  'tasks/updateTask',
  'tasks/deleteTask',
  'tasks/toggleTaskComplete',

  // Calendar
  'calendar/addEvent',
  'calendar/updateEvent',
  'calendar/deleteEvent',

  // Communications
  'communications/addCommunication',
  'communications/updateCommunication',
  'communications/deleteCommunication',
  'communications/markAsRead',

  // Documents
  'documents/addDocument',
  'documents/updateDocument',
  'documents/deleteDocument',

  // NDA
  'nda/addNDA',
  'nda/updateNDA',
  'nda/deleteNDA',
  'nda/updateSignatory',

  // Contracts
  'contract/addContract',
  'contract/updateContract',
  'contract/deleteContract',

  // Due Diligence
  'dd/createWorkspace',
  'dd/updateWorkspace',
  'dd/deleteWorkspace',
  'dd/addDDItem',
  'dd/updateDDItem',

  // Gates
  'gate/submitGateReview',
  'gate/updateGateReview',

  // Notifications
  'notifications/addNotification',
  'notifications/markAsRead',
  'notifications/markAllAsRead',
  'notifications/deleteNotification',

  // Automation
  'automation/addRule',
  'automation/updateRule',
  'automation/deleteRule',
  'automation/toggleRule',

  // Email Templates
  'emailTemplates/addTemplate',
  'emailTemplates/updateTemplate',
  'emailTemplates/deleteTemplate',

  // User Preferences
  'userPreferences/updatePreferences',
];

// Debounce timer
let saveTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 500; // Wait 500ms after last action before saving

export const localStorageMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Check if this action should trigger save
    if (action.type && SAVE_ACTIONS.some((pattern) => action.type.startsWith(pattern))) {
      // Clear existing timer
      if (saveTimer) {
        clearTimeout(saveTimer);
      }

      // Set new timer to save after debounce period
      saveTimer = setTimeout(() => {
        const state = store.getState();

        // Save state slices to localStorage
        // This will be handled by individual services
        // For now, just log
        console.log('[LocalStorage Middleware] State save triggered by:', action.type);
      }, DEBOUNCE_MS);
    }

    return result;
  };
