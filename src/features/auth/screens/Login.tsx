import React, { useEffect } from "react";
import { Alert, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { ScrollView, YStack, Text } from "tamagui";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginStyles } from "../../../styles/loginStyles";
import LoginHeader from "../components/LoginHeader";
import LoginForm from "../components/LoginForm";
import SocialLogin from "../components/SocialLogin";
import { useRouter } from "expo-router";
import { auth } from "../../../../firebaseConfig";
import ErrorModal from "../components/ErrorModal";
import { useAuth } from "../context/authContext";

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
  const router = useRouter();
  const { login, state, clearError } = useAuth();

  const [errorVisible, setErrorVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // TODO: Add your Google Client ID here
    clientId: "<YOUR_GOOGLE_CLIENT_ID>.apps.googleusercontent.com",
  });


  
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
           console.log("Google sign-in success:", userCredential.user);

           // Set ableToLogin flag for future app launches
           await AsyncStorage.setItem("ableToLogin", "true");

           // The AuthContext will handle the user state automatically
           // Just navigate to home
           router.replace("/");
         })
        .catch((error) => {
          console.error("Firebase Google sign-in error:", error);
          setTimeout(() => {
            Alert.alert("Google Sign-In Failed", error.message);
          }, 100);
        });
    }
  }, [response, router]);

  const handleLogin = async (emailOrPhone: string, password: string) => {
    try {
      clearError(); // Clear any previous errors
      await login(emailOrPhone, password);
      console.log("Login successful");

      // Set ableToLogin flag for future app launches
      await AsyncStorage.setItem("ableToLogin", "true");

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

  const handleSignUp = () => {
    router.push("/authentication/SignUp");
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FAFAFA' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={{ ...loginStyles.container, flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LoginHeader logoUrl="https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/7e211eedc40e0ae6c463f082b4afa33b366aceb9?placeholderIfAbsent=true" />
        <YStack style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{
            fontSize: 18,
            color: '#666',
            fontWeight: '500',
            fontFamily: 'Inter',
            textAlign: 'center',
            marginTop: 4,
            marginBottom: 8,
            lineHeight: 24
          }}>
            Please login to continue
          </Text>
        </YStack>
        <ErrorModal
          visible={errorVisible}
          message={errorMessage}
          onClose={() => setErrorVisible(false)}
        />
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
        />
        <YStack style={loginStyles.signUpContainer}>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={loginStyles.signUpText}>
              Don't have an account? <Text style={loginStyles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
