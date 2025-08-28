import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "@/app/constants/Colors";
import { useColorScheme } from "@/src/utils/useColorScheme";
import { Animated, Text } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';

  const scaleAnim = (focused: boolean) => ({
    transform: [{ scale: focused ? 1.05 : 1 }],
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8C52FF', // active icon and label color
        tabBarInactiveTintColor: '#888', // optional: subtle gray for inactive
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveBackgroundColor: '#f3edff', // subtle light purple background for active tab
        tabBarInactiveBackgroundColor: '#ffffff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Animated.View style={scaleAnim(focused)}>
              <TabBarIcon name="home" color="#8C52FF" />
            </Animated.View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[scaleAnim(focused), { color, fontSize: 12 }]}>Home</Animated.Text>
          ),
        }}
      />

      <Tabs.Screen
        name="tabOne"
        options={{
          title: "Jobs",
          tabBarIcon: ({ focused }) => (
            <Animated.View style={scaleAnim(focused)}>
              <TabBarIcon name="clipboard" color="#8C52FF" />
            </Animated.View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[scaleAnim(focused), { color, fontSize: 12 }]}>Jobs</Animated.Text>
          ),
        }}
      />

      <Tabs.Screen
        name="tabTwo"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <Animated.View style={scaleAnim(focused)}>
              <TabBarIcon name="inbox" color="#8C52FF" />
            </Animated.View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[scaleAnim(focused), { color, fontSize: 12 }]}>Messages</Animated.Text>
          ),
        }}
      />

      <Tabs.Screen
        name="tabThree"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <Animated.View style={scaleAnim(focused)}>
              <TabBarIcon name="user" color="#8C52FF" />
            </Animated.View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[scaleAnim(focused), { color, fontSize: 12 }]}>Account</Animated.Text>
          ),
        }}
      />
    </Tabs>
  );
}
