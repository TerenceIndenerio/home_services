import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface BalanceCardProps {
  balance: number;
  style?: any;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, style }) => {
  return (
    <YStack
      backgroundColor="$purple9"
      borderRadius="$4"
      padding="$5"
      marginHorizontal="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.25}
      shadowRadius={4}
      elevation={5}
      style={style}
    >
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
        <Text fontSize="$4" color="$background" opacity={0.9}>Current Balance</Text>
        <FontAwesome name="eye" size={16} color="#666" />
      </XStack>
      <Text fontSize="$8" fontWeight="bold" color="$background" marginBottom="$2">
        ₱{balance.toLocaleString()}
      </Text>
      <XStack alignItems="center">
        <Text fontSize="$3" color="$background" opacity={0.8}>Available for withdrawal</Text>
      </XStack>
    </YStack>
  );
};

export default BalanceCard; 