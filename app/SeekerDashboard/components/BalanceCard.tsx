import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  balance: number;
  style?: ViewStyle;
};

const BalanceCard: React.FC<Props> = ({ balance, style }) => {
  return (
    <LinearGradient
      colors={['#A4A4F7', '#8D8DF3', '#7373EF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      <Text style={styles.label}>Balance</Text>
      <Text style={styles.balance}>₦ {balance.toLocaleString()}</Text>
      <TouchableOpacity style={styles.topUpButton}>
        <Text style={styles.topUpText}>Top up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  balance: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  topUpText: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BalanceCard; 