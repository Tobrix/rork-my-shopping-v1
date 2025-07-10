import React, { useState, useRef, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  ScrollView,
  Switch,
  Animated,
  Platform,
  Dimensions
} from "react-native";
import { useExpenseStore } from "@/store/expenseStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { ContactForm } from "@/components/ContactForm";
import { AppInfoModal } from "@/components/AppInfoModal";
import { currencies, Currency } from "@/constants/currencies";
import { languages, Language } from "@/constants/languages";
import { 
  ChevronRight, 
  X, 
  Info, 
  MessageCircle,
  ArrowRightLeft,
  ChevronDown
} from "lucide-react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { 
    settings, 
    updateSettings, 
    convertCurrency, 
    isConverting
  } = useExpenseStore();
  
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [appInfoModalVisible, setAppInfoModalVisible] = useState(false);

  // Enhanced animation values for smoother experience
  const conversionAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animation values for modal-style dropdowns
  const currencyModalFadeAnim = useRef(new Animated.Value(0)).current;
  const currencyModalSlideAnim = useRef(new Animated.Value(50)).current;
  const languageModalFadeAnim = useRef(new Animated.Value(0)).current;
  const languageModalSlideAnim = useRef(new Animated.Value(50)).current;
  const themeModalFadeAnim = useRef(new Animated.Value(0)).current;
  const themeModalSlideAnim = useRef(new Animated.Value(50)).current;

  const currentCurrency = currencies.find(c => c.code === settings.currency) || currencies[0];
  const currentLanguage = languages.find(l => l.code === settings.language) || languages[0];

  const themeOptions = [
    { key: 'system', label: t("system") },
    { key: 'light', label: t("light") },
    { key: 'dark', label: t("dark") },
  ];

  const currentTheme = themeOptions.find(t => t.key === settings.darkMode) || themeOptions[0];

  // Check if currency mode is auto (toggle ON) or manual (toggle OFF)
  const isAutoCurrency = settings.currencyMode === "auto-language";

  // Enhanced currency conversion animation
  useEffect(() => {
    if (isConverting) {
      // Start conversion animation with smoother timing
      Animated.loop(
        Animated.sequence([
          Animated.timing(conversionAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(conversionAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotate arrow animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Stop animations smoothly
      conversionAnim.stopAnimation();
      rotateAnim.stopAnimation();
      Animated.parallel([
        Animated.timing(conversionAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isConverting]);

  // Currency modal animation
  useEffect(() => {
    if (currencyDropdownVisible) {
      currencyModalFadeAnim.setValue(0);
      currencyModalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(currencyModalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(currencyModalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currencyDropdownVisible]);

  // Language modal animation
  useEffect(() => {
    if (languageDropdownVisible) {
      languageModalFadeAnim.setValue(0);
      languageModalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(languageModalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(languageModalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [languageDropdownVisible]);

  // Theme modal animation
  useEffect(() => {
    if (themeModalVisible) {
      themeModalFadeAnim.setValue(0);
      themeModalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(themeModalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(themeModalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [themeModalVisible]);

  const handleCurrencySelect = async (currency: Currency) => {
    handleCurrencyModalClose();
    
    if (currency.code !== settings.currency) {
      await convertCurrency(currency.code, true);
    }
  };

  const handleLanguageSelect = (language: Language) => {
    updateSettings({ language: language.code });
    handleLanguageModalClose();
  };

  const handleThemeSelect = (theme: { key: string; label: string }) => {
    updateSettings({ darkMode: theme.key as "system" | "light" | "dark" });
    handleThemeModalClose();
  };

  const handleCurrencyModalClose = () => {
    Animated.parallel([
      Animated.timing(currencyModalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(currencyModalSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrencyDropdownVisible(false);
    });
  };

  const handleLanguageModalClose = () => {
    Animated.parallel([
      Animated.timing(languageModalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(languageModalSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLanguageDropdownVisible(false);
    });
  };

  const handleThemeModalClose = () => {
    Animated.parallel([
      Animated.timing(themeModalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(themeModalSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setThemeModalVisible(false);
    });
  };

  const handleCurrencyModeToggle = (value: boolean) => {
    // ON = auto-language, OFF = manual
    const newMode = value ? "auto-language" : "manual";
    updateSettings({ currencyMode: newMode });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "visible",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      position: 'relative',
      zIndex: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      padding: 20,
      paddingBottom: 8,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    currencySettingItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
      fontWeight: "500",
    },
    settingValue: {
      fontSize: 14,
      color: colors.darkGray,
    },
    currencyInfo: {
      fontSize: 12,
      color: colors.darkGray,
      fontStyle: "italic",
      marginTop: 2,
    },
    currencyToggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 12,
    },
    toggleLabel: {
      fontSize: 12,
      color: colors.darkGray,
      marginRight: 8,
      fontWeight: "500",
    },
    // Enhanced conversion animation styles
    conversionContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      paddingRight: 8,
    },
    conversionText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "600",
      flexShrink: 1,
    },
    conversionIcon: {
      marginLeft: 6,
      flexShrink: 0,
    },
    // Bottom slide modal styles
    bottomModalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 9999,
    },
    bottomModalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "70%",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
      zIndex: 10000,
    },
    bottomModalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    bottomModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    // Currency modal styles
    currencyOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.lightGray,
    },
    currencyOptionSelected: {
      backgroundColor: colors.primary + '20',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    currencyOptionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    currencyOptionCode: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginRight: 12,
    },
    currencyOptionName: {
      fontSize: 14,
      color: colors.darkGray,
      flex: 1,
    },
    currencyOptionSymbol: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
    },
    currencyOptionTextSelected: {
      color: colors.primary,
      fontWeight: "700",
    },
    // Language modal styles
    languageOption: {
      flexDirection: "column",
      alignItems: "flex-start",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.lightGray,
    },
    languageOptionSelected: {
      backgroundColor: colors.primary + '20',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    languageNativeName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    languageEnglishName: {
      fontSize: 14,
      color: colors.darkGray,
    },
    languageOptionTextSelected: {
      color: colors.primary,
      fontWeight: "700",
    },
    // Theme modal styles
    themeOption: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: colors.lightGray,
    },
    themeOptionSelected: {
      backgroundColor: colors.primary + '20',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    themeOptionText: {
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
      fontWeight: "500",
    },
    themeOptionTextSelected: {
      color: colors.primary,
      fontWeight: "700",
    },
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const opacityInterpolate = conversionAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 1, 0.4],
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings")}</Text>
          
          {/* Currency Setting with Toggle */}
          <TouchableOpacity 
            style={styles.currencySettingItem} 
            onPress={() => setCurrencyDropdownVisible(true)}
            disabled={isConverting}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{t("currency")}</Text>
              {isConverting ? (
                <View style={styles.conversionContainer}>
                  <Text style={styles.conversionText}>
                    {t("convertingCurrency")}
                  </Text>
                  <Animated.View 
                    style={[
                      styles.conversionIcon,
                      {
                        transform: [{ rotate: rotateInterpolate }],
                        opacity: opacityInterpolate,
                      }
                    ]}
                  >
                    <ArrowRightLeft size={12} color={colors.primary} />
                  </Animated.View>
                </View>
              ) : (
                <>
                  <Text style={styles.settingValue}>
                    {`${currentCurrency.name} (${currentCurrency.code})`}
                  </Text>
                  {isAutoCurrency && (
                    <Text style={styles.currencyInfo}>{t("autoSwitchCurrency")}</Text>
                  )}
                </>
              )}
            </View>
            <View style={styles.currencyToggleContainer}>
              <Text style={styles.toggleLabel}>{isAutoCurrency ? t("auto") : t("manual")}</Text>
              <Switch
                value={isAutoCurrency}
                onValueChange={handleCurrencyModeToggle}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <ChevronRight size={20} color={colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => setLanguageDropdownVisible(true)}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{t("language")}</Text>
              <Text style={styles.settingValue}>{currentLanguage.nativeName}</Text>
            </View>
            <ChevronRight size={20} color={colors.darkGray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => setThemeModalVisible(true)}
          >
            <View>
              <Text style={styles.settingLabel}>{t("themeMode")}</Text>
              <Text style={styles.settingValue}>{currentTheme.label}</Text>
            </View>
            <ChevronRight size={20} color={colors.darkGray} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("about")}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => setAppInfoModalVisible(true)}
          >
            <View>
              <Text style={styles.settingLabel}>{t("appInfo")}</Text>
              <Text style={styles.settingValue}>{t("appInfoSubtitle")}</Text>
            </View>
            <Info size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("contact")}</Text>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => setContactFormVisible(true)}
          >
            <View>
              <Text style={styles.settingLabel}>{t("techSupport")}</Text>
              <Text style={styles.settingValue}>{t("techSupportSubtitle")}</Text>
            </View>
            <MessageCircle size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Currency Modal - Bottom slide */}
      <Modal
        visible={currencyDropdownVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCurrencyModalClose}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity 
          style={styles.bottomModalContainer}
          activeOpacity={1}
          onPress={handleCurrencyModalClose}
        >
          <Animated.View 
            style={[
              styles.bottomModalContent,
              {
                opacity: currencyModalFadeAnim,
                transform: [{ translateY: currencyModalSlideAnim }],
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.bottomModalHeader}>
                <Text style={styles.bottomModalTitle}>{t("currency")}</Text>
                <TouchableOpacity onPress={handleCurrencyModalClose}>
                  <X size={24} color={colors.darkGray} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {currencies.map((currencyItem) => (
                  <TouchableOpacity
                    key={currencyItem.code}
                    style={[
                      styles.currencyOption,
                      currencyItem.code === settings.currency && styles.currencyOptionSelected
                    ]}
                    onPress={() => handleCurrencySelect(currencyItem)}
                  >
                    <View style={styles.currencyOptionLeft}>
                      <Text 
                        style={[
                          styles.currencyOptionCode,
                          currencyItem.code === settings.currency && styles.currencyOptionTextSelected
                        ]}
                      >
                        {currencyItem.code}
                      </Text>
                      <Text 
                        style={[
                          styles.currencyOptionName,
                          currencyItem.code === settings.currency && styles.currencyOptionTextSelected
                        ]}
                      >
                        {currencyItem.name}
                      </Text>
                    </View>
                    <Text 
                      style={[
                        styles.currencyOptionSymbol,
                        currencyItem.code === settings.currency && styles.currencyOptionTextSelected
                      ]}
                    >
                      {currencyItem.symbol}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Language Modal - Bottom slide */}
      <Modal
        visible={languageDropdownVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleLanguageModalClose}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity 
          style={styles.bottomModalContainer}
          activeOpacity={1}
          onPress={handleLanguageModalClose}
        >
          <Animated.View 
            style={[
              styles.bottomModalContent,
              {
                opacity: languageModalFadeAnim,
                transform: [{ translateY: languageModalSlideAnim }],
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.bottomModalHeader}>
                <Text style={styles.bottomModalTitle}>{currentLanguage.nativeName}</Text>
                <TouchableOpacity onPress={handleLanguageModalClose}>
                  <X size={24} color={colors.darkGray} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {languages.map((languageItem) => (
                  <TouchableOpacity
                    key={languageItem.code}
                    style={[
                      styles.languageOption,
                      languageItem.code === settings.language && styles.languageOptionSelected
                    ]}
                    onPress={() => handleLanguageSelect(languageItem)}
                  >
                    <Text 
                      style={[
                        styles.languageNativeName,
                        languageItem.code === settings.language && styles.languageOptionTextSelected
                      ]}
                    >
                      {languageItem.nativeName}
                    </Text>
                    <Text 
                      style={[
                        styles.languageEnglishName,
                        languageItem.code === settings.language && styles.languageOptionTextSelected
                      ]}
                    >
                      {languageItem.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Theme Modal - Bottom slide */}
      <Modal
        visible={themeModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleThemeModalClose}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity 
          style={styles.bottomModalContainer}
          activeOpacity={1}
          onPress={handleThemeModalClose}
        >
          <Animated.View 
            style={[
              styles.bottomModalContent,
              {
                opacity: themeModalFadeAnim,
                transform: [{ translateY: themeModalSlideAnim }],
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.bottomModalHeader}>
                <Text style={styles.bottomModalTitle}>{t("themeMode")}</Text>
                <TouchableOpacity onPress={handleThemeModalClose}>
                  <X size={20} color={colors.darkGray} />
                </TouchableOpacity>
              </View>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.themeOption,
                    option.key === settings.darkMode && styles.themeOptionSelected
                  ]}
                  onPress={() => handleThemeSelect(option)}
                >
                  <Text 
                    style={[
                      styles.themeOptionText,
                      option.key === settings.darkMode && styles.themeOptionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Contact Form - Bottom slide */}
      {contactFormVisible && (
        <ContactForm
          visible={contactFormVisible}
          onClose={() => setContactFormVisible(false)}
          slideMode={false}
          bottomSlide={true}
        />
      )}

      {appInfoModalVisible && (
        <AppInfoModal
          visible={appInfoModalVisible}
          onClose={() => setAppInfoModalVisible(false)}
        />
      )}
    </View>
  );
}