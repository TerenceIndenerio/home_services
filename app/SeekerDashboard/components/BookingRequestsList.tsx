import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import BookingRequestItem from './BookingRequestItem';

type Request = {
  id: string;
  avatar: string;
  job: string;
  customer: string;
  location: string;
};

type Props = {
  requests: Request[];
  style?: ViewStyle;
};

const BookingRequestsList: React.FC<Props> = ({ requests, style }) => {
  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity style={styles.header} activeOpacity={0.7}>
        <Text style={styles.title}>Upcoming Booking Requests</Text>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
      <View style={styles.list}>
        {requests.map((req) => (
          <BookingRequestItem key={req.id} {...req} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  list: {},
});

export default BookingRequestsList; 