import React, { useEffect } from "react";
import { ScrollView, Alert, View, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { loginStyles } from "../../../styles/loginStyles";
import LoginHeader from "../components/LoginHeader";
import LoginForm from "../components/LoginForm";
import SocialLogin from "../components/SocialLogin";
import { useRouter } from "expo-router";
import { auth } from "../../../../firebaseConfig";
import ErrorModal from "../components/ErrorModal";
import { useAuth } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
  const router = useRouter();
  const { setUserDocumentId } = useAuth();

  const [errorVisible, setErrorVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // TODO: Add your Google Client ID here
    clientId: "<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com",
  });

  // Check hasSetup on mount
  useEffect(() => {
    const checkHasSetup = async () => {
      try {
        const value = await AsyncStorage.getItem("onBoard");
        if (!value) {
          router.replace("/authentication/OnBoardingScreen");
        }
      } catch (err) {
        console.error("Error reading onBoard from AsyncStorage:", err);
      }
    };

    checkHasSetup();
  }, []);

  // Handle Google login
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          console.log("Google sign-in success:", userCredential.user);
          // Save UID using auth context
          await setUserDocumentId(userCredential.user.uid);
          router.replace("/");
        })
        .catch((error) => {
          console.error("Firebase Google sign-in error:", error);
          setTimeout(() => {
            Alert.alert("Google Sign-In Failed", error.message);
          }, 100);
        });
    }
  }, [response]);

  const handleLogin = async (emailOrPhone: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailOrPhone,
        password
      );
      const uid = userCredential.user.uid;

      // Save UID using auth context
      await setUserDocumentId(uid);

      console.log("Login successful:", uid);
      router.replace("/");
    } catch (error: any) {
      console.error("Login failed:", error);

      let message = "An unexpected error occurred. Please try again later.";

      if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        message =
          "We couldn't find an account with that email or phone number.";
      } else if (error.code === "auth/wrong-password") {
        message = "The password you entered is incorrect.";
      }

      setErrorMessage(message);
      setErrorVisible(true);
    }
  };


  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
  };

  const handleSocialLogin = (platform: string) => {
    if (platform === "Google") {
      promptAsync();
    } else {
      Alert.alert("Social Login", `${platform} login not implemented yet.`);
    }
  };

  const socialIcons = [
    {
      id: "google",
      url: "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/e669315d9f1841b20c898acbe27da9e7216e6ed5?placeholderIfAbsent=true",
      onPress: () => handleSocialLogin("Google"),
    },
    {
      id: "facebook",
      url: "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/92d8a699075747f4e1ba8ef959cdde6fd78797ab?placeholderIfAbsent=true",
      onPress: () => handleSocialLogin("Facebook"),
    },
    {
      id: "apple",
      url: "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/a4af6c21c9a0a6e7c6b99c36622b22c3d16d601e?placeholderIfAbsent=true",
      onPress: () => handleSocialLogin("Apple"),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <ScrollView contentContainerStyle={loginStyles.container} keyboardShouldPersistTaps="handled">
        <LoginHeader logoUrl="https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/7e211eedc40e0ae6c463f082b4afa33b366aceb9?placeholderIfAbsent=true" />
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 15, color: '#444', fontWeight: '400', fontFamily: 'Inter', textAlign: 'center', marginTop: 4, marginBottom: 8 }}>
            Login to your account to continue
          </Text>
        </View>
        <ErrorModal
          visible={errorVisible}
          message={errorMessage}
          onClose={() => setErrorVisible(false)}
        />
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
        />
      </ScrollView>
    </View>
  );
};

export default Login;
