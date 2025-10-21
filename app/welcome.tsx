
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { setHasSeenWelcome } = useOnboarding();

  const handleGetStarted = () => {
    setHasSeenWelcome(true);
    router.replace('/(tabs)/(home)/');
  };

  const features = [
    {
      icon: 'eye.slash.fill',
      title: 'Stay Anonymous',
      description: 'Your identity is protected. Chat without revealing who you are.',
    },
    {
      icon: 'location.fill',
      title: 'Discover Nearby',
      description: 'Find users around you based on your preferred search radius.',
    },
    {
      icon: 'message.fill',
      title: 'Chat Instantly',
      description: 'Send messages, photos, and videos to anyone you discover.',
    },
    {
      icon: 'phone.fill',
      title: 'Call Friends',
      description: 'Make voice and video calls after becoming friends.',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={56} color={colors.card} />
          </View>
          <Text style={styles.title}>Welcome to{'\n'}Anonymous Chat</Text>
          <Text style={styles.subtitle}>
            Connect with people nearby while keeping your identity private
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: colors.highlight }]}>
                <IconSymbol name={feature.icon} size={28} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <IconSymbol name="arrow.right" size={20} color={colors.card} />
          </TouchableOpacity>

          <Text style={styles.privacyNote}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            All conversations are encrypted end-to-end.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 8px 24px rgba(98, 0, 238, 0.3)',
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: '0px 8px 24px rgba(98, 0, 238, 0.3)',
    elevation: 6,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  privacyNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
