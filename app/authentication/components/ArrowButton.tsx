import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface ArrowButtonProps {
  direction: "left" | "right";
  active?: boolean;
  onPress?: () => void;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  active = false,
  onPress,
}) => {
  const buttonColor = active ? "#8C52FF" : "#FFF";
  const arrowColor = active ? "#FFF" : "#8C52FF";
  const borderColor = "#8C52FF";

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.button,
          {
            backgroundColor: buttonColor,
            borderColor: !active ? borderColor : "transparent",
          },
        ]}
      >
        <View
          style={[
            styles.arrow,
            direction === "left" ? styles.leftArrow : styles.rightArrow,
            { borderLeftColor: arrowColor },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },
  leftArrow: {
    transform: [{ rotate: "180deg" }],
  },
  rightArrow: {},
});

export default ArrowButton;
