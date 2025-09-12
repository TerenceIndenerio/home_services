import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AvailabilityStatus from '@/src/features/seeker/components/AvailabilityStatus';

interface HeaderProps {
  status: 'Available' | 'Not Available';
  onToggleStatus?: () => void;
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ status, onToggleStatus, onMenuPress }) => {
  return (
    <YStack
      backgroundColor="$background"
      paddingTop={50}
      paddingBottom="$5"
      paddingHorizontal="$4"
      borderBottomWidth={1}
      borderBottomColor="$gray6"
    >
      <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          onPress={onMenuPress}
          pressStyle={{ opacity: 0.8 }}
        >
          <FontAwesome name="bars" size={24} color="$color" />
        </Button>
        <YStack flex={1} alignItems="center">
          <Text fontSize="$5" fontWeight="bold" color="$color">Dashboard</Text>
        </YStack>
        <Button
          size="$3"
          circular
          backgroundColor="transparent"
          pressStyle={{ opacity: 0.8 }}
        >
          <FontAwesome name="bell" size={24} color="$color" />
        </Button>
      </XStack>

      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$4" color="$gray11">Welcome back!</Text>
        <AvailabilityStatus status={status} onToggle={onToggleStatus} />
      </XStack>
    </YStack>
  );
};

export default Header; 