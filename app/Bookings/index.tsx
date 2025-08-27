import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import BookingCard from './components/BookingCard';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['Scheduled', 'Completed', 'Cancelled'] as const;
type TabType = typeof TABS[number];

type Booking = {
  id: number;
  status?: string;
  penalty?: string;
  title: string;
  date: string;
  address: string;
  customer?: string;
  image: string;
  cancelledBy?: string;
  button: { label: string; type: string };
};

const bookingsData: { [key: string]: Booking[] } = {
  Scheduled: [
    {
      id: 1,
      status: 'On Going',
      title: 'Electrical Wiring Installation',
      date: 'April 24, 2025 - 10:00AM',
      address: '1178 1st Carebi Cainta, Rizal',
      customer: 'Arabela Manuta',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      button: { label: 'Cancel Booking', type: 'cancel' },
    },
  ],
  Completed: [
    {
      id: 2,
      status: '',
      title: 'Electrical Wiring Installation',
      date: 'April 24, 2025 - 10:00AM',
      address: '1178 1st Carebi Cainta, Rizal',
      customer: 'Arabela Manuta',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      button: { label: 'View Details', type: 'details' },
    },
  ],
  Cancelled: [
    {
      id: 3,
      status: 'Penalty Fee',
      penalty: '₱500.00',
      title: 'Electrical Wiring Installation',
      date: 'April 24, 2025',
      address: '1178 1st Carebi Cainta, Rizal',
      customer: 'Arabela Manuta',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      cancelledBy: 'you',
      button: { label: 'View Details', type: 'details' },
    },
  ],
};

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<TabType>('Scheduled');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add any data fetching logic here
    // For example, refetch bookings data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          // Try to go back, but if not possible, go to home
          try {
            // @ts-ignore: canGoBack may not exist in expo-router, fallback to push
            if (router.canGoBack && router.canGoBack()) {
              router.back();
            } else {
              router.replace ? router.replace("/") : router.push("/");
            }
          } catch {
            router.replace ? router.replace("/") : router.push("/");
          }
        }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bookings</Text>
      </View>
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView 
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#A259FF"]}
            tintColor="#A259FF"
          />
        }
      >
        {bookingsData[activeTab].map((item: Booking) => (
          <BookingCard key={item.id} data={item} tab={activeTab} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#A259FF', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  backBtn: { marginRight: 12, padding: 4 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#F5F5F5', paddingVertical: 10 },
  tab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginHorizontal: 4 },
  activeTab: { backgroundColor: '#A259FF' },
  tabText: { color: '#A259FF', fontWeight: '500' },
  activeTabText: { color: '#fff' },
  list: { padding: 16 },
}); 