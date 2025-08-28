// components/RadioItem.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  address: string;
}

const RadioItem: React.FC<Props> = ({ label, address }) => (
  <View style={styles.radioItem}>
    <View style={styles.radioCircle} />
    <View>
      <Text style={styles.radioLabel}>{label}</Text>
      <Text style={styles.radioAddress}>{address}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  radioItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00796b",
    marginRight: 12,
    marginTop: 4,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  radioAddress: {
    fontSize: 14,
    color: "#555",
  },
});

export default RadioItem;
