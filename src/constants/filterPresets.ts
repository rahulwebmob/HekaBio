/**
 * Filter Presets for Projects
 * Pre-defined quick filters for common use cases
 */

import type { FilterPreset, ProjectFilters } from '../types/project.types';

// Define all filter presets
export const FILTER_PRESETS: FilterPreset[] = [
  {
    type: 'HOT_PROSPECTS',
    name: 'Hot Prospects',
    description: 'High-scoring projects (70+) with strong potential',
    icon: 'IconFlame',
    badgeColor: 'text-red-600 bg-red-50',
    filters: {
      scoreMin: 70,
      isHot: true,
    } as ProjectFilters,
  },
  {
    type: 'JAPAN_HIGH_FIT',
    name: 'Japan High Fit',
    description: 'Projects with high Japan market fit',
    icon: 'IconMapPin',
    badgeColor: 'text-purple-600 bg-purple-50',
    filters: {
      japanInterest: true,
      japanMarketFit: ['HIGH'],
    } as ProjectFilters,
  },
  {
    type: 'STALLED_PROJECTS',
    name: 'Stalled Projects',
    description: 'Projects with no activity for 30+ days',
    icon: 'IconAlertTriangle',
    badgeColor: 'text-orange-600 bg-orange-50',
    filters: {
      isStalled: true,
    } as ProjectFilters,
  },
  {
    type: 'PENDING_NDA',
    name: 'Pending NDA',
    description: 'Projects awaiting NDA completion',
    icon: 'IconShieldCheck',
    badgeColor: 'text-blue-600 bg-blue-50',
    filters: {
      stages: ['NDA'],
      ndaStatus: ['REQUESTED', 'IN_PROGRESS'],
    } as ProjectFilters,
  },
  {
    type: 'IN_DD',
    name: 'In Due Diligence',
    description: 'Projects currently in DD phase',
    icon: 'IconClipboardCheck',
    badgeColor: 'text-indigo-600 bg-indigo-50',
    filters: {
      stages: ['DUE_DILIGENCE'],
    } as ProjectFilters,
  },
  {
    type: 'AWAITING_CONTRACT',
    name: 'Awaiting Contract',
    description: 'Projects in contract decision phase',
    icon: 'IconContract',
    badgeColor: 'text-green-600 bg-green-50',
    filters: {
      stages: ['CONTRACT_DECISION', 'CONTRACT_DECISION_FINDERS'],
    } as ProjectFilters,
  },
  {
    type: 'GATE_1_PENDING',
    name: 'Gate 1 Pending',
    description: 'Projects awaiting Gate 1 approval',
    icon: 'IconGate',
    badgeColor: 'text-cyan-600 bg-cyan-50',
    filters: {
      stages: ['SURVEY_1', 'DATA_ANALYSIS'],
      gate1Status: ['PENDING'],
    } as ProjectFilters,
  },
  {
    type: 'GATE_2_PENDING',
    name: 'Gate 2 Pending',
    description: 'Projects awaiting Gate 2 approval',
    icon: 'IconGate',
    badgeColor: 'text-teal-600 bg-teal-50',
    filters: {
      stages: ['SURVEY_2'],
      gate2Status: ['PENDING'],
    } as ProjectFilters,
  },
  {
    type: 'GATE_3_PENDING',
    name: 'Gate 3 Pending',
    description: 'Projects awaiting Gate 3 approval',
    icon: 'IconGate',
    badgeColor: 'text-emerald-600 bg-emerald-50',
    filters: {
      stages: ['JAPAN_EARLY_ASSESSMENT', 'SURVEY_3'],
      gate3Status: ['PENDING'],
    } as ProjectFilters,
  },
];

// Helper function to get preset by type
export function getFilterPreset(type: string): FilterPreset | undefined {
  return FILTER_PRESETS.find((preset) => preset.type === type);
}

// Helper function to get preset filters
export function getPresetFilters(type: string): ProjectFilters {
  const preset = getFilterPreset(type);
  return preset ? preset.filters : {};
}
