
import { Message, Conversation } from '@/types/User';
import { generateMockUsers } from './mockUsers';

const sampleMessages = [
  'Hey there! How are you?',
  'Nice to meet you!',
  'What brings you here?',
  'Would you like to chat?',
  'Hello! 👋',
  'Interesting profile!',
  'Want to be friends?',
  'How was your day?',
  'Thanks for connecting!',
  'See you around!',
];

export function generateMockConversations(count: number = 10): Conversation[] {
  const users = generateMockUsers(count);
  const conversations: Conversation[] = [];
  
  users.forEach((user, index) => {
    if (user.isFriend || Math.random() > 0.5) {
      const lastMessage: Message = {
        id: `msg-${index}`,
        senderId: Math.random() > 0.5 ? user.id : 'current-user',
        receiverId: Math.random() > 0.5 ? 'current-user' : user.id,
        content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
        type: 'text',
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        read: Math.random() > 0.3,
      };
      
      conversations.push({
        id: `conv-${index}`,
        userId: user.id,
        user,
        lastMessage,
        unreadCount: Math.floor(Math.random() * 5),
        updatedAt: lastMessage.timestamp,
      });
    }
  });
  
  return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function generateMockMessages(userId: string, count: number = 20): Message[] {
  const messages: Message[] = [];
  
  for (let i = 0; i < count; i++) {
    const isFromCurrentUser = Math.random() > 0.5;
    messages.push({
      id: `msg-${userId}-${i}`,
      senderId: isFromCurrentUser ? 'current-user' : userId,
      receiverId: isFromCurrentUser ? userId : 'current-user',
      content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      type: 'text',
      timestamp: new Date(Date.now() - (count - i) * 300000),
      read: true,
    });
  }
  
  return messages;
}
