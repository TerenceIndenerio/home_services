import React from 'react';
import { YStack, Text } from 'tamagui';
import { StyleSheet, Pressable } from 'react-native';

type JobProps = {
  title: string;
  description: string;
  address: string;
  amount: number;
  location: string;
  time: string;
  status: string;
};

export default function JobCard({
  job,
  onPress
}: {
  job: JobProps;
  onPress?: () => void;
}) {
  
  const badgeColor = job.status === 'accepted' ? '#9B5DE5' : '#F15BB5';

  return (
    <Pressable style={styles.card} onPress={onPress} testID="job-card">
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.description}>{job.description}</Text>

      <YStack style={styles.row}>
        <YStack style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{job.status}</Text>
        </YStack>
        <Text style={styles.location}>{job.address}</Text>
      </YStack>

      <Text style={styles.time}>{job.time}</Text>
      <Text style={styles.amount}>₱{job.amount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    color: '#333',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  location: {
    color: '#666',
    marginLeft: 8,
    fontSize: 13,
  },
  time: {
    color: '#aaa',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  amount: {
    color: '#9B5DE5',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
});
