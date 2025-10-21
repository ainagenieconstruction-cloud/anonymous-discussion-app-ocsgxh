
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionTier = 'free' | 'premium';

interface SubscriptionContextType {
  subscriptionTier: SubscriptionTier;
  isSubscribed: boolean;
  subscribe: (tier: SubscriptionTier) => Promise<void>;
  unsubscribe: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptionTier: 'free',
  isSubscribed: false,
  subscribe: async () => {},
  unsubscribe: async () => {},
  isLoading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('subscriptionTier');
      if (value !== null) {
        setSubscriptionTier(value as SubscriptionTier);
      }
    } catch (error) {
      console.log('Error loading subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async (tier: SubscriptionTier) => {
    try {
      await AsyncStorage.setItem('subscriptionTier', tier);
      setSubscriptionTier(tier);
      console.log('Subscribed to:', tier);
    } catch (error) {
      console.log('Error saving subscription:', error);
    }
  };

  const unsubscribe = async () => {
    try {
      await AsyncStorage.setItem('subscriptionTier', 'free');
      setSubscriptionTier('free');
      console.log('Unsubscribed');
    } catch (error) {
      console.log('Error unsubscribing:', error);
    }
  };

  const isSubscribed = subscriptionTier === 'premium';

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionTier,
        isSubscribed,
        subscribe,
        unsubscribe,
        isLoading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
