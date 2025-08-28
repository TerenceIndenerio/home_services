import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SeekerProfileInfo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>matt.dawner@email.com</Text>
      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>+1 234 567 8901</Text>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>123 Main St, City, Country</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});

export default SeekerProfileInfo; 