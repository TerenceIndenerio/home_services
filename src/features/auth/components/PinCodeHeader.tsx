import * as React from "react";
import { View, StyleSheet, Image } from "react-native";

interface LoginHeaderProps {}

export const LoginHeader: React.FC<LoginHeaderProps> = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/232ebf2a1eaf166daf206c0ea04ed45512b6c57c?placeholderIfAbsent=true",
        }}
        style={styles.image}
      />
    </View>
  );
};

// Default export to satisfy Expo Router
export default LoginHeader;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  image: {
    aspectRatio: 0.98,
    width: 250,
    maxWidth: "100%",
  },
});
