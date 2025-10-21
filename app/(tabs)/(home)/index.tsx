
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

export default function DiscoverScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<AnonymousUser[]>([]);
  const [radius, setRadius] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [radius]);

  const loadUsers = () => {
    const mockUsers = generateMockUsers(20);
    const filteredUsers = mockUsers.filter(user => user.distance <= radius);
    setUsers(filteredUsers);
  };

  const filteredUsers = users.filter(user =>
    user.anonymousName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return colors.online;
      case 'busy':
        return colors.warning;
      default:
        return colors.offline;
    }
  };

  const handleUserPress = (user: AnonymousUser) => {
    router.push(`/chat/${user.id}`);
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
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.anonymousName}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        </View>
        <Text style={styles.distance}>
          {item.distance < 1 
            ? `${Math.round(item.distance * 1000)}m away` 
            : `${item.distance.toFixed(1)}km away`}
        </Text>
        {item.isFriend && (
          <View style={styles.friendBadge}>
            <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
            <Text style={styles.friendBadgeText}>Friend</Text>
          </View>
        )}
      </View>

      <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.radiusContainer}>
        <View style={styles.radiusHeader}>
          <Text style={styles.radiusLabel}>Search Radius</Text>
          <Text style={styles.radiusValue}>{radius} km</Text>
        </View>
        <View style={styles.radiusButtons}>
          {[5, 10, 25, 50].map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.radiusButton,
                radius === value && styles.radiusButtonActive,
              ]}
              onPress={() => setRadius(value)}
            >
              <Text
                style={[
                  styles.radiusButtonText,
                  radius === value && styles.radiusButtonTextActive,
                ]}
              >
                {value}km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} nearby
        </Text>
        <View style={styles.resultsActions}>
          <TouchableOpacity onPress={() => router.push('/location-note')} style={styles.mapNote}>
            <IconSymbol name="map" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={loadUsers}>
            <IconSymbol name="arrow.clockwise" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
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
      
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS !== 'ios' && styles.listContentAndroid,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContentAndroid: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  radiusContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  radiusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  radiusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  radiusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  radiusButtonActive: {
    backgroundColor: colors.primary,
  },
  radiusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  radiusButtonTextActive: {
    color: colors.card,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  resultsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapNote: {
    padding: 4,
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
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  friendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  friendBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 4,
  },
});
