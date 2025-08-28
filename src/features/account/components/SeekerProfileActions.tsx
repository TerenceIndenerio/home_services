import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SeekerProfileActions: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionBtn}>
        <Icon name="create-outline" size={20} color="#8F5CFF" />
        <Text style={styles.actionText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn}>
        <Icon name="key-outline" size={20} color="#8F5CFF" />
        <Text style={styles.actionText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn}>
        <Icon name="log-out-outline" size={20} color="#D32F2F" />
        <Text style={[styles.actionText, { color: '#D32F2F' }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#222',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default SeekerProfileActions; 