import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Platform, Dimensions, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../authentication/context/authContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type MapSectionProps = {
  onBookingDataReady: (data: any) => void;
  bookingData?: any;
  providerId?: string | null;
};

const MapSection = ({ onBookingDataReady, bookingData, providerId }: MapSectionProps) => {
  const { userDocumentId } = useAuth();
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log("MapSection - useEffect triggered with:", { providerId, bookingData, hasInitialized: hasInitialized.current });
    if (!providerId) return;
    
    // Reset initialization if bookingData changes
    if (bookingData && hasInitialized.current) {
      hasInitialized.current = false;
    }
    
    if (hasInitialized.current) return;

    const fetchCoords = async () => {
      try {
        const userId = providerId || userDocumentId;

        if (!userId) return;

        let latitude, longitude;
        console.log("MapSection - bookingData received:", bookingData);
        console.log("MapSection - bookingData.location:", bookingData?.location);
        
        if (bookingData?.location?.latitude && bookingData?.location?.longitude) {
          const lat = bookingData.location.latitude;
          const lng = bookingData.location.longitude;
          
          // Validate that latitude and longitude are valid numbers
          if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            latitude = lat;
            longitude = lng;
            console.log("MapSection - Using bookingData location:", { latitude, longitude });
          } else {
            console.log("MapSection - Invalid coordinates in bookingData:", { lat, lng });
            throw new Error("Invalid coordinates in bookingData");
          }
        } else {
          console.log("MapSection - No valid bookingData.location, trying AsyncStorage");
          const stored = await AsyncStorage.getItem("selected_coords");
          if (!stored) {
            console.log("MapSection - No stored coords found");
            return;
          }
          const coords = JSON.parse(stored);
          const lat = coords.latitude;
          const lng = coords.longitude;
          
          // Validate stored coordinates
          if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            latitude = lat;
            longitude = lng;
            console.log("MapSection - Using stored coords:", { latitude, longitude });
          } else {
            console.log("MapSection - Invalid stored coordinates:", { lat, lng });
            throw new Error("Invalid stored coordinates");
          }
        }

        // Final validation
        if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
          console.error("MapSection - Final validation failed:", { latitude, longitude });
          throw new Error("Invalid coordinates for map");
        }

        console.log("MapSection - Creating map with coordinates:", { latitude, longitude });

        // Map HTML
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <style>body, html, #map { height: 100%; margin: 0; padding: 0; }</style>
          </head>
          <body>
            <div id="map"></div>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <script>
              var map = L.map('map').setView([${latitude}, ${longitude}], 15);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
              var endIcon = L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize: [32, 32], iconAnchor: [16, 32] });
              L.marker([${latitude}, ${longitude}], { icon: endIcon }).addTo(map).bindPopup("Job Site").openPopup();
            </script>
          </body>
          </html>
        `;
        setIframeHtml(html);

        hasInitialized.current = true;
      } catch (error) {
        console.error("MapSection error:", error);
      }
    };

    fetchCoords();
  }, [providerId, bookingData, userDocumentId]);

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        !providerId ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : (
          <>
            {/* Floating Return Button */}
            <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
              <Ionicons name="exit" size={22} color="#fff" />
            </TouchableOpacity>

            {iframeHtml && (
              <iframe title="Job Site Map" srcDoc={iframeHtml} style={styles.iframe} />
            )}
          </>
        )
      ) : (
        <Text style={styles.message}>Map view is only supported on web for now.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  returnButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iframe: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 180,
    border: "none",
  } as any,
  message: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
  },
});

export default MapSection;
