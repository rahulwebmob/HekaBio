/**
 * App Layout - Main application layout wrapper
 * Combines sidebar, header, footer with responsive behavior
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

interface AppLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: AppLayoutProps) {
  const { isCollapsed, isMobileOpen, toggleCollapse } = useSidebar();

  // Listen for collapse toggle events from sidebar
  useEffect(() => {
    const handleToggle = () => {
      toggleCollapse();
    };

    window.addEventListener('toggleCollapse', handleToggle);
    return () => window.removeEventListener('toggleCollapse', handleToggle);
  }, [toggleCollapse]);

  // Calculate main content margin based on sidebar state
  const mainMargin = !isMobileOpen
    ? isCollapsed
      ? 'lg:ml-20'
      : 'lg:ml-64'
    : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppSidebar />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${mainMargin}`}>
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
