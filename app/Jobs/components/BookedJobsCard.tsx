import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { router } from "expo-router";

type Booking = {
  id: string;
  jobTitle: string;
  status: string;
  scheduleDate: any;
  address: string;
  userId?: string;
};

type BookedJobsCardProps = {
  status: string; // pending | accepted | done
};

const BookedJobsCard: React.FC<BookedJobsCardProps> = ({ status }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add any data fetching logic here
    // For example, refetch bookings data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("status", "==", status.toLowerCase()));
        const snapshot = await getDocs(q);

        const data: Booking[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        setBookings(data);
      } catch (error) {
        console.error(`Error fetching ${status} bookings:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [status]);

  const renderItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity onPress={() => router.push(`Jobs/booking/${item.id}`)}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/men/36.jpg", // Placeholder image
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.jobTitle}</Text>
          <Text style={styles.detail}>
            📅 {new Date(item.scheduleDate.seconds * 1000).toDateString()}
          </Text>
          <Text style={styles.detail}>📍 {item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#555" />
    );
  }

  if (!bookings.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          There are no {status} job requests at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {status.charAt(0).toUpperCase() + status.slice(1)} Job Requests
      </Text>
      <Text style={styles.subHeader}>
        These bookings are marked as "{status}".
      </Text>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8B5CF6"]}
            tintColor="#8B5CF6"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "left",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 16,
    textAlign: "left",
  },
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
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});

export default BookedJobsCard;
