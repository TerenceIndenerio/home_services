import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { ViewToken } from "react-native";

const { width } = Dimensions.get("window");

const PromotionBanner: React.FC = () => {
  const [bannerUrls, setBannerUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerDocRef = doc(db, "appAssets", "banners");
        const bannerDoc = await getDoc(bannerDocRef);
        if (bannerDoc.exists()) {
          const data = bannerDoc.data();
          if (Array.isArray(data.promoBanner)) {
            setBannerUrls(data.promoBanner);
          }
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const firstViewable = info.viewableItems[0];
      if (firstViewable?.index != null) {
        setActiveIndex(firstViewable.index);
      }
    },
    []
  );

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  return (
    <View style={styles.bannerWrapper}>
      <View style={styles.bannerContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#8C52FF" />
        ) : (
          <FlatList
            data={bannerUrls}
            ref={flatListRef}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.bannerImageContainer}>
                <Image source={{ uri: item }} style={styles.bannerImage} />
                <View style={styles.textOverlay}>
                  <Text style={styles.discountHeading}>Get Discount</Text>
                  <Text style={styles.discountSubheading}>UP to 50%</Text>
                  <Text style={styles.discountDescription}>
                    For every repair service
                  </Text>
                </View>
              </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}

        {!loading && (
          <View style={styles.indicatorContainer}>
            {bannerUrls.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === activeIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    marginTop: 16,
    paddingHorizontal: 10,
  },
  bannerContainer: {
    width: "100%",
  },
  bannerImageContainer: {
    position: "relative",
    width: width - 20, // full width minus padding
    aspectRatio: 1.8, // keeps consistent height across devices
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#f4f4f4",
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  textOverlay: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  discountHeading: {
    color: "rgba(255, 107, 53, 1)",
    fontSize: 20,
    fontWeight: "700",
  },
  discountSubheading: {
    color: "rgba(255, 107, 53, 1)",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  discountDescription: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 3,
  },
  activeIndicator: {
    width: 25,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#6B11F4",
  },
});

export default PromotionBanner;
