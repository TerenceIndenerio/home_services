import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import PinCodeInputConfirmation from "../components/PinCodeInputConfirmation";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SetupPinScreen() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isMatched, setIsMatched] = useState(false);
  const router = useRouter();

  const handleSetup = async () => {
    if (pin.length < 4 || confirmPin.length < 4) {
      Alert.alert("Incomplete", "Please enter and confirm your PIN.");
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert("Error", "PINs do not match. Try again.");
      setPin("");
      setConfirmPin("");
      return;
    }

    try {
      await AsyncStorage.setItem("user_pin", pin);
      router.replace("authentication/PinCode");
    } catch (err) {
      Alert.alert("Error", "Failed to save PIN.");
      console.error("Saving PIN failed", err);
    }
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    setIsMatched(value === confirmPin && value.length === 4);
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPin(value);
    setIsMatched(value === pin && value.length === 4);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <SafeAreaView style={styles.container}>
        <PinCodeInputConfirmation/>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
    color: "#333",
  },
  label: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 48,
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    marginTop: 24,
  },
  resetText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
  },
});
