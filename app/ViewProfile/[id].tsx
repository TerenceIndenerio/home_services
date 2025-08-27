import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles as profileStyles } from "../../src/styles/viewProfileStyles";
import AboutSection from "./components/AboutSection";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import BookingModal from "./components/BookingModal";

const ViewProfileById = () => {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const userDocRef = doc(db, "users", String(id));
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setProfile(userDoc.data());
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleBack = useCallback(() => {
    try {
      router.back();
    } catch {
      router.replace ? router.replace("/") : router.push("/");
    }
  }, [router]);

  if (loading) {
    return (
      <View style={localStyles.centered}>
        <ActivityIndicator size="large" color="#8C52FF" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={localStyles.centered}>
        <Text style={{ color: "red" }}>{error || "Profile not found."}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header image + back */}
          <View style={{ position: "relative", alignItems: "center" }}>
            <Image
              source={{
                uri:
                  typeof profile?.profile?.profilePictureUrl === "string"
                    ? profile.profile.profilePictureUrl
                    : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=183&q=80",
              }}
              style={{
                width: "100%",
                height: 360,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 33,
                left: 18,
                backgroundColor: "#F3F0FF",
                borderRadius: 16,
                padding: 8,
              }}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color="#6B11F4" />
            </TouchableOpacity>
          </View>

          {/* Name, Title, Actions */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 18,
              marginHorizontal: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: "#222" }}>
                {`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()}
              </Text>
              <Text style={{ fontSize: 18, color: "#888", marginTop: 2 }}>
                {profile?.profile?.jobTitle || "Service Provider"}
              </Text>
            </View>
            <TouchableOpacity style={{ marginHorizontal: 8 }}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={28}
                color="#6B11F4"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={28} color="#6B11F4" />
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 22,
              marginHorizontal: 20,
            }}
          >
            <View style={profileStyles.infoCard}>
              <Ionicons
                name="star"
                size={22}
                color="#FFD700"
                style={{ marginBottom: 2 }}
              />
              <Text style={profileStyles.infoCardLabel}>Rating</Text>
              <Text style={profileStyles.infoCardValue}>
                {profile?.profile?.ratings ?? "0"}
              </Text>
            </View>

            <View style={profileStyles.infoCard}>
              <Ionicons
                name="calendar"
                size={22}
                color="#6B11F4"
                style={{ marginBottom: 2 }}
              />
              <Text style={profileStyles.infoCardLabel}>Bookings</Text>
              <Text style={profileStyles.infoCardValue}>
                {profile?.profile?.numberOfBookings ?? 0}
              </Text>
            </View>

            <View style={profileStyles.infoCard}>
              <Ionicons
                name="briefcase"
                size={22}
                color="#6B11F4"
                style={{ marginBottom: 2 }}
              />
              <Text style={profileStyles.infoCardLabel}>Experience</Text>
              <Text style={profileStyles.infoCardValue}>
                {profile?.profile?.experience ?? 0} yrs
              </Text>
            </View>
          </View>

          {/* About Section */}
          <AboutSection
            about={
              (profile?.profile?.bio || "No bio provided.") +
              "\n\n" +
              (profile?.profile?.jobDescription || "")
            }
          />
        </ScrollView>

        {/* Fixed Book Now button */}
        <View
          style={[
            localStyles.bottomButtonContainer,
            {
              bottom: insets.bottom + 12,
              left: 20,
              right: 20,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={localStyles.bookNowButton}
            activeOpacity={0.9}
          >
            <Text style={localStyles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Modal */}
        <BookingModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={String(id)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonContainer: {
    position: "absolute",
  },
  bookNowButton: {
    backgroundColor: "#6B11F4",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  bookNowButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});

export default ViewProfileById;
