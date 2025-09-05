import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

type Booking = {
  id: string;
  jobTitle: string;
  status: string;
  scheduleDate?: { seconds: number; nanoseconds: number };
  address: string;
};

type BookedJobsCardProps = {
  job: Booking;
};

const BookedJobsCard: React.FC<BookedJobsCardProps> = ({ job }) => {
  return (
    <TouchableOpacity onPress={() => router.push(`Jobs/booking/${job.id}`)}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/men/36.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{job.jobTitle}</Text>
          <Text style={styles.detail}>
            📅{" "}
            {job.scheduleDate?.seconds
              ? new Date(job.scheduleDate.seconds * 1000).toDateString()
              : "No date"}
          </Text>
          <Text style={styles.detail}>📍 {job.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
});

export default BookedJobsCard;
