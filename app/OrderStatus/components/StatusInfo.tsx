import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusInfo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Text style={styles.icon}>👤</Text>
        <View style={styles.line} />
        <Text style={styles.icon}>💼</Text>
        <View style={styles.line} />
        <Text style={styles.icon}>🚶‍♂️</Text>
        <View style={styles.line} />
        <Text style={styles.icon}>🏠</Text>
      </View>
      <Text style={styles.statusText}>Wait for you job seeker to accept...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 16 },
  label: { color: '#888', fontSize: 16, marginBottom: 4 },
  time: { color: '#7B61FF', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 24, color: '#7B61FF' },
  line: {
    width: 32,
    height: 2,
    backgroundColor: '#E0D7FF',
    marginHorizontal: 4,
    borderRadius: 1,
  },
  statusText: { color: '#7B61FF', fontSize: 16, marginTop: 4 },
});

export default StatusInfo; 