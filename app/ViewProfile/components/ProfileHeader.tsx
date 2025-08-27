import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Props {
  provider?: string;
  title?: string;
  imageUrl?: string;
}

const ProfileHeader: React.FC<Props> = ({ provider, title, imageUrl }) => {
  return (
    <>
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        </View>
      )}
      <Text style={styles.providerName}>{provider}</Text>
      <Text style={styles.serviceTitle}>{title}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: "black",
    overflow: "hidden",
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  profileImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  providerName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  serviceTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ProfileHeader;
