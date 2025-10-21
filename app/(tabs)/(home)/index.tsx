
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { AnonymousUser } from '@/types/User';
import { generateMockUsers } from '@/data/mockUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function DiscoverScreen() {
  const [users, setUsers] = useState<AnonymousUser[]>([]);
  const [radius, setRadius] = useState(10);
  const router = useRouter();
  const { isSubscribed } = useSubscription();

  useEffect(() => {
    loadUsers();
  }, [radius]);

  const loadUsers = () => {
    const mockUsers = generateMockUsers(20);
    setUsers(mockUsers);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return colors.online;
      case 'offline':
        return colors.offline;
      case 'busy':
        return colors.warning;
      default:
        return colors.offline;
    }
  };

  const handleUserPress = (user: AnonymousUser) => {
    router.push(`/chat/${user.id}`);
  };

  const handleAddFriend = (user: AnonymousUser) => {
    if (!isSubscribed) {
      Alert.alert(
        'Premium Feature',
        'Sending friend requests requires a Premium subscription. Upgrade to unlock voice and video calls.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Plans', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    Alert.alert(
      'Send Friend Request',
      `Send a friend request to ${user.anonymousName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            console.log('Friend request sent to:', user.id);
            Alert.alert('Success', 'Friend request sent!');
          },
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: AnonymousUser }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: item.avatar }]}>
        <Text style={styles.avatarText}>
          {item.anonymousName.split(' ').map(word => word[0]).join('')}
        </Text>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.anonymousName}</Text>
        <Text style={styles.distance}>
          {item.distance < 1
            ? `${Math.round(item.distance * 1000)}m away`
            : `${item.distance.toFixed(1)}km away`}
        </Text>
        <Text style={styles.status}>
          {item.status === 'online' ? 'Available to chat' : 'Last seen recently'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={(e) => {
          e.stopPropagation();
          handleAddFriend(item);
        }}
      >
        <IconSymbol name="person.badge.plus" size={24} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.radiusControl}>
        <IconSymbol name="location.fill" size={24} color={colors.primary} />
        <View style={styles.radiusInfo}>
          <Text style={styles.radiusLabel}>Search Radius</Text>
          <Text style={styles.radiusValue}>{radius} km</Text>
        </View>
        <View style={styles.radiusButtons}>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={() => setRadius(Math.max(1, radius - 5))}
          >
            <IconSymbol name="minus" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={() => setRadius(Math.min(100, radius + 5))}
          >
            <IconSymbol name="plus" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {!isSubscribed && (
        <TouchableOpacity
          style={styles.premiumPromoBanner}
          onPress={() => router.push('/subscription')}
          activeOpacity={0.8}
        >
          <View style={styles.premiumPromoContent}>
            <IconSymbol name="star.fill" size={24} color={colors.primary} />
            <View style={styles.premiumPromoText}>
              <Text style={styles.premiumPromoTitle}>Unlock Premium Features</Text>
              <Text style={styles.premiumPromoSubtitle}>
                Send friend requests and enable voice/video calls
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Nearby Users</Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Discover',
            headerLargeTitle: true,
          }}
        />
      )}

      {Platform.OS !== 'ios' && (
        <View style={styles.androidHeader}>
          <Text style={styles.androidHeaderTitle}>Discover</Text>
        </View>
      )}

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS !== 'ios' && styles.listContentAndroid,
        ]}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  androidHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  androidHeaderTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContentAndroid: {
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 16,
  },
  radiusControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  radiusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  radiusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  radiusValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  radiusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumPromoBanner: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  premiumPromoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumPromoText: {
    flex: 1,
    marginLeft: 12,
  },
  premiumPromoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  premiumPromoSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  userCard: {
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
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.card,
  },
  userInfo: {
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
  status: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
