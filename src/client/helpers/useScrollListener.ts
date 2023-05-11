import { useEffect, useState } from 'react';

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
    // Add scroll event listener.
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollData;
}
