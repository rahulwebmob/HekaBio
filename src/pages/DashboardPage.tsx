import { useAuth } from '../hooks/useAuth';
import { RoleLabels } from '../types/auth.types';
import { AppLayout } from '../components/layout';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome, {user?.firstName}!
          </h2>
          <p className="text-base text-gray-600">
            Your role: <span className="font-medium text-gray-900">{user?.role && RoleLabels[user.role]}</span>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
