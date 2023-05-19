import { useCallback, useEffect } from 'react';

import type { MutableRefObject } from 'react';

/**
 * A React hook that shifts focus to the first focusable element when the component mounts and
 * adds an event listener for the Tab key that keeps focus within the provided ref when the key is pressed.
 * @param ref The ref attached to the element that is to be kept in focus.
 */
export default function useTabFocus(ref: MutableRefObject<HTMLDivElement | null>) {
  // Elements that can take focus
  // Note: This list works in this project but may not be complete in all projects.
  const focusableElementTypes =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  /**
   * A memoized callback function that checks if the key that was pressed is the Tab key and sets the focus on the correct element if it is.
   * @param event The keyboard event object.
   */
  const handleTab = useCallback(
    (event: KeyboardEvent) => {
      // Immediately return if the key pressed was not tab.
      if (event.key !== 'Tab' || !ref.current) return;

      // Query for all focusable elements within the provided ref.
      const focusableElements = ref.current.querySelectorAll<HTMLElement>(focusableElementTypes);

      if (focusableElements.length === 0) return;

      const firstElement: HTMLElement = focusableElements[0];
      const lastElement: HTMLElement = focusableElements[focusableElements.length - 1];

      // If tabbing forward and last focusable element is focused, shift focus to the first focusable element.
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
      // If tabbing backward and first focusable element is focused, shift focus to the last focusable element.
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    },
    [ref]
  );

  useEffect(() => {
    // Focus on first focusable element when the component mounts.
    ref.current?.querySelector<HTMLElement>(focusableElementTypes)?.focus();

    // Add the event listener to the document object when the component mounts.
    document.addEventListener('keydown', handleTab);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [handleTab]);
}
