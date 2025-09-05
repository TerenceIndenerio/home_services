import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import JobSearchBar from '@/app/Jobs/components/JobSearchBar';
import JobTabBar from '@/app/Jobs/components/JobTabBar';
import JobsList from '@/app/Jobs/components/JobList';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState('Jobs For You');
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedBookings: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedBookings.push({
          id: doc.id,
          title: data.jobTitle ?? 'Untitled Job',
          description: data.description ?? 'No description',
          address: data.address ?? 'No address',
          amount: data.amount ?? 0,
          location: data.address ?? 'No address',
          time: data.scheduleDate?.seconds
            ? new Date(data.scheduleDate.seconds * 1000).toLocaleDateString()
            : 'No date',
          status: data.status ?? 'pending',
        });
      });

      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings().finally(() => setRefreshing(false));
  }, []);

  const handleJobPress = (job: any) => {
    router.push({ pathname: '/Jobs/JobDetails', params: { job: JSON.stringify(job) } });
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'Jobs For You') {
      return booking.status === 'pending';
    } else if (activeTab === 'Accepted Jobs') {
      return booking.status === 'accepted';
    }
    return false;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jobs</Text>
      <JobSearchBar />
      <JobTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <JobsList
        jobs={filteredBookings}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onJobPress={handleJobPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#9B5DE5', marginTop: 24, marginBottom: 12 },
});
