import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useColorScheme } from "../../src/utils/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8C52FF",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tabOne"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "briefcase" : "briefcase-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tabTwo"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "chatbubbles" : "chatbubbles-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tabThree"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
