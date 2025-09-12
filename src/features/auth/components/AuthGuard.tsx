import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useAuthCheck } from "../hooks/useAuthCheck";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true
}) => {
  const { requireAuth: checkAuth, isAuthenticated, isLoading, hasError } = useAuthCheck();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      if (requireAuth) {
        await checkAuth();
      }
      setAuthChecked(true);
    };

    performAuthCheck();
  }, [requireAuth, checkAuth]);

  // Show loading while checking authentication
  if (isLoading() || !authChecked) {
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
        <Text style={{ marginTop: 10, color: "#666" }}>Checking authentication...</Text>
      </View>
    );
  }

  // If authentication is required and user is not authenticated, show fallback or nothing
  if (requireAuth && !isAuthenticated()) {
    return fallback || null;
  }

  // If there's an error, show fallback
  if (hasError()) {
    return fallback || (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ color: "#ff4444", textAlign: "center" }}>
          Authentication check failed
        </Text>
      </View>
    );
  }

  // User is authenticated or auth is not required
  return <>{children}</>;
};

export default AuthGuard;