import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ContactClientCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>Get in touch with your job seeker</Text>
        <Text style={styles.subtitle}>Request contactless service</Text>
      </View>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💬</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.05)",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0D7FF',
  },
  avatar: { fontSize: 24 },
  info: { flex: 1 },
  title: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  subtitle: { color: '#888', fontSize: 13 },
  iconContainer: {
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E0D7FF',
  },
  icon: { fontSize: 20, color: '#7B61FF' },
});

export default ContactClientCard; 