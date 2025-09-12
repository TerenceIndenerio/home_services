import React, { useState } from "react";
import { ScrollView, TouchableOpacity, Image, Linking, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { YStack, Text } from "tamagui";

import { styles } from "../../src/styles/viewProfileStyles";
import AboutSection from "../../src/features/viewProfile/components/AboutSection";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
];

const REVIEWS = [
  {
    name: "Yumi Koizumi",
    date: "12/12/2025",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.5,
    text: "Matt exceeded my expectations! Quick, reliable, and fixed my electrical issue with precision. Highly recommend.",
  },
  {
    name: "Caleb",
    date: "12/12/2024",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    text: "Great service! Matt explained everything clearly and did a clean job",
  },
  {
    name: "Ethan",
    date: "12/12/2022",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    text: "Matt was on time, professional, and fixed the issue quickly. Highly recommend!",
  },
  {
    name: "Jasmine",
    date: "12/12/2023",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 4.5,
    text: "Matt was great! He arrived on time and did a fantastic job fixing my electrical issue. Highly recommend!",
  },
];

const ViewProfile = () => {
  const { provider, title, imageUrl, about, rating } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6B11F4"]}
            tintColor="#6B11F4"
          />
        }
      >
        {}
        <YStack style={{ position: "relative", alignItems: "center" }}>
          <Image
            source={{ uri: String(imageUrl) }}
            style={{
              width: "100%",
              height: 360,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 33,
              left: 18,
              backgroundColor: "#F3F0FF",
              borderRadius: 16,
              padding: 8,
            }}
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
            <Ionicons name="arrow-back" size={24} color="#6B11F4" />
          </TouchableOpacity>
        </YStack>

        {}
        <YStack style={{ flexDirection: "row", alignItems: "center", marginTop: 18, marginHorizontal: 20 }}>
          <YStack style={{ flex: 1 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: "#222" }}>{provider}</Text>
            <Text style={{ fontSize: 18, color: "#888", marginTop: 2 }}>{title}</Text>
          </YStack>
          <TouchableOpacity style={{ marginHorizontal: 8 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#6B11F4" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={28} color="#6B11F4" />
          </TouchableOpacity>
        </YStack>

        {}
        <YStack style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 22, marginHorizontal: 20 }}>
          <YStack style={styles.infoCard}>
            <FontAwesome name="star" size={22} color="#FF6B35" />
            <Text style={styles.infoCardValue}>{rating || "4.8"}</Text>
            <Text style={styles.infoCardLabel}>Rating</Text>
          </YStack>
          <YStack style={styles.infoCard}>
            <MaterialIcons name="check-circle" size={22} color="#6B11F4" />
            <Text style={styles.infoCardValue}>56</Text>
            <Text style={styles.infoCardLabel}>Bookings</Text>
          </YStack>
          <YStack style={styles.infoCard}>
            <MaterialIcons name="timeline" size={22} color="#A259FF" />
            <Text style={styles.infoCardValue}>4</Text>
            <Text style={styles.infoCardLabel}>Years</Text>
          </YStack>
        </YStack>

        {}
        <YStack style={{ marginTop: 28, marginHorizontal: 20 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>Available</Text>
          <YStack style={{ flexDirection: "row", alignItems: "center" }}>
            <YStack style={styles.timeBox}>
              <Text style={styles.timeBoxText}>7:00AM</Text>
            </YStack>
            <Text style={{ marginHorizontal: 8, fontWeight: "600" }}>To</Text>
            <YStack style={styles.timeBox}>
              <Text style={styles.timeBoxText}>10:00PM</Text>
            </YStack>
          </YStack>
        </YStack>

        {}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.bookButtonText}>BOOK</Text>
        </TouchableOpacity>

        <AboutSection about={about} />

        {}
        <YStack style={{ marginTop: 28, marginHorizontal: 0 }}></YStack>
        <YStack style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Gallery</Text>
          <TouchableOpacity>
            <Text style={{ color: "#A259FF", fontWeight: "700", fontSize: 15 }}>View all</Text>
          </TouchableOpacity>
        </YStack>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, paddingVertical: 16 }}>
          {GALLERY_IMAGES.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                marginLeft: idx === 0 ? 20 : 12,
                marginRight: idx === GALLERY_IMAGES.length - 1 ? 20 : 0,
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {}
        <YStack style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}>
          <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 16 }}>Review</Text>
          {
            REVIEWS.map((review, idx) => (
              <YStack key={idx} style={{ flexDirection: "row", marginBottom: 22 }}>
                <Image
                  source={{ uri: review.avatar }}
                  style={{ width: 38, height: 38, borderRadius: 19, marginRight: 12 }}
                />
                <YStack style={{ flex: 1 }}>
                  <YStack style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "700", fontSize: 15 }}>{review.name}</Text>
                    <Text style={{ fontSize: 13 }}>{review.date}</Text>
                  </YStack>
                  <YStack style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesome
                        key={i}
                        name={i < Math.floor(review.rating) ? "star" : (i < review.rating ? "star-half-full" : "star-o")}
                        size={15}
                        color="#FFB800"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </YStack>
                  <Text style={{ fontSize: 14 }}>{review.text}</Text>
                </YStack>
              </YStack>
            ))
          }
        </YStack>
      </ScrollView>
    </SafeAreaView >
  );
};

export default ViewProfile;
