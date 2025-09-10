import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
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
  const [minRating, setMinRating] = useState<number | null>(null);
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
    if (minRating) {
      filtered = filtered.filter(user => {
        const rating = Number(user.profile?.ratings) || 0;
        return rating >= minRating;
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
    setMinRating(null);
    setSortBy('relevance');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="people" size={48} color={Colors.primary} style={{ marginBottom: 16 }} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finding job seekers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/')} style={styles.goBackButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Job Seekers for {categoryName}</Text>
      </View>
      
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search-outline" size={22} color={Colors.primary} style={{ marginLeft: 12, marginRight: 6 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name"
          placeholderTextColor={Colors.textSecondary}
          value={searchName}
          onChangeText={setSearchName}
          returnKeyType="search"
        />
        {searchName.length > 0 && (
          <TouchableOpacity onPress={() => setSearchName('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} style={{ marginRight: 12 }} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipBar}>
        <View style={styles.filterChipRow}>
          {RATING_FILTERS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.filterChip, minRating === r && styles.filterChipActive]}
              onPress={() => setMinRating(minRating === r ? null : r)}
            >
              <Ionicons name="star" size={16} color={minRating === r ? Colors.background : Colors.secondary} style={{ marginRight: 3 }} />
              <Text style={[styles.filterChipText, minRating === r && { color: Colors.background }]}>Min {r}+</Text>
            </TouchableOpacity>
          ))}
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.filterChip, sortBy === opt.key && styles.filterChipActive]}
              onPress={() => setSortBy(opt.key as any)}
            >
              <Ionicons name={opt.icon as any} size={16} color={sortBy === opt.key ? Colors.background : Colors.primary} style={{ marginRight: 3 }} />
              <Text style={[styles.filterChipText, sortBy === opt.key && { color: Colors.background }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.clearChip} onPress={handleClearFilters}>
            <Ionicons name="close" size={16} color={Colors.primary} style={{ marginRight: 3 }} />
            <Text style={styles.clearChipText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <FlatList
        data={getFilteredUsers()}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ServiceCard
              imageUrl={item.profile?.profilePictureUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=183&q=80"}
              title={item.profile?.jobTitle || "Service Provider"}
              provider={`By ${item.firstName || ''} ${item.lastName || ''}`.trim()}
              rating={item.profile?.ratings?.toString() || "N/A"}
              onPress={() => router.push({ pathname: "/ViewProfile/[id]", params: { id: item.id } })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyStateWrapper}>
            <Ionicons name="search" size={48} color={Colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No job seekers found for this category.</Text>
            <Text style={[styles.emptyText, { fontSize: 14, marginTop: 8 }]}>Try adjusting your search or filters.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: (StatusBar.currentHeight || 0) + 16,
    paddingHorizontal: 0,
  },
  goBackButton: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 0) + 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 8,
  },
  filterChipBar: {
    marginBottom: 20,
  },
  filterChipRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 70,
    height: 32,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    minWidth: 70,
    height: 32,
    justifyContent: 'center',
  },
  clearChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardWrapper: {
    width: '48%',
    margin: 8,
    height: 220,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default CategoryUsersScreen; 