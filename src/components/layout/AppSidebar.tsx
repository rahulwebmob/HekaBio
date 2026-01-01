/**
 * App Sidebar - Main navigation sidebar
 * Collapsible sidebar with hover expand, submenu support
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconUsers,
  IconFileText,
  IconClipboardCheck,
  IconChartBar,
  IconSettings,
  IconChevronDown,
  IconChevronLeft,
  IconFlask,
  IconBuildingHospital,
} from '@tabler/icons-react';
import { useSidebar } from '../../contexts/SidebarContext';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  submenu?: { label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <IconLayoutDashboard size={20} stroke={1.5} />,
    path: '/dashboard',
  },
  {
    label: 'Innovations',
    icon: <IconFlask size={20} stroke={1.5} />,
    submenu: [
      { label: 'All Innovations', path: '/innovations' },
      { label: 'Submit New', path: '/innovations/submit' },
      { label: 'My Submissions', path: '/innovations/my-submissions' },
    ],
  },
  {
    label: 'Evaluations',
    icon: <IconClipboardCheck size={20} stroke={1.5} />,
    submenu: [
      { label: 'Pending Reviews', path: '/evaluations/pending' },
      { label: 'Gate 1', path: '/evaluations/gate-1' },
      { label: 'Gate 2', path: '/evaluations/gate-2' },
      { label: 'Gate 3', path: '/evaluations/gate-3' },
      { label: 'Due Diligence', path: '/evaluations/due-diligence' },
    ],
  },
  {
    label: 'Users',
    icon: <IconUsers size={20} stroke={1.5} />,
    path: '/users',
  },
  {
    label: 'Partners',
    icon: <IconBuildingHospital size={20} stroke={1.5} />,
    submenu: [
      { label: 'Hospitals', path: '/partners/hospitals' },
      { label: 'Distributors', path: '/partners/distributors' },
      { label: 'License Holders', path: '/partners/license-holders' },
      { label: 'Manufacturers', path: '/partners/manufacturers' },
    ],
  },
  {
    label: 'Reports',
    icon: <IconChartBar size={20} stroke={1.5} />,
    path: '/reports',
  },
  {
    label: 'Documents',
    icon: <IconFileText size={20} stroke={1.5} />,
    path: '/documents',
  },
  {
    label: 'Settings',
    icon: <IconSettings size={20} stroke={1.5} />,
    path: '/settings',
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, isHoverExpanded, setHoverExpanded, closeMobile } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isExpanded = !isCollapsed || isHoverExpanded;
  const sidebarWidth = isExpanded ? 'w-64' : 'w-20';

  const isActive = (path?: string, submenuPaths?: { path: string }[]) => {
    if (path) return location.pathname === path;
    if (submenuPaths) return submenuPaths.some((item) => location.pathname === item.path);
    return false;
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
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
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.submenu ? (
                  // Submenu Item
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        ${
                          isActive(undefined, item.submenu)
                            ? 'bg-brand-50 text-brand-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${!isExpanded && 'justify-center'}
                      `}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {isExpanded && (
                        <>
                          <span className="flex-1 text-sm font-medium text-left">
                            {item.label}
                          </span>
                          <IconChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              openSubmenu === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {/* Submenu Items */}
                    {isExpanded && openSubmenu === item.label && (
                      <ul className="mt-1 ml-9 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.path}>
                            <Link
                              to={subItem.path}
                              onClick={() => isMobileOpen && closeMobile()}
                              className={`
                                block px-3 py-2 rounded-lg text-sm
                                transition-colors duration-200
                                ${
                                  location.pathname === subItem.path
                                    ? 'bg-brand-50 text-brand-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
                              `}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Regular Item
                  <Link
                    to={item.path!}
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
                    {isExpanded && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
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
              <IconChevronLeft
                size={20}
                className={`transition-transform duration-300 ${
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
