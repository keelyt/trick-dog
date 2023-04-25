import { useCallback, useEffect } from 'react';

/**
 * A React hook that adds an event listener for the Escape key and calls a callback function when the key is pressed.
 * @param handleClose The function to be called when the Escape key is pressed.
 */
export default function useEscapeKey(handleClose: () => void) {
  /**
   * A memoized callback function that checks if the key that was pressed is the Escape key and calls the handleClose function if it is.
   * @param event The keyboard event object.
   */
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    // Add the event listener to the document object when the component mounts.
    document.addEventListener('keyup', handleEscKey);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      document.removeEventListener('keyup', handleEscKey);
    };
  }, [handleEscKey]);
}
