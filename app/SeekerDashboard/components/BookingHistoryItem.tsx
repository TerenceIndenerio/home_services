import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  job: string;
  date: string;
  location: string;
  status: string;
};

const statusColors: Record<string, string> = {
  Scheduled: '#6D28D9',
  Cancelled: '#EF4444',
  Completed: '#10B981',
};

const BookingHistoryItem: React.FC<Props> = ({ job, date, location, status }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.job}>{job}</Text>
        <Text style={[styles.status, { color: statusColors[status] || '#888' }]}>{status}</Text>
      </View>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  job: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  status: {
    fontWeight: '600',
    fontSize: 13,
  },
  date: {
    fontSize: 13,
    color: '#444',
    marginBottom: 1,
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
});

export default BookingHistoryItem; 