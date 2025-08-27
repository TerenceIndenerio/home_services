import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@/app/authentication/Login"; // Ensure this path is correct

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      {/* Add Signup or ForgotPassword screens here if needed */}
    </Stack.Navigator>
  );
}
