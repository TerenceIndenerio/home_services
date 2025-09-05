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
  ActivityIndicator,
} from "react-native";
import Header from "../../src/features/home/components/Header";
import BookedJobsCard from "../Jobs/components/BookedJobsCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/features/auth/context/authContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const screenWidth = Dimensions.get("window").width;

const JobsScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("Pending");
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const tabs = ["Pending", "Accepted", "Done", "Decline"];

  const fetchJobs = React.useCallback(() => {
    if (!user?.uid) {
      console.log("No user logged in, skipping fetch");
      setLoading(false);
      return;
    }

    setLoading(true);
    const statusFilter = activeTab ? activeTab.toLowerCase() : "pending";

    const jobsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      where("status", "==", statusFilter)
    );

    const unsubscribe = onSnapshot(
      jobsQuery,
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [activeTab, user?.uid]);

  React.useEffect(() => {
    const unsubscribe = fetchJobs();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchJobs]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchJobs();
  }, [fetchJobs]);

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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookedJobsCard job={item} />}
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
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#666", fontSize: 16 }}>
                No {activeTab} jobs found.
              </Text>
            </View>
          }
        />
      )}

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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
