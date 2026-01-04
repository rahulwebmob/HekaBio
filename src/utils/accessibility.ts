/**
 * Accessibility Utilities
 * Helper functions for improving accessibility
 */

/**
 * Generate a unique ID for ARIA labels
 */
export const generateAriaId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Get ARIA label for status
 */
export const getStatusAriaLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    DRAFT: 'Status: Draft',
    ACTIVE: 'Status: Active',
    COMPLETED: 'Status: Completed',
    PENDING: 'Status: Pending',
    IN_PROGRESS: 'Status: In Progress',
    BLOCKED: 'Status: Blocked',
    CANCELLED: 'Status: Cancelled',
    APPROVED: 'Status: Approved',
    REJECTED: 'Status: Rejected',
    UNDER_REVIEW: 'Status: Under Review',
    ARCHIVED: 'Status: Archived',
    EXPIRED: 'Status: Expired',
  };
  return statusLabels[status] || `Status: ${status}`;
};

/**
 * Get ARIA label for priority
 */
export const getPriorityAriaLabel = (priority: string): string => {
  const priorityLabels: Record<string, string> = {
    LOW: 'Priority: Low',
    MEDIUM: 'Priority: Medium',
    HIGH: 'Priority: High',
    URGENT: 'Priority: Urgent',
  };
  return priorityLabels[priority] || `Priority: ${priority}`;
};

/**
 * Get ARIA label for progress
 */
export const getProgressAriaLabel = (progress: number, max: number = 100): string => {
  const percentage = Math.round((progress / max) * 100);
  return `Progress: ${percentage}% complete`;
};

/**
 * Get ARIA label for date
 */
export const getDateAriaLabel = (date: string | Date, label: string = 'Date'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatted = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `${label}: ${formatted}`;
};

/**
 * Get ARIA label for list count
 */
export const getListCountAriaLabel = (count: number, itemType: string): string => {
  return `${count} ${itemType}${count !== 1 ? 's' : ''}`;
};

/**
 * Get ARIA label for button action
 */
export const getButtonAriaLabel = (action: string, target?: string): string => {
  if (target) {
    return `${action} ${target}`;
  }
  return action;
};

/**
 * Get ARIA label for form field validation
 */
export const getValidationAriaLabel = (fieldName: string, error?: string): string => {
  if (error) {
    return `${fieldName}: Error - ${error}`;
  }
  return `${fieldName}: Valid`;
};

/**
 * Get ARIA label for pagination
 */
export const getPaginationAriaLabel = (current: number, total: number): string => {
  return `Page ${current} of ${total}`;
};

/**
 * Get ARIA label for sort direction
 */
export const getSortAriaLabel = (column: string, direction?: 'asc' | 'desc'): string => {
  if (!direction) {
    return `Sort by ${column}`;
  }
  return `Sorted by ${column}, ${direction === 'asc' ? 'ascending' : 'descending'}`;
};

/**
 * Get ARIA label for modal/drawer
 */
export const getDialogAriaLabel = (title: string, type: 'modal' | 'drawer' = 'modal'): string => {
  return `${title} ${type}`;
};

/**
 * Get ARIA label for tab
 */
export const getTabAriaLabel = (tabName: string, index: number, total: number): string => {
  return `${tabName} tab, ${index + 1} of ${total}`;
};

/**
 * Visually hidden but screen reader accessible class
 */
export const srOnlyClass = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Check if element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
};

/**
 * Get color contrast ratio for WCAG compliance
 */
export const getContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    // In production, use a proper color library
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r, g, b] = rgb.map((val) => {
      const sRGB = val / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
 */
export const meetsWCAGAA = (
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Check WCAG AAA compliance (7:1 for normal text, 4.5:1 for large text)
 */
export const meetsWCAGAAA = (
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 4.5 : ratio >= 7;
};
