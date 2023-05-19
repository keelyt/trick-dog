import { useEffect } from 'react';

import type { MutableRefObject } from 'react';

/**
 * A React hook that automatically expands a textarea element based on its content.
 * @param ref The ref attached to the textarea element.
 */
export default function useAutoExpandTextArea(ref: MutableRefObject<HTMLTextAreaElement | null>) {
  useEffect(() => {
    const autoExpand = () => {
      if (ref.current) {
        // Reset the height
        ref.current.style.height = 'inherit';
        // Get the computed styles for the textarea.
        const computed = window.getComputedStyle(ref.current);
        // Calculate the new height.
        const height =
          parseInt(computed.getPropertyValue('border-top-width'), 10) +
          parseInt(computed.getPropertyValue('padding-top'), 10) +
          ref.current.scrollHeight +
          parseInt(computed.getPropertyValue('padding-bottom'), 10) +
          parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        // Set the new height
        ref.current.style.height = `${height}px`;
      }
    };
    // Call the handler when the component mounts to set the initial style.
    autoExpand();
    // Add input event listener.
    ref.current?.addEventListener('input', autoExpand);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => ref.current?.removeEventListener('input', autoExpand);
  }, [ref]);
}
