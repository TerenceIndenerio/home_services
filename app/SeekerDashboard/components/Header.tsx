import React from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AvailabilityStatus from './AvailabilityStatus';

interface HeaderProps {
  status: string;
}

const Header: React.FC<HeaderProps> = ({ status }) => (
  <View style={styles.headerRow}>
    <AvailabilityStatus status={status} />
    <View style={styles.bellContainer}>
      <FontAwesome name="bell-o" size={20} color="#8B5CF6" />
      <View style={styles.redDot} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    height: 150,
  },
  bellContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: '#fff',
  },
  
});

export default Header; 