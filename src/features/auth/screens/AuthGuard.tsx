import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/authContext";

const HAS_SETUP_KEY = "hasSetup";
const ABLE_TO_LOGIN_KEY = "ableToLogin";
const TEMP_DISABLE_AUTH = false; // Re-enabled with fixed navigation

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { state, refreshToken, getTokenExpiry, extendSession, isOfflineAuthenticated, canRetry, retryLastOperation } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const hasRedirectedRef = useRef(false);

  // Routes that don't require authentication
  const publicRoutes = [
    '/authentication/Login',
    '/authentication/SignUp',
    '/authentication/OnBoardingScreen',
    '/authentication/UserType',
    '/authentication/LoginScreen',
    '/authentication/PinCode',
    '/authentication/SetupPinScreen'
  ];

  // Check if current route is public (doesn't need auth)
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    // Skip authentication checks for public routes
    if (isPublicRoute) {
      console.log('🔐 AuthGuard: Public route detected, skipping auth check:', pathname);
      return;
    }

    const handleUnauthenticated = async () => {
      console.log('🔐 AuthGuard: Checking authentication status:', state.status, 'hasRedirected:', hasRedirectedRef.current);

      if (state.status === 'unauthenticated' && !hasRedirectedRef.current) {
        console.log('🔐 AuthGuard: User is unauthenticated, checking offline auth...');

        try {
          // First check if user can authenticate offline
          const offlineAuth = await isOfflineAuthenticated();
          if (offlineAuth) {
            console.log('🔐 AuthGuard: User has offline access');
            setIsOfflineMode(true);
            return; // Allow offline access
          }

          // Check if user has already attempted login (ableToLogin flag)
          const ableToLogin = await AsyncStorage.getItem(ABLE_TO_LOGIN_KEY);
          console.log('🔐 AuthGuard: Able to login:', ableToLogin);

          // Mark that we've attempted redirect
          hasRedirectedRef.current = true;

          if (ableToLogin === 'true') {
            // User has already tried to login before - go to login
            console.log('🔐 AuthGuard: User can login, redirecting to /authentication/Login');
            setTimeout(() => {
              router.replace("/authentication/Login");
            }, 100);
          } else {
            // First time user - go to onboarding
            console.log('🔐 AuthGuard: First time user, redirecting to /authentication/OnBoardingScreen');
            setTimeout(() => {
              router.replace("/authentication/OnBoardingScreen");
            }, 100);
          }
        } catch (error) {
          console.error('🔐 AuthGuard: Error checking user status:', error);
          // Default to login for safety
          if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            console.log('🔐 AuthGuard: Error fallback - redirecting to login');
            setTimeout(() => {
              router.replace("/authentication/Login");
            }, 100);
          }
        }
      } else {
        console.log('🔐 AuthGuard: Skipping redirect - status:', state.status, 'hasRedirected:', hasRedirectedRef.current);
      }
    };

    if (state.status === 'unauthenticated' && !TEMP_DISABLE_AUTH) {
      handleUnauthenticated();
    }
  }, [state.status, isOfflineAuthenticated, pathname, isPublicRoute]); // Added pathname and isPublicRoute

  // Reset redirect flag when user becomes authenticated
  useEffect(() => {
    if (state.status === 'authenticated') {
      console.log('🔐 AuthGuard: User authenticated, resetting redirect flag');
      hasRedirectedRef.current = false; // Reset for future logouts
      setIsOfflineMode(false); // Clear offline mode when authenticated
    }
  }, [state.status]);

  // Token refresh logic
  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (state.status === 'authenticated' && state.user && !isRefreshingToken) {
        try {
          const tokenExpiry = await getTokenExpiry();
          if (tokenExpiry) {
            const timeUntilExpiry = tokenExpiry - Date.now();
            // Refresh token if it expires in less than 5 minutes
            if (timeUntilExpiry < 5 * 60 * 1000) {
              setIsRefreshingToken(true);
              await refreshToken();
              extendSession(); // Extend session when token is refreshed
              setIsRefreshingToken(false);
            }
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
          setIsRefreshingToken(false);
        }
      }
    };

    handleTokenRefresh();
  }, [state.status, state.user, refreshToken, getTokenExpiry, extendSession, isRefreshingToken]);

  // Allow public routes to render immediately
  if (isPublicRoute) {
    console.log('🔐 AuthGuard: Rendering public route:', pathname);
    return <>{children}</>;
  }

  // Show loading state
  if (state.status === 'loading' || state.status === 'idle' || isRefreshingToken) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          {isRefreshingToken ? "Refreshing session..." : "Loading..."}
        </Text>
      </View>
    );
  }

  // Show error state
  if (state.status === 'error') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, color: "#ff4444", marginBottom: 20, textAlign: "center" }}>
          Authentication Error
        </Text>
        <Text style={{ color: "#666", marginBottom: 10, textAlign: "center" }}>
          {state.error || "An error occurred during authentication"}
        </Text>
        {state.errorCode && (
          <Text style={{ color: "#999", fontSize: 12, marginBottom: 20, textAlign: "center" }}>
            Error Code: {state.errorCode}
          </Text>
        )}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {canRetry() && (
            <TouchableOpacity
              onPress={retryLastOperation}
              style={{
                backgroundColor: "#4CAF50",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry ({3 - state.retryCount} left)</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                router.replace("/authentication/Login");
              }, 100);
            }}
            style={{
              backgroundColor: "#8B5CF6",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Login Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show custom fallback or default loading for unauthenticated (unless offline mode)
  if (state.status === 'unauthenticated' && !TEMP_DISABLE_AUTH && !isOfflineMode) {
    return fallback || (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ marginTop: 10, color: "#666" }}>Redirecting...</Text>
      </View>
    );
  }

  // User is authenticated or in offline mode, render children
  return (
    <>
      {isOfflineMode && (
        <View style={{
          backgroundColor: '#FFA500',
          padding: 8,
          alignItems: 'center'
        }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
            OFFLINE MODE - Limited functionality available
          </Text>
        </View>
      )}
      {children}
    </>
  );
};

export default AuthGuard;
