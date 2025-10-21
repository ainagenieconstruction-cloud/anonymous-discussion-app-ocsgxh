
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextType {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType>({
  hasSeenWelcome: false,
  setHasSeenWelcome: () => {},
  isLoading: true,
});

export const useOnboarding = () => useContext(OnboardingContext);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenWelcome, setHasSeenWelcomeState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  const loadOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasSeenWelcome');
      if (value !== null) {
        setHasSeenWelcomeState(value === 'true');
      }
    } catch (error) {
      console.log('Error loading onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setHasSeenWelcome = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', value.toString());
      setHasSeenWelcomeState(value);
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  };

  return (
    <OnboardingContext.Provider value={{ hasSeenWelcome, setHasSeenWelcome, isLoading }}>
      {children}
    </OnboardingContext.Provider>
  );
}
