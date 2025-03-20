'use client';

import { useState, useEffect } from 'react';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ScreenDimensions {
  width: number;
  height: number;
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useScreenSize = (): ScreenDimensions => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Chama na primeira execução

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getScreenSize = (): ScreenSize => {
    const { width } = windowSize;
    if (width < 376) return 'xs';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  };

  const screenSize = getScreenSize();
  const isMobile = ['xs', 'sm'].includes(screenSize);
  const isTablet = ['md', 'lg'].includes(screenSize);
  const isDesktop = ['xl', '2xl'].includes(screenSize);

  return {
    width: windowSize.width,
    height: windowSize.height,
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
  };
}; 