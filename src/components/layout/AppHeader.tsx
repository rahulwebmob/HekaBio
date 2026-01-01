/**
 * App Header - Top navigation bar
 * Contains toggle, search, notifications, and user menu
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconMenu2,
  IconSearch,
  IconBell,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui';

export default function AppHeader() {
  const navigate = useNavigate();
  const { toggleCollapse, toggleMobile } = useSidebar();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New Innovation Submitted',
      message: 'A new healthcare innovation has been submitted for review',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Evaluation Complete',
      message: 'Gate 1 evaluation for INV-2024-001 is complete',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Meeting Reminder',
      message: 'Innovation review meeting starts in 30 minutes',
      time: '2 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            <IconMenu2 size={24} stroke={1.5} />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <IconMenu2 size={24} stroke={1.5} />
          </button>

          {/* Search */}
          <div className="hidden sm:block relative">
            <div className="relative">
              <IconSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                stroke={1.5}
              />
              <input
                type="text"
                placeholder="Search... (Cmd+K)"
                className="
                  pl-10 pr-4 py-2 w-64 lg:w-80
                  bg-gray-50 border border-gray-200 rounded-lg
                  text-sm text-gray-900 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  transition-all
                "
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <IconBell size={22} stroke={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-theme-lg border border-gray-200 z-20">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <Badge variant="primary" size="sm">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`
                          px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer
                          transition-colors
                          ${notification.unread ? 'bg-brand-25' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`
                              w-2 h-2 rounded-full mt-2 flex-shrink-0
                              ${notification.unread ? 'bg-brand-500' : 'bg-transparent'}
                            `}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                <IconUser size={18} className="text-white" stroke={1.5} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
              </div>
              <IconChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-theme-lg border border-gray-200 z-20">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <IconUser size={18} stroke={1.5} />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <IconSettings size={18} stroke={1.5} />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <IconLogout size={18} stroke={1.5} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
