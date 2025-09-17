import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function JobTabBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <YStack style={styles.tabBar}>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Jobs For You')}>
        <YStack style={styles.tabContent}>
          <Ionicons name="briefcase-outline" size={20} color={activeTab === 'Jobs For You' ? '#9B5DE5' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'Jobs For You' && styles.activeTabText]}>Jobs For You</Text>
        </YStack>
        {activeTab === 'Jobs For You' && <YStack style={styles.underline} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Accepted Jobs')}>
        <YStack style={styles.tabContent}>
          <Ionicons name="checkmark-circle-outline" size={20} color={activeTab === 'Accepted Jobs' ? '#9B5DE5' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'Accepted Jobs' && styles.activeTabText]}>Accepted Jobs</Text>
        </YStack>
        {activeTab === 'Accepted Jobs' && <YStack style={styles.underline} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('On Going Job')}>
        <YStack style={styles.tabContent}>
          <Ionicons name="time-outline" size={20} color={activeTab === 'On Going Job' ? '#9B5DE5' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'On Going Job' && styles.activeTabText]}>On Going Job</Text>
        </YStack>
        {activeTab === 'On Going Job' && <YStack style={styles.underline} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Find Jobs')}>
        <YStack style={styles.tabContent}>
          <Ionicons name="search-outline" size={20} color={activeTab === 'Find Jobs' ? '#9B5DE5' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'Find Jobs' && styles.activeTabText]}>Find Jobs</Text>
        </YStack>
        {activeTab === 'Find Jobs' && <YStack style={styles.underline} />}
      </TouchableOpacity>
    </YStack>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  tabContent: { alignItems: 'center', gap: 4 },
  tabText: { fontSize: 12, color: '#888' },
  activeTabText: { color: '#9B5DE5', fontWeight: 'bold' },
  underline: { height: 3, backgroundColor: '#9B5DE5', width: '80%', borderRadius: 2, marginTop: 4 },
});