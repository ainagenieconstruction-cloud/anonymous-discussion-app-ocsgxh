
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { colors } from '@/styles/commonStyles';

export default function Index() {
  const router = useRouter();
  const { hasSeenWelcome, isLoading } = useOnboarding();

  useEffect(() => {
    if (!isLoading) {
      if (hasSeenWelcome) {
        router.replace('/(tabs)/(home)/');
      } else {
        router.replace('/welcome');
      }
    }
  }, [isLoading, hasSeenWelcome]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
