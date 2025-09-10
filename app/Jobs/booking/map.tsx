import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview"; 

const { width, height } = Dimensions.get("window");

const BookingMap = () => {
  const { id, latitude, longitude, address, jobTitle, description } = useLocalSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (latitude && longitude) {
          const bookingData = {
            latitude: parseFloat(latitude as string),
            longitude: parseFloat(longitude as string),
            address: address as string || "Location",
            jobTitle: jobTitle as string || "Job Location",
            description: description as string || "",
          };
          setBooking(bookingData);

          const html = generateMapHtml(bookingData);
          setIframeHtml(html);
        } else if (id) {
          const docRef = doc(db, "bookings", id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const bookingData = docSnap.data();
            setBooking(bookingData);

            if (bookingData.latitude && bookingData.longitude) {
              const html = generateMapHtml(bookingData);
              setIframeHtml(html);
            }
          } else {
            console.warn("❌ Booking not found.");
          }
        } else {
          console.warn("❌ No coordinates or booking ID provided.");
        }
      } catch (err) {
        console.error("❌ Error fetching booking data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, latitude, longitude, address, jobTitle, description]);

  const generateMapHtml = (data: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <title>Job Location Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>body, html, #map { height: 100%; margin: 0; padding: 0; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${data.latitude}, ${data.longitude}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

          var jobIcon = L.icon({ 
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', 
            iconSize: [32, 32], 
            iconAnchor: [16, 32] 
          });

          L.marker([${data.latitude}, ${data.longitude}], { icon: jobIcon })
            .addTo(map)
            .bindPopup("${data.jobTitle || "Job Location"}<br>${data.address || "Job address"}")
            .openPopup();
        </script>
      </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  if (!booking.latitude || !booking.longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Location data not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            try {
              if (router.canGoBack && router.canGoBack()) {
                router.back();
              } else {
                router.replace ? router.replace("/") : router.push("/");
              }
            } catch {
              router.replace ? router.replace("/") : router.push("/");
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Location</Text>
        <View style={{ width: 24 }} />
      </View>

      {}
      {iframeHtml && (
        Platform.OS === "web" ? (
          <iframe title="Job Location Map" srcDoc={iframeHtml} style={styles.iframe} />
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{ html: iframeHtml }}
            style={styles.map}
          />
        )
      )}

      {}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="location" size={20} color="#007AFF" />
          <Text style={styles.infoTitle}>Job Location</Text>
        </View>
        <Text style={styles.jobTitle}>{booking.jobTitle || "Untitled Job"}</Text>
        <Text style={styles.address}>{booking.address || "Address not available"}</Text>
        {booking.description && <Text style={styles.description}>{booking.description}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#6b7280" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" },
  errorText: { fontSize: 16, color: "#ef4444", textAlign: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
  map: { flex: 1, width: width, height: height * 0.6 },
  iframe: { width: width, height: height * 0.6, border: "none" } as any,
  infoCard: { backgroundColor: "#fff", margin: 20, padding: 16, borderRadius: 12, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  infoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginLeft: 8 },
  jobTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 4 },
  address: { fontSize: 14, color: "#6b7280", marginBottom: 8 },
  description: { fontSize: 14, color: "#374151", lineHeight: 20 },
});

export default BookingMap;
