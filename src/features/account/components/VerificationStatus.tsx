import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const VerificationStatus = () => (
  <View style={styles.container}>
    <Icon name="alert-circle" size={18} color="#D32F2F" style={{ marginRight: 8 }} />
    <Text style={styles.text}>Your account is not fully verified</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default VerificationStatus; 