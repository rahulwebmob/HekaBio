/**
 * SavedFilters Component
 * Manage saved filter sets for quick access
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconDeviceFloppy,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconFilter,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import type { RootState } from '../../../app/store';
import {
  saveSavedFilter,
  loadSavedFilter,
  deleteSavedFilter,
  setDefaultSavedFilter,
} from '../../../store/slices/projectsSlice';
import type { SavedFilter } from '../../../types/project.types';

interface SavedFiltersProps {
  onClose?: () => void;
}

export default function SavedFilters({ onClose }: SavedFiltersProps) {
  const dispatch = useDispatch();
  const { savedFilters, currentSavedFilterId, filters } = useSelector(
    (state: RootState) => state.projects
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [isCreating, setIsCreating] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [newFilterDescription, setNewFilterDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSaveCurrentFilter = () => {
    if (!newFilterName.trim() || !user) return;

    const newFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name: newFilterName.trim(),
      description: newFilterDescription.trim() || undefined,
      filters: filters,
      isPublic: isPublic,
      isDefault: false,
      createdBy: user.id,
      createdByName: user.fullName,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    dispatch(saveSavedFilter(newFilter));
    setIsCreating(false);
    setNewFilterName('');
    setNewFilterDescription('');
    setIsPublic(false);
  };

  const handleLoadFilter = (filterId: string) => {
    dispatch(loadSavedFilter(filterId));
    if (onClose) onClose();
  };

  const handleDeleteFilter = (filterId: string) => {
    if (window.confirm('Are you sure you want to delete this saved filter?')) {
      dispatch(deleteSavedFilter(filterId));
    }
  };

  const handleSetDefault = (filterId: string) => {
    dispatch(setDefaultSavedFilter(filterId));
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFilter className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Saved Filters</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IconX className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Save Current Filter Section */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {!isCreating ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Current filters are active</p>
                  <p className="text-xs text-blue-700 mt-1">Save them for quick access later</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <IconDeviceFloppy className="w-4 h-4" />
                  Save Current Filter
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter Name *
                  </label>
                  <input
                    type="text"
                    value={newFilterName}
                    onChange={(e) => setNewFilterName(e.target.value)}
                    placeholder="e.g., My High Priority Projects"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={newFilterDescription}
                    onChange={(e) => setNewFilterDescription(e.target.value)}
                    placeholder="Brief description of this filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Share with team (public filter)
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCurrentFilter}
                    disabled={!newFilterName.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconCheck className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewFilterName('');
                      setNewFilterDescription('');
                      setIsPublic(false);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved Filters List */}
        <div className="space-y-3">
          {savedFilters.length === 0 ? (
            <div className="text-center py-12">
              <IconFilter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No saved filters yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Apply filters and save them for quick access
              </p>
            </div>
          ) : (
            savedFilters.map((filter: SavedFilter) => {
              const isActive = filter.id === currentSavedFilterId;
              const isOwner = user?.id === filter.createdBy;

              return (
                <div
                  key={filter.id}
                  className={`p-4 border rounded-lg transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => handleLoadFilter(filter.id)}
                          className="text-left group"
                        >
                          <h3
                            className={`font-medium group-hover:text-blue-600 transition-colors ${
                              isActive ? 'text-blue-600' : 'text-gray-900'
                            }`}
                          >
                            {filter.name}
                          </h3>
                        </button>
                        {filter.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <IconStarFilled className="w-3 h-3" />
                            Default
                          </span>
                        )}
                        {filter.isPublic && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Public
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      {filter.description && (
                        <p className="text-sm text-gray-600 mb-2">{filter.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Created by {filter.createdByName}</span>
                        {filter.usageCount !== undefined && filter.usageCount > 0 && (
                          <span>Used {filter.usageCount} times</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-3">
                      {isOwner && !filter.isDefault && (
                        <button
                          onClick={() => handleSetDefault(filter.id)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Set as default"
                        >
                          <IconStar className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteFilter(filter.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete filter"
                        >
                          <IconTrash className="w-4 h-4 text-red-400 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          Saved filters are stored locally and persist across sessions.
          {savedFilters.some((f: SavedFilter) => f.isDefault) && (
            <> Your default filter will be loaded automatically on page load.</>
          )}
        </p>
      </div>
    </div>
  );
}
