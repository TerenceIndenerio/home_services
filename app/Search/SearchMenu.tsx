import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // adjust path if needed
import SearchBar from './components/SearchBar';
import PopularSearchSection from './components/PopularSearchSection';
import TopServiceSection from './components/TopServiceSection';

const SearchMenu = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);

    try {
      // Firestore query (jobTitle search)
      const seekersRef = collection(db, 'seekers');
      const q = query(
        seekersRef,
        where('profile.jobTitle', '>=', searchQuery),
        where('profile.jobTitle', '<=', searchQuery + '\uf8ff')
      );

      const snapshot = await getDocs(q);
      const seekers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (seekers.length === 0) {
        Alert.alert('No results', 'No seekers match your search');
      } else {
        // Navigate with query parameter
        router.push({
          pathname: '/Search/SearchResults',
          params: { query: searchQuery }, // will become ?query=Electrical
        });
      }
    } catch (error) {
      console.error('Error fetching seekers:', error);
      Alert.alert('Error', 'Something went wrong while searching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          Placeholder="Search for services or providers"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
          <Text style={styles.searchButtonText}>{loading ? 'Searching...' : 'Search'}</Text>
        </TouchableOpacity>
      </View>

      <PopularSearchSection />
      <TopServiceSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: '#8C52FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 12,
    shadowColor: '#8C52FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SearchMenu;
