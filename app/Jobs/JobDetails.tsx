import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function JobDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const job = useMemo(() => {
    return params.job ? JSON.parse(params.job as string) : null;
  }, [params.job]);

  console.log('JobDetails - received job:', job);

  const handleStatusUpdate = async (status: "accepted" | "declined") => {
    if (!job?.id) return;

    try {
      setUpdatingStatus(true);
      const ref = doc(db, "bookings", job.id);
      await updateDoc(ref, { status });

      // Update local state
      setJobDetails((prev: any) => prev ? { ...prev, status } : null);

      // Show success message and navigate back
      alert(`Job ${status} successfully!`);
      router.back();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update job status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        console.log('Job data received:', job); // Debug log

        // Fetch job details from 'bookings' collection
        const jobDoc = await getDoc(doc(db, 'bookings', job.id));
        if (jobDoc.exists()) {
          const data = jobDoc.data();
          console.log('Firebase data:', data); // Debug log

          setJobDetails({
            ...job,
            ...data,
            // Map bookings fields to job details fields
            title: data.jobTitle || job.title || 'Untitled Job',
            name: data.providerName || 'Service Provider', // Provider name might not be in data
            rate: `₱${data.amount || job.amount || 0}`,
            tags: data.tags || [],
            postedDate: data.createdAt?.seconds
              ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
              : 'Not specified',
            description: data.description || job.description || 'No description available',
            responsibilities: data.responsibilities || [],
            qualifications: data.qualifications || [],
            location: data.address || job.address || 'No address',
            status: data.status || job.status || 'pending',
            // Additional fields from the data
            providerId: data.providerId || 'N/A',
            userId: data.userId || 'N/A',
            address: data.address || 'N/A',
            amount: data.amount || 0,
            latitude: data.location?.latitude || 'N/A',
            longitude: data.location?.longitude || 'N/A',
            createdAt: data.createdAt?.seconds
              ? new Date(data.createdAt.seconds * 1000).toLocaleString()
              : 'N/A',
            scheduleDate: data.scheduleDate?.seconds
              ? new Date(data.scheduleDate.seconds * 1000).toLocaleString()
              : 'N/A',
          });
        } else {
          setError('Job details not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (job && job.id) {
      fetchJobDetails();
    } else {
      console.log('Invalid job data:', job); // Debug log
      setError('Invalid job data - missing ID');
      setLoading(false);
    }
  }, [job]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#9B5DE5" />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (error || !jobDetails) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || 'Job details not available'}</Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCustom}>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back">
          <Text style={styles.backIcon}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Job Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.jobHeader}>
          <Text style={styles.title}>{jobDetails.title}</Text>
          <Text style={styles.name}>{jobDetails.name}</Text>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{jobDetails.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏰</Text>
              <Text style={styles.metaText}>{jobDetails.time}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>💰</Text>
              <Text style={styles.metaText}>{jobDetails.rate}</Text>
            </View>
          </View>
          <View style={styles.tagsRow}>
            {jobDetails.tags.map((tag: string) => (
              <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))}
          </View>
          <Text style={styles.postedDate}>Posted on {jobDetails.postedDate}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Job Description</Text>
          <Text style={styles.sectionDescription}>{jobDetails.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Job Information</Text>
          <View style={styles.sectionContent}>
            <Detail icon="📊" label="Status" value={jobDetails.status || 'N/A'} />
            <Detail icon="💰" label="Amount" value={jobDetails.amount ? `₱${jobDetails.amount}` : 'N/A'} />
            <Detail icon="👤" label="Provider ID" value={jobDetails.providerId || 'N/A'} />
            <Detail icon="👨‍💼" label="User ID" value={jobDetails.userId || 'N/A'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location Details</Text>
          <View style={styles.sectionContent}>
            <Detail icon="🏠" label="Address" value={jobDetails.address || jobDetails.location || 'N/A'} />
            <Detail icon="📍" label="Coordinates" value={`${jobDetails.latitude || 'N/A'}, ${jobDetails.longitude || 'N/A'}`} />
          </View>
          {jobDetails.latitude && jobDetails.longitude && (
            <Pressable
              style={styles.viewMapButton}
              onPress={() => {
                const latitude = jobDetails.latitude;
                const longitude = jobDetails.longitude;
                const address = jobDetails.address || jobDetails.location || "Job Location";
                const jobTitle = jobDetails.title || "Job Location";
                const description = jobDetails.description || "";

                router.push(`/Jobs/booking/map?latitude=${latitude}&longitude=${longitude}&address=${encodeURIComponent(address)}&jobTitle=${encodeURIComponent(jobTitle)}&description=${encodeURIComponent(description)}`);
              }}
            >
              <Text style={styles.viewMapButtonText}>🗺️ View Map</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Schedule & Timeline</Text>
          <View style={styles.sectionContent}>
            <Detail icon="📅" label="Created At" value={jobDetails.createdAt || 'N/A'} />
            <Detail icon="🕐" label="Schedule Date" value={jobDetails.scheduleDate || 'N/A'} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonRow}>
       
        <Pressable
          style={styles.applyButton}
          onPress={() => handleStatusUpdate("accepted")}
          disabled={updatingStatus}
        >
          <Text style={styles.applyButtonText}>
            {updatingStatus ? "Updating..." : "Accept Job"}
          </Text>
        </Pressable>

         <Pressable
          style={styles.declineButton}
          onPress={() => handleStatusUpdate("declined")}
          disabled={updatingStatus}
        >
          <Text style={styles.declineButtonText}>
            {updatingStatus ? "Updating..." : "Decline"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const Detail = ({ icon, label, value }: { icon?: string; label: string; value: string }) => (
  <View style={styles.detailItem}>
    {icon && <Text style={styles.detailIcon}>{icon}</Text>}
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12, textAlign: 'center' },
  description: { fontSize: 13, color: '#333', marginBottom: 8 },
  list: { marginLeft: 8, marginBottom: 8 },
  listItem: { fontSize: 13, color: '#333', marginBottom: 2 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  applyButton: { backgroundColor: '#9B5DE5', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bookmarkButton: { borderWidth: 1, borderColor: '#9B5DE5', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  bookmarkButtonText: { color: '#9B5DE5', fontWeight: 'bold', fontSize: 16 },
  declineButton: { borderWidth: 1, borderColor: '#ff4444', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  declineButtonText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 },
  detailSection: { marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#666' },
  value: { fontSize: 16, fontWeight: '400', color: '#333' },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f8f9fa', borderRadius: 8 },
  detailIcon: { fontSize: 18, marginRight: 12, width: 24, textAlign: 'center' },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#333', marginTop: 2 },
  section: { marginTop: 16, marginBottom: 8, padding: 16, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sectionContent: { gap: 8 },
  sectionDescription: { fontSize: 14, color: '#555', lineHeight: 20 },
  jobHeader: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  jobMeta: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, marginBottom: 16 },
  metaItem: { alignItems: 'center', flex: 1 },
  metaIcon: { fontSize: 16, marginBottom: 4 },
  metaText: { fontSize: 12, color: '#666', textAlign: 'center' },
  viewMapButton: { backgroundColor: '#9B5DE5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginTop: 12 },
  viewMapButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#ff4444', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#9B5DE5', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  retryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});