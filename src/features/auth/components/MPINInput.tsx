import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface MPINInputProps {}

export const MPINInput: React.FC<MPINInputProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Enter your MPIN</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot MPIN?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Default export to satisfy Expo Router
export default MPINInput;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginTop: 60,
    maxWidth: "100%",
    width: 354,
    paddingLeft: 32,
    paddingRight: 32,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
  inputSection: {
    borderRadius: 50,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  titleContainer: {
    color: "rgba(49, 49, 49, 1)",
    fontSize: 18,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
  },
  title: {
    color: "rgba(49, 49, 49, 1)",
    fontSize: 18,
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontWeight: "500",
    textAlign: "center",
  },
  inputContainer: {
    borderRadius: 50,
    borderColor: "rgba(0, 0, 0, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    marginTop: 18,
    minHeight: 54,
    width: "100%",
    paddingLeft: 49,
    paddingRight: 49,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },
  dot: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    alignSelf: "stretch",
    display: "flex",
    marginTop: "auto",
    marginBottom: "auto",
    width: 14,
    flexShrink: 0,
    height: 14,
  },
  forgotContainer: {
    alignSelf: "center",
    marginTop: 18,
  },
  forgotText: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 12,
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
    fontWeight: "400",
    textAlign: "center",
  },
});
