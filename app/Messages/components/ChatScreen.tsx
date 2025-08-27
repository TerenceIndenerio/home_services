import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export type ChatMessage = {
  id: string;
  text: string;
  time: string;
  sent: boolean;
};

type ChatScreenProps = {
  messages: ChatMessage[];
  userName: string;
  userRole: string;
  userAvatar?: any; // ImageSourcePropType or undefined
  onSend?: (text: string) => void;
};

const FALLBACK_AVATAR_URL = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=50&q=80';

const ChatScreen: React.FC<ChatScreenProps> = ({
  messages = [],
  userName,
  userRole,
  userAvatar,
  onSend,
}) => {
  const [inputText, setInputText] = useState('');
  const [tempName, setTempName] = useState(userName || 'Unknown User');
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add any data fetching logic here
    // For example, refetch messages
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && onSend) {
      onSend(inputText.trim());
      setInputText("");
    }
  };

  const renderAvatar = () => {
    if (userAvatar) {
      return <Image source={userAvatar} style={styles.avatar} />;
    }
    // Fallback: show remote image
    return (
      <Image source={{ uri: FALLBACK_AVATAR_URL }} style={styles.avatar} />
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isSent = item.sent;
    return (
      <View
        style={[
          styles.messageRow,
          isSent ? styles.messageRowSent : styles.messageRowReceived,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isSent ? styles.bubbleSent : styles.bubbleReceived,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSent ? styles.textSent : styles.textReceived,
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.timeRow}>
            <Text
              style={[
                styles.time,
                isSent ? styles.timeSent : styles.timeReceived,
              ]}
            >
              {item.time}
            </Text>
            {isSent && (
              <Ionicons
                name="checkmark-done"
                size={16}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Try to go back, but if not possible, go to home
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
          style={styles.headerBackBtn}
        >
          <Ionicons name="arrow-back" size={28} color="#8B5CF6" />
        </TouchableOpacity>
        {renderAvatar()}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{tempName}</Text>
          <Text style={styles.role}>{userRole}</Text>
        </View>
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <Ionicons name="call-outline" size={26} color="#2e2e2e" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={26} color="#2e2e2e" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8B5CF6"]}
            tintColor="#8B5CF6"
          />
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#b0b0b0"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Ionicons name="send" size={26} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2,
  },
  headerBackBtn: {
    marginRight: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  role: {
    fontSize: 14,
    color: "#A0A0B0",
    marginTop: 2,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 12,
    flexGrow: 1,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageRowSent: {
    justifyContent: "flex-end",
  },
  messageRowReceived: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleSent: {
    backgroundColor: "#8B5CF6",
    borderBottomRightRadius: 6,
    alignSelf: "flex-end",
  },
  bubbleReceived: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 8,
  },
  textSent: {
    color: "#fff",
  },
  textReceived: {
    color: "#222",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  time: {
    fontSize: 13,
    opacity: 0.5,
  },
  timeSent: {
    color: "#fff",
  },
  timeReceived: {
    color: "#222",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#F4F4F8",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    color: "#222",
    height: 44,
  },
  sendBtn: {
    backgroundColor: "transparent",
    padding: 4,
    borderRadius: 20,
  },
});

export default ChatScreen;