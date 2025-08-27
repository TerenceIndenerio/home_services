import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { loginStyles } from "../../../src/styles/loginStyles";

interface LoginFormProps {
  onLogin: (emailOrPhone: string, password: string) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = () => {
    onLogin(emailOrPhone, password);
  };

  return (
    <View style={loginStyles.formContainer}>
      <View style={loginStyles.inputContainer}>
        <Text style={loginStyles.inputText}>
          Email address or mobile number
        </Text>
        <TextInput
          style={loginStyles.textInput}
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={loginStyles.inputContainer}>
        <Text style={loginStyles.inputText}>Password</Text>
        <TextInput
          style={loginStyles.textInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={loginStyles.buttonContainer}>
        <TouchableOpacity
          style={loginStyles.loginButton}
          onPress={handleLoginPress}
        >
          <Text style={loginStyles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onForgotPassword}>
          <View style={loginStyles.forgotPassword}>
            <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
