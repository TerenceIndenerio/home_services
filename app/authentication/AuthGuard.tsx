import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "./context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

const SESSION_KEY = "sessionExpiresAt";
const HAS_SETUP_KEY = "onBoard";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const [hasSetup, setHasSetup] = useState<boolean>(false);

  const isSessionExpired = async () => {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    if (!session) return true;
    const expiresAt = parseInt(session, 10);
    return Date.now() >= expiresAt;
  };

  useEffect(() => {
    const runCheck = async () => {
      if (!loading && !user) {
        const expired = await isSessionExpired();

        if (!expired) {
          // Session still valid → treat like setup is done
          setHasSetup(true);
        } else {
          // Session expired → check onboarding
          const setup = await AsyncStorage.getItem(HAS_SETUP_KEY);
          setHasSetup(!!setup);
        }
      }
      setChecking(false);
    };
    runCheck();
  }, [user, loading]);

  // While checking authentication/session
  if (loading || checking) {
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
      </View>
    );
  }

  // No user → redirect
  if (!user) {
    return (
      <Redirect
        href={
          hasSetup
            ? "/authentication/PinCode"
            : "/authentication/OnBoardingScreen"
        }
      />
    );
  }

  // User authenticated → render protected content
  return <>{children}</>;
};

export default AuthGuard;
