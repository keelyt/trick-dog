import { useCallback, useEffect } from 'react';

import type { MutableRefObject } from 'react';

/**
 * A React hook that adds an event listener for a mouse click outside of a specified element and calls a callback function when the click occurs.
 * @param handleClose The function to be called when a click occurs outside of the specified element.
 * @param ref A ref object that represents the specified element.
 */
export default function useOutsideClick(
  handleClose: () => void,
  ref: MutableRefObject<HTMLDivElement | null> | undefined
) {
  /**
   * A memoized callback function that checks if the click occurred outside of the specified element and calls the handleClose function if it did.
   * @param event - The mouse event object.
   */
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (
        ref?.current?.contains &&
        event.target instanceof Element &&
        !ref.current.contains(event.target)
      ) {
        // If the event target does not contain the ref element, call the close handler.
        handleClose();
      }
    },
    [handleClose, ref]
  );

  useEffect(() => {
    // Add the event listener to the document object when the component mounts.
    document.addEventListener('mouseup', handleClick);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      document.removeEventListener('mouseup', handleClick);
    };
  }, [handleClick]);
}
