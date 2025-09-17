import React, { useState, useEffect, useCallback } from 'react';
import { YStack, Text } from 'tamagui';
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
  const [jobs, setJobs] = useState<any[]>([]);
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

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, "jobs"), where("status", "==", "open"));
      const querySnapshot = await getDocs(q);
      const fetchedJobs: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedJobs.push({
          id: doc.id,
          title: data.jobTitle ?? 'Untitled Job',
          description: data.description ?? 'No description',
          address: data.location ?? 'No location',
          amount: data.pay ?? 0,
          location: data.location ?? 'No location',
          time: data.createdAt?.seconds
            ? getTimeAgo(data.createdAt.seconds * 1000)
            : 'No date',
          status: data.status ?? 'open',
          jobType: data.jobType ?? 'Full Time',
          skills: data.skills ?? [],
        });
      });

      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchJobs();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (activeTab === 'Find Jobs') {
      fetchJobs().finally(() => setRefreshing(false));
    } else {
      fetchBookings().finally(() => setRefreshing(false));
    }
  }, [activeTab]);

  const handleJobPress = (job: any) => {
    router.push({ pathname: '/Jobs/JobDetails', params: { job: JSON.stringify(job) } });
  };

  const getDisplayedItems = () => {
    if (activeTab === 'Find Jobs') {
      return jobs;
    }
    return bookings.filter(booking => {
      if (activeTab === 'Jobs For You') {
        return booking.status === 'pending';
      } else if (activeTab === 'Accepted Jobs') {
        return booking.status === 'accepted';
      } else if (activeTab === 'On Going Job') {
        return booking.status === 'ongoing';
      }
      return false;
    });
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingHorizontal="$3">
      <Text fontSize="$8" fontWeight="bold" color="$purple9" marginTop="$6" marginBottom="$3">Jobs</Text>
      <JobSearchBar />
      <JobTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <JobsList
        jobs={getDisplayedItems()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onJobPress={handleJobPress}
      />
    </YStack>
  );
}
