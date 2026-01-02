/**
 * Lead Score Page
 * View and analyze all projects by their scores
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconFlame,
  IconThermometer,
  IconSnowflake,
  IconSearch,
  IconFilter,
  IconTrendingUp,
} from '@tabler/icons-react';
import { useAppSelector } from '../app/store';
import { AppLayout } from '../components/layout';
import { Input, Badge, Card, Table, type TableColumn } from '../components/ui';
import { getScoreCategory } from '../config/scoringModel';
import type { Project } from '../types/project.types';

type SortField = 'score' | 'name' | 'company' | 'stage';
type SortOrder = 'asc' | 'desc';
type FilterCategory = 'all' | 'hot' | 'warm' | 'cold';

export default function LeadScorePage() {
  const navigate = useNavigate();
  const projects = useAppSelector((state) => state.projects.projects);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterJapanInterest, setFilterJapanInterest] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const hotProjects = projects.filter((p) => getScoreCategory(p.score) === 'hot');
    const warmProjects = projects.filter((p) => getScoreCategory(p.score) === 'warm');
    const coldProjects = projects.filter((p) => getScoreCategory(p.score) === 'cold');
    const avgScore =
      projects.length > 0
        ? projects.reduce((sum, p) => sum + p.score, 0) / projects.length
        : 0;

    return {
      total: projects.length,
      hot: hotProjects.length,
      warm: warmProjects.length,
      cold: coldProjects.length,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.company.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => getScoreCategory(p.score) === filterCategory);
    }

    // Japan interest filter
    if (filterJapanInterest) {
      filtered = filtered.filter((p) => p.japanInterest);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case 'score':
          aVal = a.score;
          bVal = b.score;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'company':
          aVal = a.company.name.toLowerCase();
          bVal = b.company.name.toLowerCase();
          break;
        case 'stage':
          aVal = a.currentStage;
          bVal = b.currentStage;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchQuery, sortField, sortOrder, filterCategory, filterJapanInterest]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getCategoryIcon = (category: 'hot' | 'warm' | 'cold') => {
    switch (category) {
      case 'hot':
        return <IconFlame size={16} className="text-error-600" />;
      case 'warm':
        return <IconThermometer size={16} className="text-warning-600" />;
      case 'cold':
        return <IconSnowflake size={16} className="text-blue-600" />;
    }
  };

  const getCategoryBadgeVariant = (category: 'hot' | 'warm' | 'cold') => {
    switch (category) {
      case 'hot':
        return 'error' as const;
      case 'warm':
        return 'warning' as const;
      case 'cold':
        return 'info' as const;
    }
  };

  // Table columns configuration
  const columns: TableColumn<Project>[] = [
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      render: (project) => {
        const category = getScoreCategory(project.score);
        return (
          <div className="flex items-center gap-2">
            {getCategoryIcon(category)}
            <span
              className={`text-2xl font-bold ${
                category === 'hot'
                  ? 'text-error-600'
                  : category === 'warm'
                  ? 'text-warning-600'
                  : 'text-blue-600'
              }`}
            >
              {project.score}
            </span>
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Project',
      sortable: true,
      render: (project) => (
        <p className="text-sm font-medium text-gray-900">{project.name}</p>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      sortable: true,
      render: (project) => (
        <div>
          <p className="text-sm text-gray-900">{project.company.name}</p>
          <p className="text-xs text-gray-500">{project.company.address.country}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (project) => {
        const category = getScoreCategory(project.score);
        return (
          <Badge variant={getCategoryBadgeVariant(category)} size="sm">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'stage',
      header: 'Stage',
      sortable: true,
      render: (project) => (
        <Badge variant="default" size="sm">
          {project.currentStage.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'indicators',
      header: 'Indicators',
      render: (project) => (
        <div className="flex items-center gap-2">
          {project.isHot && (
            <Badge variant="error" size="sm">
              🔥 Hot
            </Badge>
          )}
          {project.isDiamond && (
            <Badge variant="info" size="sm">
              💎 Diamond
            </Badge>
          )}
          {project.japanInterest && (
            <Badge variant="success" size="sm">
              🇯🇵 Japan
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
            Lead Scoring
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze and prioritize projects based on automated scoring
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Projects Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-lg p-5 border border-white/40">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <IconTrendingUp size={20} className="text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {stats.total}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              Total Projects
            </h3>
            <p className="text-xs text-gray-600">
              All projects tracked
            </p>
          </div>

          {/* Hot Leads Card */}
          <button
            onClick={() => setFilterCategory(filterCategory === 'hot' ? 'all' : 'hot')}
            className={`
              bg-white/80 backdrop-blur-xl rounded-lg p-5 text-left transition-all duration-200
              border cursor-pointer
              ${filterCategory === 'hot'
                ? 'border-brand-400 shadow-md bg-white/95'
                : 'border-white/40 hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-error-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <IconFlame size={20} className="text-error-600" />
              </div>
              <div className="text-2xl font-bold text-error-700">
                {stats.hot}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              Hot Leads
            </h3>
            <p className="text-xs text-gray-600">
              Score ≥ 80
            </p>
          </button>

          {/* Warm Leads Card */}
          <button
            onClick={() => setFilterCategory(filterCategory === 'warm' ? 'all' : 'warm')}
            className={`
              bg-white/80 backdrop-blur-xl rounded-lg p-5 text-left transition-all duration-200
              border cursor-pointer
              ${filterCategory === 'warm'
                ? 'border-brand-400 shadow-md bg-white/95'
                : 'border-white/40 hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-warning-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <IconThermometer size={20} className="text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-warning-700">
                {stats.warm}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              Warm Leads
            </h3>
            <p className="text-xs text-gray-600">
              Score 60-79
            </p>
          </button>

          {/* Cold Leads Card */}
          <button
            onClick={() => setFilterCategory(filterCategory === 'cold' ? 'all' : 'cold')}
            className={`
              bg-white/80 backdrop-blur-xl rounded-lg p-5 text-left transition-all duration-200
              border cursor-pointer
              ${filterCategory === 'cold'
                ? 'border-brand-400 shadow-md bg-white/95'
                : 'border-white/40 hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <IconSnowflake size={20} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {stats.cold}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              Cold Leads
            </h3>
            <p className="text-xs text-gray-600">
              Score &lt; 60
            </p>
          </button>

          {/* Average Score Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-lg p-5 border border-white/40">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-brand-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <IconTrendingUp size={20} className="text-brand-600" />
              </div>
              <div className="text-2xl font-bold text-brand-700">
                {stats.avgScore}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              Average Score
            </h3>
            <p className="text-xs text-gray-600">
              Across all projects
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card padding="md" shadow="sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<IconSearch size={18} />}
                fullWidth
              />
            </div>

            <div className="flex items-center gap-2">
              <IconFilter size={18} className="text-gray-600" />
              <button
                onClick={() => setFilterJapanInterest(!filterJapanInterest)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterJapanInterest
                    ? 'bg-brand-100 text-brand-700 border-2 border-brand-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🇯🇵 Japan Interest
              </button>
            </div>
          </div>

          {filterCategory !== 'all' && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              <Badge variant={getCategoryBadgeVariant(filterCategory)} size="sm">
                {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)} Leads
              </Badge>
              <button
                onClick={() => setFilterCategory('all')}
                className="text-xs text-brand-600 hover:text-brand-700 underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </Card>

        {/* Projects Table */}
        <Card padding="none" shadow="sm">
          <Table
            columns={columns}
            data={filteredProjects}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field) => handleSort(field as SortField)}
            emptyMessage="No projects found matching your criteria"
          />
        </Card>

        {/* Results Count */}
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>

      </div>
    </AppLayout>
  );
}
