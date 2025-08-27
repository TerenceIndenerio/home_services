import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  avatar: string;
  job: string;
  customer: string;
  address: string;
};

const BookingRequestItem: React.FC<Props> = ({ avatar, job, customer, address }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.job}>{job}</Text>
        <Text style={styles.customer}>Customer Name: {customer}</Text>
        <Text style={styles.location}>Address: {address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  job: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  customer: {
    fontSize: 13,
    color: '#444',
    marginBottom: 1,
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
});

export default BookingRequestItem; 