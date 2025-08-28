import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../authentication/context/authContext';

const employmentTypes = [
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
];

const AddJobPost: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [pay, setPay] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Emailing', 'Scheduling', 'Communication Skills']);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

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
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post a job.');
      return;
    }

    if (!selectedType || !description || !pay) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'jobs'), {
        jobType: selectedType,
        description,
        pay: parseFloat(pay),
        skills,
        uid: user.uid,
        location: 'Placeholder Location', // TODO: Implement location functionality
        status: 'open',
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Job posted successfully!');
      router.back();
    } catch (error) {
      console.error('Error posting job:', error);
      Alert.alert('Error', 'There was an error posting the job. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>What type of Employment?</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(!isDropdownOpen)}>
        <Text style={{ color: selectedType ? '#222' : '#aaa' }}>
          {selectedType || 'Type of Employment'}
        </Text>
        <Ionicons name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#8F5CFF" />
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
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
        </View>
      )}

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
      <View style={styles.skillInputRow}>
        <Ionicons name="search" size={20} color="#8F5CFF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.skillInput}
          placeholder="Add Skills"
          value={skillInput}
          onChangeText={setSkillInput}
          onSubmitEditing={handleAddSkill}
          returnKeyType="done"
        />
      </View>
      <View style={styles.skillsRow}>
        {skills.map(skill => (
          <TouchableOpacity
            key={skill}
            style={styles.skillChip}
            onLongPress={() => handleRemoveSkill(skill)}
          >
            <Text style={styles.skillChipText}>{skill}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => {
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
        }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handlePostJob}>
          <Text style={styles.nextText}>Post Job</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
});

export default AddJobPost; 