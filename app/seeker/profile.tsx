import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../src/features/auth/context/authContext";
import { logout } from "../../src/utils/authUtils";
import Loader from "../../src/components/Loader";

const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      console.log("GET /api/users/:id → User not found");
      return null;
    }

    const userData = snapshot.data();
    console.log("GET /api/users/:id →", userData);
    return userData;
  } catch (error) {
    console.error("GET /api/users/:id failed:", error);
    return null;
  }
};

const AccountProfile = () => {
  const router = useRouter();
  const { userDocumentId } = useAuth();
  const [isJobSeeker, setIsJobSeeker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userDocumentId) return;

      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          console.log("ID Token (Authorization):", idToken);
        }

        const userData = await getUserProfile(userDocumentId);

        if (userData) {
          setIsJobSeeker(userData.isJobSeeker ?? false);
          if (userData.firstName || userData.lastName) {
            setUserName(
              `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
            );
          }
          if (userData.avatarUrl) {
            setAvatarUrl(userData.avatarUrl);
          }
        } else {
          const userRef = doc(db, "users", userDocumentId);
          await setDoc(userRef, { isJobSeeker: false });
          setIsJobSeeker(false);
          console.log("Created new user doc with isJobSeeker = false");
        }
      } catch (error) {
        console.error("Error fetching/creating user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userDocumentId]);

  const toggleJobSeeker = async () => {
    if (!userDocumentId) return;
    const newValue = !isJobSeeker;
    setIsJobSeeker(newValue);
    setUpdating(true);

    try {
      const userRef = doc(db, "users", userDocumentId);
      await updateDoc(userRef, { isJobSeeker: newValue });
      console.log("Updated isJobSeeker to:", newValue);

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        console.log("ID Token after toggle:", idToken);
      }

      if (newValue) {
        router.push("/seeker/profile");
      } else {
        router.push("/tabThree");
      }
    } catch (error) {
      console.error("Failed to update isJobSeeker:", error);
      setIsJobSeeker(!newValue);
      Alert.alert("Error", "Failed to update role. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/SeekerEditProfileScreen")}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName || "User Name"}</Text>
          <Text style={styles.userRole}>
            {isJobSeeker ? "Job Seeker" : "Service Provider"}
          </Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleJobSeeker}
          >
            <Text style={styles.toggleButtonText}>
              Switch to Service Provider
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/SeekerEditProfileScreen")}
          >
            <Ionicons name="create-outline" size={20} color="#8C52FF" />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              isJobSeeker
                ? router.push("/seeker/profile")
                : router.push("/ServiceProviderDashboard")
            }
          >
            <Ionicons name="stats-chart-outline" size={20} color="#8C52FF" />
            <Text style={styles.actionButtonText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/Messages/MessagesListScreen")}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#8C52FF" />
            <Text style={styles.actionButtonText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/Bookings")}
          >
            <Ionicons name="calendar-outline" size={20} color="#8C52FF" />
            <Text style={styles.actionButtonText}>Bookings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await logout();
              router.replace("/authentication/Login");
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Loader visible={updating} text="Updating role..." />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6FF",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#8C52FF",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8C52FF",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#F8F6FF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  userRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: "#8C52FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionButtonText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default AccountProfile;
