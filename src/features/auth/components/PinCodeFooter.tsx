import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { navigate } from "expo-router/build/global-state/routing";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export const LoginFooter: React.FC = () => {
  const translateY = React.useRef(new Animated.Value(0)).current;
  const toolbarY = React.useRef(new Animated.Value(120)).current;

  const [toolbarVisible, setToolbarVisible] = React.useState(false);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -5,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [translateY]);

  const toggleToolbar = () => {
    setToolbarVisible(!toolbarVisible);
    Animated.timing(toolbarY, {
      toValue: toolbarVisible ? 120 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const navigateEmail = () => {
    router.replace("/authentication/Login");
  };

  const navigateMPIN = () => {
    router.replace("/authentication/PinCode");
  };

  const navigateBiometrics = () => {
    router.replace("/authentication/Biometrics");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.text}>or login with</Text>
          <TouchableOpacity onPress={toggleToolbar}>
            <Animated.View style={{ transform: [{ translateY }] }}>
              <Svg width="41" height="18" viewBox="0 0 41 18" fill="none">
                <Path
                  d="M19.4159 0.361261C19.5581 0.285596 19.7271 0.225564 19.9131 0.184603C20.0991 0.143643 20.2986 0.122559 20.5 0.122559C20.7014 0.122559 20.9008 0.143643 21.0869 0.184603C21.2729 0.225564 21.4419 0.285596 21.5841 0.361261L39.9591 10.1113C40.2466 10.2638 40.4082 10.4707 40.4082 10.6865C40.4082 10.9023 40.2466 11.1092 39.9591 11.2618C39.6716 11.4143 39.2816 11.5 38.875 11.5C38.4684 11.5 38.0784 11.4143 37.7909 11.2618L20.5 2.08539L3.20911 11.2618C2.92158 11.4143 2.53161 11.5 2.12498 11.5C1.71836 11.5 1.32838 11.4143 1.04086 11.2618C0.753328 11.1092 0.591797 10.9023 0.591797 10.6865C0.591797 10.4707 0.753328 10.2638 1.04086 10.1113L19.4159 0.361261Z"
                  fill="#ffffff"
                />
                <Path
                  d="M19.4159 6.86126C19.5581 6.7856 19.7271 6.72556 19.9131 6.6846C20.0991 6.64364 20.2986 6.62256 20.5 6.62256C20.7014 6.62256 20.9008 6.64364 21.0869 6.6846C21.2729 6.72556 21.4419 6.7856 21.5841 6.86126L39.9591 16.6113C40.2466 16.7638 40.4082 16.9707 40.4082 17.1865C40.4082 17.4023 40.2466 17.6092 39.9591 17.7618C39.6716 17.9143 39.2816 18 38.875 18C38.4684 18 38.0784 17.9143 37.7909 17.7618L20.5 8.58539L3.20911 17.7618C2.92158 17.9143 2.53161 18 2.12498 18C1.71836 18 1.32838 17.9143 1.04086 17.7618C0.753328 17.6092 0.591797 17.4023 0.591797 17.1865C0.591797 16.9707 0.753328 16.7638 1.04086 16.6113L19.4159 6.86126Z"
                  fill="#ffffff"
                />
              </Svg>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={[
          styles.toolbar,
          {
            transform: [{ translateY: toolbarY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.toolbarButton} onPress={navigateEmail}>
          <FontAwesome
            name="envelope"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Email</Text>
        </TouchableOpacity>


        <View style={styles.toggleButton}>
          <TouchableOpacity onPress={toggleToolbar}>
            <Animated.View style={{ transform: [{ translateY }] }}>
              <Svg width="40" height="18" viewBox="0 0 40 18" fill="none">
                <Path
                  d="M20.9923 17.6387C20.85 17.7144 20.6811 17.7744 20.495 17.8154C20.309 17.8564 20.1096 17.8774 19.9082 17.8774C19.7067 17.8774 19.5073 17.8564 19.3213 17.8154C19.1353 17.7744 18.9663 17.7144 18.824 17.6387L0.449037 7.88874C0.16151 7.73617 -2.07914e-05 7.52925 -2.07726e-05 7.31349C-2.07537e-05 7.09773 0.16151 6.8908 0.449037 6.73824C0.736565 6.58567 1.12654 6.49996 1.53316 6.49996C1.93979 6.49996 2.32976 6.58567 2.61729 6.73824L19.9082 15.9146L37.199 6.73824C37.4866 6.58567 37.8765 6.49996 38.2832 6.49996C38.6898 6.49996 39.0798 6.58567 39.3673 6.73824C39.6548 6.8908 39.8163 7.09773 39.8163 7.31349C39.8163 7.52925 39.6548 7.73617 39.3673 7.88874L20.9923 17.6387Z"
                  fill="#ffffff"
                />
                <Path
                  d="M20.9923 11.1387C20.85 11.2144 20.6811 11.2744 20.495 11.3154C20.309 11.3564 20.1096 11.3774 19.9082 11.3774C19.7067 11.3774 19.5073 11.3564 19.3213 11.3154C19.1353 11.2744 18.9663 11.2144 18.824 11.1387L0.449037 1.38874C0.16151 1.23617 -2.07994e-05 1.02925 -2.07726e-05 0.813486C-2.07457e-05 0.597725 0.16151 0.390801 0.449037 0.238236C0.736565 0.08567 1.12654 -3.99754e-05 1.53316 -3.99441e-05C1.93979 -3.99128e-05 2.32976 0.0856701 2.61729 0.238236L19.9082 9.41461L37.199 0.238239C37.4866 0.0856732 37.8765 -3.67722e-05 38.2832 -3.67313e-05C38.6898 -3.66904e-05 39.0798 0.0856733 39.3673 0.238239C39.6548 0.390805 39.8163 0.597729 39.8163 0.813489C39.8163 1.02925 39.6548 1.23617 39.3673 1.38874L20.9923 11.1387Z"
                  fill="#ffffff"
                />
              </Svg>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

// Default export to satisfy Expo Router
export default LoginFooter;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: width,
    alignItems: "center",
    paddingVertical: 16,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 12,
    color: "#444444",
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 8,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: 120,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1000,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  toolbarButton: {
    backgroundColor: "#8C52FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 100,
    textAlign: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    position: "absolute",
    bottom: 10,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 50,
  },
  icon: {
    marginBottom: 4,
  },
});
