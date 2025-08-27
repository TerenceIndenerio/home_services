import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  mobile: string;
  setMobile: (val: string) => void;
  sex: string;
  setSex: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  onPreview: () => void;
  onSave: () => void;
  saving?: boolean;
}

const PersonalInfoSection: React.FC<Props> = ({ 
  mobile, setMobile, 
  sex, setSex, 
  pincode, setPincode,
  onPreview, onSave, saving = false
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Personal Information</Text>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Mobile Number</Text>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Mobile Number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
        />
        <Icon name="alert-circle" size={16} color="#D32F2F" style={{ marginLeft: 6 }} />
      </View>
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>PIN Code</Text>
      <TextInput
        style={styles.input}
        value={pincode}
        onChangeText={setPincode}
        placeholder="PIN Code"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={4}
      />
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Sex</Text>
      <TextInput
        style={styles.input}
        value={sex}
        onChangeText={setSex}
        placeholder="Sex"
        placeholderTextColor="#aaa"
      />
    </View>
    <View style={styles.buttonContainer}>
      {/* <TouchableOpacity style={styles.previewBtn} onPress={onPreview}>
        <Text style={styles.previewBtnText}>Preview</Text>
      </TouchableOpacity> */}
      <TouchableOpacity 
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]} 
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 12,
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#888',
    width: 120,
  },
  input: {
    fontSize: 15,
    color: '#222',
    flex: 1,
    fontWeight: '500',
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  previewBtn: {
    backgroundColor: '#A259FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PersonalInfoSection; 