import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookmarkJobsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bookmarked Jobs will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#888' },
}); 