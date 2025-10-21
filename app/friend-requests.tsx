
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { FriendRequest } from '@/types/User';
import { generateMockUsers } from '@/data/mockUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function FriendRequestsScreen() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    loadFriendRequests();
  }, []);

  const loadFriendRequests = () => {
    const users = generateMockUsers(5);
    const mockRequests: FriendRequest[] = users.map((user, index) => ({
      id: `req-${index}`,
      fromUser: user,
      status: 'pending',
      timestamp: new Date(Date.now() - Math.random() * 86400000),
    }));
    setRequests(mockRequests);
  };

  const handleAccept = (requestId: string) => {
    if (!isSubscribed) {
      Alert.alert(
        'Premium Feature',
        'Accepting friend requests requires a Premium subscription. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    setRequests(requests.filter(req => req.id !== requestId));
    console.log('Accepted friend request:', requestId);
    Alert.alert('Friend Request Accepted', 'You can now make voice and video calls with this user!');
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
    console.log('Rejected friend request:', requestId);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderRequest = ({ item }: { item: FriendRequest }) => (
    <View style={styles.requestCard}>
      <View style={[styles.avatar, { backgroundColor: item.fromUser.avatar }]}>
        <Text style={styles.avatarText}>
          {item.fromUser.anonymousName.split(' ').map(word => word[0]).join('')}
        </Text>
      </View>

      <View style={styles.requestInfo}>
        <Text style={styles.userName}>{item.fromUser.anonymousName}</Text>
        <Text style={styles.distance}>
          {item.fromUser.distance < 1
            ? `${Math.round(item.fromUser.distance * 1000)}m away`
            : `${item.fromUser.distance.toFixed(1)}km away`}
        </Text>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAccept(item.id)}
        >
          <IconSymbol name="checkmark" size={20} color={colors.card} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleReject(item.id)}
        >
          <IconSymbol name="xmark" size={20} color={colors.card} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="person.2" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>No Friend Requests</Text>
      <Text style={styles.emptyStateText}>
        When someone sends you a friend request, it will appear here.
      </Text>
      {!isSubscribed && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => router.push('/subscription')}
          activeOpacity={0.8}
        >
          <IconSymbol name="star.fill" size={20} color={colors.card} />
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => {
    if (!isSubscribed && requests.length > 0) {
      return (
        <View style={styles.premiumBanner}>
          <View style={styles.premiumBannerContent}>
            <IconSymbol name="lock.fill" size={24} color={colors.primary} />
            <View style={styles.premiumBannerText}>
              <Text style={styles.premiumBannerTitle}>Premium Required</Text>
              <Text style={styles.premiumBannerSubtitle}>
                Upgrade to accept friend requests and unlock voice/video calls
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.premiumBannerButton}
            onPress={() => router.push('/subscription')}
            activeOpacity={0.8}
          >
            <Text style={styles.premiumBannerButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Friend Requests',
          headerBackTitle: 'Back',
        }}
      />

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          requests.length === 0 && styles.emptyListContent,
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  premiumBanner: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumBannerText: {
    flex: 1,
    marginLeft: 12,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  premiumBannerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  premiumBannerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumBannerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
  },
  requestInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  distance: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(98, 0, 238, 0.3)',
    elevation: 4,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
});
