import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function JobCard({ job, onPress }: { job: any, onPress?: () => void }) {
  const badgeColor = job.type === 'Full Time' ? '#9B5DE5' : '#F15BB5';
  return (
    <Pressable style={styles.card} onPress={onPress} testID="job-card">
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.name}>{job.name}</Text>
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}> 
          <Text style={styles.badgeText}>{job.type}</Text>
        </View>
        <Text style={styles.location}> {job.location}</Text>
      </View>
      <Text style={styles.time}>{job.time}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  name: { color: '#333', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12 },
  location: { color: '#666', marginLeft: 8, fontSize: 13 },
  time: { color: '#aaa', fontSize: 12, alignSelf: 'flex-end' },
}); 