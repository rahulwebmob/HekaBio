/**
 * Drawer Component - HekaBio Design System
 * Sliding panel from right side for detail views
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CloseIcon } from '../../icons';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'lg',
  closeOnOverlayClick = true,
}: DrawerProps) => {
  const [shouldMount, setShouldMount] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useFocusTrap(isOpen && shouldAnimate);

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  };

  // Handle mount and animation
  useEffect(() => {
    if (isOpen) {
      // Defer state updates to avoid direct setState in effect
      const mountTimer = setTimeout(() => setShouldMount(true), 0);
      // Trigger animation after mount
      const animateTimer = setTimeout(() => setShouldAnimate(true), 10);
      return () => {
        clearTimeout(mountTimer);
        clearTimeout(animateTimer);
      };
    } else {
      // Defer state updates
      const animateTimer = setTimeout(() => setShouldAnimate(false), 0);
      // Unmount after animation completes
      const unmountTimer = setTimeout(() => setShouldMount(false), 500);
      return () => {
        clearTimeout(animateTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!shouldMount) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ease-out z-[9998] ${
          shouldAnimate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Drawer */}
      <div
        ref={containerRef}
        className={`fixed inset-y-0 right-0 z-[9999] w-full ${sizeStyles[size]} will-change-transform`}
        style={{
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        <div className="h-full bg-gray-50/95 shadow-2xl flex flex-col border-l border-gray-200/30">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/30 bg-white/30 flex-shrink-0">
              <h2 id="drawer-title" className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-all duration-200 p-1.5 rounded-lg hover:bg-white/50"
                aria-label="Close drawer"
              >
                <CloseIcon className="w-5.5 h-5.5" />
              </button>
            </div>
          )}

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white/40 custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200/30 bg-white/30 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Drawer;
