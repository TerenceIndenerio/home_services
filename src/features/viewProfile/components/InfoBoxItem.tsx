import React from "react";
import { View, Text, StyleSheet } from "react-native";

type InfoBoxProps = {
  rating: string | string[];
};

const InfoBox: React.FC<InfoBoxProps> = ({ rating }) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>⭐ Rating</Text>
        <Text style={styles.infoValue}>{rating}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>📦 Bookings</Text>
        <Text style={styles.infoValue}>120</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>📅 Experience</Text>
        <Text style={styles.infoValue}>5 yrs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContent: {
    fontSize: 16,
  },
  infoItem: {
    alignItems: "center",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
});

export default InfoBox;
