import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import JobSearchBar from '../Jobs/components/JobSearchBar';
import JobTabBar from '../Jobs/components/JobTabBar';
import JobCard from '../Jobs/components/JobCard';
import BookmarkJobsScreen from '../Jobs/BookmarkJobsScreen';
import { useNavigation } from '@react-navigation/native';

const jobsData = [
  {
    id: 1,
    title: 'Appointment Setter & Assistant',
    name: 'Rochelle Sabino',
    type: 'Full Time',
    location: 'Quezon City',
    time: 'a day ago',
  },
  {
    id: 2,
    title: 'Full Time Home Driver',
    name: 'Arnel Subayan',
    type: 'Full Time',
    location: 'Mandaluyong, Metro Manila',
    time: '3 days ago',
  },
  {
    id: 3,
    title: 'Business Dishwasher',
    name: 'Vanessa Dez',
    type: 'Part Time',
    location: 'Pasig City',
    time: '5 days ago',
  },
];

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState('Jobs For You');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleJobPress = (job: any) => {
    (navigation as any).navigate('Jobs/JobDetails', { job });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add any data fetching logic here
    // For example, refetch jobs data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jobs</Text>
      <JobSearchBar />
      <JobTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Jobs For You' ? (
        <ScrollView 
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#8B5CF6"]}
              tintColor="#8B5CF6"
            />
          }
        >
          {jobsData.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => handleJobPress(job)} />
          ))}
        </ScrollView>
      ) : (
        <BookmarkJobsScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#9B5DE5', marginTop: 24, marginBottom: 12 },
  list: { marginTop: 8 },
}); 