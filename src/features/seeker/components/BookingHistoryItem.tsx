import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface BookingHistory {
  id: string;
  job: string;
  date: string;
  location: string;
  status: string;
}

interface BookingHistoryItemProps {
  item: BookingHistory;
  onPress?: (item: BookingHistory) => void;
}

const BookingHistoryItem: React.FC<BookingHistoryItemProps> = ({
  item,
  onPress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "accepted":
        return "#4CAF50";
      case "cancelled":
      case "declined":
        return "#F44336";
      case "scheduled":
      case "pending":
        return "#FF9800";
      default:
        return "#666";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress?.(item)}>
      <View style={styles.header}>
        <Text style={styles.jobTitle} numberOfLines={1}>
          {item.job}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <FontAwesome
            name="calendar"
            size={14}
            color="#666"
            style={styles.icon}
          />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome
            name="map-marker"
            size={14}
            color="#666"
            style={styles.icon}
          />
          <Text style={styles.detailText} numberOfLines={2}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginTop: 1,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
});

export default BookingHistoryItem;
