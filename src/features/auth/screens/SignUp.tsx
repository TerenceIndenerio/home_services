import * as React from "react";
import {
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { YStack, XStack, Text, Button, Input } from "tamagui";
import InputField from "../components/InputField";
import { useRouter } from "expo-router";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../../firebaseConfig";
import ErrorModal from "../components/ErrorModal";
import { useAuth } from "../context/authContext";
import Loader from "../../../components/Loader";

const SignUp = () => {
  const router = useRouter();
  const { register, state, clearError } = useAuth();

  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [address, setAddress] = React.useState("Cebu City");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [signingUp, setSigningUp] = React.useState(false);

  const [errorVisible, setErrorVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Test Firebase connectivity - CRITICAL CHECK
  const testFirebaseConnection = async () => {
    try {
      console.log("🔍 Testing Firebase Firestore permissions...");
      console.log("Auth current user:", auth.currentUser);
      console.log("Firestore db:", db);

      // Try to read a test document (this will fail if permissions are wrong)
      const testDocRef = doc(db, "test", "connection_test");
      const testDoc = await getDoc(testDocRef);
      console.log("✅ Firestore connection test PASSED:", testDoc.exists() ? "Document exists" : "Document doesn't exist (but permissions work)");
      return true;
    } catch (error: any) {
      console.error("❌ Firebase Firestore connection test FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      if (error.code === "permission-denied") {
        console.error("🚫 FIRESTORE SECURITY RULES ISSUE: Permission denied for test document access");
        console.error("📋 SOLUTION: Update Firestore security rules in Firebase Console");
      }

      return false;
    }
  };

  // Test Firebase Storage connectivity - CRITICAL CHECK
  const testStorageConnection = async () => {
    try {
      console.log("🔍 Testing Firebase Storage permissions...");
      // Try to get a reference to storage root
      const testRef = ref(storage, "test_permissions.txt");
      console.log("✅ Storage reference created successfully:", testRef.toString());
      return true;
    } catch (error: any) {
      console.error("❌ Firebase Storage connection test FAILED:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      if (error.code === "storage/unauthorized") {
        console.error("🚫 STORAGE SECURITY RULES ISSUE: Storage access unauthorized");
        console.error("📋 SOLUTION: Update Firebase Storage security rules in Firebase Console");
      }

      return false;
    }
  };

  const showAlert = (title: string, message: string) => {
    console.log(`SignUp Error - ${title}:`, message);
    setErrorMessage(message);
    setErrorVisible(true);
  };

  const pickImage = async () => {
    try {
      console.log("Starting image picker...");

      // Request permissions for both camera and media library
      const [mediaLibraryPermission, cameraPermission] = await Promise.all([
        ImagePicker.requestMediaLibraryPermissionsAsync(),
        ImagePicker.requestCameraPermissionsAsync()
      ]);

      console.log("Media library permission:", mediaLibraryPermission.status);
      console.log("Camera permission:", cameraPermission.status);

      if (mediaLibraryPermission.status !== "granted" && cameraPermission.status !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and photo library permissions to select or take a profile picture.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                // On mobile, you might want to open app settings
                console.log("User should open app settings manually");
              }
            }
          ]
        );
        return;
      }

      // Show options to user
      Alert.alert(
        "Select Image",
        "Choose how to add your profile picture",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Take Photo",
            onPress: async () => {
              if (cameraPermission.status === "granted") {
                await takePhoto();
              } else {
                Alert.alert("Camera Permission", "Camera permission is required to take photos.");
              }
            }
          },
          {
            text: "Choose from Gallery",
            onPress: async () => {
              if (mediaLibraryPermission.status === "granted") {
                await chooseFromGallery();
              } else {
                Alert.alert("Gallery Permission", "Gallery permission is required to select photos.");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error in image picker setup:", error);
      showAlert("Image Selection Error", "Failed to set up image picker. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      console.log("Launching camera...");
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false, // Reduce metadata for mobile
      });

      if (!result.canceled && result.assets[0]) {
        console.log("Photo taken successfully:", result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showAlert("Camera Error", "Failed to take photo. Please try again.");
    }
  };

  const chooseFromGallery = async () => {
    try {
      console.log("Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false, // Reduce metadata for mobile
      });

      if (!result.canceled && result.assets[0]) {
        console.log("Image selected from gallery:", result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting from gallery:", error);
      showAlert("Gallery Error", "Failed to select image from gallery. Please try again.");
    }
  };

  const uploadImageToStorage = async (uri: string, userId: string): Promise<string | null> => {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        console.log(`Starting image upload process... (attempt ${retryCount + 1}/${maxRetries})`);
        console.log("Image URI:", uri);
        console.log("User ID:", userId);
        console.log("Platform:", Platform.OS);

        setIsUploading(true);

        if (Platform.OS === "web") {
          console.warn("Image upload skipped on web platform to avoid CORS issues");
          return null;
        }

        // Validate URI format for mobile
        if (!uri || (!uri.startsWith('file://') && !uri.startsWith('content://') && !uri.startsWith('http'))) {
          throw new Error("Invalid image URI format for mobile device");
        }

        console.log("Fetching image from URI...");
        let response: Response;

        try {
          // For mobile, we need to handle different URI schemes
          if (Platform.OS === 'ios' && uri.startsWith('file://')) {
            // iOS file URI handling
            response = await fetch(uri);
          } else if (Platform.OS === 'android') {
            // Android content/file URI handling
            response = await fetch(uri);
          } else {
            response = await fetch(uri);
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
          throw new Error(`Failed to access image file: ${errorMessage}`);
        }

        console.log("Converting to blob...");
        let blob: Blob;

        try {
          blob = await response.blob();

          // Validate blob
          if (!blob || blob.size === 0) {
            throw new Error("Image file is empty or corrupted");
          }

          // Check file size (limit to 10MB for mobile)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (blob.size > maxSize) {
            throw new Error(`Image file too large: ${(blob.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`);
          }

          console.log("Blob size:", blob.size, "bytes");
          console.log("Blob type:", blob.type);
        } catch (blobError) {
          console.error("Blob conversion error:", blobError);
          const errorMessage = blobError instanceof Error ? blobError.message : 'Unknown blob error';
          throw new Error(`Failed to process image: ${errorMessage}`);
        }

        const timestamp = Date.now();
        const fileExtension = blob.type?.split('/')[1] || 'jpg';
        const fileName = `profile_${timestamp}.${fileExtension}`;
        const storagePath = `profile-images/${userId}/${fileName}`;

        console.log("Storage path:", storagePath);
        console.log("File extension:", fileExtension);

        // Create storage reference with metadata
        const imageRef = ref(storage, storagePath);
        const metadata = {
          contentType: blob.type || 'image/jpeg',
          customMetadata: {
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
            platform: Platform.OS
          }
        };

        console.log("Uploading bytes to Firebase Storage...");
        console.log("Upload metadata:", metadata);

        const uploadResult = await uploadBytes(imageRef, blob, metadata);
        console.log("Upload result:", uploadResult);

        console.log("Getting download URL...");
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Download URL obtained:", downloadURL);

        return downloadURL;

      } catch (error: any) {
        console.error(`Upload attempt ${retryCount + 1} failed:`, error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error server response:", error.serverResponse);

        retryCount++;

        // Don't retry on certain errors
        if (error.code === "storage/unauthorized" ||
            error.code === "storage/quota-exceeded" ||
            error.message?.includes("Invalid image URI") ||
            error.message?.includes("file too large")) {
          console.log("Non-retryable error, aborting upload");
          retryCount = maxRetries; // Don't retry
        }

        if (retryCount >= maxRetries) {
          let message = "Your account will still be created, but profile image upload failed.";

          if (error.code === "storage/unauthorized") {
            message = "Storage upload unauthorized. Please check Firebase Storage security rules.";
          } else if (error.code === "storage/canceled") {
            message = "Upload was canceled.";
          } else if (error.code === "storage/quota-exceeded") {
            message = "Storage quota exceeded.";
          } else if (error.code === "storage/invalid-format") {
            message = "Invalid file format.";
          } else if (error.code === "storage/retry-limit-exceeded") {
            message = "Upload retry limit exceeded.";
          } else if (error.code === "storage/unknown" && error.status_ === 404) {
            message = "Firebase Storage not configured. Please enable Storage in Firebase Console:\n\n1. Go to Firebase Console > Storage\n2. Click 'Get started'\n3. Choose a location\n4. Set up security rules\n5. Try again";
          } else if (error.message?.includes("file too large")) {
            message = error.message;
          } else if (error.message?.includes("Invalid image URI")) {
            message = "Image file format not supported. Please try a different image.";
          } else if (error.code) {
            message = `Upload failed: ${error.code}`;
          }

          showAlert("Image Upload Failed", message);
          return null;
        } else {
          console.log(`Retrying upload in 2 seconds... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        }
      } finally {
        setIsUploading(false);
      }
    }

    return null;
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
      console.log("Preparing user data for Firestore...");
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

      console.log("User data to save:", userData);
      console.log("Firestore document path: users/" + userId);

      await setDoc(doc(db, "users", userId), userData);
      console.log("Successfully saved user to Firestore");
      return true;
    } catch (error: any) {
      console.error("Error saving user to Firestore:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let message = "Failed to save user details to database.";
      if (error.code === "permission-denied") {
        message = "Permission denied. Please check your Firebase security rules.";
      } else if (error.code === "unavailable") {
        message = "Firestore is currently unavailable. Please try again later.";
      }

      showAlert("Database Error", message);
      return false;
    }
  };

  const handleSignUp = async () => {
    console.log("Starting sign up process...");
    console.log("Form data:", { email, firstName, lastName, password: "***", phoneNumber, address });

    if (!email || !firstName || !lastName || !password) {
      showAlert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setSigningUp(true);
    clearError(); // Clear any previous errors

    // Test Firebase connection first - STRICT CHECK
    console.log("Performing strict Firebase connectivity test...");
    const firebaseConnected = await testFirebaseConnection();
    if (!firebaseConnected) {
      console.error("Firebase connection test FAILED - ABORTING SIGNUP");
      showAlert("Firebase Error",
        "Unable to connect to Firebase database due to permission issues.\n\n" +
        "Please update your Firestore security rules in Firebase Console:\n\n" +
        "1. Go to Firebase Console > Firestore > Rules\n" +
        "2. Replace all rules with the provided code\n" +
        "3. Click 'Publish'\n" +
        "4. Wait 30 seconds and try again\n\n" +
        "Account creation aborted to prevent data issues."
      );
      setSigningUp(false);
      return;
    }
    console.log("Firebase connection test PASSED - proceeding with signup");

    try {
      console.log("Calling register function...");
      // Register the user (this will handle Firebase auth)
      await register(email, password);
      console.log("Register function completed successfully");

      // Get the current user from the context
      const currentUser = state.user;
      console.log("Current user from context:", currentUser);

      if (!currentUser) {
        throw new Error("User registration failed - no user returned from auth context");
      }

      console.log("User registered successfully:", currentUser.uid);

      let profileImageUrl: string | null = null;
      if (profileImage) {
        console.log("Profile image selected, testing Storage permissions...");
        const storageConnected = await testStorageConnection();
        if (!storageConnected) {
          console.error("❌ Storage permission test FAILED - ABORTING SIGNUP");
          showAlert("Storage Error", "Unable to access Firebase Storage due to permission issues. Please check your Firebase Storage security rules. Account creation aborted.");
          setSigningUp(false);
          return;
        } else {
          console.log("✅ Storage permissions OK, proceeding with upload...");
          profileImageUrl = await uploadImageToStorage(profileImage, currentUser.uid);
          console.log("Profile image uploaded:", profileImageUrl);
        }
      }

      console.log("Saving user to Firestore...");
      const firestoreSaved = await saveUserToFirestore(currentUser.uid, profileImageUrl);
      if (!firestoreSaved) {
        console.error("❌ CRITICAL: Failed to save user to Firestore - ABORTING SIGNUP");
        showAlert("Database Error", "Failed to save user details to database due to permission issues. Please check your Firebase security rules. Account creation aborted.");
        setSigningUp(false);
        return;
      }
      console.log("✅ User saved to Firestore successfully");

      console.log("Saving names locally...");
      const saved = await saveNamesLocally();
      if (!saved) {
        console.error("Failed to save names locally");
        return;
      }
      console.log("Names saved locally successfully");

      // Set ableToLogin flag for future app launches
      await AsyncStorage.setItem("ableToLogin", "true");
      console.log("ableToLogin flag set");

      console.log("Sign up process completed successfully, navigating to home...");
      // The AuthContext will handle setting userDocumentId and hasSetup automatically
      router.push("/");
    } catch (error: any) {
      console.error("Sign up error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let message = "An unexpected error occurred. Please try again later.";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already associated with an account.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters long.";
      } else if (error.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection and try again.";
      } else if (error.code === "permission-denied") {
        message = "Permission denied. Please check your Firebase security rules.";
      }
      showAlert("Sign Up Failed", message);
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$gray1">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 50,
          paddingBottom: 50,
          maxWidth: 420,
          width: "100%",
          alignSelf: "center",
          flexGrow: 1,
          justifyContent: "center"
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <YStack alignItems="center" marginBottom="$6">
          <Text fontSize="$8" color="$purple9" fontWeight="900" textAlign="center">Join Our Community</Text>
          <Text fontSize="$4" color="$gray11" marginTop="$2" textAlign="center" maxWidth={300}>
            Create your account to connect with service providers and access premium features
          </Text>
        </YStack>

        <ErrorModal visible={errorVisible} message={errorMessage} onClose={() => setErrorVisible(false)} title="Sign Up Error" />

        <YStack marginTop="$6" backgroundColor="$background" borderRadius="$6" padding="$5" shadowColor="$shadowColor" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.1} shadowRadius={8} elevation={3}>
          <Text fontSize="$5" color="$gray12" fontWeight="600" marginBottom="$4" textAlign="center">
            Account Information
          </Text>
          <InputField label="Email Address" required value={email} onChangeText={setEmail} iconName="mail" placeholder="Enter your email" />
          <InputField label="Password" required value={password} onChangeText={setPassword} secureTextEntry iconName="lock-closed" placeholder="Create a strong password" />

          <Text fontSize="$5" color="$gray12" fontWeight="600" marginTop="$4" marginBottom="$4" textAlign="center">
            Personal Details
          </Text>
          <InputField label="First Name" required value={firstName} onChangeText={setFirstName} iconName="person" placeholder="Your first name" />
          <InputField label="Middle Name" value={middleName} onChangeText={setMiddleName} iconName="person" placeholder="Your middle name (optional)" />
          <InputField label="Last Name" required value={lastName} onChangeText={setLastName} iconName="person" placeholder="Your last name" />
          <InputField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} iconName="call" placeholder="Your contact number" />
          <InputField label="Address" value={address} onChangeText={setAddress} iconName="location" placeholder="Your location" />

          <YStack marginTop="$4" alignItems="center">
            <Text fontSize="$4" color="$gray11" marginBottom="$3" textAlign="center">
              Add a Profile Picture (Optional)
            </Text>
            <Button
              size="$6"
              circular
              backgroundColor="$gray3"
              borderColor="$gray6"
              borderWidth={2}
              onPress={pickImage}
              disabled={isUploading}
              pressStyle={{ opacity: 0.8 }}
              hoverStyle={{ backgroundColor: "$gray4" }}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{ width: 80, height: 80, borderRadius: 40 }} />
              ) : (
                <YStack alignItems="center">
                  <Text fontSize="$6" color="$gray10" marginBottom="$1">📷</Text>
                  <Text fontSize="$3" color="$gray10" textAlign="center">
                    {isUploading ? "Uploading..." : "Choose Photo"}
                  </Text>
                  <Text fontSize="$2" color="$gray8" textAlign="center" marginTop="$1">
                    Camera or Gallery
                  </Text>
                </YStack>
              )}
            </Button>
            {profileImage && (
              <Text marginTop="$3" fontSize="$3" color="$green9" fontWeight="600" textAlign="center">
                ✓ Profile picture added successfully
              </Text>
            )}
          </YStack>
        </YStack>

        <YStack marginTop="$8" alignItems="center" paddingBottom="$6">
          <Button
            size="$5"
            theme="purple"
            backgroundColor="$purple9"
            color="$background"
            fontWeight="700"
            fontSize="$4"
            paddingHorizontal="$6"
            onPress={handleSignUp}
            pressStyle={{ opacity: 0.8 }}
            disabled={signingUp}
            hoverStyle={{ backgroundColor: "$purple10" }}
          >
            {signingUp ? "Creating Account..." : "Create Your Account"}
          </Button>
          <Text marginTop="$5" fontSize="$4" color="$gray11" textAlign="center">
            Already have an account?{" "}
            <Text
              color="$purple9"
              fontWeight="600"
              onPress={() => router.push("/authentication/Login")}
              pressStyle={{ opacity: 0.8 }}
            >
              Sign In Here
            </Text>
          </Text>
          <Text marginTop="$2" fontSize="$3" color="$gray9" textAlign="center" maxWidth={300}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </YStack>
      </ScrollView>
      <Loader visible={signingUp} text="Creating account..." />
    </YStack>
  );
};


export default SignUp;
