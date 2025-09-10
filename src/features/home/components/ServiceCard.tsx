import * as React from "react";
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from "react-native";
import Colors from "../../../../app/constants/Colors";

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
    backgroundColor: Colors.background,
    shadowColor: Colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  serviceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  infoContainer: {
    padding: 0,
    width: "100%",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStar: {
    fontSize: 14,
    marginRight: 4,
    color: Colors.secondary,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
});

export default ServiceCard;
