import { useState, useEffect } from 'react';
import { MOBILE_MAX_WIDTH } from 'src/Theme';

export function useIsMobile(breakpoint = MOBILE_MAX_WIDTH) {
  const [windowSize, setWindowSize] = useState(window.screen.width);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.screen.width);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize <= breakpoint;
}
