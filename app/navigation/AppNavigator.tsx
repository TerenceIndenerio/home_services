import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@/app/(tabs)";
import SeekerProfileScreen from "../AccountProfile/SeekerProfileScreen";
import ChatScreen from "../Messages/ChatScreen";

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
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SeekerProfile" component={SeekerProfileScreen} />
    </Stack.Navigator>
  );
}
