import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AvailabilityStatus from './AvailabilityStatus';

interface HeaderProps {
  status: 'Available' | 'Not Available';
  onToggleStatus?: () => void;
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ status, onToggleStatus, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <FontAwesome name="bars" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <FontAwesome name="bell" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <AvailabilityStatus status={status} onToggle={onToggleStatus} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    padding: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Header; 