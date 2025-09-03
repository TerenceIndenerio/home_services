import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import BalanceCard from '@/src/features/seeker/components/BalanceCard';
import BookingRequestsList from '@/src/features/seeker/components/BookingRequestsList';
import BookingHistoryList from '@/src/features/seeker/components/BookingHistoryList';
import Header from '@/src/features/seeker/components/Header';

const mockBookingRequests = [
  {
    id: '1',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    job: 'Fix Wirings',
    customer: 'Arabela Manuta',
    latitude: 14.5995,
    longitude: 121.1754,
    address: '1st. Street Carebi Antipolo, Rizal',
  },
  {
    id: '2',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    job: 'Installing Light Fixtures',
    customer: 'Casey Sagera',
    latitude: 14.5995,
    longitude: 121.1754,
    address: 'Cornialao Street Cainta, Rizal',
  },
  {
    id: '3',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    job: 'Replace Switches',
    customer: 'Fiona Harke',
    latitude: 14.5995,
    longitude: 121.1754,
    address: 'Green Ridge Binangonan, Rizal',
  },
];

const mockBookingHistory = [
  {
    id: '1',
    job: 'Resetting Breakers',
    date: 'April 30, 2025 - 8:45AM',
    location: '1st. Street Carebi Antipolo, Rizal',
    status: 'Scheduled',
  },
  {
    id: '2',
    job: 'Move Outlet Location',
    date: 'April 28, 2025 - 2:00PM',
    location: 'Cornialao Street Cainta, Rizal',
    status: 'Cancelled',
  },
];

const SeekerDashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#8C52FF"]}
          tintColor="#8C52FF"
        />
      }
    >
      <Header status="Not Available" onToggleStatus={() => {}} onMenuPress={() => {}} />
      <BalanceCard balance={3200} style={styles.balanceCard} />
      <BookingRequestsList requests={mockBookingRequests} style={styles.bookingRequestsList} onStatusChange={onRefresh} />
      <BookingHistoryList history={mockBookingHistory} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    marginTop: 100,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingRequestsList: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }
});

export default SeekerDashboardScreen;
