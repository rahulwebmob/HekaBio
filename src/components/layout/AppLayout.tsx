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
import SkipLinks from '../ui/SkipLinks';

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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Skip Links for Accessibility */}
      <SkipLinks />

      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/login-bg.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Extreme Blur Glass Overlay */}
      <div className="fixed inset-0 z-0 glass-extreme" aria-hidden="true" />

      {/* Additional Glass Layer for Extra Effect */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white/30 via-blue-50/10 to-cyan-50/20 glass-layer" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <AppSidebar />

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${mainMargin}`}>
          <AppHeader />

          {/* Page Content */}
          <main id="main-content" className="flex-1 p-4 lg:p-6" role="main" aria-label="Main content">
            <div className="max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>

          <AppFooter />
        </div>
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
