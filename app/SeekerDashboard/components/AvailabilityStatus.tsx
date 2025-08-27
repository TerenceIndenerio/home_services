import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

type Props = {
  status: string;
};

const AvailabilityStatus: React.FC<Props> = ({ status }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Switch value={false} disabled style={styles.switch} />
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default AvailabilityStatus; 