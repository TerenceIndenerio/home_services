import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import InputField from "../components/InputField";
import Button from "../components/SignUpButton";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../../firebaseConfig";
import ErrorModal from "../components/ErrorModal";
import { useAuth } from "../context/authContext";

const SignUp = () => {
  const router = useRouter();
  const { setUserDocumentId } = useAuth();

  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [address, setAddress] = React.useState("Cebu City");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const [errorVisible, setErrorVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const showAlert = (title: string, message: string) => {
    setErrorMessage(`${title}\n\n${message}`);
    setErrorVisible(true);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant camera roll permissions to select an image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showAlert("Image Selection Error", "Failed to select image. Please try again.");
    }
  };

  const uploadImageToStorage = async (uri: string, userId: string): Promise<string | null> => {
    try {
      setIsUploading(true);

      if (Platform.OS === "web") {
        console.warn("Image upload skipped on web platform to avoid CORS issues");
        return null;
      }

      const response = await fetch(uri);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);

      const blob = await response.blob();
      const imageRef = ref(storage, `profile-images/${userId}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      showAlert("Image Upload Failed", "Your account will still be created, but profile image upload failed.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const saveNamesLocally = async () => {
    try {
      const data = { firstName, middleName, lastName };
      await AsyncStorage.setItem("user_names", JSON.stringify(data));
      return true;
    } catch {
      showAlert("Storage Error", "Failed to save names locally.");
      return false;
    }
  };

  const saveUserToFirestore = async (userId: string, profileImageUrl: string | null) => {
    try {
      const userData = {
        uid: userId,
        email,
        firstName,
        middleName,
        lastName,
        address,
        phoneNumber,
        profileImageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountType: "seeker",
        isActive: true,
        isVerified: false,
      };

      await setDoc(doc(db, "users", userId), userData);
      return true;
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      showAlert("Database Error", "Failed to save user details to database.");
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!email || !firstName || !lastName || !password) {
      showAlert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profileImageUrl: string | null = null;
      if (profileImage) {
        profileImageUrl = await uploadImageToStorage(profileImage, user.uid);
      }

      const firestoreSaved = await saveUserToFirestore(user.uid, profileImageUrl);
      if (!firestoreSaved) {
        showAlert("Sign Up Error", "Account created but failed to save user details. Please contact support.");
        return;
      }

      const saved = await saveNamesLocally();
      if (!saved) return;

      await setUserDocumentId(user.uid);
      router.push("/");
    } catch (error: any) {
      let message = "An unexpected error occurred. Please try again later.";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already associated with an account.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters long.";
      }
      showAlert("Sign Up Failed", message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Let's Get Started</Text>
          <Text style={styles.subtitleText}>Create your account to access all features</Text>
        </View>

        <ErrorModal visible={errorVisible} message={errorMessage} onClose={() => setErrorVisible(false)} />

        <View style={styles.formContainer}>
          <InputField label="Email address" required value={email} onChangeText={setEmail} style={styles.fieldSpacing} />
          <InputField label="Password" required value={password} onChangeText={setPassword} secureTextEntry style={styles.fieldSpacing} />
          <InputField label="First Name" required value={firstName} onChangeText={setFirstName} style={styles.fieldSpacing} />
          <InputField label="Middle Name" value={middleName} onChangeText={setMiddleName} style={styles.fieldSpacing} />
          <InputField label="Last Name" required value={lastName} onChangeText={setLastName} style={styles.fieldSpacing} />
          <InputField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.fieldSpacing} />
          <InputField label="Address" value={address} onChangeText={setAddress} style={styles.fieldSpacing} />

          <View style={styles.fieldSpacing}>
            <Text style={styles.fieldLabel}>Profile Picture</Text>
            <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer} disabled={isUploading}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImagePlaceholderText}>
                    {isUploading ? "Uploading..." : "Tap to select image"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {profileImage && <Text style={styles.imageSelectedText}>Image selected ✓</Text>}
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Button title="Create Account" onPress={handleSignUp} />
          <TouchableOpacity style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink} onPress={() => router.push("/authentication/Login")}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginLeft: "auto", marginRight: "auto", maxWidth: 420, width: "100%", padding: 20, paddingTop: 40, paddingBottom: 40 },
  headerContainer: { alignItems: "center" },
  headerText: { fontSize: 28, color: "#8C52FF", fontWeight: "900" },
  subtitleText: { fontSize: 15, color: "#444", marginTop: 4, marginBottom: 8 },
  formContainer: { marginTop: 32, backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  fieldSpacing: { marginTop: 12 },
  fieldLabel: { fontSize: 14, color: "#444", marginBottom: 8 },
  actionContainer: { marginTop: 32, alignItems: "center" },
  loginContainer: { marginTop: 16 },
  loginText: { fontSize: 15, color: "#444" },
  loginLink: { fontWeight: "600", color: "#8C52FF" },
  profileImageContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  profileImage: { width: "100%", height: "100%", borderRadius: 50 },
  profileImagePlaceholder: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#E0E0E0" },
  profileImagePlaceholderText: { fontSize: 14, color: "#888" },
  imageSelectedText: { marginTop: 8, fontSize: 14, color: "#4CAF50", fontWeight: "600", textAlign: "center" },
});

export default SignUp;
