
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { isSubscribed, subscribe, unsubscribe } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');

  const handleSubscribe = async () => {
    if (selectedPlan === 'premium') {
      Alert.alert(
        'Subscribe to Premium',
        'This is a demo. In a real app, this would process payment through your payment provider.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Subscribe',
            onPress: async () => {
              await subscribe('premium');
              Alert.alert(
                'Success!',
                'You are now subscribed to Premium. You can now send and accept friend requests!',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            },
          },
        ]
      );
    }
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'Would you like to cancel your subscription?',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            await unsubscribe();
            Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled.');
          },
        },
      ]
    );
  };

  const renderFeature = (icon: string, text: string, included: boolean) => (
    <View style={styles.feature}>
      <View style={[styles.featureIcon, included ? styles.featureIconIncluded : styles.featureIconExcluded]}>
        <IconSymbol
          name={included ? 'checkmark' : 'xmark'}
          size={16}
          color={included ? colors.success : colors.error}
        />
      </View>
      <Text style={[styles.featureText, !included && styles.featureTextExcluded]}>{text}</Text>
    </View>
  );

  const renderPlanCard = (
    plan: 'free' | 'premium',
    title: string,
    price: string,
    description: string,
    features: { icon: string; text: string; included: boolean }[]
  ) => {
    const isSelected = selectedPlan === plan;
    const isPremium = plan === 'premium';

    return (
      <Animated.View
        entering={FadeInDown.delay(isPremium ? 200 : 100)}
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected,
          isPremium && styles.planCardPremium,
        ]}
      >
        {isPremium && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedPlan(plan)}
          style={styles.planCardContent}
        >
          <View style={styles.planHeader}>
            <Text style={[styles.planTitle, isPremium && styles.planTitlePremium]}>{title}</Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, isPremium && styles.pricePremium]}>{price}</Text>
              {isPremium && <Text style={styles.priceSubtext}>/month</Text>}
            </View>
            <Text style={styles.planDescription}>{description}</Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index}>
                {renderFeature(feature.icon, feature.text, feature.included)}
              </View>
            ))}
          </View>

          {isSelected && !isPremium && (
            <View style={styles.currentPlanBadge}>
              <Text style={styles.currentPlanText}>Current Plan</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Subscription Plans',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol name="star.fill" size={48} color={colors.primary} />
          <Text style={styles.headerTitle}>Unlock Premium Features</Text>
          <Text style={styles.headerSubtitle}>
            Subscribe to send and accept friend requests, enabling voice and video calls
          </Text>
        </View>

        {renderPlanCard(
          'free',
          'Free',
          'Free',
          'Basic anonymous chatting',
          [
            { icon: 'message.fill', text: 'Unlimited text messages', included: true },
            { icon: 'photo.fill', text: 'Send images and videos', included: true },
            { icon: 'person.2.fill', text: 'Discover nearby users', included: true },
            { icon: 'person.badge.plus', text: 'Send friend requests', included: false },
            { icon: 'phone.fill', text: 'Voice calls with friends', included: false },
            { icon: 'video.fill', text: 'Video calls with friends', included: false },
          ]
        )}

        {renderPlanCard(
          'premium',
          'Premium',
          '$4.99',
          'Full access to all features',
          [
            { icon: 'message.fill', text: 'Unlimited text messages', included: true },
            { icon: 'photo.fill', text: 'Send images and videos', included: true },
            { icon: 'person.2.fill', text: 'Discover nearby users', included: true },
            { icon: 'person.badge.plus', text: 'Send & accept friend requests', included: true },
            { icon: 'phone.fill', text: 'Voice calls with friends', included: true },
            { icon: 'video.fill', text: 'Video calls with friends', included: true },
          ]
        )}

        {isSubscribed ? (
          <TouchableOpacity
            style={[styles.subscribeButton, styles.manageButton]}
            onPress={handleManageSubscription}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              selectedPlan === 'free' && styles.subscribeButtonDisabled,
            ]}
            onPress={handleSubscribe}
            activeOpacity={0.8}
            disabled={selectedPlan === 'free'}
          >
            <Text style={styles.subscribeButtonText}>
              {selectedPlan === 'premium' ? 'Subscribe Now' : 'Select a Plan'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • Cancel anytime{'\n'}
            • Secure payment processing{'\n'}
            • Your privacy remains protected
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  planCardSelected: {
    borderColor: colors.primary,
  },
  planCardPremium: {
    borderColor: colors.primary,
  },
  planCardContent: {
    padding: 20,
  },
  popularBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
    letterSpacing: 1,
  },
  planHeader: {
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  planTitlePremium: {
    color: colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  pricePremium: {
    color: colors.primary,
  },
  priceSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  featuresContainer: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconIncluded: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  featureIconExcluded: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  featureTextExcluded: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  currentPlanBadge: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentPlanText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(98, 0, 238, 0.3)',
    elevation: 4,
  },
  subscribeButtonDisabled: {
    backgroundColor: colors.border,
    boxShadow: 'none',
    elevation: 0,
  },
  manageButton: {
    backgroundColor: colors.textSecondary,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
