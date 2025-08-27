import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function JobDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { job } = route.params as any;

  // Example static data for demonstration (replace with real job data as needed)
  const jobDetails = {
    ...job,
    rate: 'Php 250 / hr',
    tags: ['Assist', 'Scheduling', 'Emailing', 'English', 'Communication Skills', 'Organize'],
    postedDate: 'May 21, 2025',
    description:
      "We're looking for a highly motivated and detail-oriented Appointment Setter to join our growing team. Your primary responsibility will be to contact potential clients, introduce our products/services, and schedule appointments for our sales team. This role is perfect for someone who enjoys speaking with people, has great communication skills, and thrives in a fast-paced environment.",
    responsibilities: [
      'Make outbound calls and respond to inbound inquiries.',
      'Engage prospects, introduce company offerings, and set qualified appointments.',
      'Manage and maintain a pipeline of leads using CRM tools.',
      'Follow up with leads through calls, emails, or messages as needed.',
      'Collaborate with the sales team to ensure seamless hand-offs.',
      'Track and report daily activities and performance metrics.',
    ],
    qualifications: [],
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCustom}>
        <Pressable style={styles.backButton} onPress={() => {
          // Try to go back, but if not possible, go to home
          try {
            if (navigation.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home' as never);
            }
          } catch {
            navigation.navigate('Home' as never);
          }
        }} accessibilityLabel="Go back">
          <Text style={styles.backIcon}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Job Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{jobDetails.title}</Text>
        <Text style={styles.name}>{jobDetails.name}</Text>
        <View style={styles.row}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.info}>{jobDetails.location}</Text>
          <Text style={styles.icon}>⏰</Text>
          <Text style={styles.info}>{jobDetails.type}</Text>
          <Text style={styles.icon}>💰</Text>
          <Text style={styles.info}>{jobDetails.rate}</Text>
        </View>
        <View style={styles.tagsRow}>
          {jobDetails.tags.map((tag: string) => (
            <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
          ))}
        </View>
        <Text style={styles.postedDate}>Posted on {jobDetails.postedDate}</Text>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{jobDetails.description}</Text>
        <Text style={styles.sectionTitle}>Key Responsibilities:</Text>
        <View style={styles.list}>
          {jobDetails.responsibilities.map((item: string, idx: number) => (
            <Text key={idx} style={styles.listItem}>• {item}</Text>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Qualifications:</Text>
        <Text style={styles.description}>-</Text>
      </ScrollView>
      <View style={styles.buttonRow}>
        <Pressable style={styles.applyButton}><Text style={styles.applyButtonText}>Apply Now</Text></Pressable>
        <Pressable style={styles.bookmarkButton}><Text style={styles.bookmarkButtonText}>Bookmark</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerCustom: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#9B5DE5', height: 60, paddingHorizontal: 12 },
  backButton: { padding: 8, marginRight: 8 },
  backIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  headerBar: { height: 60, backgroundColor: '#9B5DE5', marginBottom: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  content: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
  name: { fontSize: 14, textAlign: 'center', color: '#444', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 14, marginHorizontal: 2 },
  info: { fontSize: 13, color: '#555', marginHorizontal: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 },
  tag: { backgroundColor: '#9B5DE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, margin: 2 },
  tagText: { color: '#fff', fontSize: 12 },
  postedDate: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 8 },
  sectionTitle: { fontWeight: 'bold', marginTop: 12, marginBottom: 4, fontSize: 15 },
  description: { fontSize: 13, color: '#333', marginBottom: 8 },
  list: { marginLeft: 8, marginBottom: 8 },
  listItem: { fontSize: 13, color: '#333', marginBottom: 2 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  applyButton: { backgroundColor: '#9B5DE5', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bookmarkButton: { borderWidth: 1, borderColor: '#9B5DE5', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  bookmarkButtonText: { color: '#9B5DE5', fontWeight: 'bold', fontSize: 16 },
}); 