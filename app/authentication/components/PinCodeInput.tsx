import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  length?: number;
  onComplete: (pin: string) => void;
  value?: string;
  highlight?: boolean;
};

export default function PinCodeInput({
  length = 4,
  onComplete,
  value = "",
  highlight = false,
}: Props) {
  const [pin, setPin] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const arr = value.split("");
    const updated = [...Array(length)].map((_, i) => arr[i] || "");
    setPin(updated);
  }, [value]);

  const handleChange = (val: string, index: number) => {
    const numeric = val.replace(/[^0-9]/g, "");
    const newPin = [...pin];
    newPin[index] = numeric;
    setPin(newPin);

    if (numeric && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const joined = newPin.join("");
    if (joined.length === length && !newPin.includes("")) {
      onComplete(joined);
    }
  };

  const handleKeypadPress = (key: string) => {
    if (key === "del") {
      const lastFilledIndex = pin.findLastIndex((digit) => digit !== "");
      if (lastFilledIndex >= 0) {
        const newPin = [...pin];
        newPin[lastFilledIndex] = "";
        setPin(newPin);
        inputs.current[lastFilledIndex]?.focus();
      }
    } else {
      const firstEmptyIndex = pin.findIndex((digit) => digit === "");
      if (firstEmptyIndex >= 0) {
        const newPin = [...pin];
        newPin[firstEmptyIndex] = key;
        setPin(newPin);

        if (firstEmptyIndex < length - 1) {
          inputs.current[firstEmptyIndex + 1]?.focus();
        }

        const joined = newPin.join("");
        if (joined.length === length && !newPin.includes("")) {
          onComplete(joined);
        }
      }
    }
  };

  const renderKeypadButton = (key: string, idx?: number) => (
    <TouchableOpacity
      key={key}
      style={styles.keypadButton}
      onPress={() => handleKeypadPress(key)}
      accessibilityLabel={key === "del" ? "Delete" : key}
    >
      <Text style={styles.keypadText}>{key === "del" ? "⌫" : key}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Enter your MPIN</Text>
      <View style={styles.pinContainer}>
        {pin.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            value={digit ? "•" : ""}
            onChangeText={(val) => handleChange(val, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.input, highlight ? styles.highlighted : {}]}
            autoFocus={i === 0}
            secureTextEntry={false}
            editable={true}
            showSoftInputOnFocus={false}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot MPIN?</Text>
      </TouchableOpacity>
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          {["1", "2", "3"].map(renderKeypadButton)}
        </View>
        <View style={styles.keypadRow}>
          {["4", "5", "6"].map(renderKeypadButton)}
        </View>
        <View style={styles.keypadRow}>
          {["7", "8", "9"].map(renderKeypadButton)}
        </View>
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
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    padding: 8,
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
  highlighted: {
    borderColor: "#8B5CF6",
    backgroundColor: "#FFFFFF",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  keypadContainer: {
    position: "relative",
    bottom: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#8B5CF6",
    width: "100%",
    padding: 30,
    marginTop: 20,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    width: 80,
    height: 80,
  },

  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  forgotButton: {
    marginTop: 10,
  },
  forgotText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    boxShadow: "0px 0px 8px rgba(139, 92, 246, 0.3)",
  },
}); 