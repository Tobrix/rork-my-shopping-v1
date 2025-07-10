import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Dimensions,
  Platform,
  SafeAreaView,
  Animated
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { getStoreIconsForLanguage, getIconColorsForLanguage } from "@/constants/storeIcons";
import { IconComponent } from "@/components/IconComponent";
import { X } from "lucide-react-native";

interface IconSelectorProps {
  selectedIcon: string;
  selectedColor?: string;
  onIconSelect: (icon: string) => void;
  onColorSelect: (color: string) => void;
}

export function IconSelector({ selectedIcon, selectedColor, onIconSelect, onColorSelect }: IconSelectorProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'icons' | 'colors'>('icons');

  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Get language-specific icons and colors
  const storeIcons = useMemo(() => getStoreIconsForLanguage(language), [language]);
  const iconColors = useMemo(() => getIconColorsForLanguage(language), [language]);

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.75;

  useEffect(() => {
    if (modalVisible) {
      slideAnim.setValue(modalHeight);
      backdropAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, modalHeight, slideAnim, backdropAnim]);

  const handleIconSelect = useCallback((icon: string) => {
    onIconSelect(icon);
    if (activeTab === 'icons') {
      setActiveTab('colors');
    }
  }, [onIconSelect, activeTab]);

  const handleColorSelect = useCallback((color: string) => {
    onColorSelect(color);
  }, [onColorSelect]);

  const handleDone = useCallback(() => {
    closeModal();
  }, []);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: modalHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setActiveTab('icons');
    });
  }, [slideAnim, backdropAnim, modalHeight]);

  const currentColor = selectedColor || colors.primary;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    selectedIconContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: modalHeight,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 20,
    },
    safeArea: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    doneButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    doneButtonText: {
      color: colors.white,
      fontWeight: "700",
      fontSize: 16,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: colors.lightGray,
      margin: 20,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: colors.background,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    tabText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.darkGray,
    },
    activeTabText: {
      color: colors.primary,
    },
    previewContainer: {
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    previewIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    previewText: {
      fontSize: 14,
      color: colors.darkGray,
      fontWeight: "500",
    },
    contentContainer: {
      flex: 1,
    },
    gridContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    iconGrid: {
      paddingTop: 10,
    },
    iconItem: {
      width: 70,
      height: 70,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      margin: 6,
      borderWidth: 2,
      borderColor: "transparent",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    selectedIconItem: {
      borderColor: colors.primary,
      backgroundColor: colors.secondary,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    colorGrid: {
      paddingTop: 10,
      alignItems: "center",
    },
    colorItem: {
      width: 40,
      height: 40,
      borderRadius: 20,
      margin: 6,
      borderWidth: 2,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    selectedColorItem: {
      borderColor: colors.text,
      borderWidth: 3,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    colorInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
  }), [colors, modalHeight]);

  const renderIconItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.iconItem,
        item.icon === selectedIcon && styles.selectedIconItem
      ]}
      onPress={() => handleIconSelect(item.icon)}
      activeOpacity={0.7}
    >
      <IconComponent 
        name={item.icon} 
        size={24}
        color={item.icon === selectedIcon ? colors.primary : currentColor} 
      />
    </TouchableOpacity>
  ), [styles, selectedIcon, handleIconSelect, colors.primary, currentColor]);

  const renderColorItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.colorItem,
        item.color === currentColor && styles.selectedColorItem
      ]}
      onPress={() => handleColorSelect(item.color)}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.colorInner,
          { backgroundColor: item.color }
        ]} 
      />
    </TouchableOpacity>
  ), [styles, currentColor, handleColorSelect]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("iconAndColor")}</Text>
      <TouchableOpacity 
        style={styles.selectedIconContainer}
        onPress={() => setModalVisible(true)}
      >
        <IconComponent name={selectedIcon} size={36} color={currentColor} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
              }
            ]}
          >
            <TouchableOpacity 
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={closeModal}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t("selectIconAndColor")}</Text>
                <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>{t("done")}</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.previewContainer}>
                <View style={[styles.previewIcon, { backgroundColor: currentColor + '20' }]}>
                  <IconComponent name={selectedIcon} size={28} color={currentColor} />
                </View>
                <Text style={styles.previewText}>{t("preview")}</Text>
              </View>
              
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'icons' && styles.activeTab]}
                  onPress={() => setActiveTab('icons')}
                >
                  <Text style={[styles.tabText, activeTab === 'icons' && styles.activeTabText]}>
                    {t("icons")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'colors' && styles.activeTab]}
                  onPress={() => setActiveTab('colors')}
                >
                  <Text style={[styles.tabText, activeTab === 'colors' && styles.activeTabText]}>
                    {t("colors")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.contentContainer}>
                {activeTab === 'icons' ? (
                  <View style={styles.gridContainer}>
                    <FlatList
                      key={`icon-selector-icons-${storeIcons.length}`}
                      data={storeIcons}
                      keyExtractor={(item) => `icon-${item.name}`}
                      numColumns={4}
                      contentContainerStyle={styles.iconGrid}
                      columnWrapperStyle={{ justifyContent: 'center' }}
                      showsVerticalScrollIndicator={false}
                      bounces={true}
                      renderItem={renderIconItem}
                    />
                  </View>
                ) : (
                  <View style={styles.gridContainer}>
                    <FlatList
                      key={`icon-selector-colors-${iconColors.length}`}
                      data={iconColors}
                      keyExtractor={(item) => `color-${item.name}`}
                      numColumns={6}
                      contentContainerStyle={styles.colorGrid}
                      columnWrapperStyle={{ justifyContent: 'center' }}
                      showsVerticalScrollIndicator={false}
                      bounces={true}
                      renderItem={renderColorItem}
                    />
                  </View>
                )}
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}