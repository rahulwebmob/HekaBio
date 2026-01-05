/**
 * FilterPresets Component
 * Quick access to pre-defined filter combinations
 */

import { useDispatch } from 'react-redux';
import {
  IconFlame,
  IconMapPin,
  IconAlertTriangle,
  IconShieldCheck,
  IconClipboardCheck,
  IconContract,
  IconDoorEnter,
} from '@tabler/icons-react';
import { FILTER_PRESETS } from '../../../constants/filterPresets';
import { setFilters } from '../../../store/slices/projectsSlice';
import type { FilterPreset } from '../../../types/project.types';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  IconFlame,
  IconMapPin,
  IconAlertTriangle,
  IconShieldCheck,
  IconClipboardCheck,
  IconContract,
  IconGate: IconDoorEnter,
};

interface FilterPresetsProps {
  variant?: 'chips' | 'cards';
  onApplyPreset?: () => void;
}

export default function FilterPresets({ variant = 'chips', onApplyPreset }: FilterPresetsProps) {
  const dispatch = useDispatch();

  const handleApplyPreset = (preset: FilterPreset) => {
    dispatch(setFilters(preset.filters));
    if (onApplyPreset) onApplyPreset();
  };

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {FILTER_PRESETS.map((preset) => {
          const Icon = iconMap[preset.icon] || IconFlame;

          return (
            <button
              key={preset.type}
              onClick={() => handleApplyPreset(preset)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${preset.badgeColor || 'text-gray-600 bg-gray-100'}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Chips variant (default)
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_PRESETS.map((preset) => {
        const Icon = iconMap[preset.icon] || IconFlame;

        return (
          <button
            key={preset.type}
            onClick={() => handleApplyPreset(preset)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-md ${
              preset.badgeColor || 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            title={preset.description}
          >
            <Icon className="w-4 h-4" />
            {preset.name}
          </button>
        );
      })}
    </div>
  );
}
