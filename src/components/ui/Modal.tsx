/**
 * Modal Component - HekaBio Design System
 * Reusable modal dialog with header and footer
 */

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CloseIcon } from '../../icons';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}: ModalProps) => {
  const [shouldMount, setShouldMount] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useFocusTrap(isOpen && shouldAnimate);

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
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
      const unmountTimer = setTimeout(() => setShouldMount(false), 300);
      return () => {
        clearTimeout(animateTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
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
    <div className="fixed inset-0 z-999999 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ease-out"
        style={{
          opacity: shouldAnimate ? 1 : 0,
        }}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={containerRef}
          className={`relative bg-gray-50/95 rounded-xl shadow-2xl w-full ${sizeStyles[size]} border border-gray-200/30 will-change-transform`}
          style={{
            transform: shouldAnimate ? 'scale(1)' : 'scale(0.95)',
            opacity: shouldAnimate ? 1 : 0,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/30">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-all duration-200 p-1 rounded-lg hover:bg-white/50"
                aria-label="Close modal"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4 bg-white/40">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200/30 bg-white/30 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
