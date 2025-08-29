import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/AppNavigator';
import { useRouter } from "expo-router";

const ProfileHeader = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileRow}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Matt Dawner</Text>
          <Text style={styles.verification}>Verification 60%</Text>
          <Text style={styles.subtitle}>Your account is not fully verified</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/seeker/profile')}>
          <Icon name="pencil" size={18} color="#8F5CFF" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#EAE6FF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 24,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    alignSelf: "center",
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  verification: {
    fontSize: 14,
    color: "#8F5CFF",
    fontWeight: "600",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 2,
  },
  editBtn: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D32F2F",
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default ProfileHeader; 