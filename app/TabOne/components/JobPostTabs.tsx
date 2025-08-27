import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const tabs = [
  { label: "Active Post" },
  { label: "Deleted Post" },
  { label: "Draft" },
];

const JobPostTabs = () => (
  <View style={styles.container}>
    {tabs.map((tab) => (
      <TouchableOpacity key={tab.label} style={styles.tabRow}>
        <Text style={styles.tabLabel}>{tab.label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 4,
    elevation: 1,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F0FF",
  },
  tabLabel: {
    fontSize: 16,
    color: "#222",
  },
});

export default JobPostTabs; 