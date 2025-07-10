import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { Shop } from "@/types/shop";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { IconSelector } from "@/components/IconSelector";
import { getShopIconMappingForLanguage } from "@/constants/storeIcons";
import { X } from "lucide-react-native";

interface ShopFormProps {
  shop?: Shop;
  visible: boolean;
  onClose: () => void;
  onSave: (shop: Omit<Shop, "id">) => void;
}

export function ShopForm({ shop, visible, onClose, onSave }: ShopFormProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.85;

  // Initialize form data - moved to state to prevent render-time updates
  const [formData, setFormData] = useState(() => {
    if (!shop) {
      return {
        name: "",
        icon: "ShoppingCart",
        color: "#3B82F6"
      };
    }
    
    const multilingualData = shop.multilingualData?.[language];
    if (multilingualData) {
      return {
        name: multilingualData.name,
        icon: multilingualData.icon,
        color: multilingualData.color
      };
    }
    
    return {
      name: shop.name,
      icon: shop.icon,
      color: shop.color || "#3B82F6"
    };
  });

  // Reset form data when modal becomes visible or shop changes
  useEffect(() => {
    if (visible) {
      if (!shop) {
        setFormData({
          name: "",
          icon: "ShoppingCart",
          color: "#3B82F6"
        });
      } else {
        const multilingualData = shop.multilingualData?.[language];
        if (multilingualData) {
          setFormData({
            name: multilingualData.name,
            icon: multilingualData.icon,
            color: multilingualData.color
          });
        } else {
          setFormData({
            name: shop.name,
            icon: shop.icon,
            color: shop.color || "#3B82F6"
          });
        }
      }
    }
  }, [visible, shop?.id, language]);

  // Handle animations
  useEffect(() => {
    if (visible) {
      // Reset animation values
      slideAnim.setValue(modalHeight);
      backdropAnim.setValue(0);
      
      // Start animation
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
  }, [visible, modalHeight, slideAnim, backdropAnim]);

  // Auto-suggest icon based on shop name (debounced)
  useEffect(() => {
    if (!shop && formData.name.trim() && visible) {
      const timeoutId = setTimeout(() => {
        const shopIconMapping = getShopIconMappingForLanguage(language);
        const suggestedIcon = shopIconMapping[formData.name.trim()];
        if (suggestedIcon && suggestedIcon !== formData.icon) {
          setFormData(prev => ({ ...prev, icon: suggestedIcon }));
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.name, shop, language, formData.icon, visible]);

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) return;
    
    const shopDataToSave: Omit<Shop, "id"> = {
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      isOriginal: false,
      isCustom: true,
      language: language,
    };

    if (shop) {
      shopDataToSave.language = shop.language;
      shopDataToSave.isFavorite = shop.isFavorite;
      shopDataToSave.isOriginal = shop.isOriginal;
      shopDataToSave.isCustom = shop.isCustom || !shop.isOriginal;
      
      const existingMultilingualData = shop.multilingualData || {};
      shopDataToSave.multilingualData = {
        ...existingMultilingualData,
        [language]: {
          name: formData.name.trim(),
          icon: formData.icon,
          color: formData.color,
        }
      };
      
      if (shop.language === language || !shop.language) {
        shopDataToSave.name = formData.name.trim();
        shopDataToSave.icon = formData.icon;
        shopDataToSave.color = formData.color;
      }
    } else {
      shopDataToSave.multilingualData = {
        [language]: {
          name: formData.name.trim(),
          icon: formData.icon,
          color: formData.color,
        }
      };
    }
    
    onSave(shopDataToSave);
    handleClose();
  }, [formData, language, shop, onSave]);

  const handleClose = useCallback(() => {
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
      onClose();
    });
  }, [slideAnim, backdropAnim, modalHeight, onClose]);

  const handleIconSelect = useCallback((selectedIcon: string) => {
    setFormData(prev => ({ ...prev, icon: selectedIcon }));
  }, []);

  const handleColorSelect = useCallback((selectedColor: string) => {
    setFormData(prev => ({ ...prev, color: selectedColor }));
  }, []);

  const handleNameChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, name: text }));
  }, []);

  const styles = useMemo(() => StyleSheet.create({
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
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 40,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 18,
      alignItems: "center",
      marginTop: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    saveButtonDisabled: {
      backgroundColor: colors.darkGray,
      shadowOpacity: 0,
      elevation: 0,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
    },
  }), [colors, modalHeight]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
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
            onPress={handleClose}
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
          <KeyboardAvoidingView 
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.title}>
                  {shop ? t("editShop") : t("addShop")}
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={20} color={colors.darkGray} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("shopName")}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={handleNameChange}
                  placeholder={t("enterShopName")}
                  placeholderTextColor={colors.darkGray}
                  autoFocus={false}
                />
              </View>

              <IconSelector
                selectedIcon={formData.icon}
                selectedColor={formData.color}
                onIconSelect={handleIconSelect}
                onColorSelect={handleColorSelect}
              />

              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  !formData.name.trim() && styles.saveButtonDisabled
                ]} 
                onPress={handleSave}
                disabled={!formData.name.trim()}
              >
                <Text style={styles.saveButtonText}>{t("save")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}