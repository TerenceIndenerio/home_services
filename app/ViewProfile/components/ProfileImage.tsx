// components/ProfileImage.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface Props {
  imageUrl: string;
}

const ProfileImage: React.FC<Props> = ({ imageUrl }) => (
  <View style={styles.imageContainer}>
    <Image source={{ uri: imageUrl }} style={styles.profileImage} />
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: "black",
    overflow: "hidden",
    marginBottom: 20,
  },
  profileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
});

export default ProfileImage;
