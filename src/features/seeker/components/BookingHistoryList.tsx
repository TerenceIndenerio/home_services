import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BookingHistoryItem from "./BookingHistoryItem"; // this is your existing file

interface BookingHistory {
  id: string;
  job: string;
  date: string;
  location: string;
  status: string;
}

interface BookingHistoryListProps {
  history: BookingHistory[];
}

const BookingHistoryList: React.FC<BookingHistoryListProps> = ({ history }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="history" size={24} color="#333" />
        <Text style={styles.title}>Booking History</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {history.map((item) => (
          <BookingHistoryItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContainer: {
    maxHeight: 300, // Adjust this value as needed
  },
});

export default BookingHistoryList;
