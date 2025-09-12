import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/src/features/auth/context/authContext';
import Loader from '@/src/components/Loader';
import { YStack, Text } from 'tamagui';

const employmentTypes = [
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
];

const AddJobPost: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pay, setPay] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state } = useAuth();

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handlePostJob = async () => {
    if (!state.user) {
      Alert.alert('Error', 'You must be logged in to post a job.');
      return;
    }

    if (!selectedType || !jobTitle || !description || !pay || skills.length === 0) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        jobType: selectedType,
        jobTitle,
        description,
        pay: parseFloat(pay),
        skills: skills, // Store as JSON array
        uid: state.user.uid,
        location: 'Placeholder Location',
        status: 'open',
        createdAt: new Date(),
      });
      Alert.alert(
        'Success!',
        'Your job post has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert(
        'Failed to Post Job',
        'There was an error posting your job. Please check your connection and try again.',
        [
          { text: 'Try Again' },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>What type of Employment?</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(!isDropdownOpen)}>
          <Text style={{ color: selectedType ? '#222' : '#aaa' }}>
            {selectedType || 'Type of Employment'}
          </Text>
          <Ionicons name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#8F5CFF" />
        </TouchableOpacity>
        {isDropdownOpen && (
          <YStack style={styles.dropdownMenu}>
            {employmentTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedType(type);
                  setDropdownOpen(false);
                }}
              >
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </YStack>
        )}

        <Text style={[styles.label, { marginTop: 32 }]}>Job Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter job title"
          value={jobTitle}
          onChangeText={setJobTitle}
        />

        <Text style={[styles.label, { marginTop: 32 }]}>Job Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter job description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={[styles.label, { marginTop: 32 }]}>Offered Pay</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={pay}
          onChangeText={setPay}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { marginTop: 32 }]}>What skills are you looking for?</Text>
        <YStack style={styles.skillInputRow}>
          <TextInput
            style={[styles.skillInput, { flex: 1, marginRight: 8 }]}
            placeholder="Enter skill"
            value={skillInput}
            onChangeText={setSkillInput}
          />
          <TouchableOpacity style={styles.addSkillBtn} onPress={handleAddSkill}>
            <Text style={styles.addSkillText}>Add</Text>
          </TouchableOpacity>
        </YStack>

        <YStack style={styles.skillsRow}>
          {skills.map(skill => (
            <TouchableOpacity
              key={skill}
              style={styles.skillChip}
              onPress={() => handleRemoveSkill(skill)}
            >
              <Text style={styles.skillChipText}>{skill}</Text>
            </TouchableOpacity>
          ))}
        </YStack>
        <YStack style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => {

            try {

              if (router.canGoBack && router.canGoBack()) {
                router.back();
              } else {
                router.replace ? router.replace("/") : router.push("/");
              }
            } catch {
              router.replace ? router.replace("/") : router.push("/");
            }
          }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={handlePostJob}>
            <Text style={styles.nextText}>Post Job</Text>
          </TouchableOpacity>
        </YStack>
      </ScrollView>
      <Loader visible={loading} text="Posting job..." />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5DFFF',
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FAF8FF',
    fontSize: 16,
    color: '#222',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#222',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5DFFF',
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FAF8FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E5DFFF',
    borderRadius: 6,
    backgroundColor: '#FAF8FF',
    marginTop: -10,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5DFFF',
  },
  skillInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5DFFF',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FAF8FF',
  },
  skillInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  addSkillBtn: {
    backgroundColor: '#A259FF',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addSkillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  skillChip: {
    backgroundColor: '#A259FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  skillChipText: {
    color: '#fff',
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A259FF',
    borderRadius: 6,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#A259FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#A259FF',
    borderRadius: 6,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5DFFF',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
  },
  toggleBtnActive: {
    backgroundColor: '#A259FF',
    borderColor: '#A259FF',
  },
  toggleText: {
    color: '#8F5CFF',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
});

export default AddJobPost; 