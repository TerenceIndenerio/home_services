import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const BookingDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const docRef = doc(db, "bookings", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const bookingData = docSnap.data();
          setBooking(bookingData);
          console.log("✅ Booking fetched:", bookingData);

          const providerId = bookingData.providerId;
          console.log("🔍 Booking providerId:", providerId);

          if (providerId) {
            const providerRef = doc(db, "users", providerId);
            const providerSnap = await getDoc(providerRef);

            if (providerSnap.exists()) {
              setProvider(providerSnap.data());
              console.log("✅ Provider found:", providerSnap.data());
            } else {
              console.warn("❌ Provider not found in 'users' collection.");
            }
          } else {
            console.warn("❌ No providerId found in booking.");
          }
        } else {
          console.warn("❌ Booking not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
  if (!booking) return <Text style={styles.errorText}>Booking not found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          // Try to go back, but if not possible, go to home
          try {
            // @ts-ignore: canGoBack may not exist in expo-router, fallback to push
            if (router.canGoBack && router.canGoBack()) {
              router.back();
            } else {
              router.replace ? router.replace("/") : router.push("/");
            }
          } catch {
            router.replace ? router.replace("/") : router.push("/");
          }
        }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Provider Info */}
      {provider && (
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                provider.profilePictureUrl ||
                "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>
              {provider.firstName || "Unnamed"} {provider.lastName || ""}
            </Text>
            {provider.profile?.jobTitle && (
              <Text style={styles.profileSub}>{provider.profile.jobTitle}</Text>
            )}
            {provider.phoneNumber && (
              <Text style={styles.profileSub}>{provider.phoneNumber}</Text>
            )}
          </View>
        </View>
      )}

      {/* Job Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Job Information</Text>
        <Text style={styles.label}>Job Title</Text>
        <Text style={styles.value}>{booking.jobTitle}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{booking.description}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{booking.address}</Text>

        <Text style={styles.label}>Scheduled Date</Text>
        <Text style={styles.value}>{formatDate(booking.scheduleDate)}</Text>
      </View>

      {/* Payment Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>₱{booking.amount}</Text>

        <Text style={styles.label}>Paid</Text>
        <Text style={styles.value}>{booking.isPaid ? "Yes" : "No"}</Text>
      </View>

      {/* Status Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status & Feedback</Text>
        <View style={styles.badgeWrapper}>
          <Text style={[styles.badge, getBadgeStyle(booking.status)]}>
            {booking.status?.toUpperCase()}
          </Text>
        </View>

        {booking.status === "pending" ? (
          <Text style={styles.pendingMessage}>
            Waiting for the Job Seeker to accept the job offer
          </Text>
        ) : (
          <>
            <Text style={styles.label}>Rating</Text>
            <Text style={styles.value}>{booking.rating ?? "N/A"}</Text>

            <Text style={styles.label}>Review</Text>
            <Text style={styles.value}>{booking.review ?? "No review yet"}</Text>
          </>
        )}
      </View>

      {/* View Map Button */}
      {booking.latitude && booking.longitude && (
        <TouchableOpacity
          style={styles.viewMapButton}
          onPress={() => router.push(`/Jobs/booking/map?id=${id}`)}
        >
          <Ionicons name="map" size={20} color="#fff" />
          <Text style={styles.viewMapButtonText}>View Map</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const getBadgeStyle = (status: string) => {
  switch (status) {
    case "pending":
      return { backgroundColor: "#facc15", color: "#000" };
    case "completed":
      return { backgroundColor: "#4ade80", color: "#fff" };
    case "cancelled":
      return { backgroundColor: "#f87171", color: "#fff" };
    default:
      return { backgroundColor: "#ccc", color: "#000" };
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginTop: 2,
  },
  badgeWrapper: {
    marginTop: 8,
    marginBottom: 4,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
    fontSize: 13,
    alignSelf: "flex-start",
    fontWeight: "600",
  },
  errorText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  pendingMessage: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  profileSub: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  viewMapButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  viewMapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default BookingDetails;
