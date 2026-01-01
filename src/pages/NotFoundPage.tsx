/**
 * 404 Not Found Page
 */

import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-[72px] font-bold text-gray-900 leading-none">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mt-2 text-base text-gray-600">Sorry, the page you visited does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors focus:outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          Back Home
        </button>
      </div>
    </div>
  );
}
