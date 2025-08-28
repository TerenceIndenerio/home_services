import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MessagesList, { MessageItem } from '@/app/Messages/components/MessagesList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const mockMessages = [
  {
    id: '1',
    name: 'John Doe',
    message: 'Hi, I need help with electrical work. Are you available?',
    time: '2:30 PM',
    avatar: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    message: 'Thanks for the great service yesterday!',
    time: '1:45 PM',
    avatar: null,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    message: 'Can you come over tomorrow for a consultation?',
    time: '11:20 AM',
    avatar: null,
  },
];

function MessagesHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Messages</Text>
      <TouchableOpacity style={styles.searchIcon}>
        <Ionicons name="search" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function SeekerMessagesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handlePressItem = (item: MessageItem) => {
    router.push({
      pathname: '/Messages/chat',
      params: {
        userName: item.name,
        userRole: 'Client',
        userAvatar: item.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
      },
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add any data fetching logic here
    // For example, refetch messages
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MessagesHeader />
      <MessagesList 
        messages={mockMessages} 
        onPressItem={handlePressItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#8B5CF6',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    position: 'relative',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: '55%',
    transform: [{ translateY: -10 }],
    padding: 4,
  },
  messageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.08)",
  },
}); 