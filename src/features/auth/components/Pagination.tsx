import React from "react";
import { View } from "react-native";
import { styles } from "@/src/styles/onBoardingStyles";

interface PaginationDotsProps {
  count: number;
  activeIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({
  count,
  activeIndex,
}) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex && styles.activePaginationDot,
          ]}
        />
      ))}
    </View>
  );
};

export default PaginationDots;
