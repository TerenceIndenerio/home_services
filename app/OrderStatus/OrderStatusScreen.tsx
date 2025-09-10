import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import MapSection from "./components/MapSection";
import StatusInfo from "./components/StatusInfo";
import ContactClientCard from "./components/ContactClientCard";
import OnTheWayButton from "./components/OnTheWayButton";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const OrderStatusScreen = () => {
  const { bookingData } = useLocalSearchParams();
  const [bookingDataState, setBookingDataState] = useState<any>(null);
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    if (bookingData) {
      try {
        const parsed = JSON.parse(String(bookingData));
        console.log("OrderStatusScreen - Raw bookingData:", bookingData);
        console.log("OrderStatusScreen - Parsed bookingData:", parsed);
        console.log("OrderStatusScreen - Location data:", parsed.location);
        console.log("OrderStatusScreen - userId from bookingData:", parsed.userId);
        setBookingDataState(parsed);
        
        setProviderId(parsed.userId);
      } catch (error) {
        console.error("OrderStatusScreen - Error parsing bookingData:", error);
      }
    }
  }, [bookingData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapSection 
          onBookingDataReady={setBookingDataState} 
          bookingData={bookingDataState}
          providerId={providerId}
        />
      </View>
      <View style={styles.statusContainer}>
        <StatusInfo />
        <ContactClientCard />
        {bookingDataState && <OnTheWayButton bookingData={bookingDataState} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapContainer: { flex: 1 },
  statusContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default OrderStatusScreen;
