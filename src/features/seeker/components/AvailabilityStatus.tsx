import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface AvailabilityStatusProps {
  status: 'Available' | 'Not Available';
  onToggle?: () => void;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({ status, onToggle }) => {
  const isAvailable = status === 'Available';
  
  return (
    <TouchableOpacity 
      style={[styles.container, isAvailable ? styles.available : styles.notAvailable]} 
      onPress={onToggle}
    >
      <FontAwesome 
        name={isAvailable ? 'check-circle' : 'times-circle'} 
        size={16} 
        color={isAvailable ? '#4CAF50' : '#F44336'} 
      />
      <Text style={[styles.text, isAvailable ? styles.availableText : styles.notAvailableText]}>
        {status}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 16,
  },
  available: {
    backgroundColor: '#E8F5E8',
  },
  notAvailable: {
    backgroundColor: '#FFEBEE',
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  availableText: {
    color: '#4CAF50',
  },
  notAvailableText: {
    color: '#F44336',
  },
});

export default AvailabilityStatus; 