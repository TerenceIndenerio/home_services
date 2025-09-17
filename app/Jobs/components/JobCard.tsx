import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <YStack style={styles.cardContent}>
        <YStack style={styles.leftSection}>
          <YStack style={styles.thumbnail}>
            <Ionicons name="briefcase-outline" size={24} color="#9B5DE5" />
          </YStack>
        </YStack>
        <YStack style={styles.middleSection}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.description}>{job.description}</Text>
          <YStack style={styles.row}>
            <YStack style={[styles.statusBadge, { backgroundColor: job.status === 'open' ? '#4CAF50' : '#9E9E9E' }]}>
              <Text style={styles.statusBadgeText}>{job.status === 'open' ? 'Open' : 'Closed'}</Text>
            </YStack>
            <Text style={styles.location}>{job.location}</Text>
          </YStack>
          <Text style={styles.time}>{job.time}</Text>
        </YStack>
        <YStack style={styles.rightSection}>
          <Text style={styles.amount}>₱{job.amount}</Text>
          <Button style={styles.applyButton} onPress={onPress}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </Button>
        </YStack>
      </YStack>
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftSection: {
    marginRight: 12,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleSection: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
  },
  description: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  location: {
    color: '#666',
    fontSize: 13,
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    color: '#9B5DE5',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#9B5DE5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
