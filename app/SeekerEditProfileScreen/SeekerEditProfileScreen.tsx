import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/features/auth/context/authContext';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
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
    jobCategory?: string;
    rating?: number;
    jobDescription?: string;
    bio?: string;
    skills?: string;
    experience?: string;
    hourlyRate?: number;
  };
  address?: string;
  email?: string;
  pincode?: number;
}

const SeekerEditProfileScreen = () => {
  const router = useRouter();
  const { user, userDocumentId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pincode, setPincode] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobCategories, setJobCategories] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchJobCategories();
  }, [user?.uid]);

  const fetchJobCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobCategories'));
      const categories: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name) categories.push(data.name);
      });
      setJobCategories(categories);
    } catch (error) {
      console.error('Error fetching job categories:', error);
      Alert.alert('Error', 'Failed to load job categories.');
    }
  };

  const fetchUserData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const documentId = userDocumentId || user.uid;
      const userDocRef = doc(db, 'users', documentId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);

        setName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
        setAddress(data.address || '');
        setEmail(data.email || '');
        setMobile(data.phoneNumber || '');
        setPincode(data.pincode?.toString() || '');
        setJobTitle(data.profile?.jobTitle || '');
        setJobCategory(data.profile?.jobCategory || '');
        setJobDescription(data.profile?.jobDescription || '');
        setBio(data.profile?.bio || '');
        setSkills(data.profile?.skills || '');
        setExperience(data.profile?.experience || '');
        setHourlyRate(data.profile?.hourlyRate?.toString() || '');
      } else {
        Alert.alert('Profile Not Found', 'Your profile data could not be found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.uid || !userData) {
      Alert.alert('Error', 'User data not available');
      return;
    }

    if (!name.trim() || !mobile.trim() || !pincode.trim()) {
      Alert.alert('Error', 'Name, Mobile, and Pincode are required');
      return;
    }

    setSaving(true);
    try {
      let documentId = await AsyncStorage.getItem('user_document_id');
      if (!documentId) documentId = user.uid;

      const userDocRef = doc(db, 'users', documentId);

      const updateData: Partial<UserData> = {
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        phoneNumber: mobile,
        address,
        email,
        pincode: parseInt(pincode) || 0,
        profile: {
          jobTitle,
          jobCategory,
          jobDescription,
          bio,
          skills,
          experience,
          hourlyRate: parseFloat(hourlyRate) || 0,
          rating: userData?.profile?.rating || 0,
        },
      };

      await updateDoc(userDocRef, updateData);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#8C52FF" />
      </View>
    );
  }

  if (!user?.uid) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Please log in to edit your profile</Text>
      </View>
    );
  }

  const renderInput = (label: string, value: string, onChange: (text: string) => void, props = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={label}
        {...props}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Edit Profile</Text>

      {renderInput('Full Name', name, setName)}
      {renderInput('Mobile Number', mobile, setMobile, { keyboardType: 'phone-pad' })}
      {renderInput('Email Address', email, setEmail, { keyboardType: 'email-address' })}
      {renderInput('Address', address, setAddress)}
      {renderInput('Pincode', pincode, setPincode, { keyboardType: 'numeric' })}
      {renderInput('Job Title', jobTitle, setJobTitle)}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Job Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={jobCategory}
            onValueChange={(itemValue) => setJobCategory(itemValue)}
          >
            <Picker.Item label="Select a category" value="" />
            {jobCategories.map((cat, index) => (
              <Picker.Item key={index} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      {renderInput('Job Description', jobDescription, setJobDescription, { multiline: true })}
      {renderInput('Bio', bio, setBio, { multiline: true })}
      {renderInput('Skills', skills, setSkills)}
      {renderInput('Experience', experience, setExperience)}
      {renderInput('Hourly Rate', hourlyRate, setHourlyRate, { keyboardType: 'numeric' })}

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center', color: '#222' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#8C52FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default SeekerEditProfileScreen;
