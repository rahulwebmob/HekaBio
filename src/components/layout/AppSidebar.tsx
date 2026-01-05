/**
 * App Sidebar - Main navigation sidebar
 * Collapsible sidebar with hover expand
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconFlask,
  IconAddressBook,
  IconFileText,
  IconTemplate,
  IconFolder,
  IconShieldCheck,
  IconClipboardCheck,
  IconContract,
  IconBolt,
  IconChevronDown,
} from '@tabler/icons-react';
import { ChevronLeftIcon, GridIcon } from '../../icons';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import type { UserRole } from '../../types/auth.types';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  allowedRoles?: UserRole[]; // Roles that can see this menu item
  children?: MenuItem[]; // Submenu items
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
  // Opportunities and Pipeline features removed - out of scope per client requirements
  // Projects are now auto-created from surveys/intro decks (Cold/Warm/Hot reach)
  {
    label: 'Surveys',
    icon: <IconFileText size={20} stroke={1.5} />,
    path: '/surveys',
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
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
  // Utils dropdown removed - tasks, notifications, calendar, communications out of scope
  {
    label: 'Documents',
    icon: <IconFolder size={20} stroke={1.5} />,
    path: '/documents',
    // All roles can view documents
  },
  {
    label: 'Address Book',
    icon: <IconAddressBook size={20} stroke={1.5} />,
    path: '/address-book',
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
  },
  {
    label: 'Contracts',
    icon: <IconContract size={20} stroke={1.5} />,
    path: '/contracts',
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
  },
  {
    label: 'NDAs',
    icon: <IconShieldCheck size={20} stroke={1.5} />,
    path: '/ndas',
    allowedRoles: ['super_admin', 'crm_owner', 'analyst'],
  },
  {
    label: 'Due Diligence',
    icon: <IconClipboardCheck size={20} stroke={1.5} />,
    path: '/dd-workspace',
    allowedRoles: ['super_admin', 'crm_owner', 'analyst', 'dd_specialist'],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, isHoverExpanded, setHoverExpanded, closeMobile } =
    useSidebar();
  const { hasRole } = useAuthorization();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const isExpanded = !isCollapsed || isHoverExpanded;
  const sidebarWidth = isExpanded ? 'w-64' : 'w-20';

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubmenuActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some((child) => child.path && isActive(child.path));
  };

  const toggleSubmenu = (label: string) => {
    setExpandedSubmenu(expandedSubmenu === label ? null : label);
  };

  // Filter menu items based on user's role
  const filterMenuItem = (item: MenuItem): MenuItem | null => {
    // Check if item itself is allowed
    const isItemAllowed =
      !item.allowedRoles || item.allowedRoles.length === 0 || hasRole(item.allowedRoles);

    // If item has children, filter them too
    if (item.children) {
      const visibleChildren = item.children
        .map(filterMenuItem)
        .filter((child): child is MenuItem => child !== null);

      // Only show parent if it has visible children
      if (visibleChildren.length > 0) {
        return { ...item, children: visibleChildren };
      }
      return null;
    }

    return isItemAllowed ? item : null;
  };

  const visibleMenuItems = menuItems
    .map(filterMenuItem)
    .filter((item): item is MenuItem => item !== null);

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
                {item.children ? (
                  // Parent menu with submenu
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${
                          isSubmenuActive(item.children)
                            ? 'bg-brand-50 text-brand-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${!isExpanded && 'justify-center'}
                      `}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {isExpanded && (
                        <>
                          <span className="text-sm font-medium">{item.label}</span>
                          <IconChevronDown
                            size={16}
                            className={`ml-auto transition-transform duration-200 ${
                              expandedSubmenu === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>
                    {/* Submenu items */}
                    {isExpanded && expandedSubmenu === item.label && (
                      <ul className="mt-1 space-y-1 ml-4">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.path || '#'}
                              onClick={() => isMobileOpen && closeMobile()}
                              className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg
                                transition-all duration-200
                                ${
                                  child.path && isActive(child.path)
                                    ? 'bg-brand-50 text-brand-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
                              `}
                            >
                              <span className="flex-shrink-0">{child.icon}</span>
                              <span className="text-sm font-medium">{child.label}</span>
                              {child.badge && (
                                <span className="ml-auto text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Link
                    to={item.path || '#'}
                    onClick={() => isMobileOpen && closeMobile()}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200
                      ${
                        item.path && isActive(item.path)
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
                )}
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
