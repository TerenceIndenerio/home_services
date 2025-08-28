import * as React from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import { LoginHeader } from "../components/PinCodeHeader";
import { LoginFooter } from "../components/PinCodeFooter";
import PinCodeInput from "../components/PinCodeInput";
import ErrorModal from "../components/ErrorModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // 🔹 Check hasSetup (onBoarding) on mount
  React.useEffect(() => {
    const checkHasSetup = async () => {
      try {
        const value = await AsyncStorage.getItem("onBoard");
        if (!value) {
          router.replace("/authentication/OnBoardingScreen");
        }
      } catch (err) {
        console.error("Error reading onBoard from AsyncStorage:", err);
      }
    };

    checkHasSetup();
  }, []);

  // 🔹 Fetch user data on component load
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Attempting to fetch user data...");
        // TODO: Replace with dynamic user ID
        const userDocRef = doc(db, "users", "j9Tvehvtg5FrYFMHhtWn");
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("✅ User data loaded successfully:", userData);
          await AsyncStorage.setItem("user_data", JSON.stringify(userData));
        } else {
          console.log("❌ User document does not exist");
        }
      } catch (error) {
        console.error("❌ Error fetching user data on load:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePinComplete = async (pin: string) => {
    if (!pin || pin.length < 4) {
      setErrorMessage("Please enter a valid 4-digit PIN.");
      setErrorModalVisible(true);
      return;
    }

    try {
      // TODO: Replace with dynamic user ID
      const userDocRef = doc(db, "users", "j9Tvehvtg5FrYFMHhtWn");
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data fetched:", userData);

        const fetchedPin = userData.pincode?.toString();

        if (pin === fetchedPin) {
          await AsyncStorage.setItem("user_data", JSON.stringify(userData));
          router.replace("/");
        } else {
          setErrorMessage("The PIN you entered is incorrect.");
          setErrorModalVisible(true);
        }
      } else {
        setErrorMessage("User data not found.");
        setErrorModalVisible(true);
      }
    } catch (error) {
      setErrorMessage("Something went wrong while checking your PIN.");
      setErrorModalVisible(true);
      console.error("PIN check error:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={styles.container}>
        <LoginHeader />
        <PinCodeInput length={4} onComplete={handlePinComplete} />
        <LoginFooter />

      </View>

      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 480,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 19,
    paddingBottom: 20,
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

export default Login;
