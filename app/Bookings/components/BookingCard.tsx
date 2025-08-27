import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type TabType = 'Scheduled' | 'Completed' | 'Cancelled';
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

interface BookingCardProps {
  data: Booking;
  tab: TabType;
}

export default function BookingCard({ data, tab }: BookingCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: data.image }} style={styles.avatar} />
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title} numberOfLines={1}>{data.title}</Text>
          {tab === 'Scheduled' && (
            <Text style={styles.statusOngoing}>On Going</Text>
          )}
          {tab === 'Cancelled' && (
            <Text style={styles.statusPenalty}>{data.status}</Text>
          )}
        </View>
        <Text style={styles.details}>{data.date}</Text>
        <Text style={styles.details}>{data.address}</Text>
        {tab === 'Scheduled' && (
          <Text style={styles.details}>Customer: {data.customer}</Text>
        )}
        {tab === 'Cancelled' && (
          <Text style={styles.details}>Cancelled by {data.cancelledBy} ({data.date})</Text>
        )}
        {tab === 'Cancelled' && (
          <Text style={styles.penalty}>~{data.penalty}</Text>
        )}
        <TouchableOpacity
          style={tab === 'Scheduled' ? styles.cancelBtn : styles.detailsBtn}
        >
          <Text style={tab === 'Scheduled' ? styles.cancelBtnText : styles.detailsBtnText}>
            {data.button.label}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'flex-start',
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  info: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 15, flex: 1 },
  statusOngoing: { color: '#A259FF', fontWeight: 'bold', marginLeft: 8, fontSize: 12 },
  statusPenalty: { color: '#FF6B6B', fontWeight: 'bold', marginLeft: 8, fontSize: 12 },
  details: { color: '#555', fontSize: 13, marginTop: 2 },
  penalty: { color: '#FF6B6B', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
  cancelBtn: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cancelBtnText: { color: '#fff', fontWeight: 'bold' },
  detailsBtn: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#A259FF',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  detailsBtnText: { color: '#fff', fontWeight: 'bold' },
}); 