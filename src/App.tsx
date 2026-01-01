/**
 * Main App Component
 * HekaBio Platform - Healthcare Innovation Management System
 */

import { Suspense, useEffect, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import { Provider } from 'react-redux';

// Store & Theme
import { store } from './app/store';
import theme from './config/theme';

// Styles
import './assets/styles/global.css';

// Routes
import { routes } from './routes';

// Components
import { useAuth } from './hooks/useAuth';

// Loading Fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <Spin size="large" tip="Loading..." />
  </div>
);

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
                  // Protected route
                  <ProtectedRoute>
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
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
