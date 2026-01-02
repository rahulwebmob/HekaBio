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
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-md border';

  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    primary: 'bg-brand-100 text-brand-700 border-brand-300',
    success: 'bg-success-100 text-success-700 border-success-300',
    warning: 'bg-warning-100 text-warning-700 border-warning-300',
    error: 'bg-error-100 text-error-700 border-error-300',
    info: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
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
