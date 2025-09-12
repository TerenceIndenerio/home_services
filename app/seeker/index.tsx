import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUserDocumentId } from "../../src/hooks/useUserDocumentId";
import Loader from "../../src/components/Loader";
import { YStack, Text } from "tamagui";

import Header from "../../src/features/seeker/components/Header";
import BalanceCard from "../../src/features/seeker/components/BalanceCard";
import BookingRequestsList from "../../src/features/seeker/components/BookingRequestsList";
import BookingHistoryList from "../../src/features/seeker/components/BookingHistoryList";

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
  const [fetching, setFetching] = useState(false);

  const fetchBookings = async () => {
    setFetching(true);
    try {
      if (!userDocumentId) {
        console.error("No user document ID found.");
        return;
      }

      const currentUserId = userDocumentId;


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
    } finally {
      setFetching(false);
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

  
  if (loading) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <ScrollView>
          <Header status="Not Available" />
          <YStack position="absolute" top={100} left={0} right={0} zIndex={1000}>
            <BalanceCard balance={3200} />
          </YStack>
          <YStack justifyContent="center" alignItems="center" marginTop={200}>
            <Text fontSize="$4" color="$gray11" fontWeight="500">Loading...</Text>
          </YStack>
        </ScrollView>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["$purple9"]}
            tintColor="$purple9"
          />
        }
      >
        <Header status="Not Available" />
        <YStack position="absolute" top={100} left={0} right={0} zIndex={1000}>
          <BalanceCard balance={3200} />
        </YStack>
        <YStack marginTop={130}>
          <BookingRequestsList
            requests={bookingRequests}
            onStatusChange={onRefresh}
          />
        </YStack>
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
      <Loader visible={fetching} text="Fetching bookings..." />
    </YStack>
  );
}

