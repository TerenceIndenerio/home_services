import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { YStack, Text } from 'tamagui';
import SearchBar from '@/app/Search/components/SearchBar';
import SearchResultCard from '@/app/Search/components/SearchResultCard';
import SearchResultsFilterBar from '@/app/Search/components/SearchResultsFilterBar';
import { router } from 'expo-router';

type Provider = {
  id: string;
  name: string;
  rating: number;
  job: string;
  address: string;
  image: string;
};

const SearchResultsScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ params: { query: string } }, 'params'>>();
  const initialQuery = route.params?.query || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResults = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      // Firestore query: only active seekers, partial match on jobCategory
      const q = query(
        collection(db, 'users'),
        where('accountType', '==', 'seeker'),
        where('isActive', '==', true),
        orderBy('jobCategory'),
        startAt(searchQuery),
        endAt(searchQuery + '\uf8ff')
      );

      const snapshot = await getDocs(q);
      const data: Provider[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: `${d.firstName} ${d.lastName}`,
          rating: d.rating || 0,
          job: d.jobTitle || d.jobCategory || 'N/A',
          address: d.address || 'No address provided',
          image: d.profileImageUrl || '',
        };
      });

      setResults(data);
    } catch (err) {
      console.error('Error fetching results:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [searchQuery]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchResults().finally(() => {
      setRefreshing(false);
    });
  }, [searchQuery]);

  return (
    <YStack style={styles.container}>
      <YStack style={styles.headerRow}>
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

        <SearchBar
          value={searchQuery}
          Placeholder="Search..."
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          onPress={fetchResults}
        />
      </YStack>

      <Text style={styles.resultsCount}>
        {results.length} results for{' '}
        <Text style={{ fontWeight: 'bold' }}>"{searchQuery}"</Text>
      </Text>

      <SearchResultsFilterBar />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <SearchResultCard
              name={item.name}
              rating={item.rating}
              job={item.job}
              address={item.address}
              image={item.image}
              onPress={() =>
                router.push({
                  pathname: '/ViewProfile/',
                  params: {
                    id: item.id,
                    title: item.name,
                    provider: item.job,
                    rating: item.rating,
                    imageUrl: item.image,
                    about: item.address,
                  },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8B5CF6']}
              tintColor="#8B5CF6"
            />
          }
        />
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
    marginLeft: 6,
  },
});

export default SearchResultsScreen;
