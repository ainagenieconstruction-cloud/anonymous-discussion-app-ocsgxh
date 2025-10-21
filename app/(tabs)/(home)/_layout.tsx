
import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: Platform.OS === 'ios',
        animation: 'default',
      }}
    />
  );
}
