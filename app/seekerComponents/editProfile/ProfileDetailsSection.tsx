import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

interface Props {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  skills: string;
  setSkills: (val: string) => void;
  experience: string;
  setExperience: (val: string) => void;
  hourlyRate: string;
  setHourlyRate: (val: string) => void;
  rating?: number;
}

const ProfileDetailsSection: React.FC<Props> = ({ 
  jobTitle, setJobTitle,
  jobDescription, setJobDescription,
  bio, setBio,
  skills, setSkills,
  experience, setExperience,
  hourlyRate, setHourlyRate,
  rating
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Professional Profile</Text>
    
    <View style={styles.infoRow}>
      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        value={jobTitle}
        onChangeText={setJobTitle}
        placeholder="e.g., Home Cleaning, Plumber, Electrician"
        placeholderTextColor="#aaa"
      />
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Job Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={jobDescription}
        onChangeText={setJobDescription}
        placeholder="Describe your services in detail..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.charCount}>{jobDescription.length}/500</Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell clients about yourself, your experience, and why they should choose you..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={300}
      />
      <Text style={styles.charCount}>{bio.length}/300</Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Skills</Text>
      <TextInput
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
        placeholder="e.g., Deep cleaning, Sanitization, Organization"
        placeholderTextColor="#aaa"
      />
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Experience</Text>
      <TextInput
        style={styles.input}
        value={experience}
        onChangeText={setExperience}
        placeholder="e.g., 5 years, Certified, Licensed"
        placeholderTextColor="#aaa"
      />
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.label}>Hourly Rate</Text>
      <TextInput
        style={styles.input}
        value={hourlyRate}
        onChangeText={setHourlyRate}
        placeholder="e.g., 25 (numbers only)"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />
      <Text style={styles.hintText}>Enter amount without currency symbol</Text>
    </View>

    {rating !== undefined && (
      <View style={styles.infoRow}>
        <Text style={styles.label}>Current Rating</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{rating.toFixed(1)} ⭐</Text>
        </View>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
  hintText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ProfileDetailsSection; 