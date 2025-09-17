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
   Animated,
   Modal,
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
   const { state } = useAuth();
   const [activeTab, setActiveTab] = React.useState("Pending");
   const [jobs, setJobs] = React.useState<any[]>([]);
   const [loading, setLoading] = React.useState(true);
   const [refreshing, setRefreshing] = React.useState(false);
   const [dropdownVisible, setDropdownVisible] = React.useState(false);

    // Animation values
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const fabScaleAnim = React.useRef(new Animated.Value(1)).current;
    const dropdownAnim = React.useRef(new Animated.Value(0)).current;

  const tabs = [
   { label: "Pending", icon: "time-outline" },
   { label: "Accepted", icon: "checkmark-circle-outline" },
   { label: "Ongoing", icon: "checkmark-circle-outline" },
   { label: "Done", icon: "checkmark-done-outline" },
   { label: "Decline", icon: "close-circle-outline" }
 ];

   const activeTabData = tabs.find(tab => tab.label === activeTab);

  const fetchJobs = React.useCallback(() => {
    if (!state.user?.uid) {
      console.log("No user logged in, skipping fetch");
      setLoading(false);
      return;
    }

    setLoading(true);
    const statusFilter = activeTab ? activeTab.toLowerCase() : "pending";

    const jobsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", state.user.uid),
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
  }, [activeTab, state.user?.uid]);

  React.useEffect(() => {
    const unsubscribe = fetchJobs();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchJobs]);

  // Fade in animation on mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // FAB press animation
  const handleFabPress = () => {
    Animated.sequence([
      Animated.timing(fabScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("/TabOne/AddJobPost");
    });
  };

  // Handle tab selection from dropdown
  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setDropdownVisible(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    const toValue = dropdownVisible ? 0 : 1;
    Animated.timing(dropdownAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setDropdownVisible(!dropdownVisible);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchJobs();
  }, [fetchJobs]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header />
      </View>

      <Animated.View style={[styles.contentWrapper, { opacity: fadeAnim }]}>
        {/* Dropdown Selector */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}
            activeOpacity={0.8}
          >
            <View style={styles.dropdownButtonContent}>
              {activeTabData && <Ionicons name={activeTabData.icon as any} size={20} color="#8C52FF" style={styles.dropdownButtonIcon} />}
              <Text style={styles.dropdownButtonText}>{activeTab}</Text>
            </View>
            <Animated.View style={[
              styles.dropdownArrow,
              {
                transform: [{
                  rotate: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }
            ]}>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Dropdown Modal */}
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <Animated.View
              style={[
                styles.dropdownMenu,
                {
                  opacity: dropdownAnim,
                  transform: [{
                    translateY: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0]
                    })
                  }]
                }
              ]}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.label}
                  style={[
                    styles.dropdownItem,
                    activeTab === tab.label && styles.dropdownItemActive
                  ]}
                  onPress={() => handleTabPress(tab.label)}
                >
                  <View style={styles.dropdownItemContent}>
                    <Ionicons name={tab.icon as any} size={20} color={activeTab === tab.label ? "#8C52FF" : "#666"} />
                    <Text
                      style={[
                        styles.dropdownItemText,
                        activeTab === tab.label && styles.dropdownItemTextActive
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </View>
                  {activeTab === tab.label && (
                    <Ionicons name="checkmark" size={20} color="#8C52FF" />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {loading ? (
          <View style={styles.loaderContainer}>
            <View style={styles.loaderCard}>
              <ActivityIndicator size="large" color="#8C52FF" />
              <Text style={styles.loaderText}>Loading your jobs...</Text>
            </View>
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
                colors={["#8C52FF"]}
                tintColor="#8C52FF"
                progressBackgroundColor="#f8f9ff"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="document-outline" size={64} color="#ccc" />
                </View>
                <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} jobs</Text>
                <Text style={styles.emptySubtitle}>
                  {activeTab === "Pending" && "Your pending job requests will appear here"}
                  {activeTab === "Accepted" && "Accepted jobs will be shown here"}
                  {activeTab === "Ongoing" && "Currently active jobs will appear here"}
                  {activeTab === "Done" && "Completed jobs will be listed here"}
                  {activeTab === "Decline" && "Declined jobs will appear here"}
                </Text>
              </View>
            }
          />
        )}
      </Animated.View>

      <Animated.View style={[styles.fab, { transform: [{ scale: fabScaleAnim }] }]}>
        <TouchableOpacity
          style={styles.fabTouchable}
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <View style={styles.fabInner}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: "#f8f9ff",
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
   contentWrapper: {
     flex: 1,
     marginTop: 150,
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
     backgroundColor: "#f8f9ff",
   },
   loaderCard: {
     backgroundColor: "#fff",
     padding: 32,
     borderRadius: 16,
     alignItems: "center",
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.1,
     shadowRadius: 8,
     elevation: 4,
   },
   loaderText: {
     marginTop: 16,
     fontSize: 16,
     color: "#666",
     fontWeight: "500",
   },
   emptyContainer: {
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
     paddingHorizontal: 40,
     paddingVertical: 60,
   },
   emptyIconContainer: {
     width: 120,
     height: 120,
     borderRadius: 60,
     backgroundColor: "#f8f9fa",
     justifyContent: "center",
     alignItems: "center",
     marginBottom: 24,
   },
   emptyTitle: {
     fontSize: 20,
     fontWeight: "700",
     color: "#333",
     marginBottom: 8,
     textAlign: "center",
   },
   emptySubtitle: {
     fontSize: 16,
     color: "#666",
     textAlign: "center",
     lineHeight: 24,
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
   fabTouchable: {
     width: 56,
     height: 56,
     alignItems: "center",
     justifyContent: "center",
   },
   fabInner: {
     width: 24,
     height: 24,
     alignItems: "center",
     justifyContent: "center",
   },
   dropdownContainer: {
     paddingHorizontal: 20,
     paddingVertical: 16,
     backgroundColor: "#fff",
     borderBottomWidth: 1,
     borderBottomColor: "#e0e0e0",
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
   dropdownButton: {
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "space-between",
     paddingVertical: 12,
     paddingHorizontal: 16,
     backgroundColor: "#f8f9fa",
     borderRadius: 12,
     borderWidth: 1,
     borderColor: "#e9ecef",
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.05,
     shadowRadius: 2,
     elevation: 2,
   },
   dropdownButtonContent: {
     flexDirection: "row",
     alignItems: "center",
   },
   dropdownButtonIcon: {
     marginRight: 8,
   },
   dropdownButtonText: {
     fontSize: 16,
     fontWeight: "600",
     color: "#333",
   },
   dropdownArrow: {
     marginLeft: 8,
   },
   modalOverlay: {
     flex: 1,
     backgroundColor: "rgba(0, 0, 0, 0.5)",
     justifyContent: "flex-start",
     paddingTop: 220, // Position below header
   },
   dropdownMenu: {
     marginHorizontal: 20,
     backgroundColor: "#fff",
     borderRadius: 12,
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.25,
     shadowRadius: 8,
     elevation: 8,
     overflow: "hidden",
   },
   dropdownItem: {
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "space-between",
     paddingVertical: 16,
     paddingHorizontal: 20,
     borderBottomWidth: 1,
     borderBottomColor: "#f0f0f0",
   },
   dropdownItemContent: {
     flexDirection: "row",
     alignItems: "center",
   },
   dropdownItemActive: {
     backgroundColor: "#f8f9ff",
   },
   dropdownItemText: {
     fontSize: 16,
     color: "#555",
     fontWeight: "500",
   },
   dropdownItemTextActive: {
     color: "#8C52FF",
     fontWeight: "600",
   },
});

export default JobsScreen;
