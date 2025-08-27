import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function JobTabBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Jobs For You')}>
        <Text style={[styles.tabText, activeTab === 'Jobs For You' && styles.activeTabText]}>Jobs For You</Text>
        {activeTab === 'Jobs For You' && <View style={styles.underline} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('Bookmark Jobs')}>
        <Text style={[styles.tabText, activeTab === 'Bookmark Jobs' && styles.activeTabText]}>Bookmark Jobs</Text>
        {activeTab === 'Bookmark Jobs' && <View style={styles.underline} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, borderBottomWidth: 1, borderColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  tabText: { fontSize: 15, color: '#888' },
  activeTabText: { color: '#9B5DE5', fontWeight: 'bold' },
  underline: { height: 3, backgroundColor: '#9B5DE5', width: '80%', borderRadius: 2, marginTop: 4 },
}); 