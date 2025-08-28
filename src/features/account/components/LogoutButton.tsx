import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const LogoutButton = () => {
  const handleLogout = () => {
    // TODO: Implement logout logic
  };
  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Log out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "#8F5CFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    color: "#8F5CFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LogoutButton; 