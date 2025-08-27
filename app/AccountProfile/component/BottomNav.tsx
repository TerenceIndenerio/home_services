import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const tabs = [
  { icon: "home-outline", label: "Home" },
  { icon: "briefcase-outline", label: "Jobs" },
  { icon: "chatbubble-ellipses-outline", label: "Message" },
  { icon: "person-outline", label: "Account" },
];

const BottomNav = () => (
  <View style={styles.container}>
    {tabs.map((tab, idx) => (
      <TouchableOpacity
        key={tab.label}
        style={[styles.tab, tab.label === "Account" && styles.activeTab]}
      >
        <Icon
          name={tab.icon}
          size={26}
          color={tab.label === "Account" ? "#8F5CFF" : "#B0A4D6"}
        />
        <Text
          style={[
            styles.label,
            tab.label === "Account" && styles.activeLabel,
          ]}
        >
          {tab.label}
        </Text>
        {tab.label === "Message" && <View style={styles.dot} />}
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F2F0FF",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    position: "relative",
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    color: "#3A334B",
    marginTop: 2,
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: "#8F5CFF",
    backgroundColor: "#F2F0FF",
  },
  activeLabel: {
    color: "#8F5CFF",
    fontWeight: "bold",
  },
  dot: {
    position: "absolute",
    top: 8,
    right: 28,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8F5CFF",
  },
});

export default BottomNav; 