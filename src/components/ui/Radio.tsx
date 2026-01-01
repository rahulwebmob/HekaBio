/**
 * Radio Component - HekaBio Design System
 * Reusable radio button with label
 */

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = '', disabled, ...props }, ref) => {
    return (
      <div>
        <label className="inline-flex items-center cursor-pointer group">
          <div className="relative">
            <input
              ref={ref}
              type="radio"
              className="peer sr-only"
              disabled={disabled}
              {...props}
            />
            <div
              className={`
                w-5 h-5 border-2 rounded-full transition-all
                peer-checked:border-brand-500
                peer-focus:ring-4 peer-focus:ring-brand-500/20
                peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                ${error ? 'border-error-500' : 'border-gray-300'}
                ${className}
              `}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-brand-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
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

Radio.displayName = 'Radio';

export default Radio;
