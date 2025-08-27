import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthButton from '../authentication/components/AuthButton';
import ServiceDetailsDropdown from './components/ServiceDetailsDropdown';

const ServiceDetails: React.FC = () => {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dummy data for now
  const customer = {
    name: 'Arabela Justine Manuta',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: '1176 St, 1930 Antipolo, Philippines 1st St',
    service: 'Fix Plugs',
    category: 'Repair',
    description:
      'Lorem Ipsum ehahiudy alksjdhlakjshiduawkdjwchaiuwdhawuhdaihdaiuwdauwhsdasdasdasdasdasd',
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add any data fetching logic here
    // For example, refetch service details
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <Text style={styles.timer}>60s</Text>
      </View>

      {/* Map Section (placeholder) */}
      <View style={styles.mapSection}>
        <Ionicons name="location" size={40} color="#8C52FF" style={{ alignSelf: 'center', marginTop: 30 }} />
        <View style={styles.mapPin} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8C52FF"]}
            tintColor="#8C52FF"
          />
        }
      >
        {/* User Info */}
        <View style={styles.userRow}>
          <Image source={{ uri: customer.image }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.userName}>{customer.name}</Text>
            <Text style={styles.userLabel}>Customer Name</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Location Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{customer.location}</Text>
        </View>

        {/* Service Details Dropdown */}
        <ServiceDetailsDropdown
          open={detailsOpen}
          onToggle={() => setDetailsOpen(!detailsOpen)}
          service={customer.service}
          category={customer.category}
          description={customer.description}
        />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <AuthButton text="Accept" variant="secondary" onPress={() => {}} style={{ flex: 1, marginRight: 8 }} />
        <AuthButton text="Decline" variant="primary" onPress={() => {}} style={{ flex: 1, marginLeft: 8 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8C52FF',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timer: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapSection: {
    height: 140,
    backgroundColor: '#F3F1FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapPin: {
    position: 'absolute',
    top: 60,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8C52FF',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  userLabel: {
    fontSize: 12,
    color: '#888',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 14,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8C52FF',
    fontWeight: '600',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsContent: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 90,
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.04)",
  },
});

export default ServiceDetails; 