import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Keyboard
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

interface NumericInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  label: string;
}

export function NumericInput({ value, onChangeText, placeholder, label }: NumericInputProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    // Allow digits, comma, and dot
    const cleanedText = text.replace(/[^0-9.,]/g, '');
    
    // Ensure only one decimal separator
    const parts = cleanedText.split(/[.,]/);
    if (parts.length > 2) {
      // If more than one separator, keep only the first one
      const firstPart = parts[0];
      const secondPart = parts[1];
      const separator = cleanedText.includes(',') ? ',' : '.';
      onChangeText(`${firstPart}${separator}${secondPart}`);
    } else {
      onChangeText(cleanedText);
    }
  };

  const handleDone = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      paddingRight: Platform.OS === 'ios' && isFocused ? 60 : 12,
    },
    doneButton: {
      position: "absolute",
      right: 8,
      top: 8,
      bottom: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 6,
      paddingHorizontal: 12,
    },
    doneButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={colors.darkGray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="done"
          onSubmitEditing={handleDone}
        />
        {Platform.OS === 'ios' && isFocused && (
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}