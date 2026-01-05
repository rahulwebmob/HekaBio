/**
 * App Sidebar - Main navigation sidebar
 * Collapsible sidebar with hover expand
 */

import { Link, useLocation } from 'react-router-dom';
import {
  IconFlask,
  IconBuildingHospital,
  IconFileText,
  IconTemplate,
  IconTrendingUp,
  IconMail,
  IconChecklist,
  IconBell,
  IconCalendar,
  IconChartDots,
  IconFolder,
  IconShieldCheck,
  IconClipboardCheck,
  IconContract,
  IconBulb,
  IconThermometer,
  IconBolt,
} from '@tabler/icons-react';
import { ChevronLeftIcon, GridIcon, UserIcon } from '../../icons';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import type { UserRole } from '../../types/auth.types';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  allowedRoles?: UserRole[]; // Roles that can see this menu item
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <GridIcon className="w-5 h-5" />,
    path: '/dashboard',
    // All roles can access dashboard
  },
  {
    label: 'Projects',
    icon: <IconFlask size={20} stroke={1.5} />,
    path: '/projects',
    // All roles can view projects
  },
  {
    label: 'Opportunities',
    icon: <IconBulb size={20} stroke={1.5} />,
    path: '/opportunities',
    allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst'],
  },
  {
    label: 'Lead Scoring',
    icon: <IconTrendingUp size={20} stroke={1.5} />,
    path: '/lead-scoring',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
  },
  {
    label: 'Screenings',
    icon: <IconThermometer size={20} stroke={1.5} />,
    path: '/screenings',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
  },
  {
    label: 'Pipeline',
    icon: <IconChartDots size={20} stroke={1.5} />,
    path: '/pipeline',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
  },
  {
    label: 'Surveys',
    icon: <IconFileText size={20} stroke={1.5} />,
    path: '/surveys',
    allowedRoles: ['super_admin', 'crm_owner', 'gate_1_analyst'],
  },
  {
    label: 'Survey Templates',
    icon: <IconTemplate size={20} stroke={1.5} />,
    path: '/admin/survey-templates',
    allowedRoles: ['super_admin', 'crm_owner'],
  },
  {
    label: 'Automation',
    icon: <IconBolt size={20} stroke={1.5} />,
    path: '/automation',
    allowedRoles: ['super_admin', 'crm_owner'],
  },
  {
    label: 'Communications',
    icon: <IconMail size={20} stroke={1.5} />,
    path: '/communications',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
  },
  {
    label: 'Tasks',
    icon: <IconChecklist size={20} stroke={1.5} />,
    path: '/tasks',
    // All roles can access tasks
  },
  {
    label: 'Notifications',
    icon: <IconBell size={20} stroke={1.5} />,
    path: '/notifications',
    // All roles can access notifications
  },
  {
    label: 'Calendar',
    icon: <IconCalendar size={20} stroke={1.5} />,
    path: '/calendar',
    // All roles can access calendar
  },
  {
    label: 'Documents',
    icon: <IconFolder size={20} stroke={1.5} />,
    path: '/documents',
    // All roles can view documents
  },
  {
    label: 'Contracts',
    icon: <IconContract size={20} stroke={1.5} />,
    path: '/contracts',
    allowedRoles: ['super_admin', 'crm_owner', 'gate_3_decision_maker'],
  },
  {
    label: 'NDAs',
    icon: <IconShieldCheck size={20} stroke={1.5} />,
    path: '/ndas',
    allowedRoles: ['super_admin', 'crm_owner', 'gate_2_analyst', 'gate_3_decision_maker'],
  },
  {
    label: 'Due Diligence',
    icon: <IconClipboardCheck size={20} stroke={1.5} />,
    path: '/dd-workspace',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'dd_specialist_scientific',
      'dd_specialist_regulatory',
      'dd_specialist_commercial',
      'dd_specialist_financial',
    ],
  },
  {
    label: 'Companies',
    icon: <IconBuildingHospital size={20} stroke={1.5} />,
    path: '/companies',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
  },
  {
    label: 'Contacts',
    icon: <UserIcon className="w-5 h-5" />,
    path: '/contacts',
    allowedRoles: [
      'super_admin',
      'crm_owner',
      'gate_1_analyst',
      'gate_2_analyst',
      'gate_3_decision_maker',
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, isHoverExpanded, setHoverExpanded, closeMobile } =
    useSidebar();
  const { hasRole } = useAuthorization();

  const isExpanded = !isCollapsed || isHoverExpanded;
  const sidebarWidth = isExpanded ? 'w-64' : 'w-20';

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Filter menu items based on user's role
  const visibleMenuItems = menuItems.filter((item) => {
    // If no allowedRoles specified, item is visible to all
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }
    // Check if user has one of the allowed roles
    return hasRole(item.allowedRoles);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobile} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50
          transition-all duration-300 ease-in-out shadow-theme-xl
          ${sidebarWidth}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        onMouseEnter={() => {
          if (isCollapsed && !isMobileOpen) {
            setHoverExpanded(true);
          }
        }}
        onMouseLeave={() => {
          if (isCollapsed && isHoverExpanded) {
            setHoverExpanded(false);
          }
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200/50 px-4">
          {isExpanded ? (
            <img src="/logo.png" alt="HekaBio" className="h-10" />
          ) : (
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">H</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {visibleMenuItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => isMobileOpen && closeMobile()}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? 'bg-brand-50 text-brand-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${!isExpanded && 'justify-center'}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
                  {item.badge && isExpanded && (
                    <span className="ml-auto text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Toggle (Desktop Only) */}
        {!isMobileOpen && (
          <div className="hidden lg:block border-t border-gray-200/50 p-3">
            <button
              onClick={() => {
                setHoverExpanded(false);
                // Small delay to avoid conflict with hover
                setTimeout(() => {
                  const toggleEvent = new CustomEvent('toggleCollapse');
                  window.dispatchEvent(toggleEvent);
                }, 100);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors
                ${!isExpanded && 'justify-center'}
              `}
            >
              <ChevronLeftIcon
                className={`w-5 h-5 transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />
              {isExpanded && <span className="text-sm font-medium">Collapse</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
