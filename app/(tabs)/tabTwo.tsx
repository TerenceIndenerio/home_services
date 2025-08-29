import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import Header from "../home/components/Header";
import MessagesList, { MessageItem } from "../Messages/components/MessagesList";

import { useRouter } from "expo-router";
// Chat context for global chat data
export const ChatContext = React.createContext({ chats: {} as any, setChats: (_: any) => {} });

const screenWidth = Dimensions.get("window").width;

const HomeScreen: React.FC = () => {
  const { chats, setChats } = useContext(ChatContext);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const messages: MessageItem[] = [
    {
      id: '1',
      name: 'Matt Dawner',
      message: "No problem at all! I'll be there in 15 minutes and I'll text you when I...",
      time: '2:17 PM',
      avatar: { uri: 'https://randomuser.me/api/portraits/men/42.jpg' }, // Use a valid image
    },
    {
      id: '2',
      name: 'Jay Noman',
      message: "No problem at all! I'll be there in 15 minutes and I'll text you when I...",
      time: '2:17 PM',
      avatar: { uri: 'https://randomuser.me/api/portraits/men/45.jpg' }, // Use a valid image
    },
  ];

  // Example chat messages per user (replace with your DB logic)
  const chatMessages = {
    '1': [
      { id: "1", text: "This is your electrician. I'm just around the corner from your place. 😊", time: "10:10", sent: false },
      { id: "2", text: "Hi!", time: "10:10", sent: true },
      { id: "3", text: "Awesome, thanks for letting me know! Can't wait for plugs to fix.", time: "10:11", sent: true },
      { id: "4", text: "No problem at all!\nI'll be there in about 15 minutes.", time: "10:11", sent: false },
      { id: "5", text: "I'll text you when I arrive.", time: "10:11", sent: false },
      { id: "6", text: "Great! 😊", time: "10:12", sent: true },
    ],
    '2': [
      { id: "1", text: "Hey Jay, are you on your way?", time: "11:00", sent: true },
      { id: "2", text: "Yes, I'll be there soon!", time: "11:01", sent: false },
    ],
  };

  // On mount, store chat messages in context
  React.useEffect(() => {
    setChats(chatMessages);
  }, []);

  const handlePressItem = (item: MessageItem) => {
    router.push({
      pathname: "Messages/components/ChatScreen",
      params: {
        chatId: item.id,
        userName: item.name,
        userRole: "Electrician", // Or dynamic role
        userAvatar: item.avatar,
      }
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Fixed Header */}
      <View style={styles.headerWrapper}>
        <Header />
      </View>

      <View style={styles.contentWrapper}>
        <MessagesList 
          messages={messages} 
          onPressItem={handlePressItem}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 140,
    paddingBottom: 100,
    width: screenWidth,
    backgroundColor: "#fff",
  },
});

// Wrap export with ChatContext provider
export default function HomeScreenWithProvider(props: any) {
  const [chats, setChats] = React.useState({});
  return (
    <ChatContext.Provider value={{ chats, setChats }}>
      <HomeScreen {...props} />
    </ChatContext.Provider>
  );
}
