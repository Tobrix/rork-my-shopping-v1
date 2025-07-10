import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLogo } from "@/components/AppLogo";

const { width } = Dimensions.get('window');

export function LoadingScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  // Main animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Floating elements animations
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  
  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Progress bar animation
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation - smooth fade and scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating elements animations
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000 + delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 2000 + delay,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(float1, 0).start();
    createFloatingAnimation(float2, 500).start();
    createFloatingAnimation(float3, 1000).start();

    // Subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();
  }, []);

  const float1Y = float1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float2Y = float2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const float3Y = float3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.6],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      position: 'relative',
    },
    content: {
      alignItems: "center",
      zIndex: 10,
    },
    logoContainer: {
      position: 'relative',
    },
    appName: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text,
      marginTop: 32,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.darkGray,
      marginTop: 8,
      textAlign: "center",
    },
    progressContainer: {
      marginTop: 40,
      width: width * 0.6,
      height: 4,
      backgroundColor: colors.lightGray,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    floatingElement: {
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      opacity: 0.3,
    },
    float1: {
      top: '20%',
      left: '15%',
    },
    float2: {
      top: '30%',
      right: '20%',
    },
    float3: {
      bottom: '25%',
      left: '25%',
    },
    glowEffect: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.primary,
      opacity: 0.05,
    },
  });

  return (
    <View style={styles.container}>
      {/* Glow effect behind logo */}
      <Animated.View 
        style={[
          styles.glowEffect,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      
      {/* Floating elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.float1,
          {
            transform: [{ translateY: float1Y }],
          },
        ]}
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.float2,
          {
            transform: [{ translateY: float2Y }],
          },
        ]}
      />
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.float3,
          {
            transform: [{ translateY: float3Y }],
          },
        ]}
      />

      {/* Main content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            <AppLogo size={120} />
          </Animated.View>
        </View>
        <Text style={styles.appName}>{t("appName")}</Text>
        <Text style={styles.subtitle}>{t("loading")}</Text>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}