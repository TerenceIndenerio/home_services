import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

interface AddressItem {
  label: string;
  latitude: number;
  longitude: number;
}

interface Coords {
  latitude: number;
  longitude: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const router = useRouter();
  const [location, setLocation] = useState<Coords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customAddresses, setCustomAddresses] = useState<AddressItem[]>([]);
  const [newLabel, setNewLabel] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [pickedCoords, setPickedCoords] = useState<Coords | null>(null);
  const [webMapHtml, setWebMapHtml] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      fetchLocation();
      loadSavedAddresses();
    }
  }, [visible]);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      console.log("BookingModal - Fetched location:", coords);
      setLocation(coords);
      setSelectedIndex(0); 
    } catch (error) {
      console.error("BookingModal - Error fetching location:", error);
      setErrorMsg(
        "Error fetching location: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const loadSavedAddresses = async () => {
    try {
      const stored = await AsyncStorage.getItem("saved_addresses");
      if (stored) {
        setCustomAddresses(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const saveAddresses = async (addresses: AddressItem[]) => {
    try {
      await AsyncStorage.setItem("saved_addresses", JSON.stringify(addresses));
    } catch (error) {
      console.error("Error saving addresses:", error);
    }
  };

  const handleAddAddress = async () => {
    if (!newLabel.trim()) {
      Alert.alert("Label is required", "Please enter a name for the address.");
      return;
    }
    if (!pickedCoords) {
      Alert.alert("Please pick a location on the map.");
      return;
    }
    const newAddress: AddressItem = {
      label: newLabel.trim(),
      latitude: pickedCoords.latitude,
      longitude: pickedCoords.longitude,
    };
    const updated = [...customAddresses, newAddress];
    setCustomAddresses(updated);
    saveAddresses(updated);
    setNewLabel("");
    setShowInput(false);
    setShowMap(false);
    setPickedCoords(null);
  };

  const handleDeleteAddress = (index: number) => {
    const updated = [...customAddresses];
    updated.splice(index, 1);
    setCustomAddresses(updated);
    saveAddresses(updated);
    if (selectedIndex === index + 1) {
      setSelectedIndex(null);
    } else if (selectedIndex !== null && selectedIndex > index + 1) {
      setSelectedIndex((prev) => (prev !== null ? prev - 1 : null));
    }
  };

  const handleNext = () => {
    if (selectedIndex === null) {
      Alert.alert("Please select an address to continue.");
      return;
    }

    let bookingData;

    if (selectedIndex === 0) {
      if (!location) {
        Alert.alert("Location not available", "Please allow location access.");
        return;
      }

      
      if (
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number"
      ) {
        Alert.alert("Invalid location data", "Please try again.");
        return;
      }

      bookingData = {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        address: "Current Location",
        userId: userId,
      };
      console.log("BookingModal - Current location selected:", bookingData);
    } else {
      const selectedAddress = customAddresses[selectedIndex - 1];
      bookingData = {
        location: {
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude,
        },
        address: selectedAddress.label,
        userId: userId,
      };
      console.log("BookingModal - Custom address selected:", bookingData);
    }

    console.log("BookingModal - Final bookingData being sent:", bookingData);
    onClose();
    router.push({
      pathname: "/OrderStatus/OrderStatusScreen",
      params: { bookingData: JSON.stringify(bookingData) },
    });
  };

  const generateWebMapHtml = () => {
    const initialLat = location?.latitude || 14.5995;
    const initialLng = location?.longitude || 120.9842;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <title>Pick Location</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html, #map { height: 100%; margin: 0; padding: 0; }
          .info-box { position: absolute; top: 10px; left: 10px; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000; font-family: Arial, sans-serif; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="info-box">
          <strong>Tap on the map to pick a location</strong><br>
          <span id="coordinates">No location selected</span>
        </div>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${initialLat}, ${initialLng}], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
          var marker = null;
          var coordinatesSpan = document.getElementById('coordinates');
          map.on('click', function(e) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;
            if (marker) { map.removeLayer(marker); }
            marker = L.marker([lat, lng]).addTo(map);
            coordinatesSpan.textContent = 'Lat: ' + lat.toFixed(4) + ', Lng: ' + lng.toFixed(4);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapClick', latitude: lat, longitude: lng }));
          });
        </script>
      </body>
      </html>
    `;
  };

  const openWebMapPicker = () => {
    setWebMapHtml(generateWebMapHtml());
    setShowMap(true);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.addressHeader}>Tell us where to go!</Text>
          <View style={styles.addressContainer}>
            {}
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setSelectedIndex(0)}
              activeOpacity={0.8}
            >
              <View style={styles.radioCircle}>
                {selectedIndex === 0 && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.radioLabel}>📍 Use my current location</Text>
                {location && (
                  <Text style={styles.radioAddress}>
                    Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
                  </Text>
                )}
                {errorMsg && <Text style={styles.radioAddress}>{errorMsg}</Text>}
              </View>
            </TouchableOpacity>

            {}
            {customAddresses.map((address, index) => (
              <TouchableOpacity
                key={index}
                style={styles.radioItem}
                onPress={() => setSelectedIndex(index + 1)}
                activeOpacity={0.8}
              >
                <View style={styles.radioCircle}>
                  {selectedIndex === index + 1 && <View style={styles.radioDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.radioLabel}>{address.label}</Text>
                  <Text style={styles.radioAddress}>
                    Latitude: {address.latitude.toFixed(4)}, Longitude: {address.longitude.toFixed(4)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteAddress(index)}>
                  <Text style={{ color: "red", fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {}
            {showInput ? (
              <View style={{ marginTop: 10 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter address label (e.g. Home)"
                  value={newLabel}
                  onChangeText={setNewLabel}
                />
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <Button title="Pick on Map" onPress={openWebMapPicker} />
                  <View style={{ width: 10 }} />
                  <Button title="Save" onPress={handleAddAddress} />
                  <View style={{ width: 10 }} />
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setShowInput(false);
                      setPickedCoords(null);
                    }}
                  />
                </View>
                {pickedCoords && (
                  <Text style={{ marginTop: 8, fontSize: 14, color: "#00796b" }}>
                    Picked: Lat {pickedCoords.latitude.toFixed(4)}, Lng {pickedCoords.longitude.toFixed(4)}
                  </Text>
                )}
              </View>
            ) : (
              <TouchableOpacity onPress={() => setShowInput(true)}>
                <Text style={styles.addAddress}>➕ Add a new address</Text>
              </TouchableOpacity>
            )}

            {}
            <Modal
              visible={showMap}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setShowMap(false)}
            >
              <View style={{ flex: 1 }}>
                {webMapHtml && (
                  <WebView
                    originWhitelist={["*"]}
                    source={{ html: webMapHtml }}
                    style={{ flex: 1 }}
                    onMessage={(event) => {
                      try {
                        const data = JSON.parse(event.nativeEvent.data);
                        if (data.type === "mapClick") {
                          setPickedCoords({
                            latitude: data.latitude,
                            longitude: data.longitude,
                          });
                        }
                      } catch (err) {
                        console.warn("Invalid message", err);
                      }
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 16,
                    backgroundColor: "#fff",
                  }}
                >
                  <Button
                    title="Confirm Location"
                    onPress={() => setShowMap(false)}
                    disabled={!pickedCoords}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setShowMap(false);
                      setPickedCoords(null);
                    }}
                  />
                </View>
              </View>
            </Modal>

            <View style={{ marginTop: 20 }}>
              <Button title="Next" onPress={handleNext} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: "90%",
    maxWidth: 400,
  },
  addressHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addressContainer: {
    width: "100%",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00796b",
    marginRight: 12,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00796b",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  radioAddress: {
    fontSize: 14,
    color: "#555",
  },
  addAddress: {
    marginTop: 10,
    fontSize: 16,
    color: "#007aff",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
  },
});

export default BookingModal;
