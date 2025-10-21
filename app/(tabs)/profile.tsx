
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoAcceptFriends, setAutoAcceptFriends] = useState(false);

  const handleLocationToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Disable Location',
        'Disabling location will prevent you from discovering nearby users. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', onPress: () => setLocationEnabled(false), style: 'destructive' },
        ]
      );
    } else {
      setLocationEnabled(true);
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <IconSymbol name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.highlight }}
        thumbColor={value ? colors.primary : colors.card}
      />
    </View>
  );

  const renderActionItem = (icon: string, title: string, onPress: () => void, danger?: boolean, badge?: string) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingIcon}>
        <IconSymbol name={icon} size={24} color={danger ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.actionTitle, danger && styles.actionTitleDanger]}>{title}</Text>
      {badge && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>{badge}</Text>
        </View>
      )}
      <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerLargeTitle: true,
          }}
        />
      )}

      {Platform.OS !== 'ios' && (
        <View style={styles.androidHeader}>
          <Text style={styles.androidHeaderTitle}>Profile</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentAndroid,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
            <IconSymbol name="person.fill" size={48} color={colors.card} />
          </View>
          <Text style={styles.profileName}>Anonymous User</Text>
          <Text style={styles.profileId}>ID: #USER-{Math.floor(Math.random() * 10000)}</Text>
          {isSubscribed && (
            <View style={styles.subscriptionBadge}>
              <IconSymbol name="star.fill" size={16} color={colors.primary} />
              <Text style={styles.subscriptionBadgeText}>Premium Member</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.card}>
            {renderActionItem(
              'star.fill',
              isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium',
              () => {
                router.push('/subscription');
              },
              false,
              isSubscribed ? undefined : 'UNLOCK'
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social</Text>
          <View style={styles.card}>
            {renderActionItem('person.2.fill', 'Friend Requests', () => {
              router.push('/friend-requests');
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Settings</Text>
          <View style={styles.card}>
            {renderSettingItem(
              'bell.fill',
              'Notifications',
              'Receive alerts for new messages',
              notificationsEnabled,
              setNotificationsEnabled
            )}
            <View style={styles.divider} />
            {renderSettingItem(
              'location.fill',
              'Location Services',
              'Allow app to access your location',
              locationEnabled,
              handleLocationToggle
            )}
            <View style={styles.divider} />
            {renderSettingItem(
              'person.2.fill',
              'Auto-Accept Friends',
              'Automatically accept friend requests',
              autoAcceptFriends,
              setAutoAcceptFriends
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            {renderActionItem('key.fill', 'Change Anonymous ID', () => {
              Alert.alert('Change ID', 'Generate a new anonymous ID?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Generate', onPress: () => console.log('Generate new ID') },
              ]);
            })}
            <View style={styles.divider} />
            {renderActionItem('info.circle.fill', 'About This App', () => {
              router.push('/info');
            })}
            <View style={styles.divider} />
            {renderActionItem('shield.fill', 'Privacy Policy', () => {
              console.log('Open privacy policy');
            })}
            <View style={styles.divider} />
            {renderActionItem('doc.text.fill', 'Terms of Service', () => {
              console.log('Open terms of service');
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            {renderActionItem('trash.fill', 'Delete All Data', () => {
              Alert.alert(
                'Delete All Data',
                'This will permanently delete all your conversations and data. This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', onPress: () => console.log('Delete all data'), style: 'destructive' },
                ]
              );
            }, true)}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Your privacy is our priority. All conversations are encrypted and your identity remains anonymous.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollContentAndroid: {
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  profileAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    gap: 6,
  },
  subscriptionBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionTitleDanger: {
    color: colors.error,
  },
  premiumBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.card,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 72,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
