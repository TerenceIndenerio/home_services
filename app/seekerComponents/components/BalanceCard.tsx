import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface BalanceCardProps {
  balance: number;
  style?: ViewStyle;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Balance</Text>
        <FontAwesome name="eye" size={16} color="#666" />
      </View>
      <Text style={styles.balance}>₱{balance.toLocaleString()}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Available for withdrawal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
});

export default BalanceCard; 