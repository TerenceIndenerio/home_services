import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const employmentTypes = [
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
];

const AddJobPost: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Emailing', 'Scheduling', 'Communication Skills']);
  const router = useRouter();

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>What type of Employment?</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={{ color: selectedType ? '#222' : '#aaa' }}>
          {selectedType || 'Type of Employment'}
        </Text>
        {/* Dropdown logic placeholder */}
      </TouchableOpacity>

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
        <TouchableOpacity style={styles.nextBtn}>
          <Text style={styles.nextText}>Next</Text>
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