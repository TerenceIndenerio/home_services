import * as React from "react";
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from "react-native";

interface ServiceCardProps {
  imageUrl: string;
  title: string;
  provider: string;
  rating: string;
  onPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  imageUrl,
  title,
  provider,
  rating,
  onPress,
}) => {
  const handlePress = () => {
    console.log("You tapped the button!");
    onPress();
  };
  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <Image source={{ uri: imageUrl }} style={styles.serviceImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.providerName} numberOfLines={1}>
          {provider}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStar}>⭐</Text>
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    overflow: "hidden",
    height: "100%",
    width: 183,
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  serviceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 0,
    width: "100%",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  providerName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 14,
    marginRight: 4,
    color: "#FFD700",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});

export default ServiceCard;
