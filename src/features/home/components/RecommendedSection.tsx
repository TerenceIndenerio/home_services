import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { collection, query, where, getDocs, limit, startAfter } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import ServiceCard from "./ServiceCard";

const RecommendedSection: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecommended = useCallback(async (batchSize: number = 5, startAfterDoc?: any) => {
    try {
      const q = query(
        collection(db, "users"),
        where("isJobSeeker", "==", true),
        limit(batchSize),
        ...(startAfterDoc ? [startAfter(startAfterDoc)] : [])
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        if (!startAfterDoc) {
          setServices([]);
        }
        setHasMore(false);
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

      setServices(prev => startAfterDoc ? [...prev, ...fetchedServices] : fetchedServices);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      if (querySnapshot.docs.length < batchSize) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Firestore error:", err);
      setError("Failed to load recommended services.");
    }
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      await fetchRecommended(5);
      setLoading(false);
    };

    loadInitial();
  }, [fetchRecommended]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    // Add delay to cause lag
    setTimeout(async () => {
      await fetchRecommended(5, lastDoc);
      setLoadingMore(false);
    }, 2000); // 2 second delay
  }, [loadingMore, hasMore, lastDoc, fetchRecommended]);

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
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#8C52FF" />
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
            ) : null
          }
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
    width: 180, 
    height: 200, 
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginRight: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#8C52FF",
  },
});

export default RecommendedSection;
