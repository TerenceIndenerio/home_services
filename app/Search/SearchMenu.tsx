import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import SearchBar from '@/app/Search/components/SearchBar';
import PopularSearchSection from '@/app/Search/components/PopularSearchSection';
import TopServiceSection from '@/app/Search/components/TopServiceSection';

const SearchMenu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return Alert.alert('Please enter a search term');

    try {
      // Step 1: Get all seekers who are active job seekers
      const q = query(
        collection(db, 'users'),
        where('accountType', '==', 'seeker'),
        where('isJobSeeker', '==', true),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      let seekers: any[] = [];
      snapshot.forEach(doc => {
        seekers.push({ id: doc.id, ...doc.data() });
      });

      if (seekers.length === 0) {
        Alert.alert('No matching job seekers found');
        return;
      }

      // Step 2: Let AI rank them by best match for the search term
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a recommendation engine that ranks job seekers based on a search query and their profile details.'
            },
            {
              role: 'user',
              content: `Search term: "${searchQuery}". Here is the list of seekers in JSON format: ${JSON.stringify(seekers)}. Rank them from best to least relevant for this job type. Return only an array of seeker IDs in ranked order.`
            }
          ]
        })
      });

      const aiData = await aiResponse.json();
      const rankedIds = JSON.parse(aiData.choices[0].message.content);

      // Step 3: Sort seekers according to AI ranking
      const rankedSeekers = rankedIds
        .map(id => seekers.find(seeker => seeker.id === id))
        .filter(Boolean);

      // Step 4: Navigate to results screen
      navigation.navigate('Search/SearchResults', {
        query: searchQuery,
        results: rankedSeekers
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Error searching');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            try {
              if (navigation.canGoBack && navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Home' as never);
              }
            } catch {
              navigation.navigate('Home' as never);
            }
          }}
        >
          <Icon name="arrow-back-outline" size={20} color="#222" />
        </TouchableOpacity>

        {/* Search Field */}
        <SearchBar
          Placeholder="Search for services or providers"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        {/* Filter Icon */}
        <TouchableOpacity>
          <Icon name="options-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>

      <PopularSearchSection />
      <TopServiceSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 14,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SearchMenu;
