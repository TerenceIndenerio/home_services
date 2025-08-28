import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/src/features/auth/context/authContext";
import { logout } from "@/src/utils/authUtils";
import { getAuth } from "firebase/auth"; // Firebase Auth

const generalItems = [
  { icon: "settings-outline", label: "Settings" },
  { icon: "call-outline", label: "Contact Us" },
  { icon: "gift-outline", label: "Refer & Earn" },
  { icon: "information-circle-outline", label: "About App" },
  { icon: "help-circle-outline", label: "Help" },
];

// Simulated API: GET /api/users/:id
const getUserProfile = async (userId) => {
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
  const [avatarUrl, setAvatarUrl] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userDocumentId) return;

      try {
        // Fetch and log ID Token for authentication if needed
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken();
          console.log("ID Token (Authorization):", idToken);
        }

        // Simulate GET /api/users/:id
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
          // Create a default user if not found
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

    try {
      const userRef = doc(db, "users", userDocumentId);
      await updateDoc(userRef, { isJobSeeker: newValue });
      console.log("Updated isJobSeeker to:", newValue);

      // Log token after update
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        console.log("ID Token after toggle:", idToken);
      }
    } catch (error) {
      console.error("Failed to update isJobSeeker:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.name}>{userName || "Loading..."}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.verification}>Verification 40%</Text>
              <Icon
                name="alert-circle"
                size={12}
                color="#D32F2F"
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text style={styles.subtitle}>
              Your account is not fully verified
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/SeekerEditProfileScreen")}
          >
            <Icon name="pencil" size={18} color="#8F5CFF" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {isJobSeeker && (
          <TouchableOpacity
            style={styles.seekerButton}
            onPress={() => router.push("/seeker")}
          >
            <Text style={styles.seekerButtonText}>Go to Seeker Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* General Section */}
      <View style={styles.generalSection}>
        <Text style={styles.generalTitle}>General</Text>

        <View style={styles.generalItem}>
          <Icon
            name="briefcase-outline"
            size={22}
            color="#8F5CFF"
            style={{ marginRight: 16 }}
          />
          <Text style={styles.generalLabel}>Job Seeker</Text>
          {!loading && (
            <Switch
              style={{ marginLeft: "auto" }}
              value={isJobSeeker}
              onValueChange={toggleJobSeeker}
              trackColor={{ false: "#ccc", true: "#8F5CFF" }}
              thumbColor="#fff"
            />
          )}
        </View>

        {generalItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.generalItem}>
            <Icon
              name={item.icon}
              size={22}
              color="#8F5CFF"
              style={{ marginRight: 16 }}
            />
            <Text style={styles.generalLabel}>{item.label}</Text>
            <Icon
              name="chevron-forward"
              size={18}
              color="#bbb"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            try {
              await logout();
              router.replace("/authentication/Login");
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F6FF" },
  profileSection: {
    backgroundColor: "#EAE6FF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 32,
    paddingTop: 32,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#222" },
  verification: { fontSize: 13, color: "#8F5CFF", fontWeight: "600" },
  subtitle: { fontSize: 12, color: "#D32F2F", marginTop: 2 },
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
  seekerButton: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: "#8F5CFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  seekerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  generalSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 18,
    paddingBottom: 24,
    paddingTop: 8,
    elevation: 1,
  },
  generalTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#888",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  generalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  generalLabel: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  logoutBtn: {
    marginTop: 18,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#A259FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#A259FF",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default AccountProfile;
