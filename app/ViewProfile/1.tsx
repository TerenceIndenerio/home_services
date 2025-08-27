import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfileHeader from "./components/ProfileHeader";
import InfoBox from "./components/InfoBoxItem";
import AboutSection from "./components/AboutSection";
import BookingModal from "./components/BookingModal";

import { styles } from "../../src/styles/viewProfileStyles";

const ViewProfile = () => {
  const { provider, title, imageUrl, about, rating } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <ProfileHeader
            provider={String(provider)}
            title={String(title)}
            imageUrl={String(imageUrl)}
          />

          <InfoBox rating={rating} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕒 Availability</Text>
            <Text style={styles.sectionContent}>
              {"     "}Mon - Sat | 9am - 6pm
            </Text>
          </View>

          <AboutSection about={about} />
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.bookNowButton}
          >
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ViewProfile;
