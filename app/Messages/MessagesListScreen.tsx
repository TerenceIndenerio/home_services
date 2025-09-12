import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { YStack, Text } from 'tamagui';


export type MessageItem = {
    id: string;
    name: string;
    message: string;
    time: string;
    avatar: any; 
    onPress?: () => void;
};

type MessagesListProps = {
    messages: MessageItem[];
    onPressItem?: (item: MessageItem) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
};

const MessagesList: React.FC<MessagesListProps> = ({ 
    messages, 
    onPressItem, 
    onRefresh, 
    refreshing = false 
}) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const renderAvatar = (item: MessageItem) => {
        if (item.avatar) {
            return <Image source={item.avatar} style={styles.avatar} />;
        } else {
            return (
                <YStack style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </YStack>
            );
        }
    };

    const renderItem = ({ item }: { item: MessageItem }) => (
        <TouchableOpacity style={styles.row} onPress={() => onPressItem?.(item)}>
            <YStack style={styles.avatarContainer}>
                {renderAvatar(item)}
            </YStack>
            <YStack style={styles.content}>
                <YStack style={styles.header}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </YStack>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </YStack>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <YStack style={styles.separator} />}
            contentContainerStyle={{ backgroundColor: '#fff', paddingTop: 8 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#8B5CF6"]}
                    tintColor="#8B5CF6"
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        borderWidth: 2,
        borderColor: '#8B5CF6',
        borderRadius: 32,
        padding: 2,
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        borderBottomWidth: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B5CF6',
        flex: 1,
    },
    time: {
        fontSize: 15,
        color: '#888',
        marginLeft: 8,
    },
    message: {
        fontSize: 15,
        color: '#222',
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginLeft: 76,
    },
});

export default MessagesList;