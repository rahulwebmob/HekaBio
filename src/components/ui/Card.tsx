/**
 * Card Component - HekaBio Design System
 * Reusable card container with optional header and footer
 */

import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({
  children,
  header,
  footer,
  padding = 'md',
  shadow = 'sm',
  hover = false,
  className = '',
  ...props
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-theme-sm',
    md: 'shadow-theme-md',
    lg: 'shadow-theme-lg',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-theme-lg cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white/70 backdrop-blur-2xl rounded-lg border border-white/40 ${shadowStyles[shadow]} ${hoverStyles} ${className}`}
      style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}
      {...props}
    >
      {header && <div className="px-6 py-4 border-b border-white/30 bg-white/20">{header}</div>}

      <div className={paddingStyles[padding]}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-white/30 bg-white/20 rounded-b-lg">{footer}</div>
      )}
    </div>
  );
};

export default Card;
