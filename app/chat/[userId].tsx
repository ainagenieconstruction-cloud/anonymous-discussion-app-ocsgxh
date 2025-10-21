
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Message } from '@/types/User';
import { generateMockMessages } from '@/data/mockMessages';
import { getMockUser } from '@/data/mockUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState(getMockUser(userId || ''));
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (userId) {
      loadMessages();
    }
  }, [userId]);

  const loadMessages = () => {
    const mockMessages = generateMockMessages(userId || '', 20);
    setMessages(mockMessages);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'current-user',
        receiverId: userId || '',
        content: inputText.trim(),
        type: 'text',
        timestamp: new Date(),
        read: false,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'current-user',
        receiverId: userId || '',
        content: asset.type === 'video' ? 'Video message' : 'Image message',
        type: asset.type === 'video' ? 'video' : 'image',
        mediaUrl: asset.uri,
        timestamp: new Date(),
        read: false,
      };
      setMessages([...messages, newMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleVoiceCall = () => {
    if (!isSubscribed) {
      Alert.alert(
        'Premium Feature',
        'Voice calls require a Premium subscription. Subscribe to send friend requests and unlock voice calls.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    if (user?.isFriend) {
      Alert.alert('Voice Call', 'Voice calling feature coming soon!');
    } else {
      Alert.alert(
        'Friend Required',
        'You need to be friends with this user to make voice calls. Send a friend request first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Request', onPress: handleFriendRequest },
        ]
      );
    }
  };

  const handleVideoCall = () => {
    if (!isSubscribed) {
      Alert.alert(
        'Premium Feature',
        'Video calls require a Premium subscription. Subscribe to send friend requests and unlock video calls.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    if (user?.isFriend) {
      Alert.alert('Video Call', 'Video calling feature coming soon!');
    } else {
      Alert.alert(
        'Friend Required',
        'You need to be friends with this user to make video calls. Send a friend request first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Request', onPress: handleFriendRequest },
        ]
      );
    }
  };

  const handleFriendRequest = () => {
    if (!isSubscribed) {
      Alert.alert(
        'Premium Feature',
        'Sending friend requests requires a Premium subscription. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    Alert.alert('Friend Request Sent', 'Your friend request has been sent!');
    if (user) {
      setUser({ ...user, isFriend: true });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'current-user';
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
          ]}
        >
          {item.type === 'image' && (
            <View style={styles.mediaPlaceholder}>
              <IconSymbol name="photo.fill" size={32} color={colors.card} />
              <Text style={styles.mediaText}>Image</Text>
            </View>
          )}
          {item.type === 'video' && (
            <View style={styles.mediaPlaceholder}>
              <IconSymbol name="video.fill" size={32} color={colors.card} />
              <Text style={styles.mediaText}>Video</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.messageTextRight : styles.messageTextLeft,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isCurrentUser ? styles.messageTimeRight : styles.messageTimeLeft,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.chatHeader}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol name="chevron.left" size={24} color={colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.headerUserInfo}>
        <View style={[styles.headerAvatar, { backgroundColor: user?.avatar || colors.primary }]}>
          <Text style={styles.headerAvatarText}>
            {user?.anonymousName.split(' ').map(word => word[0]).join('') || 'U'}
          </Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>{user?.anonymousName || 'Unknown User'}</Text>
          <Text style={styles.headerStatus}>
            {user?.status === 'online' ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity onPress={handleVoiceCall} style={styles.headerButton}>
          <IconSymbol name="phone.fill" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVideoCall} style={styles.headerButton}>
          <IconSymbol name="video.fill" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {renderHeader()}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.attachButton}>
            <IconSymbol name="paperclip" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={36}
              color={inputText.trim() ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  messageContainerLeft: {
    alignSelf: 'flex-start',
  },
  messageContainerRight: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  messageBubbleLeft: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageBubbleRight: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextLeft: {
    color: colors.text,
  },
  messageTextRight: {
    color: colors.card,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  messageTimeLeft: {
    color: colors.textSecondary,
  },
  messageTimeRight: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mediaPlaceholder: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  mediaText: {
    fontSize: 14,
    color: colors.card,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
