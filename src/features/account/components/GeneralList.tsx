import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const items = [
  { icon: "settings-outline", label: "Settings" },
  { icon: "call-outline", label: "Contact Us" },
  { icon: "share-social-outline", label: "Refer & Earn" },
  { icon: "star-outline", label: "About App" },
];

const GeneralList = () => (
  <View style={styles.container}>
    <Text style={styles.title}>General</Text>
    {items.map((item, idx) => (
      <TouchableOpacity style={styles.item} key={item.label}>
        <Icon name={item.icon} size={22} color="#8F5CFF" />
        <Text style={styles.label}>{item.label}</Text>
        <Icon name="chevron-forward" size={20} color="#B0A4D6" style={styles.chevron} />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    marginLeft: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F0FF",
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginLeft: 16,
    flex: 1,
  },
  chevron: {
    marginLeft: "auto",
  },
});

export default GeneralList; 