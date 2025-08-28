import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import AuthButton from "../components/AuthButton";

const AuthLanding: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/9953241a85c07cd9d7700f15635da9520d300b90",
            }}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Handy Janny Logo"
          />
        </View>

        <View style={styles.buttonContainer}>
          <AuthButton
            text="Login"
            variant="primary"
            onPress={() => router.push("/authentication/Login")}
          />
          <AuthButton
            text="Sign Up"
            variant="secondary"
            onPress={() => router.push("/authentication/SignUp")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8C52FF",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 80,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 353,
    gap: 12,
  },
});

export default AuthLanding;
