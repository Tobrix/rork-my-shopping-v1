import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";

interface AppLogoProps {
  size?: number;
}

export function AppLogo({ size = 80 }: AppLogoProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size * 0.25,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  });

  return (
    <View style={styles.container}>
      <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF6B35" />
            <Stop offset="50%" stopColor="#F7931E" />
            <Stop offset="100%" stopColor="#FF1744" />
          </LinearGradient>
          <LinearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF6B35" />
            <Stop offset="100%" stopColor="#F7931E" />
          </LinearGradient>
        </Defs>
        
        {/* Shopping cart handle */}
        <Path
          d="M15 25 L25 25 L30 70 L75 70 C78 70 80 68 80 65 L85 35 L35 35"
          stroke="url(#handleGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Cart body */}
        <Path
          d="M30 70 L75 70 C78 70 80 68 80 65 L85 35 L35 35 L30 70 Z"
          fill="url(#cartGradient)"
          opacity="0.8"
        />
        
        {/* Cart wheels */}
        <Circle cx="40" cy="80" r="4" fill="url(#cartGradient)" />
        <Circle cx="65" cy="80" r="4" fill="url(#cartGradient)" />
        
        {/* Speed lines for modern effect */}
        <Path d="M10 15 L20 15" stroke="url(#handleGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <Path d="M5 20 L18 20" stroke="url(#handleGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <Path d="M8 25 L15 25" stroke="url(#handleGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      </Svg>
    </View>
  );
}