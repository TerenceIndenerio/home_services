import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, Text, Button, Input, ScrollView, Card, Image, Theme, Select, Adapt, Sheet } from 'tamagui';
import ServiceCard from '../../src/features/home/components/ServiceCard';

const db = getFirestore(app);

const RATING_FILTERS = [5, 4, 3, 2, 1];
const SORT_OPTIONS = [
  { key: 'relevance', label: 'Relevance', icon: 'flash' },
  { key: 'rating', label: 'Rating', icon: 'star' },
  { key: 'experience', label: 'Experience', icon: 'briefcase' },
];

const CategoryUsersScreen: React.FC = () => {
  const { category, name, exampleServices } = useLocalSearchParams();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [minRating, setMinRating] = useState<string>("any");
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'experience'>('relevance');

  const exampleServicesArr = typeof exampleServices === 'string' ? exampleServices.split(',') : [];
  let categoryName = '';
  if (typeof name === 'string') {
    categoryName = name;
  } else if (typeof category === 'string') {
    categoryName = category;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('isJobSeeker', '==', true));
      const querySnapshot = await getDocs(q);
      const userList: any[] = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
      const filtered = userList.filter(user => {
        const jobTitle = (user.profile.jobTitle || '').toLowerCase();
        if (jobTitle.includes(categoryName.toLowerCase())) return true;
        return exampleServicesArr.some(service => jobTitle.includes(service.toLowerCase()));
      });
      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [categoryName, exampleServices]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUsers().finally(() => {
      setRefreshing(false);
    });
  }, [categoryName, exampleServices]);

  const getFilteredUsers = () => {
    let filtered = users;
    if (searchName.trim()) {
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        return fullName.includes(searchName.trim().toLowerCase());
      });
    }
    if (minRating !== "any") {
      const min = parseInt(minRating);
      filtered = filtered.filter(user => {
        const rating = Number(user.profile?.ratings) || 0;
        return rating >= min;
      });
    }
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (Number(b.profile?.ratings) || 0) - (Number(a.profile?.ratings) || 0));
    } else if (sortBy === 'experience') {
      filtered = [...filtered].sort((a, b) => (Number(b.profile?.yearsOfExperience) || 0) - (Number(a.profile?.yearsOfExperience) || 0));
    } else if (sortBy === 'relevance') {
      filtered = [...filtered].sort((a, b) => {
        const jobA = (a.profile?.jobTitle || '').toLowerCase();
        const jobB = (b.profile?.jobTitle || '').toLowerCase();
        const cat = categoryName.toLowerCase();
        const relevanceA = jobA.includes(cat) ? 1 : 0;
        const relevanceB = jobB.includes(cat) ? 1 : 0;
        return relevanceB - relevanceA;
      });
    }
    return filtered;
  };

  const handleClearFilters = () => {
    setSearchName('');
    setMinRating("any");
    setSortBy('relevance');
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Ionicons name="people" size={48} color="$color" style={{ marginBottom: 16 }} />
        <ActivityIndicator size="large" color="$color" />
        <Text fontSize="$4" color="$color" marginTop="$2">Finding job seekers...</Text>
      </YStack>
    );
  }

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor="$background" paddingTop={(StatusBar.currentHeight || 0) + 16}>
        <Button
          position="absolute"
          top={(StatusBar.currentHeight || 0) + 16}
          left="$4"
          zIndex={10}
          size="$3"
          circular
          backgroundColor="$background"
          borderColor="$borderColor"
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={24} color="$color" />
        </Button>

        <YStack paddingHorizontal="$4" paddingTop="$5" paddingBottom="$3">
          <Text fontSize="$7" fontWeight="bold" color="$color" textAlign="center">
            Job Seekers for {categoryName}
          </Text>
        </YStack>

        <XStack
          alignItems="center"
          backgroundColor="$gray2"
          marginHorizontal="$4"
          borderRadius="$4"
          paddingVertical="$2"
          marginBottom="$3"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <Ionicons name="search-outline" size={22} color="$color" style={{ marginLeft: 12, marginRight: 6 }} />
          <Input
            flex={1}
            fontSize="$4"
            color="$color"
            placeholder="Search by name"
            placeholderTextColor="$color"
            value={searchName}
            onChangeText={setSearchName}
            returnKeyType="search"
            borderWidth={0}
            backgroundColor="transparent"
          />
          {searchName.length > 0 && (
            <Button
              size="$2"
              circular
              backgroundColor="transparent"
              onPress={() => setSearchName('')}
              marginRight="$3"
            >
              <Ionicons name="close-circle" size={20} color="$color" />
            </Button>
          )}
        </XStack>

        <XStack paddingHorizontal="$4" marginBottom="$4" gap="$3" alignItems="center">
          <Select value={minRating} onValueChange={setMinRating}>
            <Select.Trigger width={120} backgroundColor="$gray2" borderColor="$borderColor">
              <Select.Value placeholder="Rating" />
            </Select.Trigger>
            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton />
              <Select.Viewport>
                <Select.Group>
                  <Select.Label>Minimum Rating</Select.Label>
                  <Select.Item value="any" index={0}>
                    <Select.ItemText>Any</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Ionicons name="checkmark" size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                  {RATING_FILTERS.map((r, index) => (
                    <Select.Item key={r} value={r.toString()} index={index + 1}>
                      <Select.ItemText>Min {r}+</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Ionicons name="checkmark" size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton />
            </Select.Content>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <Select.Trigger width={120} backgroundColor="$gray2" borderColor="$borderColor">
              <Select.Value placeholder="Sort by" />
            </Select.Trigger>
            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton />
              <Select.Viewport>
                <Select.Group>
                  <Select.Label>Sort By</Select.Label>
                  {SORT_OPTIONS.map((opt, index) => (
                    <Select.Item key={opt.key} value={opt.key} index={index}>
                      <Select.ItemText>{opt.label}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Ionicons name="checkmark" size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton />
            </Select.Content>
          </Select>

          <Button
            size="$3"
            backgroundColor="$background"
            borderColor="$color"
            onPress={handleClearFilters}
            icon={<Ionicons name="close" size={16} color="$color" />}
          >
            <Text fontSize="$2" color="$color">Clear</Text>
          </Button>
        </XStack>

        <FlatList
          data={getFilteredUsers()}
          numColumns={2}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <YStack width="48%" margin="$2" height={220}>
              <ServiceCard
                imageUrl={item.profile?.profilePictureUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=183&q=80"}
                title={item.profile?.jobTitle || "Service Provider"}
                provider={`By ${item.firstName || ''} ${item.lastName || ''}`.trim()}
                rating={item.profile?.ratings?.toString() || "N/A"}
                onPress={() => router.push({ pathname: "/ViewProfile/[id]", params: { id: item.id } })}
              />
            </YStack>
          )}
          ListEmptyComponent={
            <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$10">
              <Ionicons name="search" size={48} color="$color" style={{ marginBottom: 16 }} />
              <Text fontSize="$4" color="$color" textAlign="center" fontWeight="500">
                No job seekers found for this category.
              </Text>
              <Text fontSize="$3" color="$color" textAlign="center" marginTop="$2">
                Try adjusting your search or filters.
              </Text>
            </YStack>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </YStack>
    </Theme>
  );
};

export default CategoryUsersScreen;