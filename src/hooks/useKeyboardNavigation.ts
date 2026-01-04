/**
 * Keyboard Navigation Hook
 * Handle keyboard navigation for lists, menus, and other interactive elements
 */

import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  loop?: boolean; // Whether to loop from last to first item
  initialIndex?: number;
}

export const useKeyboardNavigation = ({
  itemCount,
  onSelect,
  onEscape,
  loop = true,
  initialIndex = 0,
}: UseKeyboardNavigationOptions) => {
  const activeIndexRef = useRef(initialIndex);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (itemCount === 0) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          activeIndexRef.current = loop
            ? (activeIndexRef.current + 1) % itemCount
            : Math.min(activeIndexRef.current + 1, itemCount - 1);
          // Focus the element
          const nextElement = document.querySelector(
            `[data-keyboard-nav-index="${activeIndexRef.current}"]`
          ) as HTMLElement;
          nextElement?.focus();
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          activeIndexRef.current = loop
            ? (activeIndexRef.current - 1 + itemCount) % itemCount
            : Math.max(activeIndexRef.current - 1, 0);
          // Focus the element
          const prevElement = document.querySelector(
            `[data-keyboard-nav-index="${activeIndexRef.current}"]`
          ) as HTMLElement;
          prevElement?.focus();
          break;
        }

        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect?.(activeIndexRef.current);
          break;

        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;

        case 'Home': {
          event.preventDefault();
          activeIndexRef.current = 0;
          const firstElement = document.querySelector(
            `[data-keyboard-nav-index="0"]`
          ) as HTMLElement;
          firstElement?.focus();
          break;
        }

        case 'End': {
          event.preventDefault();
          activeIndexRef.current = itemCount - 1;
          const lastElement = document.querySelector(
            `[data-keyboard-nav-index="${itemCount - 1}"]`
          ) as HTMLElement;
          lastElement?.focus();
          break;
        }
      }
    },
    [itemCount, loop, onSelect, onEscape]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    getItemProps: (index: number) => ({
      'data-keyboard-nav-index': index,
      tabIndex: index === activeIndexRef.current ? 0 : -1,
      role: 'option',
      'aria-selected': index === activeIndexRef.current,
    }),
  };
};
