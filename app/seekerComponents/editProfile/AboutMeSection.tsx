import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  name: string;
  setName: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  rating?: number;
}

const AboutMeSection: React.FC<Props> = ({ 
  name, setName, 
  address, setAddress,
  email, setEmail,
  rating
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>About Me</Text>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#aaa"
      />
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
    <View style={styles.infoRow}>
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        placeholderTextColor="#aaa"
      />
    </View>
    {rating !== undefined && (
      <View style={styles.infoRow}>
        <Text style={styles.label}>Rating</Text>
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
  ratingContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
});

export default AboutMeSection; 