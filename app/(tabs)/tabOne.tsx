import * as React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import Header from "../../src/features/home/components/Header";
import BookedJobsCard from "../Jobs/components/BookedJobsCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const JobsScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("Pending");
  const [refreshing, setRefreshing] = React.useState(false);

  const tabs = ["Pending", "Accepted", "Done", "Decline"];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const data = [{ id: "1", status: activeTab.toLowerCase() }];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header />
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookedJobsCard status={item.status as any} />
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8B5CF6"]}
            tintColor="#8B5CF6"
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/TabOne/AddJobPost")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginTop: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  tabItemActive: {
    backgroundColor: "#8C52FF",
    borderColor: "#8C52FF",
    shadowColor: "#8C52FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
    width: screenWidth,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#8C52FF",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8C52FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default JobsScreen;
