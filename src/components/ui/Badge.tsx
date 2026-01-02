/**
 * Badge Component - HekaBio Design System
 * Small status indicator or label
 */

import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-normal rounded-md border';

  const variantStyles = {
    default: 'bg-gray-50/50 text-gray-600 border-gray-200/50',
    primary: 'bg-brand-50/50 text-brand-600 border-brand-200/50',
    success: 'bg-success-50/50 text-success-600 border-success-200/50',
    warning: 'bg-warning-50/50 text-warning-600 border-warning-200/50',
    error: 'bg-error-50/50 text-error-600 border-error-200/50',
    info: 'bg-cyan-50/50 text-cyan-600 border-cyan-200/50',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-xs',
  };

  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-brand-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-cyan-500',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
