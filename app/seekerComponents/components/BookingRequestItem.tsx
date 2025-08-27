import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface BookingRequest {
  id: string;
  avatar: string;
  job: string;
  customer: string;
  location?: { latitude: number; longitude: number };
  latitude?: number;
  longitude?: number;
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

interface BookingRequestItemProps {
  request: BookingRequest;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onRefresh?: () => void;
}

const BookingRequestItem: React.FC<BookingRequestItemProps> = ({
  request,
  onAccept,
  onDecline,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept?.(request.id);
      setModalMessage("Booking request accepted successfully!");
      setShowModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to accept booking request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await onDecline?.(request.id);
      setModalMessage("Booking request declined successfully!");
      setShowModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to decline booking request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    onRefresh?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: request.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.customerName}>{request.customer}</Text>
            <Text style={styles.jobTitle}>{request.jobTitle || request.job}</Text>
          </View>
        </View>
        <View style={styles.status}>
          <Text style={styles.statusText}>New</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <FontAwesome name="map-marker" size={14} color="#666" />
        <Text style={styles.location} numberOfLines={2}>
          {request.address || "No address provided"}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.declineButton, isLoading && styles.disabledButton]}
          onPress={handleDecline}
          disabled={isLoading}
        >
          <Text style={styles.declineText}>
            {isLoading ? "Processing..." : "Decline"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton, isLoading && styles.disabledButton]}
          onPress={handleAccept}
          disabled={isLoading}
        >
          <Text style={styles.acceptText}>
            {isLoading ? "Processing..." : "Accept"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <FontAwesome name="check-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  acceptButton: {
    backgroundColor: "#8B5CF6",
  },
  disabledButton: {
    opacity: 0.6,
  },
  declineText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookingRequestItem;
