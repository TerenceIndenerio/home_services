import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

const HAS_SETUP_KEY = "hasSetup";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const [redirectHref, setRedirectHref] = useState<string | null>(null);

  useEffect(() => {
    const runCheck = async () => {
      if (!loading) {
        if (user) {
          
          setChecking(false);
        } else {
          
          const setup = await AsyncStorage.getItem(HAS_SETUP_KEY);
          const setupBoolean = !!setup;
          const href = setupBoolean ? "/authentication/Login" : "/authentication/OnBoardingScreen";
          setRedirectHref(href);
          setChecking(false);
        }
      }
    };
    runCheck();
  }, [user, loading]);

  
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

  
  if (!user && redirectHref) {
    return <Redirect href={redirectHref} />;
  }

  
  return <>{children}</>;
};

export default AuthGuard;
