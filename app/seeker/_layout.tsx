import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "../constants/Colors";
import { useColorScheme } from "../../src/utils/useColorScheme";
import { Animated, Text } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  showDot?: boolean;
  focused?: boolean;
}) {
  return (
    <Animated.View style={{ transform: [{ scale: props.focused ? 1.05 : 1 }] }}>
      <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
      {props.showDot && (
        <FontAwesome
          name="circle"
          size={10}
          color="#F44336"
          style={{ position: "absolute", top: 2, right: -2 }}
        />
      )}
    </Animated.View>
  );
}

export default function SeekerTabLayout() {
  const colorScheme = useColorScheme();
  
  const hasUnreadMessages = true;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8C52FF', 
        tabBarInactiveTintColor: '#888', 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveBackgroundColor: '#f3edff', 
        tabBarInactiveBackgroundColor: '#ffffff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="home" color="#8C52FF" focused={focused} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[{ transform: [{ scale: focused ? 1.05 : 1 }] }, { color, fontSize: 12 }]}>Home</Animated.Text>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="briefcase" color="#8C52FF" focused={focused} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[{ transform: [{ scale: focused ? 1.05 : 1 }] }, { color, fontSize: 12 }]}>Jobs</Animated.Text>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="inbox" color="#8C52FF" showDot={hasUnreadMessages} focused={focused} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[{ transform: [{ scale: focused ? 1.05 : 1 }] }, { color, fontSize: 12 }]}>Messages</Animated.Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="user" color="#8C52FF" focused={focused} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Animated.Text style={[{ transform: [{ scale: focused ? 1.05 : 1 }] }, { color, fontSize: 12 }]}>Profile</Animated.Text>
          ),
        }}
      />
    </Tabs>
  );
} 