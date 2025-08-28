import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ServiceCard from "./ServiceCard";

const RecommendedSection: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(db, "users"),
          where("isJobSeeker", "==", true)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setServices([]);
          return;
        }

        const fetchedServices = querySnapshot.docs.map((docSnap) => {
          const userData = docSnap.data();

          return {
            id: docSnap.id,
            imageUrl:
              userData.profile?.profilePictureUrl ||
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=183&q=80",
            title: userData.profile?.jobTitle || "Service Provider",
            provider:
              `By ${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
            rating: userData.profile?.rating?.toString() || "N/A",
            about: encodeURIComponent(userData.profile?.bio || ""),
          };
        });

        setServices(fetchedServices);
      } catch (err: any) {
        console.error("Firestore error:", err);
        setError("Failed to load recommended services.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Recommended For You</Text>

      {loading && <ActivityIndicator size="large" color="#8C52FF" />}

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {!loading && !error && services.length === 0 && (
        <Text>No services available</Text>
      )}

      {!loading && !error && services.length > 0 && (
        <FlatList
          data={services}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ServiceCard
                imageUrl={item.imageUrl}
                title={item.title}
                provider={item.provider}
                rating={item.rating}
                onPress={() =>
                  router.push({
                    pathname: "/ViewProfile/[id]",
                    params: { id: item.id },
                  })
                }
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  cardWrapper: {
    marginRight: 12,
    width: 180, // fixed width
    height: 200, // fixed height
  },
});

export default RecommendedSection;
