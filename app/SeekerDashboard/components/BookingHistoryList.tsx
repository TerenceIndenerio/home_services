import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BookingHistoryItem from './BookingHistoryItem';

type History = {
  id: string;
  job: string;
  date: string;
  location: string;
  status: string;
};

type Props = {
  history: History[];
};

const BookingHistoryList: React.FC<Props> = ({ history }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} activeOpacity={0.7}>
        <Text style={styles.title}>Booking History</Text>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
      <View style={styles.list}>
        {history.map((item) => (
          <BookingHistoryItem key={item.id} {...item} />
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

export default BookingHistoryList; 