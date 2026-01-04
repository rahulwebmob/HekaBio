/**
 * Dashboard Page
 * Main dashboard after login with real-time stats
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconFlask,
  IconBuildingHospital,
  IconTrendingUp,
  IconChartBar,
} from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../app/store';
import { RoleLabels } from '../types/auth.types';
import { StageLabels } from '../types/project.types';
import { AppLayout } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { ProjectCard } from '../components/common';
// Charts removed - focusing on core functionality

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const projects = useAppSelector((state) => state.projects.projects);
  const companies = useAppSelector((state) => state.addressBook.companies);
  const contacts = useAppSelector((state) => state.addressBook.contacts);
  const surveys = useAppSelector((state) => state.surveys.instances);

  // Calculate stats
  const stats = useMemo(() => {
    const hotProjects = projects.filter((p) => p.isHot).length;
    const diamondProjects = projects.filter((p) => p.isDiamond).length;
    const stalledProjects = projects.filter((p) => p.isStalled).length;
    const activeProjects = projects.filter((p) => !p.isStalled).length;
    const avgScore = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.score, 0) / projects.length)
      : 0;

    const pendingSurveys = surveys.filter(
      (s) => s.status === 'NOT_STARTED' || s.status === 'IN_PROGRESS'
    ).length;

    // Projects by tag
    const strategicPortfolio = projects.filter(p => p.tags.includes('Strategic Portfolio')).length;
    const finders = projects.filter(p => p.tags.includes('Finders')).length;
    const developmentServices = projects.filter(p => p.tags.includes('Development Services')).length;

    // Projects with Japan interest
    const japanInterest = projects.filter(p => p.japanInterest).length;

    return {
      totalProjects: projects.length,
      activeProjects,
      stalledProjects,
      totalCompanies: companies.length,
      totalContacts: contacts.length,
      totalSurveys: surveys.length,
      hotProjects,
      diamondProjects,
      avgScore,
      pendingSurveys,
      strategicPortfolio,
      finders,
      developmentServices,
      japanInterest,
    };
  }, [projects, companies, contacts, surveys]);

  // Recent projects (top 6 by updated date)
  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [projects]);

  // Pipeline by stage
  const pipelineStats = useMemo(() => {
    const stageCounts: Record<string, number> = {};
    projects.forEach((project) => {
      const stage = project.currentStage;
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    return Object.entries(stageCounts)
      .map(([stage, count]) => ({
        stage,
        label: StageLabels[stage as keyof typeof StageLabels],
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [projects]);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: IconFlask,
      color: 'text-brand-500',
      bgColor: 'bg-brand-50/80',
      onClick: () => navigate('/projects'),
    },
    {
      title: 'Companies',
      value: stats.totalCompanies,
      icon: IconBuildingHospital,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50/80',
      onClick: () => navigate('/companies'),
    },
    {
      title: 'Hot Projects',
      value: stats.hotProjects,
      icon: IconTrendingUp,
      color: 'text-error-500',
      bgColor: 'bg-error-50/80',
      onClick: () => navigate('/projects'),
    },
    {
      title: 'Avg Score',
      value: stats.avgScore,
      icon: IconChartBar,
      color: 'text-success-500',
      bgColor: 'bg-success-50/80',
      onClick: () => navigate('/projects'),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-base text-gray-600">
            Your role: <span className="font-medium text-gray-900">{user?.role && RoleLabels[user.role]}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card
              key={stat.title}
              padding="md"
              shadow="sm"
              hover
              onClick={stat.onClick}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor}`}>
                  <stat.icon size={24} stroke={1.5} className={stat.color} />
                </div>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card
              padding="lg"
              shadow="sm"
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Projects</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/projects')}
                  >
                    View All
                  </Button>
                </div>
              }
            >
              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconFlask size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first project
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/projects/new')}
                  >
                    Create Project
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pipeline Overview */}
            <Card
              padding="lg"
              shadow="sm"
              header={
                <h3 className="text-xl font-semibold text-gray-900">Pipeline Overview</h3>
              }
            >
              {pipelineStats.length > 0 ? (
                <div className="space-y-4">
                  {pipelineStats.map((item) => (
                    <div key={item.stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(item.count / stats.totalProjects) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No pipeline data yet</p>
              )}
            </Card>

            {/* Quick Stats */}
            <Card
              padding="lg"
              shadow="sm"
              header={
                <h3 className="text-xl font-semibold text-gray-900">Quick Stats</h3>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <Badge variant="success" size="md">
                    {stats.activeProjects}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Diamond Projects</span>
                  <Badge variant="success" size="md">
                    {stats.diamondProjects}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hot Projects</span>
                  <Badge variant="error" size="md">
                    {stats.hotProjects}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stalled Projects</span>
                  <Badge variant="default" size="md">
                    {stats.stalledProjects}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Japan Interest</span>
                  <Badge variant="primary" size="md">
                    {stats.japanInterest}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className={`text-lg font-bold ${
                    stats.avgScore >= 80 ? 'text-success-600' :
                    stats.avgScore >= 70 ? 'text-brand-600' :
                    stats.avgScore >= 60 ? 'text-warning-600' :
                    'text-gray-600'
                  }`}>
                    {stats.avgScore}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card
              padding="lg"
              shadow="sm"
              header={
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              }
            >
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/projects/new')}
                >
                  New Project
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/companies/new')}
                >
                  New Company
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/surveys')}
                >
                  View Surveys
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/contacts')}
                >
                  View Contacts
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
