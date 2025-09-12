import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { YStack, Text, Image } from "tamagui";
import { useThrottledRouter } from "../../../hooks/useThrottledRouter";
import { styles } from "../../../styles/onBoardingStyles";
import ArrowButton from "../components/ArrowButton";
import PaginationDots from "../components/Pagination";
import AsyncStorage from "@react-native-async-storage/async-storage";

const onboardingData = [
  {
    title: "Find your dream job",
    subtitle:
      "Apply to your dream job according to your skill sets and passion",
    imageUri:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/493fe804dd7b1887d6a669f0044ff53fb5ad283a",
  },
  {
    title: "Search for Services",
    subtitle: "Easily search for services that matches your needs",
    imageUri:
      "https://cdn.builder.io/api/v1/image/assets/a53206a1ac514d57bc5e1f4cc3ffd204/df734f384a98c3d50438d4fc5ff185fe13b8620b?placeholderIfAbsent=true",
  },
  {
    title: "Build Partnership",
    subtitle: "Connect with professionals that offer and seek services",
    imageUri:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/55d39796cb132384cf0ac7f2f04f74cd0c78b80c?placeholderIfAbsent=true",
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useThrottledRouter();

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setOnBoard();
      router.push("/authentication/LoginScreen");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const setOnBoard = async () => {
    try {
      await AsyncStorage.setItem("hasSetup", "true");
    } catch (e) {
      showAlert("Storage Error", "Failed to save setup flag.");
    }
  };

  const showAlert = (title: string, message: string) => {
    setErrorMessage(`${title}\n\n${message}`);
    setErrorVisible(true);
  };

  const { title, subtitle, imageUri } = onboardingData[currentPage];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <YStack style={styles.container}>
        <YStack style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.mainImage}
            accessibilityLabel={title}
          />
        </YStack>

        <YStack style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </YStack>

        <YStack style={styles.navigationContainer}>
          <ArrowButton
            direction="left"
            active={currentPage > 0}
            onPress={handlePrevious}
          />
          <PaginationDots
            count={onboardingData.length}
            activeIndex={currentPage}
          />
          <ArrowButton direction="right" active={true} onPress={handleNext} />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

export const options = {
  headerShown: false,
};
