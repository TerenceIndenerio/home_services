import React from "react";
import { View, Text, Image } from "react-native";
import { loginStyles } from "../../../src/styles/loginStyles";

interface LoginHeaderProps {
  logoUrl: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ logoUrl }) => {
  return (
    <>
      <View style={loginStyles.logoContainer}>
        <Image source={{ uri: logoUrl }} style={loginStyles.logo} />
      </View>
      <View style={loginStyles.welcomeContainer}>
        <View style={loginStyles.helloText}>
          <Text
            style={{
              fontSize: 25,
              color: "rgba(68, 68, 68, 1)",
              fontWeight: "600",
            }}
          >
            Hello There,
          </Text>
        </View>
        <View style={loginStyles.welcomeText}>
          <Text
            style={{
              fontSize: 30,
              color: "rgba(140, 82, 255, 1)",
              fontWeight: "900",
            }}
          >
            Welcome Back!
          </Text>
        </View>
      </View>
    </>
  );
};

export default LoginHeader;
