
import { SystemBars } from "react-native-edge-to-edge";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { useColorScheme, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Button } from "@/components/button";
import { useFonts } from "expo-font";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { isConnected } = useNetworkState();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingProvider>
        <SubscriptionProvider>
          <WidgetProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <SystemBars style="auto" />
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="chat" options={{ headerShown: false }} />
                <Stack.Screen name="friend-requests" options={{ headerShown: false }} />
                <Stack.Screen name="subscription" options={{ headerShown: false }} />
                <Stack.Screen name="info" options={{ headerShown: false }} />
                <Stack.Screen name="location-note" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: "modal",
                    headerTitle: "Modal",
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: "transparentModal",
                    animation: "fade",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: "formSheet",
                    headerTitle: "Form Sheet",
                    sheetAllowedDetents: [0.5, 0.8],
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </WidgetProvider>
        </SubscriptionProvider>
      </OnboardingProvider>
    </GestureHandlerRootView>
  );
}
