import { useRouter, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthCheckResult {
  isAuthenticated: boolean;
  needsRedirect: boolean;
  userId?: string;
  isOffline?: boolean;
}

/**
 * Checks if user is authenticated (online or offline)
 * @returns Promise<AuthCheckResult>
 */
export const checkAuthenticationStatus = async (): Promise<AuthCheckResult> => {
  try {
    // Check online authentication first
    const userData = await AsyncStorage.getItem('user_document_id');
    const sessionExpiry = await AsyncStorage.getItem('sessionExpiresAt');

    if (userData && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry);
      if (Date.now() < expiryTime) {
        return {
          isAuthenticated: true,
          needsRedirect: false,
          userId: userData,
          isOffline: false,
        };
      }
    }

    // Check offline authentication
    const offlineUser = await AsyncStorage.getItem('offline_user');
    const offlineExpiry = await AsyncStorage.getItem('offline_session_expiry');

    if (offlineUser && offlineExpiry) {
      const expiryTime = parseInt(offlineExpiry);
      if (Date.now() < expiryTime) {
        const user = JSON.parse(offlineUser);
        return {
          isAuthenticated: true,
          needsRedirect: false,
          userId: user.uid,
          isOffline: true,
        };
      }
    }

    // Not authenticated
    return {
      isAuthenticated: false,
      needsRedirect: true,
    };
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return {
      isAuthenticated: false,
      needsRedirect: true,
    };
  }
};

/**
 * Redirects to login if not authenticated
 * @param router - Expo router instance
 * @returns Promise<boolean> - true if authenticated, false if redirected
 */
export const checkAuthAndRedirect = async (router: ReturnType<typeof useRouter>): Promise<boolean> => {
  const authStatus = await checkAuthenticationStatus();

  if (!authStatus.isAuthenticated) {
    router.replace('/authentication/Login');
    return false;
  }

  return true;
};

/**
 * Higher-order function to protect route handlers
 * @param handler - The function to protect
 * @returns Protected function that checks auth first
 */
export const withAuthCheck = <T extends any[], R>(
  handler: (...args: T) => R | Promise<R>
) => {
  return async (...args: T): Promise<R | null> => {
    const authStatus = await checkAuthenticationStatus();

    if (!authStatus.isAuthenticated) {
      // In a real app, you'd trigger navigation here
      console.warn('User not authenticated, action blocked');
      return null;
    }

    return handler(...args);
  };
};

/**
 * Checks if user has valid session (not expired)
 * @returns Promise<boolean>
 */
export const hasValidSession = async (): Promise<boolean> => {
  const authStatus = await checkAuthenticationStatus();
  return authStatus.isAuthenticated;
};

/**
 * Gets current user ID if authenticated
 * @returns Promise<string | null>
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const authStatus = await checkAuthenticationStatus();
  return authStatus.userId || null;
};

/**
 * Checks if user is in offline mode
 * @returns Promise<boolean>
 */
export const isOfflineMode = async (): Promise<boolean> => {
  const authStatus = await checkAuthenticationStatus();
  return authStatus.isOffline || false;
};

/**
 * Simple function to check if user is logged in and redirect to login if not
 * @param customRouter - Optional router instance (uses global router if not provided)
 * @returns Promise<boolean> - true if authenticated, false if redirected to login
 */
export const checkLoginAndRedirect = async (customRouter?: any): Promise<boolean> => {
  const authStatus = await checkAuthenticationStatus();

  if (!authStatus.isAuthenticated) {
    console.log('🔐 checkLoginAndRedirect: User not authenticated, checking ableToLogin status');

    // Check if user has already attempted login before
    const ableToLogin = await AsyncStorage.getItem('ableToLogin');
    const routerToUse = customRouter || router;

    let redirectPath = '/authentication/OnBoardingScreen'; // Default for first-time users

    if (ableToLogin === 'true') {
      redirectPath = '/authentication/Login'; // User has tried logging in before
      console.log('🔐 checkLoginAndRedirect: User can login, redirecting to Login');
    } else {
      console.log('🔐 checkLoginAndRedirect: First-time user, redirecting to OnBoarding');
    }

    try {
      // Try push first
      routerToUse.push(redirectPath);
      console.log('🔐 checkLoginAndRedirect: Navigation initiated with push to', redirectPath);
    } catch (error) {
      console.error('🔐 checkLoginAndRedirect: Push failed, trying replace:', error);
      try {
        // Fallback to replace
        routerToUse.replace(redirectPath);
        console.log('🔐 checkLoginAndRedirect: Navigation initiated with replace to', redirectPath);
      } catch (replaceError) {
        console.error('🔐 checkLoginAndRedirect: Replace also failed:', replaceError);
      }
    }
    return false;
  }

  console.log('🔐 checkLoginAndRedirect: User is authenticated');
  return true;
};

/**
 * Hook-based version that automatically gets the router
 * @returns Function to check auth and redirect
 */
export const useCheckLoginAndRedirect = () => {
  const router = useRouter();

  return async (): Promise<boolean> => {
    const authStatus = await checkAuthenticationStatus();

    if (!authStatus.isAuthenticated) {
      console.log('🔐 useCheckLoginAndRedirect: User not authenticated, checking ableToLogin status');

      // Check if user has already attempted login before
      const ableToLogin = await AsyncStorage.getItem('ableToLogin');

      let redirectPath = '/authentication/OnBoardingScreen'; // Default for first-time users

      if (ableToLogin === 'true') {
        redirectPath = '/authentication/Login'; // User has tried logging in before
        console.log('🔐 useCheckLoginAndRedirect: User can login, redirecting to Login');
      } else {
        console.log('🔐 useCheckLoginAndRedirect: First-time user, redirecting to OnBoarding');
      }

      try {
        router.push(redirectPath);
        console.log('🔐 useCheckLoginAndRedirect: Navigation initiated to', redirectPath);
      } catch (error) {
        console.error('🔐 useCheckLoginAndRedirect: Navigation failed:', error);
        try {
          router.replace(redirectPath);
        } catch (replaceError) {
          console.error('🔐 useCheckLoginAndRedirect: Replace also failed:', replaceError);
        }
      }
      return false;
    }

    console.log('🔐 useCheckLoginAndRedirect: User is authenticated');
    return true;
  };
};