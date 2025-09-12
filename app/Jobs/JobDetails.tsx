import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { YStack, XStack, Text, Button, Card, Separator } from 'tamagui';

export default function JobDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const job = useMemo(() => {
    return params.job ? JSON.parse(params.job as string) : null;
  }, [params.job]);

  console.log('JobDetails - received job:', job);

  const handleStatusUpdate = async (status: "accepted" | "declined" | "started" | "ongoing" | "done") => {
    if (!job?.id) return;

    try {
      setUpdatingStatus(true);
      const ref = doc(db, "bookings", job.id);
      await updateDoc(ref, { status });


      setJobDetails((prev: any) => prev ? { ...prev, status } : null);


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
        console.log('Job data received:', job); 

        
        const jobDoc = await getDoc(doc(db, 'bookings', job.id));
        if (jobDoc.exists()) {
          const data = jobDoc.data();
          console.log('Firebase data:', data); 

          setJobDetails({
            ...job,
            ...data,
            
            title: data.jobTitle || job.title || 'Untitled Job',
            name: data.providerName || 'Service Provider', 
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
      console.log('Invalid job data:', job); 
      setError('Invalid job data - missing ID');
      setLoading(false);
    }
  }, [job]);

  if (loading) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="$purple9" />
        <Text fontSize="$4" color="$gray11" marginTop="$4">Loading job details...</Text>
      </YStack>
    );
  }

  if (error || !jobDetails) {
    return (
      <YStack flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$red9" textAlign="center" marginBottom="$5">
          {error || 'Job details not available'}
        </Text>
        <Button
          size="$4"
          theme="purple"
          backgroundColor="$purple9"
          color="$background"
          fontWeight="bold"
          onPress={() => router.back()}
          pressStyle={{ opacity: 0.8 }}
        >
          Go Back
        </Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <XStack
        alignItems="center"
        backgroundColor="$purple9"
        height={60}
        paddingHorizontal="$3"
      >
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          color="$background"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          pressStyle={{ opacity: 0.8 }}
        >
          {'\u2039'}
        </Button>
        <Text color="$background" fontWeight="bold" fontSize="$5" marginLeft="$2">
          Job Details
        </Text>
      </XStack>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Card backgroundColor="$background" borderRadius="$4" padding="$5" marginBottom="$4" shadowColor="$shadowColor" shadowOpacity={0.05} shadowRadius={4} shadowOffset={{ width: 0, height: 2 }} elevation={2}>
          <Text fontSize="$5" fontWeight="bold" textAlign="center" marginTop="$1">{jobDetails.title}</Text>
          <Text fontSize="$4" textAlign="center" color="$gray11" marginBottom="$2">{jobDetails.name}</Text>
          <XStack justifyContent="space-around" marginTop="$3" marginBottom="$4">
            <YStack alignItems="center" flex={1}>
              <Text fontSize="$4" marginBottom="$1">📍</Text>
              <Text fontSize="$3" color="$gray10" textAlign="center">{jobDetails.location}</Text>
            </YStack>
            <YStack alignItems="center" flex={1}>
              <Text fontSize="$4" marginBottom="$1">⏰</Text>
              <Text fontSize="$3" color="$gray10" textAlign="center">{jobDetails.time}</Text>
            </YStack>
            <YStack alignItems="center" flex={1}>
              <Text fontSize="$4" marginBottom="$1">💰</Text>
              <Text fontSize="$3" color="$gray10" textAlign="center">{jobDetails.rate}</Text>
            </YStack>
          </XStack>
          <XStack flexWrap="wrap" justifyContent="center" marginBottom="$2">
            {jobDetails.tags.map((tag: string) => (
              <Text key={tag} backgroundColor="$purple9" borderRadius="$2" paddingHorizontal="$2" paddingVertical="$1" margin="$1" color="$background" fontSize="$2">
                {tag}
              </Text>
            ))}
          </XStack>
          <Text fontSize="$3" color="$gray8" textAlign="center" marginBottom="$2">Posted on {jobDetails.postedDate}</Text>
        </Card>
        <Card backgroundColor="$background" borderRadius="$4" padding="$4" marginTop="$4" marginBottom="$2" shadowColor="$shadowColor" shadowOpacity={0.05} shadowRadius={4} shadowOffset={{ width: 0, height: 2 }} elevation={2}>
          <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$3" textAlign="center">📝 Job Description</Text>
          <Text fontSize="$4" color="$gray11" lineHeight={20}>{jobDetails.description}</Text>
        </Card>

        <Card backgroundColor="$background" borderRadius="$4" padding="$4" marginTop="$4" marginBottom="$2" shadowColor="$shadowColor" shadowOpacity={0.05} shadowRadius={4} shadowOffset={{ width: 0, height: 2 }} elevation={2}>
          <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$3" textAlign="center">📋 Job Information</Text>
          <YStack gap="$3">
            <Detail icon="📊" label="Status" value={jobDetails.status || 'N/A'} />
            <Detail icon="💰" label="Amount" value={jobDetails.amount ? `₱${jobDetails.amount}` : 'N/A'} />
            <Detail icon="👤" label="Provider ID" value={jobDetails.providerId || 'N/A'} />
            <Detail icon="👨‍💼" label="User ID" value={jobDetails.userId || 'N/A'} />
          </YStack>
        </Card>

        <Card backgroundColor="$background" borderRadius="$4" padding="$4" marginTop="$4" marginBottom="$2" shadowColor="$shadowColor" shadowOpacity={0.05} shadowRadius={4} shadowOffset={{ width: 0, height: 2 }} elevation={2}>
          <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$3" textAlign="center">📍 Location Details</Text>
          <YStack gap="$3">
            <Detail icon="🏠" label="Address" value={jobDetails.address || jobDetails.location || 'N/A'} />
            <Detail icon="📍" label="Coordinates" value={`${jobDetails.latitude || 'N/A'}, ${jobDetails.longitude || 'N/A'}`} />
          </YStack>
          {jobDetails.latitude && jobDetails.longitude && (
            <Button
              size="$4"
              theme="purple"
              backgroundColor="$purple9"
              color="$background"
              fontSize="$4"
              fontWeight="600"
              marginTop="$3"
              onPress={() => {
                const latitude = jobDetails.latitude;
                const longitude = jobDetails.longitude;
                const address = jobDetails.address || jobDetails.location || "Job Location";
                const jobTitle = jobDetails.title || "Job Location";
                const description = jobDetails.description || "";

                router.push(`/Jobs/booking/map?latitude=${latitude}&longitude=${longitude}&address=${encodeURIComponent(address)}&jobTitle=${encodeURIComponent(jobTitle)}&description=${encodeURIComponent(description)}`);
              }}
              pressStyle={{ opacity: 0.8 }}
            >
              🗺️ View Map
            </Button>
          )}
        </Card>

        <Card backgroundColor="$background" borderRadius="$4" padding="$4" marginTop="$4" marginBottom="$2" shadowColor="$shadowColor" shadowOpacity={0.05} shadowRadius={4} shadowOffset={{ width: 0, height: 2 }} elevation={2}>
          <Text fontSize="$5" fontWeight="bold" color="$color" marginBottom="$3" textAlign="center">⏰ Schedule & Timeline</Text>
          <YStack gap="$3">
            <Detail icon="📅" label="Created At" value={jobDetails.createdAt || 'N/A'} />
            <Detail icon="🕐" label="Schedule Date" value={jobDetails.scheduleDate || 'N/A'} />
          </YStack>
        </Card>
      </ScrollView>
      <XStack
        justifyContent="space-around"
        alignItems="center"
        padding="$3"
        borderTopWidth={1}
        borderTopColor="$gray6"
        backgroundColor="$background"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
      >
        {jobDetails.status === 'accepted' ? (
          <Button
            size="$4"
            theme="green"
            backgroundColor="$green9"
            color="$background"
            fontWeight="bold"
            onPress={() => handleStatusUpdate("ongoing")}
            disabled={updatingStatus}
            pressStyle={{ opacity: 0.8 }}
          >
            {updatingStatus ? "Updating..." : "Start Job"}
          </Button>
        ) : jobDetails.status === 'ongoing' ? (
          <Button
            size="$4"
            theme="blue"
            backgroundColor="$blue9"
            color="$background"
            fontWeight="bold"
            onPress={() => handleStatusUpdate("done")}
            disabled={updatingStatus}
            pressStyle={{ opacity: 0.8 }}
          >
            {updatingStatus ? "Updating..." : "Finish Job"}
          </Button>
        ) : jobDetails.status === 'done' ? (
          <YStack alignItems="center" justifyContent="center" paddingVertical="$2">
            <Text color="$green9" fontWeight="bold" fontSize="$5">Job Completed</Text>
          </YStack>
        ) : (
          <XStack gap="$4">
            <Button
              size="$4"
              theme="purple"
              backgroundColor="$purple9"
              color="$background"
              fontWeight="bold"
              onPress={() => handleStatusUpdate("accepted")}
              disabled={updatingStatus}
              pressStyle={{ opacity: 0.8 }}
            >
              {updatingStatus ? "Updating..." : "Accept Job"}
            </Button>

            <Button
              size="$4"
              theme="red"
              backgroundColor="transparent"
              borderColor="$red9"
              borderWidth={1}
              color="$red9"
              fontWeight="bold"
              onPress={() => handleStatusUpdate("declined")}
              disabled={updatingStatus}
              pressStyle={{ opacity: 0.8 }}
            >
              {updatingStatus ? "Updating..." : "Decline"}
            </Button>
          </XStack>
        )}
      </XStack>
    </YStack>
  );
}

const Detail = ({ icon, label, value }: { icon?: string; label: string; value: string }) => (
  <XStack
    alignItems="center"
    marginBottom="$3"
    paddingVertical="$2"
    paddingHorizontal="$3"
    backgroundColor="$gray2"
    borderRadius="$3"
  >
    {icon && <Text fontSize="$5" marginRight="$3" width={24} textAlign="center">{icon}</Text>}
    <YStack flex={1}>
      <Text fontSize="$3" fontWeight="600" color="$gray11" textTransform="uppercase" letterSpacing={0.5}>{label}</Text>
      <Text fontSize="$4" fontWeight="500" color="$color" marginTop="$1">{value}</Text>
    </YStack>
  </XStack>
);