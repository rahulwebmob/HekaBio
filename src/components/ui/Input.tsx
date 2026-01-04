/**
 * Input Component - HekaBio Design System
 * Reusable text input with label, error states, and icons
 */

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const baseStyles = 'px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50/30 bg-white/80 hover:bg-white hover:border-gray-400';

    const errorStyles = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10'
      : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/10';

    const iconPaddingLeft = leftIcon ? 'pl-11' : '';
    const iconPaddingRight = rightIcon ? 'pr-11' : '';
    const widthStyle = fullWidth ? 'w-full' : '';

    const ariaDescribedBy = [];
    if (error) ariaDescribedBy.push(errorId);
    if (helperText && !error) ariaDescribedBy.push(helperId);

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`${baseStyles} ${errorStyles} ${iconPaddingLeft} ${iconPaddingRight} ${widthStyle} ${className}`}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-error-500" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-xs text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
