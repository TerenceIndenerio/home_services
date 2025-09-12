import { useRouter } from "expo-router";
import { useRef, useEffect } from "react";
import { useAuth } from "../context/authContext";

export const useAuthCheck = () => {
  const router = useRouter();
  const { checkAuthAndRedirect, state } = useAuth();
  const hasRedirectedRef = useRef(false);

  // Reset redirect flag when user becomes authenticated
  useEffect(() => {
    if (state.status === 'authenticated') {
      hasRedirectedRef.current = false; // Reset for future logouts
    }
  }, [state.status]);

  const checkAndRedirect = async (): Promise<boolean> => {
    try {
      const isAuthenticated = await checkAuthAndRedirect();

      if (!isAuthenticated && !hasRedirectedRef.current) {
        // Mark that we've redirected
        hasRedirectedRef.current = true;
        // Redirect to login screen
        router.replace("/authentication/Login");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace("/authentication/Login");
      }
      return false;
    }
  };

  const requireAuth = async (): Promise<boolean> => {
    // Quick check first
    if (state.status === 'authenticated' || state.status === 'loading') {
      return true;
    }

    // Full check with redirect
    return await checkAndRedirect();
  };

  const isAuthenticated = (): boolean => {
    return state.status === 'authenticated' && !!state.user;
  };

  const isLoading = (): boolean => {
    return state.status === 'loading' || state.status === 'idle';
  };

  const hasError = (): boolean => {
    return state.status === 'error';
  };

  return {
    checkAndRedirect,
    requireAuth,
    isAuthenticated,
    isLoading,
    hasError,
    authState: state,
  };
};