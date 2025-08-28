import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "../src/features/auth/context/authContext";
import { useColorScheme } from "../src/utils/useColorScheme";

export { ErrorBoundary } from "expo-router";

export const navigationOptions = {
  headerShown: false,
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="seeker" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen
            name="authentication/OnBoardingScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/UserType"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/LoginScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/Login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/SignUp"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/AuthGuard"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/PinCode"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="authentication/SetupPinScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search/SearchMenu"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search/SearchResults"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewProfile/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ViewProfile/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SeekerDashboard/SeekerDashboardScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AccountProfile/AccountProfileScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Messages/ChatScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Messages/MessagesListScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Jobs/JobDetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ServiceDetails/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SeekerEditProfileScreen/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Messages/chat" options={{ headerShown: false }} />
          <Stack.Screen
            name="Bookings/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="category-users/[category]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Jobs/booking/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderStatus/OrderStatusScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Jobs/booking/map"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="soon"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
