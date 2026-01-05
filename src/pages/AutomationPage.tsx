/**
 * Automation Page
 * Manage automation rules and view execution logs
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconSearch,
  IconBolt,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconClock,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { AppLayout } from '../components/layout';
import { Input, Button, Badge, Card } from '../components/ui';
import { toggleRuleStatus } from '../store/slices/automationSlice';
import { getTriggerTypeLabel, getActionTypeLabel } from '../types/automation.types';
import type { AutomationStatus } from '../types/automation.types';
import { mockAutomationRules } from '../data/mockAutomationRules';
import { setRules } from '../store/slices/automationSlice';
import { useEffect } from 'react';

export default function AutomationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rules = useAppSelector((state) => state.automation.rules);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AutomationStatus | 'ALL'>('ALL');

  // Load mock rules on mount
  useEffect(() => {
    if (rules.length === 0) {
      dispatch(setRules(mockAutomationRules));
    }
  }, [dispatch, rules.length]);

  // Stats
  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.isActive).length,
    totalExecutions: rules.reduce((sum, r) => sum + r.executionCount, 0),
    successRate:
      rules.reduce((sum, r) => sum + r.successCount, 0) /
        Math.max(1, rules.reduce((sum, r) => sum + r.executionCount, 0)) *
      100 || 0,
  };

  // Filter rules
  const filteredRules = rules.filter((rule) => {
    if (statusFilter !== 'ALL' && rule.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        rule.name.toLowerCase().includes(query) ||
        rule.description?.toLowerCase().includes(query) ||
        getTriggerTypeLabel(rule.trigger.type).toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadge = (status: AutomationStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'INACTIVE':
        return <Badge>Inactive</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge variant="error">Archived</Badge>;
    }
  };

  const handleToggleStatus = (ruleId: string) => {
    dispatch(toggleRuleStatus(ruleId));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
              <IconBolt size={32} className="text-brand-600" />
              Automation Rules
            </h1>
            <p className="text-gray-600 mt-1">
              Automate workflows with triggers, conditions, and actions
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<IconPlus size={18} />}
            onClick={() => navigate('/automation/new')}
          >
            New Rule
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Total Rules</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-success-600 mt-1">{stats.active}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Total Executions</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{stats.totalExecutions}</p>
          </Card>
          <Card padding="md" shadow="sm">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Math.round(stats.successRate)}%
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                leftIcon={<IconSearch size={18} />}
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AutomationStatus | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </Card>

        {/* Rules List */}
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <Card key={rule.id} padding="lg" shadow="sm" hover>
              <div className="flex items-start gap-4">
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggleStatus(rule.id)}
                  className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors ${
                    rule.isActive ? 'bg-success-500' : 'bg-gray-300'
                  }`}
                  disabled={rule.status === 'DRAFT' || rule.status === 'ARCHIVED'}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      rule.isActive ? 'translate-x-6' : 'translate-x-1'
                    } mt-0.5`}
                  />
                </button>

                {/* Rule Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                      {rule.description && (
                        <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                      )}
                    </div>
                    {getStatusBadge(rule.status)}
                  </div>

                  {/* Trigger & Actions */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <IconBolt size={16} className="text-brand-600" />
                      <span className="font-medium">Trigger:</span>
                      <span>{getTriggerTypeLabel(rule.trigger.type)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconClock size={16} className="text-gray-400" />
                      <span className="font-medium">Actions:</span>
                      <span>{rule.actions.length}</span>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rule.actions.map((action, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {action.order}. {getActionTypeLabel(action.type)}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <IconCheck size={14} className="text-success-600" />
                      <span>
                        {rule.successCount}/{rule.executionCount} successful
                      </span>
                    </div>
                    {rule.failureCount > 0 && (
                      <div className="flex items-center gap-1">
                        <IconX size={14} className="text-error-600" />
                        <span>{rule.failureCount} failed</span>
                      </div>
                    )}
                    {rule.lastExecutedAt && (
                      <div>
                        Last run: {new Date(rule.lastExecutedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconEdit size={16} />}
                    onClick={() => navigate(`/automation/${rule.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<IconTrash size={16} />}
                    onClick={() => {
                      if (confirm(`Delete rule "${rule.name}"?`)) {
                        // dispatch(deleteRule(rule.id));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredRules.length === 0 && (
            <Card padding="lg" shadow="sm">
              <div className="text-center py-12">
                <IconBolt size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No automation rules found</p>
                <Button
                  variant="primary"
                  leftIcon={<IconPlus size={18} />}
                  onClick={() => navigate('/automation/new')}
                  className="mt-4"
                >
                  Create Your First Rule
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
