import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SeekerProfileInfo from './component/SeekerProfileInfo';
import SeekerProfileActions from './component/SeekerProfileActions';

const SeekerProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Matt Dawner</Text>
        <Text style={styles.subtitle}>Seeker Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Icon name="pencil" size={18} color="#8F5CFF" />
        </TouchableOpacity>
      </View>
      <SeekerProfileInfo />
      <SeekerProfileActions />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#EAE6FF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#8F5CFF',
    marginTop: 4,
    marginBottom: 8,
  },
  editBtn: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
});

export default SeekerProfileScreen; 