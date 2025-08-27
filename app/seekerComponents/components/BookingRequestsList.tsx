import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import BookingRequestItem from "./BookingRequestItem";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface BookingRequest {
  id: string;
  avatar: string;
  job: string;
  customer: string;
  location?: { latitude: number; longitude: number };
  latitude?: number; // Add direct latitude property
  longitude?: number; // Add direct longitude property
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
  rating?: number;
  review?: string;
}

interface BookingRequestsListProps {
  requests: BookingRequest[];
  style?: ViewStyle;
  onStatusChange?: () => void; // ✅ Added
  maxHeight?: number; // Make max height configurable
}

const formatTimestamp = (timestamp: Timestamp | undefined) => {
  if (!timestamp?.toDate) return "N/A";
  return timestamp.toDate().toLocaleString();
};

const BookingRequestsList: React.FC<BookingRequestsListProps> = ({
  requests,
  style,
  onStatusChange,
  maxHeight = 400, // Default max height
}) => {
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(
    null
  );
  const router = useRouter();

  console.log(selectedRequest)

  const openModal = (request: BookingRequest) => setSelectedRequest(request);
  const closeModal = () => setSelectedRequest(null);

  const handleStatusUpdate = async (
    id: string,
    status: "accepted" | "declined"
  ) => {
    try {
      const ref = doc(db, "bookings", id);
      await updateDoc(ref, { status });

      setSelectedRequest(null);
      onStatusChange?.(); // ✅ Ask parent to refresh
    } catch (err) {
      console.error("Failed to update status:", err);
      throw err; // Re-throw the error so the BookingRequestItem can handle it
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking Requests</Text>
        <Text style={styles.count}>{requests.length} new</Text>
      </View>

      <ScrollView 
        style={[styles.scrollContainer, { maxHeight }]}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {requests.map((request) => (
          <TouchableOpacity key={request.id} onPress={() => openModal(request)}>
            <BookingRequestItem
              request={request}
              onAccept={() => handleStatusUpdate(request.id, "accepted")}
              onDecline={() => handleStatusUpdate(request.id, "declined")}
              onRefresh={onStatusChange}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedRequest} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>📋 Booking Summary</Text>

              {selectedRequest && (
                <>
                  <Image
                    source={{ uri: selectedRequest.avatar }}
                    style={styles.avatar}
                  />

                  <Section title="👤 Provider Info">
                    <Detail
                      label="Name"
                      value={selectedRequest.customer || "N/A"}
                    />
                    
                  </Section>

                  <Section title="🛠 Job Details">
                    <Detail
                      label="Job Title"
                      value={selectedRequest.jobTitle || "N/A"}
                    />
                    <Detail
                      label="Description"
                      value={selectedRequest.description || "N/A"}
                    />
                    <Detail
                      label="Amount"
                      value={
                        selectedRequest.amount
                          ? `₱${selectedRequest.amount}`
                          : "N/A"
                      }
                    />
                   
                  </Section>

                  <Section title="📍 Location">
                    <Detail
                      label="Address"
                      value={selectedRequest.address || "N/A"}
                    />
                    <Detail
                      label="Latitude"
                      value={selectedRequest.location?.latitude?.toString() ?? selectedRequest.latitude?.toString() ?? "N/A"}
                    />
                    <Detail
                      label="Longitude"
                      value={selectedRequest.location?.longitude?.toString() ?? selectedRequest.longitude?.toString() ?? "N/A"}
                    />
                  </Section>

                  <Section title="⏰ Timing">
                    <Detail
                      label="Schedule Date"
                      value={formatTimestamp(selectedRequest.scheduleDate)}
                    />
                    <Detail
                      label="Created At"
                      value={formatTimestamp(selectedRequest.createdAt)}
                    />
                    
                  </Section>

                  <Section title="📌 Status">
                    <Detail
                      label="Current Status"
                      value={
                        selectedRequest.status === "accepted"
                          ? "✅ Accepted"
                          : selectedRequest.status === "declined"
                            ? "❌ Declined"
                            : "🕐 Pending"
                      }
                    />
                  </Section>

                  {selectedRequest.status === "pending" && (
                    <View
                      style={{ flexDirection: "row", marginTop: 20, gap: 10 }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.closeButton,
                          { backgroundColor: "#F5F5F5" },
                        ]}
                        onPress={() =>
                          handleStatusUpdate(selectedRequest.id, "declined")
                        }
                      >
                        <Text style={{ color: "#444", fontWeight: "600" }}>
                          Decline
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.closeButton,
                          { backgroundColor: "#8B5CF6" },
                        ]}
                        onPress={() =>
                          handleStatusUpdate(selectedRequest.id, "accepted")
                        }
                      >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          Accept
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* View Map Button */}
                  {selectedRequest && (selectedRequest.location?.latitude || selectedRequest.latitude) && (
                    <TouchableOpacity
                      style={styles.viewMapButton}
                      onPress={() => {
                        const latitude = selectedRequest.location?.latitude || selectedRequest.latitude;
                        const longitude = selectedRequest.location?.longitude || selectedRequest.longitude;
                        const address = selectedRequest.address || "Location";
                        const jobTitle = selectedRequest.jobTitle || "Job Location";
                        const description = selectedRequest.description || "";
                        
                        closeModal(); // Close the modal first
                        router.push(`/Jobs/booking/map?latitude=${latitude}&longitude=${longitude}&address=${encodeURIComponent(address)}&jobTitle=${encodeURIComponent(jobTitle)}&description=${encodeURIComponent(description)}`);
                      }}
                    >
                      <Ionicons name="map" size={20} color="#fff" />
                      <Text style={styles.viewMapButtonText}>View Map</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={closeModal}
                    style={[styles.closeButton, { marginTop: 12 }]}
                  >
                    <Text style={styles.closeText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  scrollContainer: {
    paddingBottom: 8, // Add some bottom padding for better scrolling
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  count: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    borderRadius: 16,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 6,
  },
  sectionContent: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#8B5CF6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  viewMapButton: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  viewMapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingRequestsList;
