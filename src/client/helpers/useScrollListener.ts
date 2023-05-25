import { useEffect, useState } from 'react';

/**
 * A React hook that listens to scroll events and returns scroll data.
 * @returns scrollData Object containing scroll position data.
 * @returns scrollData.x Current horizontal scroll position.
 * @returns scrollData.y Current vertical scroll position.
 * @returns scrollData.prevX Previous horizontal scroll position.
 * @returns scrollData.prevY Previous vertical scroll position.
 */
export default function useScrollListener() {
  const [scrollData, setScrollData] = useState({ x: 0, y: 0, prevX: 0, prevY: 0 });

  useEffect(() => {
    const handleScroll = () =>
      setScrollData((prev) => ({
        x: window.scrollX,
        y: window.scrollY,
        prevX: prev.x,
        prevY: prev.y,
      }));
    // Call the handler when the component mounts to set the state.
    handleScroll();
    // Throttle the scroll handler with a wait of 100ms.
    const throttledHandleScroll = (() => {
      let wait = false;

      return () => {
        if (wait) return;

        handleScroll();
        wait = true;
        setTimeout(() => {
          wait = false;
        }, 100);
      };
    })();
    // Add scroll event listener.
    window.addEventListener('scroll', throttledHandleScroll);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return scrollData;
}
