import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import { loginStyles } from "../../../../src/styles/loginStyles";
import { Input, Button, YStack, XStack, Text } from "tamagui";
import { useAuth } from "../context/authContext";

interface LoginFormProps {
  onLogin: (emailOrPhone: string, password: string) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const { isBiometricAvailable, authenticateWithBiometrics } = useAuth();

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
    };
    checkBiometricAvailability();
  }, [isBiometricAvailable]);

  const handleLoginPress = () => {
    onLogin(emailOrPhone, password);
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        // For biometric login, we need stored credentials
        // This is a simplified implementation
        Alert.alert("Success", "Biometric authentication successful!");
        // In a real implementation, you'd retrieve stored credentials and login
      } else {
        Alert.alert("Failed", "Biometric authentication failed");
      }
    } catch (error) {
      Alert.alert("Error", "Biometric authentication error");
    }
  };

  return (
    <YStack style={loginStyles.formContainer}>
      <YStack style={loginStyles.inputContainer}>
        <Text style={loginStyles.inputText}>
          Email address or mobile number
        </Text>
        <Input
          style={loginStyles.textInput}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter email or phone"
        />
      </YStack>

      <YStack style={loginStyles.inputContainer}>
        <Text style={loginStyles.inputText}>Password</Text>
        <Input
          style={loginStyles.textInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
        />
      </YStack>

      <YStack style={loginStyles.buttonContainer}>
        <Button
          style={loginStyles.loginButton}
          onPress={handleLoginPress}
        >
          <Text style={loginStyles.loginButtonText}>Login</Text>
        </Button>

        {biometricAvailable && (
          <Button
            style={[loginStyles.loginButton, { backgroundColor: '#4CAF50', marginTop: 10 }]}
            onPress={handleBiometricLogin}
          >
            <Text style={loginStyles.loginButtonText}>Login with Biometrics</Text>
          </Button>
        )}

        <TouchableOpacity onPress={onForgotPassword}>
          <YStack style={loginStyles.forgotPassword}>
            <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
          </YStack>
        </TouchableOpacity>
      </YStack>
    </YStack>
  );
};

export default LoginForm;
