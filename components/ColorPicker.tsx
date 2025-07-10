import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  FlatList,
  SafeAreaView
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { X } from "lucide-react-native";

interface ColorPickerProps {
  visible: boolean;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

// Enhanced color palette with more vibrant and saturated colors
const colorPalette = [
  // Vibrant Reds & Pinks
  "#FF0000", "#FF1744", "#F44336", "#E91E63", "#C2185B",
  "#FF4081", "#FF5722", "#D50000", "#B71C1C", "#FF80AB",
  
  // Electric Purples & Magentas
  "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C",
  "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0",
  
  // Vibrant Blues & Cyans
  "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1",
  "#00BCD4", "#00ACC1", "#0097A7", "#00838F", "#006064",
  "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#0277BD",
  "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00E5FF",
  
  // Electric Greens & Teals
  "#009688", "#00897B", "#00796B", "#00695C", "#004D40",
  "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20",
  "#8BC34A", "#7CB342", "#689F38", "#558B2F", "#33691E",
  "#1DE9B6", "#00C853", "#64DD17", "#AEEA00", "#76FF03",
  
  // Vibrant Yellows & Oranges
  "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17",
  "#FFC107", "#FFB300", "#FFA000", "#FF8F00", "#FF6F00",
  "#FF9800", "#FB8C00", "#F57C00", "#EF6C00", "#E65100",
  "#FFFF00", "#FFC400", "#FF9100", "#FF3D00", "#FF5722",
  
  // Deep Earth Tones
  "#795548", "#6D4C41", "#5D4037", "#4E342E", "#3E2723",
  "#8D6E63", "#A1887F", "#BCAAA4", "#D7CCC8", "#EFEBE9",
  
  // Sophisticated Grays & Metallics
  "#9E9E9E", "#757575", "#616161", "#424242", "#212121",
  "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238",
  "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#000000",
  
  // Neon & Electric Colors
  "#00FF00", "#00FFFF", "#FF00FF", "#FFFF00", "#FF0080",
  "#8000FF", "#0080FF", "#FF8000", "#80FF00", "#FF0040",
  
  // Pastel Variants
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
  "#C9C9FF", "#FFBAF3", "#F0F8FF", "#FFF8DC", "#E6E6FA",
  
  // Metallic & Premium Colors
  "#FFD700", "#C0C0C0", "#B87333", "#CD7F32", "#E5E4E2",
  "#36454F", "#2F4F4F", "#708090", "#778899", "#B0C4DE"
];

export function ColorPicker({ visible, onColorSelect, onClose }: ColorPickerProps) {
  const { colors } = useTheme();
  const [selectedColor, setSelectedColor] = useState<string>("");

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const isWeb = Platform.OS === 'web';
  const isIOS = Platform.OS === 'ios';
  
  // Improved sizing with smaller color circles and more columns
  let modalWidth, modalHeight, colorsPerRow, colorSize;
  
  if (isWeb) {
    modalWidth = Math.min(400, screenWidth * 0.8);
    modalHeight = Math.min(650, screenHeight * 0.8);
    colorsPerRow = 8; // Increased from 6 to 8
  } else if (isIOS) {
    modalWidth = screenWidth * 0.9;
    modalHeight = screenHeight * 0.7;
    colorsPerRow = 8; // Increased from 6 to 8
  } else {
    modalWidth = screenWidth * 0.9;
    modalHeight = screenHeight * 0.75;
    colorsPerRow = 8; // Increased from 6 to 8
  }
  
  colorSize = (modalWidth - 80) / colorsPerRow; // Smaller circles due to more columns

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleConfirm = () => {
    if (selectedColor) {
      onColorSelect(selectedColor);
      onClose();
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      width: modalWidth,
      maxHeight: modalHeight,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.3,
      shadowRadius: 25,
      elevation: 20,
      overflow: 'hidden',
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    previewContainer: {
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    previewColor: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 8,
      borderWidth: 3,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    previewText: {
      fontSize: 14,
      color: colors.darkGray,
      fontWeight: "500",
    },
    colorGrid: {
      padding: 20,
      alignItems: "center",
      flex: 1,
    },
    colorItem: {
      width: colorSize,
      height: colorSize,
      borderRadius: colorSize / 2,
      margin: 2, // Reduced margin for smaller circles
      borderWidth: 2, // Reduced border width
      borderColor: "transparent",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    selectedColorItem: {
      borderColor: colors.text,
      borderWidth: 3, // Slightly thicker for selected
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginLeft: 12,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cancelButton: {
      backgroundColor: colors.lightGray,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontWeight: "600",
      fontSize: 16,
    },
    cancelButtonText: {
      color: colors.text,
    },
    confirmButtonText: {
      color: colors.white,
    },
    disabledButton: {
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
  });

  // Create unique key that includes platform and colorsPerRow to force re-render when these change
  const flatListKey = `color-picker-${Platform.OS}-${colorsPerRow}-${modalWidth}-${modalHeight}`;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isIOS ? (
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <Text style={styles.title}>Choose Color</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={20} color={colors.darkGray} />
                </TouchableOpacity>
              </View>

              {selectedColor ? (
                <View style={styles.previewContainer}>
                  <View 
                    style={[
                      styles.previewColor,
                      { backgroundColor: selectedColor }
                    ]} 
                  />
                  <Text style={styles.previewText}>Selected Color</Text>
                </View>
              ) : null}

              <FlatList
                key={flatListKey}
                data={colorPalette}
                keyExtractor={(item, index) => `color-picker-${index}`}
                numColumns={colorsPerRow}
                contentContainerStyle={styles.colorGrid}
                showsVerticalScrollIndicator={false}
                bounces={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorItem,
                      { backgroundColor: item },
                      selectedColor === item && styles.selectedColorItem
                    ]}
                    onPress={() => handleColorSelect(item)}
                    activeOpacity={0.7}
                  />
                )}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    !selectedColor && styles.disabledButton
                  ]}
                  onPress={handleConfirm}
                  disabled={!selectedColor}
                >
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>
                    Select
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Choose Color</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={20} color={colors.darkGray} />
                </TouchableOpacity>
              </View>

              {selectedColor ? (
                <View style={styles.previewContainer}>
                  <View 
                    style={[
                      styles.previewColor,
                      { backgroundColor: selectedColor }
                    ]} 
                  />
                  <Text style={styles.previewText}>Selected Color</Text>
                </View>
              ) : null}

              <FlatList
                key={flatListKey}
                data={colorPalette}
                keyExtractor={(item, index) => `color-picker-${index}`}
                numColumns={colorsPerRow}
                contentContainerStyle={styles.colorGrid}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorItem,
                      { backgroundColor: item },
                      selectedColor === item && styles.selectedColorItem
                    ]}
                    onPress={() => handleColorSelect(item)}
                  />
                )}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    !selectedColor && styles.disabledButton
                  ]}
                  onPress={handleConfirm}
                  disabled={!selectedColor}
                >
                  <Text style={[styles.buttonText, styles.confirmButtonText]}>
                    Select
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}