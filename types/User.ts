
export interface AnonymousUser {
  id: string;
  anonymousName: string;
  distance: number;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
  isFriend: boolean;
  avatar: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  user: AnonymousUser;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface FriendRequest {
  id: string;
  fromUser: AnonymousUser;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}
