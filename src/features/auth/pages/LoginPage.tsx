/**
 * Login Page - TailAdmin Style
 * Authentication page with role switcher for demo
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconUser, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole, RoleLabels } from '../../../types/auth.types';
import { Button, Input, Select } from '../../../components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, switchRole, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Please enter your email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await login(formData);

      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      } else {
        setErrors({ ...errors, password: 'Invalid email or password' });
      }
    } catch {
      setErrors({ ...errors, password: 'Login failed. Please try again.' });
    }
  };

  const handleRoleSwitch = () => {
    if (selectedRole) {
      switchRole(selectedRole as UserRole);
      navigate('/dashboard');
    }
  };

  // Prepare role options for Select component - Updated for simplified roles
  const roleOptions = [
    { value: UserRole.SUPER_ADMIN, label: RoleLabels[UserRole.SUPER_ADMIN] },
    { value: UserRole.CRM_OWNER, label: RoleLabels[UserRole.CRM_OWNER] },
    { value: UserRole.ANALYST, label: RoleLabels[UserRole.ANALYST] },
    { value: UserRole.DD_SPECIALIST, label: RoleLabels[UserRole.DD_SPECIALIST] },
    { value: UserRole.VIEWER, label: RoleLabels[UserRole.VIEWER] },
    { value: UserRole.PRODUCT_OWNER, label: RoleLabels[UserRole.PRODUCT_OWNER] },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4 overflow-auto"
      style={{
        backgroundImage: 'url(/login-bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-[450px] my-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-theme-xl border border-gray-200/50 p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="HekaBio Logo" className="h-[60px] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-brand-500 mb-2">Welcome to HekaBio</h3>
            <p className="text-sm text-gray-600">Healthcare Innovation Management Platform</p>
          </div>

          {/* Login Form */}
          <form onSubmit={onFinish} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              autoComplete="email"
              leftIcon={<IconUser size={18} stroke={1.5} />}
              error={errors.email}
              fullWidth
            />

            {/* Password Input */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<IconLock size={18} stroke={1.5} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <IconEyeOff size={18} stroke={1.5} />
                  ) : (
                    <IconEye size={18} stroke={1.5} />
                  )}
                </button>
              }
              error={errors.password}
              fullWidth
            />

            {/* Submit Button */}
            <Button type="submit" variant="primary" size="md" fullWidth loading={isLoading}>
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500">OR</span>
            </div>
          </div>

          {/* Demo Role Selector */}
          <div className="space-y-4">
            <Select
              label="Quick Demo Login (Select Role):"
              placeholder="Select a role to demo"
              options={roleOptions}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole | '')}
              fullWidth
            />

            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              disabled={!selectedRole}
              onClick={handleRoleSwitch}
            >
              Login as Selected Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
