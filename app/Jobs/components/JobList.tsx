import React from 'react';
import { ScrollView, RefreshControl, Text, StyleSheet } from 'react-native';
import JobCard from '@/app/Jobs/components/JobCard';

interface Job {
  id: string;
  title: string;
  description: string;
  address: string;
  amount: number;
  location: string;
  time: string;
  status: string;
}

interface JobsListProps {
  jobs: Job[];
  onRefresh: () => void;
  refreshing: boolean;
  onJobPress: (job: Job) => void;
}

export default function JobsList({ jobs, onRefresh, refreshing, onJobPress }: JobsListProps) {
  return (
    <ScrollView
      style={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#8B5CF6']}
          tintColor="#8B5CF6"
        />
      }
    >
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={() => onJobPress(job)}
          />
        ))
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No jobs found
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 8 },
});
