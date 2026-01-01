/**
 * Dashboard Page - TailAdmin Style
 * Main dashboard after login
 */

import { IconFolder, IconFileText, IconCircleCheck, IconClock } from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { RoleLabels } from '../types/auth.types';
import { AppLayout } from '../components/layout';
import { Card } from '../components/ui';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Projects',
      value: '42',
      icon: IconFolder,
      color: 'text-brand-500',
      bgColor: 'bg-brand-50',
    },
    {
      title: 'Active Pipeline',
      value: '28',
      icon: IconFileText,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Completed',
      value: '12',
      icon: IconCircleCheck,
      color: 'text-success-500',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Pending Review',
      value: '8',
      icon: IconClock,
      color: 'text-warning-500',
      bgColor: 'bg-warning-50',
    },
  ];

  return (
    <AppLayout>
      <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-base text-gray-600">
            Your role: <span className="font-medium text-gray-900">{user?.role && RoleLabels[user.role]}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} padding="md" shadow="sm" hover>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor}`}>
                  <stat.icon size={24} stroke={1.5} className={stat.color} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card padding="lg" shadow="sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Foundation Setup Complete!
          </h3>
          <p className="text-sm text-gray-700 mb-6">
            The HekaBio platform foundation is now ready. We have successfully set up:
          </p>
          <ul className="space-y-3 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>React 18 + TypeScript + Vite</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>Tailwind CSS 4 with TailAdmin design system</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>Redux Toolkit state management</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>React Router with protected routes</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>Mock authentication with 12 user roles</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>TypeScript type definitions for all entities</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>Landing page and login flow with TailAdmin style</span>
            </li>
            <li className="flex items-start gap-3">
              <IconCircleCheck size={20} stroke={1.5} className="text-success-500 flex-shrink-0 mt-0.5" />
              <span>Custom teal/cyan theme matching HekaBio branding</span>
            </li>
          </ul>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Next Steps - Phase 0.2:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                <span>Create AppLayout with Header, Sidebar, and navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                <span>Build Address Book module (companies & contacts)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                <span>Build Project management module</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                <span>Build Survey system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500">•</span>
                <span>...and 20+ more modules from the granular plan!</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
