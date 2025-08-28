import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import PromotionBanner from "../components/PromotionBanner";
import CategorySection from "../components/CategorySection";
import RecommendedSection from "../components/RecommendedSection";
import AuthGuard from "../../../../app/authentication/AuthGuard";

const screenWidth = Dimensions.get("window").width;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // trigger reload logic in your sections
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Fixed Header */}
        <View
          style={styles.headerWrapper}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setHeaderHeight(height);
          }}
        >
          <Header />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#8B5CF6"]}
              tintColor="#8B5CF6"
            />
          }
        >
          {/* Spacer equal to header height */}
          <View style={{ height: headerHeight }} />

          <View style={styles.contentWrapper}>
            <PromotionBanner />
            <CategorySection />
            <RecommendedSection />
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 10,
    flexGrow: 1,
    width: screenWidth,
  },
  contentWrapper: {
    width: "100%",
  },
});

export default HomeScreen;
