/**
 * Checkbox Component - HekaBio Design System
 * Reusable checkbox with label
 */

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', disabled, ...props }, ref) => {
    return (
      <div>
        <label className="inline-flex items-center cursor-pointer group">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="peer sr-only"
              disabled={disabled}
              {...props}
            />
            <div
              className={`
                w-5 h-5 border-2 rounded transition-all
                peer-checked:bg-brand-500 peer-checked:border-brand-500
                peer-focus:ring-4 peer-focus:ring-brand-500/20
                peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                ${error ? 'border-error-500' : 'border-gray-300'}
                ${className}
              `}
            >
              <svg
                className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {label && (
            <span
              className={`ml-2 text-sm ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              } group-hover:text-gray-900`}
            >
              {label}
            </span>
          )}
        </label>

        {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
