import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/hooks/useTheme";
import { useExpenseStore } from "@/store/expenseStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Animated, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [showLoading, setShowLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  const appOpacity = useRef(new Animated.Value(0)).current;
  
  const { initializeSystemTheme } = useExpenseStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      initializeSystemTheme();
      
      // Show custom loading screen for 2.5 seconds
      const timer = setTimeout(() => {
        // Start transition animation
        Animated.parallel([
          Animated.timing(loadingOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(appOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowLoading(false);
          setAppReady(true);
        });
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [loaded, initializeSystemTheme]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Main App */}
        <Animated.View 
          style={{ 
            flex: 1, 
            opacity: appOpacity,
            position: appReady ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <RootLayoutNav />
        </Animated.View>
        
        {/* Loading Screen Overlay */}
        {showLoading && (
          <Animated.View 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: loadingOpacity,
              zIndex: 1000,
            }}
          >
            <LoadingScreen />
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: "600",
            color: colors.text,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}