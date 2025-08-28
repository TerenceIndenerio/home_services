import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl, View, Text } from "react-native";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUserDocumentId } from "@/src/hooks/useUserDocumentId";
import Header from "@/src/features/seeker/components/Header";
import BalanceCard from "@/src/features/seeker/components/BalanceCard";
import BookingRequestsList from "@/src/features/seeker/components/BookingRequestsList";
import BookingHistoryList from "@/src/features/seeker/components/BookingHistoryList";

type BookingRequest = {
  id: string;
  avatar: string;
  job: string;
  customer: string;
  location?: { latitude: number; longitude: number };
  address?: string;
  amount?: number;
  createdAt?: any;
  description?: string;
  etaInSeconds?: number;
  jobTitle?: string;
  providerId?: string;
  scheduleDate?: any;
  serviceId?: string;
  status?: string;
};

export default function SeekerHomeScreen() {
  const { userDocumentId, loading } = useUserDocumentId();
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [bookingHistory, setBookingHistory] = useState<BookingRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      if (!userDocumentId) {
        console.error("No user document ID found.");
        return;
      }

      const currentUserId = userDocumentId;

      // Query Firestore for only bookings assigned to this provider
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", currentUserId)
      );
      const bookingsSnapshot = await getDocs(q);

      const pendingRequests: BookingRequest[] = [];
      const historyRequests: BookingRequest[] = [];

      for (const docSnap of bookingsSnapshot.docs) {
        const booking = docSnap.data();
        const status = booking.status;

        if (["pending", "accepted", "declined"].includes(status)) {
          const providerRef = doc(db, "users", booking.providerId);
          const providerSnap = await getDoc(providerRef);

          if (providerSnap.exists()) {
            const provider = providerSnap.data();

            const data: BookingRequest = {
              id: docSnap.id,
              avatar: provider.profilePictureUrl || "https://via.placeholder.com/150",
              job: booking.jobTitle || "No Job Title",
              customer: `${provider.firstName || ""} ${provider.lastName || ""}`,
              location: booking.location || { latitude: 0, longitude: 0 },
              address: booking.address || "No Address",
              amount: booking.amount,
              createdAt: booking.createdAt,
              description: booking.description,
              jobTitle: booking.jobTitle,
              providerId: booking.providerId,
              scheduleDate: booking.scheduleDate,
              serviceId: booking.serviceId,
              status: status,
            };
            

            if (status === "pending") {
              pendingRequests.push(data);
            } else {
              historyRequests.push(data);
            }
          }
        }
      }

      setBookingRequests(pendingRequests);
      setBookingHistory(historyRequests);
    } catch (error) {
      console.error("Error fetching bookings with providers:", error);
    }
  };

  useEffect(() => {
    if (!loading && userDocumentId) {
      fetchBookings();
    }
  }, [loading, userDocumentId]);

  const onRefresh = React.useCallback(() => {
    if (!userDocumentId) {
      console.error("No user document ID found for refresh.");
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    fetchBookings().finally(() => {
      setRefreshing(false);
    });
  }, [userDocumentId]);

  const formatDate = (timestamp: any): string => {
    if (!timestamp || !timestamp.toDate) return "No Date";
    const dateObj = timestamp.toDate();
    return `${dateObj.toLocaleDateString()} - ${dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Show loading state while auth is loading
  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <Header status="Not Available" />
        <BalanceCard balance={3200} style={styles.balanceCard} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#8B5CF6"]}
          tintColor="#8B5CF6"
        />
      }
    >
      <Header status="Not Available" />
      <BalanceCard balance={3200} style={styles.balanceCard} />
      <BookingRequestsList
        requests={bookingRequests}
        style={styles.bookingRequestsList}
        onStatusChange={onRefresh}
      />
      <BookingHistoryList
        history={bookingHistory.map((item) => ({
          id: item.id,
          job: item.job,
          date: formatDate(item.scheduleDate || item.createdAt),
          location: item.address || "No Address",
          status: item.status || "",
        }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  balanceCard: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bookingRequestsList: {
    marginTop: 130,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
