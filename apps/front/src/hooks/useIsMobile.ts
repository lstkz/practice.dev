import { useState, useEffect } from 'react';

const MOBILE_SIZE = 1024;

export function useIsMobile(breakpoint = MOBILE_SIZE) {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize <= breakpoint;
}
