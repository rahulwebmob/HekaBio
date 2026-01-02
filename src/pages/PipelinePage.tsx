/**
 * Pipeline Page
 * Visual kanban board for business development pipeline
 */

import { useState, useMemo } from 'react';
import {
  IconPlus,
  IconTrendingUp,
  IconCurrencyDollar,
  IconPercentage,
  IconClock,
  IconChartBar,
  IconFilter,
  IconBuilding,
} from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { moveOpportunityToStage } from '../store/slices/pipelineSlice';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button } from '../components/ui';
import type { PipelineStage, PipelineOpportunity } from '../types/pipeline.types';
import { PIPELINE_STAGE_CONFIG, getActiveStages } from '../types/pipeline.types';

export default function PipelinePage() {
  const dispatch = useAppDispatch();
  const opportunities = useAppSelector((state) => state.pipeline.opportunities);

  const [showClosedDeals, setShowClosedDeals] = useState(false);
  const [draggedOpportunity, setDraggedOpportunity] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  // Get stages to display
  const activeStages = getActiveStages();
  const stagesToShow = showClosedDeals
    ? [...activeStages, 'WON' as PipelineStage, 'LOST' as PipelineStage]
    : activeStages;

  // Group opportunities by stage
  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<PipelineStage, PipelineOpportunity[]> = {
      LEAD: [],
      QUALIFIED: [],
      PROPOSAL: [],
      NEGOTIATION: [],
      VERBAL_COMMIT: [],
      WON: [],
      LOST: [],
    };

    opportunities.forEach((opp) => {
      if (grouped[opp.stage]) {
        grouped[opp.stage].push(opp);
      }
    });

    return grouped;
  }, [opportunities]);

  // Calculate pipeline metrics
  const metrics = useMemo(() => {
    const activeOpps = opportunities.filter((opp) => opp.stage !== 'WON' && opp.stage !== 'LOST');
    const wonOpps = opportunities.filter((opp) => opp.stage === 'WON');
    const lostOpps = opportunities.filter((opp) => opp.stage === 'LOST');
    const closedOpps = wonOpps.length + lostOpps.length;

    const totalValue = activeOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);
    const weightedValue = activeOpps.reduce(
      (sum, opp) => sum + opp.estimatedValue * (opp.probability / 100),
      0
    );
    const wonValue = wonOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);

    return {
      activeCount: activeOpps.length,
      totalValue,
      weightedValue,
      wonCount: wonOpps.length,
      wonValue,
      winRate: closedOpps > 0 ? (wonOpps.length / closedOpps) * 100 : 0,
    };
  }, [opportunities]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageColor = (stage: PipelineStage) => {
    const config = PIPELINE_STAGE_CONFIG[stage];
    const colorMap: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-700 border-gray-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      green: 'bg-success-100 text-success-700 border-success-300',
      red: 'bg-error-100 text-error-700 border-error-300',
    };
    return colorMap[config.color] || colorMap.gray;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleDragStart = (e: React.DragEvent, opportunityId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('opportunityId', opportunityId);
    setDraggedOpportunity(opportunityId);

    // Set drag image
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedOpportunity(null);
    setDragOverStage(null);

    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the drop zone completely
    if (e.currentTarget === e.target) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    e.stopPropagation();

    const opportunityId = e.dataTransfer.getData('opportunityId');
    if (opportunityId) {
      const probability = PIPELINE_STAGE_CONFIG[targetStage].defaultProbability;
      dispatch(moveOpportunityToStage({ opportunityId, newStage: targetStage, probability }));
    }

    setDraggedOpportunity(null);
    setDragOverStage(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600 mt-1">
              Track opportunities through your business development funnel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<IconFilter size={16} />}
              onClick={() => setShowClosedDeals(!showClosedDeals)}
            >
              {showClosedDeals ? 'Hide' : 'Show'} Closed Deals
            </Button>
            <Button variant="primary" leftIcon={<IconPlus size={18} />}>
              New Opportunity
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeCount}</p>
              </div>
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <IconTrendingUp size={20} className="text-brand-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalValue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconCurrencyDollar size={20} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weighted Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(metrics.weightedValue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <IconPercentage size={20} className="text-purple-600" />
              </div>
            </div>
          </Card>

          <Card padding="md" shadow="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-success-600">
                  {metrics.winRate.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">{metrics.wonCount} deals won</p>
              </div>
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <IconChartBar size={20} className="text-success-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stagesToShow.map((stage) => {
              const stageConfig = PIPELINE_STAGE_CONFIG[stage];
              const stageOpps = opportunitiesByStage[stage] || [];
              const stageValue = stageOpps.reduce((sum, opp) => sum + opp.estimatedValue, 0);

              return (
                <div key={stage} className="w-80 flex-shrink-0">
                  {/* Stage Header */}
                  <div
                    className={`rounded-t-lg border-2 border-b-0 p-4 transition-all ${getStageColor(stage)} ${
                      dragOverStage === stage ? 'ring-2 ring-brand-500 ring-offset-2' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm uppercase tracking-wide">
                        {stageConfig.label}
                      </h3>
                      <Badge variant="default" size="sm">
                        {stageOpps.length}
                      </Badge>
                    </div>
                    <p className="text-xs font-medium">{formatCurrency(stageValue)}</p>
                  </div>

                  {/* Stage Cards Container */}
                  <div
                    className={`border-2 border-t-0 rounded-b-lg p-2 bg-gray-50 min-h-[500px] space-y-2 transition-all ${
                      dragOverStage === stage ? 'bg-brand-50 border-brand-400' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, stage)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage)}
                  >
                    {stageOpps.map((opp) => (
                      <Card
                        key={opp.id}
                        padding="sm"
                        shadow="sm"
                        className={`cursor-move hover:shadow-md transition-all bg-white ${
                          draggedOpportunity === opp.id ? 'opacity-50 scale-95' : 'opacity-100'
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, opp.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="space-y-2">
                          {/* Title and Priority */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
                              {opp.title}
                            </h4>
                            {opp.priority !== 'LOW' && (
                              <Badge variant={getPriorityColor(opp.priority)} size="sm">
                                {opp.priority}
                              </Badge>
                            )}
                          </div>

                          {/* Company */}
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <IconBuilding size={14} />
                            <span className="truncate">{opp.company.name}</span>
                          </div>

                          {/* Value and Probability */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-gray-700 font-medium">
                              <IconCurrencyDollar size={14} />
                              <span>{formatCurrency(opp.estimatedValue)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <IconPercentage size={14} />
                              <span>{opp.probability}%</span>
                            </div>
                          </div>

                          {/* Close Date */}
                          {opp.estimatedCloseDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <IconClock size={14} />
                              <span>
                                Close: {new Date(opp.estimatedCloseDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {/* Tags */}
                          {opp.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {opp.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                >
                                  {tag}
                                </span>
                              ))}
                              {opp.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{opp.tags.length - 2}</span>
                              )}
                            </div>
                          )}

                          {/* Win/Loss Info */}
                          {opp.outcome === 'WON' && opp.winReason && (
                            <div className="text-xs text-success-600 font-medium">
                              Won: {opp.winReason.replace(/_/g, ' ')}
                            </div>
                          )}
                          {opp.outcome === 'LOST' && opp.lossReason && (
                            <div className="text-xs text-error-600 font-medium">
                              Lost: {opp.lossReason.replace(/_/g, ' ')}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}

                    {stageOpps.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No opportunities
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <Card padding="md" shadow="sm" className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <IconTrendingUp size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">Drag & Drop to Move Opportunities</p>
              <p className="text-xs text-blue-700">
                Drag opportunity cards between stages to update their pipeline status. The probability will automatically adjust based on the stage.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
