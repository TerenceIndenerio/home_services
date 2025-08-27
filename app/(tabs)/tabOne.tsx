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
import Header from "../home/components/Header";
import BookedJobsCard from "../Jobs/components/BookedJobsCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("Pending");
  const [refreshing, setRefreshing] = React.useState(false);

  const tabs = ["Pending", "Accepted", "Done", "Decline"];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add data fetching logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Just to render one card per tab for now
  const data = [{ id: "1", status: activeTab.toLowerCase() }];

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerWrapper}>
        <Header />
      </View>

      {/* Tab Bar */}
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

      {/* FlatList instead of ScrollView */}
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

      {/* Floating Add Button */}
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
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 150,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: "#8F5CFF",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
    width: screenWidth,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#8F5CFF",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    zIndex: 20,
  },
});

export default HomeScreen;
