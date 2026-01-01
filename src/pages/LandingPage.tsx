/**
 * Landing Page - Simple redirect to login
 * Main website is at hekabio.com - this is the APPLICATION platform
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login immediately
    navigate('/login');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-700">Redirecting to HekaBio Platform...</p>
      </div>
    </div>
  );
}
