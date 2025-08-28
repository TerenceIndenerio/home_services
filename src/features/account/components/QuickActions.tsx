import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const QuickActions = () => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.actionBtn}>
      <Icon name="calendar-outline" size={28} color="#fff" />
      <Text style={styles.actionText}>Bookings</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionBtn}>
      <Icon name="briefcase-outline" size={28} color="#fff" />
      <Text style={styles.actionText}>Jobs Applied</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  actionBtn: {
    backgroundColor: "#8F5CFF",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    width: 140,
    elevation: 2,
    shadowColor: "#8F5CFF",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
  },
});

export default QuickActions; 