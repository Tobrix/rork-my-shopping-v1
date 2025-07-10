import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Keyboard,
  Modal,
  ScrollView,
  Animated
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useExpenseStore } from "@/store/expenseStore";
import { currencies } from "@/constants/currencies";
import { convertAmount, getExchangeRates } from "@/utils/currencyConverter";
import { formatCurrency } from "@/utils/currencyUtils";
import { ChevronDown, X } from "lucide-react-native";

interface CurrencyAmountInputProps {
  amount: string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  placeholder: string;
  label: string;
  showDropdown?: boolean;
  onToggleDropdown?: () => void;
}

export function CurrencyAmountInput({ 
  amount, 
  currency, 
  onAmountChange, 
  onCurrencyChange, 
  placeholder, 
  label,
  showDropdown = false,
  onToggleDropdown
}: CurrencyAmountInputProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const appCurrency = useExpenseStore((state) => state.settings.currency);
  
  const [isFocused, setIsFocused] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Animation for dropdown and conversion
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const conversionAnim = useRef(new Animated.Value(0)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;
  
  // Enhanced modal animation
  const modalFadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(50)).current;

  const selectedCurrencyData = currencies.find(c => c.code === currency);
  const appCurrencyData = currencies.find(c => c.code === appCurrency);

  // Convert amount when currency or amount changes
  useEffect(() => {
    const convertCurrency = async () => {
      if (!amount || currency === appCurrency) {
        setConvertedAmount(null);
        return;
      }

      const numericAmount = parseFloat(amount.replace(',', '.'));
      if (isNaN(numericAmount)) {
        setConvertedAmount(null);
        return;
      }

      setIsConverting(true);
      try {
        const rates = await getExchangeRates(currency);
        const converted = convertAmount(numericAmount, currency, appCurrency, rates);
        setConvertedAmount(converted);
      } catch (error) {
        console.error('Currency conversion failed:', error);
        setConvertedAmount(null);
      } finally {
        setIsConverting(false);
      }
    };

    convertCurrency();
  }, [amount, currency, appCurrency]);

  // Animate dropdown
  useEffect(() => {
    if (showDropdown) {
      Animated.parallel([
        Animated.spring(dropdownAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(arrowRotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(arrowRotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showDropdown]);

  // Animate conversion row
  useEffect(() => {
    if (showConversion) {
      Animated.spring(conversionAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(conversionAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [convertedAmount, currency, appCurrency, amount]);

  // Enhanced modal animation
  useEffect(() => {
    if (showCurrencyPicker) {
      modalFadeAnim.setValue(0);
      modalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(modalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCurrencyPicker]);

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
      onAmountChange(`${firstPart}${separator}${secondPart}`);
    } else {
      onAmountChange(cleanedText);
    }
  };

  const handleCurrencySelect = (selectedCurrency: string) => {
    onCurrencyChange(selectedCurrency);
    handleCurrencyPickerClose();
    if (onToggleDropdown) {
      onToggleDropdown();
    }
  };

  const handleCurrencyPickerClose = () => {
    Animated.parallel([
      Animated.timing(modalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCurrencyPicker(false);
    });
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    inputContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      overflow: 'hidden',
    },
    mainInputRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    amountInput: {
      flex: 1,
      padding: 18,
      fontSize: 16,
      color: colors.text,
    },
    currencySelector: {
      paddingHorizontal: 18,
      paddingVertical: 18,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      minWidth: 100,
    },
    currencyCode: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginRight: 8,
    },
    // Fixed conversion row styling
    conversionRow: {
      backgroundColor: colors.lightGray,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      overflow: 'hidden',
    },
    conversionText: {
      fontSize: 14,
      color: colors.darkGray,
      textAlign: "center",
    },
    convertedAmount: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      textAlign: "center",
      marginTop: 4,
    },
    // Currency dropdown styles with enhanced z-index for web
    currencyDropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 12,
      zIndex: Platform.select({
        web: 99999999,
        default: 99999,
      }),
      marginTop: 8,
      maxHeight: 200,
    },
    currencyDropdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    currencyDropdownItemLast: {
      borderBottomWidth: 0,
    },
    selectedCurrencyDropdownItem: {
      backgroundColor: colors.primary + '10',
    },
    currencyDropdownItemLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    currencyDropdownItemCode: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginRight: 12,
    },
    currencyDropdownItemName: {
      fontSize: 14,
      color: colors.darkGray,
    },
    currencyDropdownItemSymbol: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
    },
    selectedCurrencyDropdownItemText: {
      fontWeight: "600",
      color: colors.primary,
    },
    // Show more button styling
    showMoreButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 0,
    },
    showMoreText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    // Enhanced currency picker modal styles with higher z-index
    pickerModalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: Platform.select({
        web: 999999999,
        default: 100000,
      }),
    },
    pickerModalContent: {
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
      zIndex: Platform.select({
        web: 999999999,
        default: 100000,
      }),
    },
    pickerHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    currencyPickerItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedPickerItem: {
      backgroundColor: colors.secondary,
    },
    currencyPickerItemLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    currencyPickerCode: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginRight: 12,
    },
    currencyPickerName: {
      fontSize: 14,
      color: colors.darkGray,
    },
    currencyPickerSymbol: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "600",
    },
    selectedPickerItemText: {
      fontWeight: "600",
      color: colors.primary,
    },
  });

  // Only show conversion if currencies are different and there's a converted amount
  const showConversion = currency !== appCurrency && convertedAmount !== null && amount;

  // Calculate arrow rotation
  const arrowRotationDegrees = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.mainInputRow}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleTextChange}
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={colors.darkGray}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          
          <TouchableOpacity 
            style={styles.currencySelector}
            onPress={() => {
              if (onToggleDropdown) {
                onToggleDropdown();
              } else {
                setShowCurrencyPicker(true);
              }
            }}
          >
            <Text style={styles.currencyCode}>
              {selectedCurrencyData?.code || currency}
            </Text>
            <Animated.View style={{ transform: [{ rotate: arrowRotationDegrees }] }}>
              <ChevronDown size={16} color={colors.darkGray} />
            </Animated.View>
          </TouchableOpacity>
        </View>
        
        {/* Animated conversion row */}
        {showConversion && (
          <Animated.View 
            style={[
              styles.conversionRow,
              {
                opacity: conversionAnim,
                maxHeight: conversionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
              }
            ]}
          >
            <Text style={styles.conversionText}>
              {isConverting ? t("converting") + "..." : t("convertedTo") + " " + appCurrency}
            </Text>
            {!isConverting && (
              <Text style={styles.convertedAmount}>
                {formatCurrency(convertedAmount, appCurrency)}
              </Text>
            )}
          </Animated.View>
        )}
      </View>

      {/* Currency Dropdown */}
      {showDropdown && (
        <Animated.View 
          style={[
            styles.currencyDropdown,
            {
              opacity: dropdownAnim,
              transform: [
                {
                  scale: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {currencies.slice(0, 8).map((currencyItem, index) => (
              <TouchableOpacity
                key={currencyItem.code}
                style={[
                  styles.currencyDropdownItem,
                  index === Math.min(7, currencies.length - 1) && styles.currencyDropdownItemLast,
                  currencyItem.code === currency && styles.selectedCurrencyDropdownItem
                ]}
                onPress={() => handleCurrencySelect(currencyItem.code)}
              >
                <View style={styles.currencyDropdownItemLeft}>
                  <Text 
                    style={[
                      styles.currencyDropdownItemCode,
                      currencyItem.code === currency && styles.selectedCurrencyDropdownItemText
                    ]}
                  >
                    {currencyItem.code}
                  </Text>
                  <Text style={styles.currencyDropdownItemName}>
                    {currencyItem.name}
                  </Text>
                </View>
                <Text 
                  style={[
                    styles.currencyDropdownItemSymbol,
                    currencyItem.code === currency && styles.selectedCurrencyDropdownItemText
                  ]}
                >
                  {currencyItem.symbol}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.currencyDropdownItem, styles.currencyDropdownItemLast, styles.showMoreButton]}
              onPress={() => {
                setShowCurrencyPicker(true);
                if (onToggleDropdown) {
                  onToggleDropdown();
                }
              }}
            >
              <Text style={styles.showMoreText}>
                {t("showMore")}...
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}

      {/* Enhanced Currency Picker Modal */}
      <Modal
        visible={showCurrencyPicker}
        animationType="none"
        transparent={true}
        onRequestClose={handleCurrencyPickerClose}
      >
        <Animated.View 
          style={[
            styles.pickerModalContainer,
            {
              opacity: modalFadeAnim,
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.pickerModalContent,
              {
                transform: [{ translateY: modalSlideAnim }],
              }
            ]}
          >
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{t("selectCurrency")}</Text>
              <TouchableOpacity onPress={handleCurrencyPickerClose}>
                <X size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {currencies.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.currencyPickerItem,
                    item.code === currency && styles.selectedPickerItem
                  ]}
                  onPress={() => handleCurrencySelect(item.code)}
                >
                  <View style={styles.currencyPickerItemLeft}>
                    <Text 
                      style={[
                        styles.currencyPickerCode,
                        item.code === currency && styles.selectedPickerItemText
                      ]}
                    >
                      {item.code}
                    </Text>
                    <Text style={styles.currencyPickerName}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={styles.currencyPickerSymbol}>
                    {item.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}