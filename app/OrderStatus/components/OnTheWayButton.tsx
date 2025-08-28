import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  View,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/app/authentication/context/authContext";
import { useRouter } from "expo-router";

const OnTheWayButton = ({ bookingData }: { bookingData: any }) => {
  const { userDocumentId } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [modalVisible, setModalVisible] = useState(false);          // edit/review modal
  const [successVisible, setSuccessVisible] = useState(false);       // ✅ success modal
  const [provider, setProvider] = useState<any>(null);

  // Debug logging
  useEffect(() => {
    console.log("OnTheWayButton - Received bookingData:", bookingData);
    console.log("OnTheWayButton - Location data:", bookingData?.location);
  }, [bookingData]);

  const [editableData, setEditableData] = useState({
    jobTitle: bookingData.jobTitle || "",
    description: bookingData.description || "",
    amount: bookingData.amount || 0,
    address: bookingData.address || "",
    scheduleDate: bookingData.scheduleDate
      ? new Date(bookingData.scheduleDate)
      : new Date(),
  });

  const currentUserId = userDocumentId;
  const router = useRouter();

  useEffect(() => {
    const fetchProvider = async () => {
      const targetProviderId =
        bookingData?.providerId || currentUserId || null;
      if (!targetProviderId) return;

      try {
        const docRef = doc(db, "users", targetProviderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProvider(docSnap.data());
      } catch (error) {
        console.error("Error fetching provider:", error);
      }
    };

    fetchProvider();
  }, [bookingData?.providerId, currentUserId]);

  const handleOpenModal = () => {
    if (status === "idle") setModalVisible(true);
  };

  const handleProceed = async () => {
    setStatus("loading");
    setModalVisible(false);

    try {
      // Extract and validate location data
      const latitude = bookingData.location?.latitude || bookingData.latitude;
      const longitude = bookingData.location?.longitude || bookingData.longitude;
      
      // Validate coordinates
      if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
        console.error("OnTheWayButton - Invalid coordinates:", { latitude, longitude });
        throw new Error("Invalid coordinates provided");
      }

      const data = {
        ...bookingData,
        ...editableData,
        // Store location data as direct properties (as expected by BookingRequestsList)
        latitude: latitude,
        longitude: longitude,
        // Also keep the location object for backward compatibility
        location: bookingData.location,
        providerId: bookingData.providerId || currentUserId,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      console.log("OnTheWayButton - Saving booking data:", data);
      await addDoc(collection(db, "bookings"), data);

      // ✅ Success: lock button & show success modal
      setStatus("sent");
      setSuccessVisible(true);
    } catch (error) {
      console.error("Failed to book:", error);
      setStatus("idle");
    }
  };



  return (
    <>
      <TouchableOpacity
        style={[styles.button, status === "sent" && { borderColor: "green" }]}
        onPress={handleOpenModal}
        disabled={status === "loading" || status === "sent"}
      >
        {status === "loading" ? (
          <ActivityIndicator color="#7B61FF" />
        ) : (
          <Text
            style={[styles.buttonText, status === "sent" && { color: "green" }]}
          >
            {status === "sent" ? "Successfully Sent" : "Book Now!"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Review & Edit Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Review & Edit Booking</Text>

            {provider && (
              <View style={styles.profileBox}>
                <Text style={styles.profileName}>
                  {provider.firstName || "No Name"} {provider.lastName || ""}
                </Text>
                <Text style={styles.profileInfo}>
                  {provider.profile?.jobTitle || "No job title"}
                </Text>
              </View>
            )}

            {[
              { label: "Job Title", key: "jobTitle" },
              { label: "Description", key: "description", multiline: true },
              { label: "Amount (₱)", key: "amount", keyboardType: "numeric" },
              { label: "Address", key: "address" },
            ].map((field) => (
              <View key={field.key} style={{ marginBottom: 10 }}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={[styles.input, field.multiline && { height: 60 }]}
                  multiline={field.multiline}
                  keyboardType={field.keyboardType as any}
                  value={String(
                    editableData[field.key as keyof typeof editableData]
                  )}
                  onChangeText={(text) =>
                    setEditableData((prev) => ({
                      ...prev,
                      [field.key]:
                        field.keyboardType === "numeric" ? Number(text) : text,
                    }))
                  }
                />
              </View>
            ))}

            <Text style={styles.label}>Schedule Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter date (MM/DD/YYYY HH:MM)"
              value={editableData.scheduleDate.toLocaleString()}
              onChangeText={(text) => {
                // Simple date parsing - you can type manually
                try {
                  const newDate = new Date(text);
                  if (!isNaN(newDate.getTime())) {
                    setEditableData((prev) => ({
                      ...prev,
                      scheduleDate: newDate,
                    }));
                  }
                } catch (error) {
                  // If parsing fails, just store as string for now
                  console.log("Date parsing failed, storing as string");
                }
              }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#7B61FF" }]}
                onPress={handleProceed}
              >
                <Text style={{ color: "#fff" }}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Success / Waiting Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={successVisible}
        onRequestClose={() => setSuccessVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { alignItems: "center" }]}>
            <View style={styles.successIcon}>
              <Text style={{ fontSize: 28 }}>✓</Text>
            </View>
            <Text style={[styles.modalTitle, { marginTop: 8 }]}>Booking Sent</Text>
            <Text style={{ textAlign: "center", color: "#444", marginTop: 6 }}>
              Please wait for the job seeker to accept your request.
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#7B61FF", marginTop: 18 }]}
              onPress={() => {setSuccessVisible(false); router.push("/tabOne");}}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#7B61FF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "92%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  profileBox: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileInfo: {
    fontSize: 14,
    color: "#555",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },


  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    minWidth: 120,
    alignItems: "center",
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EAF7EE",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default OnTheWayButton;
