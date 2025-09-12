import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { YStack, Text } from 'tamagui';

export default function JobTabBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <YStack style={styles.tabBar}>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Jobs For You')}>
        <Text style={[styles.tabText, activeTab === 'Jobs For You' && styles.activeTabText]}>Jobs For You</Text>
        {activeTab === 'Jobs For You' && <YStack style={styles.underline} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Accepted Jobs')}>
        <Text style={[styles.tabText, activeTab === 'Accepted Jobs' && styles.activeTabText]}>Accepted Jobs</Text>
        {activeTab === 'Accepted Jobs' && <YStack style={styles.underline} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('On Going Job')}>
        <Text style={[styles.tabText, activeTab === 'On Going Job' && styles.activeTabText]}>On Going Job</Text>
        {activeTab === 'On Going Job' && <YStack style={styles.underline} />}
      </TouchableOpacity>
    </YStack>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, borderBottomWidth: 1, borderColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  tabText: { fontSize: 15, color: '#888' },
  activeTabText: { color: '#9B5DE5', fontWeight: 'bold' },
  underline: { height: 3, backgroundColor: '#9B5DE5', width: '80%', borderRadius: 2, marginTop: 4 },
}); 