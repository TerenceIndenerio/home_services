import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@/app/authentication/Login"; 

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      {}
    </Stack.Navigator>
  );
}
