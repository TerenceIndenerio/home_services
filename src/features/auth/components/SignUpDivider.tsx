import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DividerProps {
  text: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>

      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  lineContainer: {
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
    display: "flex",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
  line: {
    borderColor: "rgba(62, 62, 62, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    minHeight: 1,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 12,
    color: "rgba(68, 68, 68, 1)",
    fontWeight: "400",
    textAlign: "center",
  },
});

export default Divider;
