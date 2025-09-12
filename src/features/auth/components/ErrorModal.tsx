import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
  title?: string;
};

const ErrorModal: React.FC<Props> = ({ visible, message, onClose, title = "Error" }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 12,
            width: "80%",
            alignItems: "center",
          }}
        >
          <Ionicons name="alert-circle" size={48} color="red" />
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 10 }}>
            {title}
          </Text>
          <Text style={{ marginTop: 10, textAlign: "center", color: "#444" }}>
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "#FF4D4D",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
