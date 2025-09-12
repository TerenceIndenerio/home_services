import React from "react";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { YStack, XStack } from "tamagui";
import AuthButton from "../components/AuthButton";

const AuthLanding: React.FC = () => {
  const router = useRouter();

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        flex={1}
        backgroundColor="$purple9"
        paddingHorizontal="$4"
        paddingTop="$10"
        paddingBottom="$10"
        justifyContent="space-between"
        alignItems="center"
      >
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/9953241a85c07cd9d7700f15635da9520d300b90",
            }}
            style={{ width: 250, height: 250 }}
            resizeMode="contain"
            accessibilityLabel="Handy Janny Logo"
          />
        </YStack>

        <YStack width="100%" maxWidth={353} gap="$3">
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
        </YStack>
      </YStack>
    </YStack>
  );
};

export default AuthLanding;
