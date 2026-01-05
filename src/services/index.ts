/**
 * Services Index
 *
 * Central export for all services
 */

// Core services
export * from './localStorage.service';
export * from './baseCRUD.service';

// Entity services
export * from './company.service';
export * from './contact.service';
export * from './project.service';
export * from './savedFilter.service';
export * from './surveyTemplate.service';
export * from './surveyInstance.service';
export * from './opportunity.service';
export * from './screening.service';

// Feature services
export * from './aiExtraction.service';
export * from './extractionService';
export * from './japanMarketAnalysis.service';
export * from './taskAssignmentService';
export * from './taskAutomationService';
export * from './automationEngine.service';

// Due Diligence services
export * from './ddWorkspace.service';
export * from './ddTemplate.service';
export * from './ddActivity.service';

// NDA services
export * from './nda.service';
export * from './ndaTemplate.service';
export * from './ndaActivity.service';

// Contract services
export * from './contract.service';
export * from './contractTemplate.service';
export * from './contractActivity.service';

// Task service
export * from './task.service';
