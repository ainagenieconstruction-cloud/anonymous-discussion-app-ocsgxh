
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InfoScreen() {
  const router = useRouter();

  const features = [
    {
      icon: 'eye.slash.fill',
      title: 'Complete Anonymity',
      description: 'Your identity is never revealed. Chat freely without worrying about privacy.',
    },
    {
      icon: 'location.fill',
      title: 'Location-Based Discovery',
      description: 'Find and connect with users nearby based on your preferred search radius.',
    },
    {
      icon: 'message.fill',
      title: 'Instant Messaging',
      description: 'Send text, images, and videos instantly to anyone you discover.',
    },
    {
      icon: 'phone.fill',
      title: 'Voice & Video Calls',
      description: 'Make voice and video calls after becoming friends with mutual consent.',
    },
    {
      icon: 'lock.shield.fill',
      title: 'End-to-End Encryption',
      description: 'All your conversations and media are encrypted for maximum security.',
    },
    {
      icon: 'person.2.fill',
      title: 'Friend System',
      description: 'Build trust gradually by sending friend requests before enabling calls.',
    },
  ];

  const renderFeature = (feature: typeof features[0], index: number) => (
    <View key={index} style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
        <IconSymbol name={feature.icon} size={28} color={colors.card} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'About',
          headerBackTitle: 'Back',
          presentation: 'modal',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={48} color={colors.card} />
          </View>
          <Text style={styles.appName}>Anonymous Chat</Text>
          <Text style={styles.appTagline}>Connect Anonymously, Chat Freely</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {features.map((feature, index) => renderFeature(feature, index))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.card}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Discover Users</Text>
                <Text style={styles.stepDescription}>
                  Browse anonymous users nearby based on your location and search radius.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Start Chatting</Text>
                <Text style={styles.stepDescription}>
                  Send messages, images, and videos instantly to anyone you find interesting.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Build Trust</Text>
                <Text style={styles.stepDescription}>
                  Send friend requests to users you trust to unlock voice and video calling.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Stay Safe</Text>
                <Text style={styles.stepDescription}>
                  All conversations are encrypted and your identity remains completely anonymous.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Notes</Text>
          <View style={styles.card}>
            <Text style={styles.noteText}>
              • This is a demo application showcasing anonymous chat functionality
            </Text>
            <Text style={styles.noteText}>
              • Currently uses mock data for users and conversations
            </Text>
            <Text style={styles.noteText}>
              • Location services use simulated distances
            </Text>
            <Text style={styles.noteText}>
              • Map view (react-native-maps) is not supported in this environment
            </Text>
            <Text style={styles.noteText}>
              • For production use, connect to Supabase for real-time messaging and user management
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your privacy and security are our top priorities. We never collect personal information
            or share your data with third parties.
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
  appIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
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
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  footer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
});
