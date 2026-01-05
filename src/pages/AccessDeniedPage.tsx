/**
 * Access Denied Page
 * Shown when user tries to access a route they don't have permission for
 */

import { Link } from 'react-router-dom';
import { IconShieldX, IconArrowLeft, IconHome } from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function AccessDeniedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white rounded-full p-6 shadow-theme-xl border border-red-200">
              <IconShieldX size={64} stroke={1.5} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-2">You don't have permission to access this page.</p>

        {user && (
          <p className="text-sm text-gray-500 mb-8">
            Your current role: <span className="font-semibold text-gray-700">{user.role}</span>
          </p>
        )}

        {/* Info Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-red-800 mb-2">
            <strong>Why am I seeing this?</strong>
          </p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>This page requires specific permissions</li>
            <li>Your user role may not have access</li>
            <li>Contact your administrator for access</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            leftIcon={<IconArrowLeft size={18} />}
          >
            Go Back
          </Button>
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<IconHome size={18} />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-8">
          Need help? Contact your system administrator or{' '}
          <Link to="/settings" className="text-brand-600 hover:text-brand-700 underline">
            check your settings
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
