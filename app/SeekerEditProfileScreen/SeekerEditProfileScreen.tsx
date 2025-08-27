// SeekerEditProfileScreen.tsx
// This screen allows seekers to edit their profile information, including profile image, name, address, email, mobile number, sex, and professional profile details. It uses reusable components for each section and provides navigation back to the profile page.
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView } from 'react-native';
import ProfileImageSection from '../seekerComponents/editProfile/ProfileImageSection';
import AboutMeSection from '../seekerComponents/editProfile/AboutMeSection';
import PersonalInfoSection from '../seekerComponents/editProfile/PersonalInfoSection';
import ProfileDetailsSection from '../seekerComponents/editProfile/ProfileDetailsSection';
import { useRouter } from 'expo-router';
import { useAuth } from '../authentication/context/authContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_IMAGE = 'https://randomuser.me/api/portraits/men/32.jpg';

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  profile?: {
    jobTitle?: string;
    rating?: number;
    jobDescription?: string;
    bio?: string;
    skills?: string;
    experience?: string;
    hourlyRate?: number;
  };
  address?: string;
  email?: string;
  isJobSeeker?: boolean;
  latitude?: number;
  longitude?: number;
  pincode?: number;
}

const SeekerEditProfileScreen = () => {
  const router = useRouter();
  const { user, userDocumentId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [sex, setSex] = useState('Male');
  const [pincode, setPincode] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // New profile fields
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      // Use userDocumentId from auth context
      const documentId = userDocumentId || user.uid;

      const userDocRef = doc(db, 'users', documentId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        
        // Update state with Firestore data
        setImageUrl(data.profilePictureUrl || DEFAULT_IMAGE);
        setName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
        setAddress(data.address || '');
        setEmail(data.email || '');
        setMobile(data.phoneNumber || '');
        setPincode(data.pincode?.toString() || '');
        
        // Update new profile fields
        setJobTitle(data.profile?.jobTitle || '');
        setJobDescription(data.profile?.jobDescription || '');
        setBio(data.profile?.bio || '');
        setSkills(data.profile?.skills || '');
        setExperience(data.profile?.experience || '');
        setHourlyRate(data.profile?.hourlyRate?.toString() || '');
        
        // Log the data for debugging
        console.log('Loaded user data:', data);
        console.log('Profile data:', data.profile);
        
        // For sex, we'll keep the default since it's not in the Firestore data
        // You can add this field to your Firestore if needed
      } else {
        console.log('User document not found');
        Alert.alert('Profile Not Found', 'Your profile data could not be found. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user profile data. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.uid]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleEditImage = () => {
    // Placeholder for image picker logic
    Alert.alert('Edit Profile Image', 'Image picker logic goes here.');
  };

  const handleBack = () => {
    // Try to go back, but if not possible, go to home
    try {
      // @ts-ignore: canGoBack may not exist in expo-router, fallback to push
      if (router.canGoBack && router.canGoBack()) {
        router.back();
      } else {
        router.replace ? router.replace("/") : router.push("/");
      }
    } catch {
      router.replace ? router.replace("/") : router.push("/");
    }
  };

  const handlePreview = () => {
    Alert.alert('Preview', 'Preview logic goes here.');
  };

  const handleSaveProfile = async () => {
    if (!user?.uid || !userData) {
      Alert.alert('Error', 'User data not available');
      return;
    }

    // Basic validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!mobile.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    if (!pincode.trim() || pincode.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit PIN code');
      return;
    }

    // Profile validation
    if (!jobTitle.trim()) {
      Alert.alert('Error', 'Please enter your job title');
      return;
    }

    if (!jobDescription.trim()) {
      Alert.alert('Error', 'Please enter a job description');
      return;
    }

    if (!bio.trim()) {
      Alert.alert('Error', 'Please enter your bio');
      return;
    }

    if (!skills.trim()) {
      Alert.alert('Error', 'Please enter your skills');
      return;
    }

    if (!experience.trim()) {
      Alert.alert('Error', 'Please enter your experience');
      return;
    }

    if (!hourlyRate.trim()) {
      Alert.alert('Error', 'Please enter your hourly rate');
      return;
    }

    // Validate hourly rate is a positive number
    const hourlyRateNum = parseFloat(hourlyRate);
    if (isNaN(hourlyRateNum) || hourlyRateNum <= 0) {
      Alert.alert('Error', 'Please enter a valid hourly rate (positive number)');
      return;
    }

    // Email validation (if provided)
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setSaving(true);

    try {
      // Get document ID
      let documentId = await AsyncStorage.getItem('user_document_id');
      if (!documentId) {
        documentId = user.uid;
      }

      const userDocRef = doc(db, 'users', documentId);
      
      // Prepare update data
      const updateData: Partial<UserData> = {
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        phoneNumber: mobile,
        address: address,
        email: email,
        pincode: parseInt(pincode) || 0,
        profile: {
          jobTitle: jobTitle,
          jobDescription: jobDescription,
          bio: bio,
          skills: skills,
          experience: experience,
          hourlyRate: hourlyRateNum,
          rating: userData?.profile?.rating || 0,
        },
        // Add other fields as needed
      };

      await updateDoc(userDocRef, updateData);
      
      // Show success message
      Alert.alert(
        'Success', 
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Update local state
              setUserData(prev => prev ? { ...prev, ...updateData } : null);
            }
          }
        ]
      );
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your account status.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Network unavailable. Please check your internet connection.';
      } else if (error.code === 'deadline-exceeded') {
        errorMessage = 'Request timeout. Please try again.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8C52FF" />
      </View>
    );
  }

  if (!user?.uid) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Please log in to edit your profile</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Unable to load profile data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <ProfileImageSection 
          imageUrl={imageUrl} 
          onEdit={handleEditImage} 
          onBack={handleBack}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <AboutMeSection 
          name={name} 
          setName={setName} 
          address={address}
          setAddress={setAddress}
          email={email}
          setEmail={setEmail}
          rating={userData?.profile?.rating}
        />
       {userData?.isJobSeeker && (
  <ProfileDetailsSection
    jobTitle={jobTitle}
    setJobTitle={setJobTitle}
    jobDescription={jobDescription}
    setJobDescription={setJobDescription}
    bio={bio}
    setBio={setBio}
    skills={skills}
    setSkills={setSkills}
    experience={experience}
    setExperience={setExperience}
    hourlyRate={hourlyRate}
    setHourlyRate={setHourlyRate}
    rating={userData?.profile?.rating}
  />
)}

      <PersonalInfoSection
          mobile={mobile}
          setMobile={setMobile}
          sex={sex}
          setSex={setSex}
          pincode={pincode}
          setPincode={setPincode}
          onPreview={handlePreview}
          onSave={handleSaveProfile}
          saving={saving}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SeekerEditProfileScreen; 