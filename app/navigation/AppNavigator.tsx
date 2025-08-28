import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@/app/(tabs)"; // Update to your actual home screen
import SeekerProfileScreen from "@/app/AccountProfile/SeekerProfileScreen";
import ChatScreen from "@/app/Messages/components/ChatScreen";

export type RootStackParamList = {
  Home: undefined;
  SeekerProfile: undefined;
  ChatScreen: {
    chatId: string;
    userName: string;
    userRole: string;
    userAvatar: any;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SeekerProfile" component={SeekerProfileScreen} />
      {/* Add other app screens here */}
    </Stack.Navigator>
  );
}
