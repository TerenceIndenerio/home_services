import React, { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { checkAuthenticationStatus, withAuthCheck, hasValidSession } from "../utils/authUtils";

/**
 * Example component showing different ways to check authentication
 */
const AuthCheckExample: React.FC = () => {
  const { checkAndRedirect, requireAuth, isAuthenticated, isLoading } = useAuthCheck();

  useEffect(() => {
    // Example 1: Check auth on component mount
    const checkAuthOnMount = async () => {
      const isAuth = await checkAndRedirect();
      if (isAuth) {
        console.log("User is authenticated");
      } else {
        console.log("User redirected to login");
      }
    };

    checkAuthOnMount();
  }, [checkAndRedirect]);

  // Example 2: Protected button action using withAuthCheck
  const handleProtectedAction = withAuthCheck(async () => {
    Alert.alert("Success", "This action is protected and user is authenticated!");
  });

  // Example 3: Manual auth check
  const handleManualCheck = async () => {
    const authStatus = await checkAuthenticationStatus();

    if (authStatus.isAuthenticated) {
      Alert.alert(
        "Authentication Status",
        `Authenticated${authStatus.isOffline ? ' (Offline Mode)' : ''}\nUser ID: ${authStatus.userId}`
      );
    } else {
      Alert.alert("Not Authenticated", "User needs to log in");
    }
  };

  // Example 4: Simple session check
  const handleSessionCheck = async () => {
    const hasSession = await hasValidSession();
    Alert.alert("Session Check", hasSession ? "Valid session" : "No valid session");
  };

  if (isLoading()) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
        Authentication Check Examples
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Authenticated: {isAuthenticated() ? 'Yes' : 'No'}
      </Text>

      <Button
        title="Manual Auth Check"
        onPress={handleManualCheck}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Protected Action"
        onPress={handleProtectedAction}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Session Check"
        onPress={handleSessionCheck}
      />

      <View style={{ height: 20 }} />

      <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
        These examples show different ways to check authentication status and redirect users to login when needed.
      </Text>
    </View>
  );
};

export default AuthCheckExample;