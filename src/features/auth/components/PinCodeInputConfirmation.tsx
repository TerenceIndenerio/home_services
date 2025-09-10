import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const PIN_LENGTH = 4;

export default function PinSetupScreen() {
  const [firstPin, setFirstPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [secondPin, setSecondPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [activeInput, setActiveInput] = useState<"first" | "second">("first");

  const inputs = useRef<(TextInput | null)[]>([]);
  const inputsConfirm = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    
    setTimeout(() => {
      inputs.current[0]?.focus();
    }, 100);
  }, []);

  const handleChange = (val: string, index: number, type: "first" | "second") => {
    const numeric = val.replace(/[^0-9]/g, "");
    const pinArray = type === "first" ? [...firstPin] : [...secondPin];
    pinArray[index] = numeric;

    type === "first" ? setFirstPin(pinArray) : setSecondPin(pinArray);

    if (numeric && index < PIN_LENGTH - 1) {
      const nextRef = type === "first" ? inputs.current : inputsConfirm.current;
      nextRef[index + 1]?.focus();
    }

    if (!pinArray.includes("")) {
      const first = firstPin.join("");
      const second = pinArray.join("");

      if (type === "first") {
        setActiveInput("second");
        inputsConfirm.current[0]?.focus();
      } else if (first === second) {
        AsyncStorage.setItem("user_pin", first)
          .then(() => {
            Alert.alert("Success", "PIN has been saved.");
            console.log("PIN saved:", first);
            router.replace("/");
          })
          .catch(() => Alert.alert("Error", "Failed to save PIN"));
      } else {
        Alert.alert("PIN Mismatch", "Please try again.");
        setSecondPin(Array(PIN_LENGTH).fill(""));
        inputsConfirm.current[0]?.focus();
      }
    }
  };

  const handleKeypadPress = (key: string) => {
    const pinArray = activeInput === "first" ? [...firstPin] : [...secondPin];
    const setPin = activeInput === "first" ? setFirstPin : setSecondPin;
    const refs = activeInput === "first" ? inputs.current : inputsConfirm.current;

    if (key === "del") {
      const lastIndex = pinArray.findLastIndex((digit) => digit !== "");
      if (lastIndex >= 0) {
        pinArray[lastIndex] = "";
        setPin(pinArray);
        refs[lastIndex]?.focus();
      }
    } else {
      const firstEmpty = pinArray.findIndex((digit) => digit === "");
      if (firstEmpty >= 0) {
        pinArray[firstEmpty] = key;
        setPin(pinArray);
        if (firstEmpty < PIN_LENGTH - 1) refs[firstEmpty + 1]?.focus();

        if (!pinArray.includes("")) {
          const first = firstPin.join("");
          const second = pinArray.join("");

          if (activeInput === "second") {
            if (first === second) {
              AsyncStorage.setItem("user_pin", first)
                .then(() => {
                  Alert.alert("Success", "PIN has been saved.");
                  console.log("PIN saved:", first);
                  router.replace("/");
                })
                .catch(() => Alert.alert("Error", "Failed to save PIN"));
            } else {
              Alert.alert("PIN Mismatch", "Please try again.");
              setSecondPin(Array(PIN_LENGTH).fill(""));
              inputsConfirm.current[0]?.focus();
            }
          } else {
            setActiveInput("second");
            inputsConfirm.current[0]?.focus();
          }
        }
      }
    }
  };

  const renderInputRow = (pin: string[], refs: typeof inputs.current) => (
    <View style={styles.pinContainer}>
      {pin.map((digit, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            if (ref) refs[i] = ref;
          }}
          value={digit ? "•" : ""}
          onChangeText={(val) => handleChange(val, i, activeInput)}
          keyboardType="number-pad"
          maxLength={1}
          style={styles.input}
          secureTextEntry={false}
          editable
          showSoftInputOnFocus={false}
        />
      ))}
    </View>
  );

  const renderKeypadButton = (key: string) => (
    <TouchableOpacity
      key={key}
      style={styles.keypadButton}
      onPress={() => handleKeypadPress(key)}
    >
      <Text style={styles.keypadText}>{key === "del" ? "⌫" : key}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Enter your MPIN</Text>
      {renderInputRow(firstPin, inputs.current)}
      <Text style={styles.titleText}>Confirm MPIN</Text>
      {renderInputRow(secondPin, inputsConfirm.current)}

      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>{["1", "2", "3"].map(renderKeypadButton)}</View>
        <View style={styles.keypadRow}>{["4", "5", "6"].map(renderKeypadButton)}</View>
        <View style={styles.keypadRow}>{["7", "8", "9"].map(renderKeypadButton)}</View>
        <View style={styles.keypadRow}>
          <View style={styles.emptyKeypadButton} />
          {renderKeypadButton("0")}
          {renderKeypadButton("del")}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 5,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  keypadContainer: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: "#8B5CF6",
    width: "100%",
    padding: 30,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  keypadButton: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  keypadText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
  },
  emptyKeypadButton: {
    width: 70,
    height: 70,
  },
});
