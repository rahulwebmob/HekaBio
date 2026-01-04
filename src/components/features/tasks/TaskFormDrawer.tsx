/**
 * Task Form Drawer
 * For creating and editing tasks
 */

import { useState, useEffect } from 'react';

import { IconTemplate, IconUserPlus } from '@tabler/icons-react';
import { useAppDispatch } from '../../../app/store';
import { addTask, updateTask } from '../../../store/slices/tasksSlice';
import { Drawer, Input, Select, Button, Card } from '../../ui';
import type { Task, TaskType, TaskStatus, TaskPriority } from '../../../types/task.types';
import { TASK_TEMPLATES, getTaskTemplate } from '../../../data/taskTemplates';
import { getAllUsers, autoAssignTask } from '../../../services/taskAssignmentService';

interface TaskFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskFormDrawer({ isOpen, onClose, task }: TaskFormDrawerProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'GENERAL' as TaskType,
    status: 'TODO' as TaskStatus,
    priority: 'MEDIUM' as TaskPriority,
    assignedTo: 'user-001',
    dueDate: '',
    estimatedHours: '',
    progress: 0,
    tags: [] as string[],
    notes: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const allUsers = getAllUsers();

  // Populate form when editing
  useEffect(() => {
    if (task && isOpen) {
      setFormData({
        title: task.title,
        description: task.description || '',
        type: task.type,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours?.toString() || '',
        progress: task.progress,
        tags: task.tags,
        notes: task.notes || '',
      });
    } else if (!isOpen) {
      // Reset form when drawer closes
      setFormData({
        title: '',
        description: '',
        type: 'GENERAL',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: 'user-001',
        dueDate: '',
        estimatedHours: '',
        progress: 0,
        tags: [],
        notes: '',
      });
      setTagInput('');
      setErrors({});
      setSelectedTemplateId('');
    }
  }, [task, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    if (!templateId) {
      setSelectedTemplateId('');
      return;
    }

    const template = getTaskTemplate(templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      setFormData({
        title: template.name,
        description: template.description,
        type: template.type,
        status: 'TODO',
        priority: template.priority,
        assignedTo: formData.assignedTo,
        dueDate: '',
        estimatedHours: template.estimatedHours?.toString() || '',
        progress: 0,
        tags: [...template.tags],
        notes: template.checklist
          ? `Checklist:\n${template.checklist.map((item, idx) => `${idx + 1}. [ ] ${item.text}`).join('\n')}`
          : '',
      });
    }
  };

  const handleAutoAssign = () => {
    const assignedUser = autoAssignTask({
      taskType: formData.type,
    });
    setFormData((prev) => ({
      ...prev,
      assignedTo: assignedUser.userId,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && task) {
      // Update existing task
      const updatedTask: Task = {
        ...task,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        progress: formData.progress,
        tags: formData.tags,
        notes: formData.notes,
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateTask(updatedTask));
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        assignedBy: 'user-001',
        assignedAt: new Date().toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        progress: formData.progress,
        tags: formData.tags,
        notes: formData.notes,
        reminderSent: false,
        isRecurring: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTask(newTask));
    }

    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'New Task'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Template Selector - Only show when creating new task */}
        {!isEdit && (
          <Card padding="md">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100">
                <IconTemplate size={20} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start from Template (Optional)
                </label>
                <Select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  options={[
                    { value: '', label: 'Start from scratch' },
                    ...TASK_TEMPLATES.map((template) => ({
                      value: template.id,
                      label: `${template.name} - ${template.category}`,
                    })),
                  ]}
                  fullWidth
                />
                {selectedTemplateId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Template applied. You can still customize the fields below.
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title <span className="text-error-600">*</span>
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter task title"
            fullWidth
            error={errors.title}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter task description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Type, Status, Priority - Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={[
                { value: 'GENERAL', label: 'General' },
                { value: 'FOLLOW_UP', label: 'Follow Up' },
                { value: 'CALL', label: 'Call' },
                { value: 'MEETING', label: 'Meeting' },
                { value: 'REVIEW', label: 'Review' },
                { value: 'RESEARCH', label: 'Research' },
              ]}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={[
                { value: 'TODO', label: 'To Do' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'BLOCKED', label: 'Blocked' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <Select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Assigned To - Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            <Select
              value={formData.assignedTo}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              options={allUsers.map((user) => ({
                value: user.userId,
                label: `${user.userName} (${user.userRole})`,
              }))}
              fullWidth
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Assign</label>
            <Button
              variant="secondary"
              onClick={handleAutoAssign}
              leftIcon={<IconUserPlus size={18} />}
              fullWidth
            >
              Auto-Assign by Role
            </Button>
          </div>
        </div>

        {/* Due Date and Estimated Hours - Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
            <Input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
              placeholder="0"
              min="0"
              step="0.5"
              fullWidth
            />
          </div>
        </div>

        {/* Progress Slider */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress: {formData.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => handleInputChange('progress', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tag and press Enter"
              fullWidth
            />
            <Button variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-brand-900 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Add any additional notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>
      </div>
    </Drawer>
  );
}
