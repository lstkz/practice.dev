import { useState, useEffect } from 'react';
import { MOBILE_MAX_WIDTH } from 'ui';

export function useIsMobile(breakpoint = MOBILE_MAX_WIDTH) {
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
