import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DividerProps {
  text: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <View className="flex-row items-center my-4">
      <View className="flex-1 h-px bg-gray-300" />
      <Text className="mx-4 text-gray-500 text-sm">{text}</Text>
      <View className="flex-1 h-px bg-gray-300" />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  text: {
    marginHorizontal: 16,
    color: "#718096",
    fontSize: 14,
  },
});

export default Divider;
