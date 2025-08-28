import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface AccountTypeOptionProps {
  imageUrl: string;
  label: string;
  onPress: () => void;
  isSelected?: boolean;
}

const AccountTypeOption: React.FC<AccountTypeOptionProps> = ({
  imageUrl,
  label,
  onPress,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 171.5,
    paddingTop: 45,
    paddingRight: 20,
    paddingBottom: 45,
    paddingLeft: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedContainer: {
    borderColor: "#8C52FF",
    backgroundColor: "rgba(140, 82, 255, 0.05)",
    shadowColor: "#8C52FF",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    transform: [{ scale: 1.05 }],
  },
  image: {
    width: 80,
    height: 80,
    maxWidth: "100%",
    maxHeight: 150,
    marginBottom: 11,
  },
  labelContainer: {
    alignItems: "center",
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 15,
    color: "#444",
    textAlign: "center",
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    boxShadow: "0px 4px 4px rgba(140, 82, 255, 0.2)",
  },
});

export default AccountTypeOption;
