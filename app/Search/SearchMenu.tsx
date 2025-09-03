import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import SearchBar from './components/SearchBar';
import PopularSearchSection from './components/PopularSearchSection';
import TopServiceSection from './components/TopServiceSection';

type RootStackParamList = {
  'Search/SearchResults': {
    query: string;
    results: any[];
  };
};

const SearchMenu = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

  const seekers = [
    {
      id: '1',
      firstName: 'Matt',
      lastName: 'Dawner',
      profile: {
        jobTitle: 'Electrician',
        ratings: 4.8,
        yearsOfExperience: 5,
        skills: ['Electrical wiring', 'Circuit repair', 'Installation'],
        location: 'Antipolo, Rizal'
      }
    },
    {
      id: '2',
      firstName: 'Jay',
      lastName: 'Noman',
      profile: {
        jobTitle: 'Plumber',
        ratings: 4.6,
        yearsOfExperience: 3,
        skills: ['Pipe repair', 'Drainage', 'Installation'],
        location: 'Cainta, Rizal'
      }
    },
    {
      id: '3',
      firstName: 'Fiona',
      lastName: 'Harke',
      profile: {
        jobTitle: 'Carpenter',
        ratings: 4.9,
        yearsOfExperience: 7,
        skills: ['Woodworking', 'Furniture repair', 'Installation'],
        location: 'Binangonan, Rizal'
      }
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    try {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
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

      const rankedSeekers = rankedIds
        .map((id: string) => seekers.find(seeker => seeker.id === id))
        .filter(Boolean);

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
        <SearchBar
          Placeholder="Search for services or providers"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
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
