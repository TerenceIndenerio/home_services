import React from 'react';
import { ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { YStack, Text } from 'tamagui';

interface LoaderProps {
  visible: boolean;
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  visible,
  text = 'Loading...',
  size = 'large',
  color = '#8B5CF6'
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <YStack style={styles.overlay}>
        <YStack style={styles.container}>
          <ActivityIndicator size={size} color={color} />
          <Text style={styles.text}>{text}</Text>
        </YStack>
      </YStack>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Loader;