import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const applicant = {
  name: "Matt Dawner",
  job: "Applying For Home Driver",
  avatar: { uri: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=183&q=80" },
};

const JobApplicantsCard = () => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.title}>Job Applicants</Text>
      <TouchableOpacity>
        <Text style={styles.viewAll}>View all <Ionicons name="chevron-forward" size={14} color="#8F5CFF" /></Text>
      </TouchableOpacity>
    </View>
    <View style={styles.applicantRow}>
      <Image source={applicant.avatar} style={styles.avatar} />
      <View style={styles.infoCol}>
        <Text style={styles.name}>{applicant.name}</Text>
        <Text style={styles.job}>{applicant.job}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  viewAll: {
    fontSize: 13,
    color: "#8F5CFF",
    fontWeight: "600",
  },
  applicantRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F8FF",
    borderRadius: 8,
    padding: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
    backgroundColor: "#eee",
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  job: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
});

export default JobApplicantsCard; 