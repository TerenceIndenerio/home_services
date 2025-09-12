import { useRouter } from 'expo-router';
import { useRef, useCallback } from 'react';

export const useThrottledRouter = (throttleMs: number = 100) => {
  const router = useRouter();
  const lastCallRef = useRef<number>(0);

  const throttledPush = useCallback((href: any) => {
    const now = Date.now();
    if (now - lastCallRef.current >= throttleMs) {
      lastCallRef.current = now;
      router.push(href);
    }
  }, [router, throttleMs]);

  const throttledReplace = useCallback((href: any) => {
    const now = Date.now();
    if (now - lastCallRef.current >= throttleMs) {
      lastCallRef.current = now;
      router.replace(href);
    }
  }, [router, throttleMs]);

  return {
    ...router,
    push: throttledPush,
    replace: throttledReplace,
  };
};