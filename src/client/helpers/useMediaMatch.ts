import { useEffect, useState } from 'react';

export default function useMediaMatch(query: string) {
  const [mediaMatch, setMediaMatch] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleMediaChange = () => setMediaMatch(mediaQueryList.matches);
    // Call the handler when the component mounts to set the state.
    handleMediaChange();
    // Add an event listener for media query status changes.
    mediaQueryList.addEventListener('change', handleMediaChange);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => mediaQueryList.removeEventListener('change', handleMediaChange);
  }, []);

  return mediaMatch;
}
