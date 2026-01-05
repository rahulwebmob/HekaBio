/**
 * Main App Component
 * HekaBio Platform - Healthcare Innovation Management System
 */

import { Suspense, useEffect, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

// Store
import { store } from './app/store';

// Routes
import { routes } from './routes';

// Components
import { useAuth } from './hooks/useAuth';
import { useAuthorization } from './hooks/useAuthorization';
import AccessDeniedPage from './pages/AccessDeniedPage';
import type { UserRole } from './types/auth.types';

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-700">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactElement;
  allowedRoles?: UserRole[];
}) {
  const { isAuthenticated } = useAuth();
  const { hasRole } = useAuthorization();

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based authorization if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRole(allowedRoles)) {
      return <AccessDeniedPage />;
    }
  }

  return children;
}

// App Router Component
function AppRouter() {
  const { isAuthenticated } = useAuth();

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('hekabio_token');
    const userStr = localStorage.getItem('hekabio_user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Dispatch restore session action if needed
        console.log('Session restored for:', userData.fullName);
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('hekabio_token');
        localStorage.removeItem('hekabio_user');
      }
    }
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.map((route) => {
          const Element = route.element;

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isPublic ? (
                  // Public route - redirect to dashboard if already logged in
                  isAuthenticated && route.path === '/login' ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Element />
                  )
                ) : (
                  // Protected route with optional role-based access control
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
                    <Element />
                  </ProtectedRoute>
                )
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
