import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface AuthButtonProps {
  text: string;
  variant: "primary" | "secondary";
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  variant,
  onPress,
  style,
  textStyle,
}) => {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;

  const buttonTextStyle =
    variant === "primary"
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[buttonTextStyle, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    padding: 4,
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  primaryButtonText: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "700",
    color: "#8C52FF",
  },
  secondaryButton: {
    padding: 4,
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#8C52FF",
  },
  secondaryButtonText: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default AuthButton;
