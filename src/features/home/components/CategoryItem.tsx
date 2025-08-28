import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface CategoryItemProps {
  name: string;
  imageUrl: string;
  onPress?: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, imageUrl, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.categoryContainer}>
      <View style={styles.categoryIcon}>
        <Image source={{ uri: imageUrl }} style={styles.iconImage} />
      </View>
      <Text style={styles.categoryName}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    borderRadius: 15,
    display: "flex",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "stretch",
    justifyContent: "center",
    width: 79,
    backgroundColor: "#F5F5F5",
  },
  categoryIcon: {
    alignSelf: "center",
    display: "flex",
    minHeight: 50,
    width: 50,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  categoryName: {
    alignSelf: "stretch",
    marginTop: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    color: "rgba(0, 0, 0, 1)",
  },
});

export default CategoryItem;
