import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function JobSearchBar() {
  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={18} color="#9B5DE5" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search for Jobs"
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 8,
    height: 40,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#333' },
}); 