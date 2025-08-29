import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import ChatScreen, { ChatMessage } from '@/app/Messages/ChatScreen';

const mockChat: ChatMessage[] = [
  {
    id: '1',
    text: 'Hi!',
    time: '10:10',
    sent: true,
  },
  {
    id: '2',
    text: "Awesome, thanks for letting me know! Can't wait for plugs to fix.",
    time: '10:11',
    sent: true,
  },
  {
    id: '3',
    text: 'No problem at all! I\'ll be there in about 15 minutes.',
    time: '10:11',
    sent: false,
  },
  {
    id: '4',
    text: 'I\'ll text you when I arrive.',
    time: '10:11',
    sent: false,
  },
  {
    id: '5',
    text: 'Great! 😊',
    time: '10:12',
    sent: true,
  },
];

export default function SeekerChatPage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  // Fallbacks for demo
  const userName = params.userName || 'Arabela Manuta';
  const userRole = params.userRole || 'Client';
  const userAvatar = params.userAvatar || { uri: 'https://randomuser.me/api/portraits/women/44.jpg' };

  return (
    <ChatScreen
      messages={mockChat}
      userName={userName as string}
      userRole={userRole as string}
      userAvatar={userAvatar}
      onSend={() => {}}
    />
  );
} 