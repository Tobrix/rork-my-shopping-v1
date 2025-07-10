import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated
} from "react-native";
import { useExpenseStore } from "@/store/expenseStore";
import { Expense } from "@/types/expense";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { CurrencyAmountInput } from "@/components/CurrencyAmountInput";
import { IconComponent } from "@/components/IconComponent";
import { ShopSearchModal } from "@/components/ShopSearchModal";
import { Calendar, X, TrendingUp, TrendingDown, ChevronDown } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertAmount, getExchangeRates } from "@/utils/currencyConverter";

interface ExpenseFormProps {
  expense?: Expense;
  visible: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, "id">) => void;
}

export function ExpenseForm({ expense, visible, onClose, onSave }: ExpenseFormProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const getVisibleShops = useExpenseStore((state) => state.getVisibleShops);
  const settings = useExpenseStore((state) => state.settings);
  
  const [amount, setAmount] = useState("");
  const [shopId, setShopId] = useState("");
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedCurrency, setSelectedCurrency] = useState(settings.currency);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showShopPicker, setShowShopPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const noteInputRef = useRef<TextInput>(null);
  const typePickerRef = useRef<View>(null);
  const currencyPickerRef = useRef<View>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const typeDropdownAnim = useRef(new Animated.Value(0)).current;
  const typeArrowRotation = useRef(new Animated.Value(0)).current;
  
  // Date picker modal animation
  const dateModalFadeAnim = useRef(new Animated.Value(0)).current;
  const dateModalSlideAnim = useRef(new Animated.Value(50)).current;

  // Get visible shops (custom shops + current language default shops)
  const filteredShops = getVisibleShops();

  useEffect(() => {
    if (expense) {
      setAmount(expense.originalAmount ? expense.originalAmount.toString().replace('.', ',') : expense.amount.toString().replace('.', ','));
      setShopId(expense.shopId);
      setDate(new Date(expense.date));
      setNote(expense.note || "");
      setType(expense.type);
      setSelectedCurrency(expense.originalCurrency || settings.currency);
    } else {
      setAmount("");
      setShopId("");
      setDate(new Date());
      setNote("");
      setType('expense');
      setSelectedCurrency(settings.currency);
    }
  }, [expense, visible, settings.currency]);

  useEffect(() => {
    if (visible) {
      // Reset animation values
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
      slideAnim.setValue(30);
      
      // Start entrance animation with smoother timing
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (showTypePicker) {
      Animated.parallel([
        Animated.spring(typeDropdownAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(typeArrowRotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(typeDropdownAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(typeArrowRotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showTypePicker]);

  // Date picker modal animation
  useEffect(() => {
    if (showDatePicker && Platform.OS === "ios") {
      dateModalFadeAnim.setValue(0);
      dateModalSlideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(dateModalFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(dateModalSlideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showDatePicker]);

  const handleSave = async () => {
    if (!amount) return;
    if (type === 'expense' && !shopId) return;
    
    // Convert comma to dot for parsing
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount)) return;
    
    // Get selected shop data for preservation
    const selectedShop = filteredShops.find(s => s.id === shopId);
    
    let finalAmount = numericAmount;
    
    // Convert currency if different from app currency
    if (selectedCurrency !== settings.currency) {
      try {
        const rates = await getExchangeRates(selectedCurrency);
        finalAmount = convertAmount(numericAmount, selectedCurrency, settings.currency, rates);
      } catch (error) {
        console.error('Currency conversion failed:', error);
        // Continue with original amount if conversion fails
      }
    }
    
    const expenseData: Omit<Expense, "id"> = {
      amount: finalAmount,
      shopId: type === 'income' ? 'income' : shopId,
      date: date.toISOString(),
      note: note.trim() || undefined,
      type,
      originalCurrency: selectedCurrency,
      originalAmount: numericAmount,
    };

    // Store original shop data to preserve across language changes
    if (selectedShop && type === 'expense') {
      // Check if shop has multilingual data for current language
      const multilingualData = selectedShop.multilingualData?.[language];
      if (multilingualData) {
        expenseData.originalShopName = multilingualData.name;
        expenseData.originalShopIcon = multilingualData.icon;
        expenseData.originalShopColor = multilingualData.color;
      } else {
        expenseData.originalShopName = selectedShop.name;
        expenseData.originalShopIcon = selectedShop.icon;
        expenseData.originalShopColor = selectedShop.color;
      }
    }
    
    onSave(expenseData);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Web-specific date handling
  const handleWebDateChange = (dateString: string) => {
    if (!dateString) return;
    
    try {
      const newDate = new Date(dateString + 'T00:00:00');
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      }
    } catch (error) {
      console.warn('Invalid date:', dateString);
    }
  };

  const formatDateForInput = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  const openWebDatePicker = () => {
    if (Platform.OS !== 'web') return;
    
    try {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = formatDateForInput(date);
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      input.style.opacity = '0';
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.value) {
          handleWebDateChange(target.value);
        }
        try {
          document.body.removeChild(input);
        } catch (e) {
          // Input already removed
        }
      };
      
      input.onblur = () => {
        try {
          document.body.removeChild(input);
        } catch (e) {
          // Input already removed
        }
      };
      
      document.body.appendChild(input);
      input.focus();
      input.click();
    } catch (error) {
      console.warn('Failed to open web date picker:', error);
    }
  };

  const handleNoteInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleClose = () => {
    // Exit animation with smoother timing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleDatePickerClose = () => {
    if (Platform.OS === "ios") {
      Animated.parallel([
        Animated.timing(dateModalFadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(dateModalSlideAnim, {
          toValue: 50,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowDatePicker(false);
      });
    } else {
      setShowDatePicker(false);
    }
  };

  const handleShopSelect = (shop: any) => {
    setShopId(shop.id);
  };

  const handleTypePress = () => {
    if (typePickerRef.current) {
      typePickerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setShowTypePicker(!showTypePicker);
      });
    }
  };

  const handleCurrencyToggle = () => {
    setShowCurrencyPicker(!showCurrencyPicker);
  };

  const getShopDisplayData = (shop: any) => {
    // Check if shop has multilingual data for current language
    const multilingualData = shop.multilingualData?.[language];
    if (multilingualData) {
      return {
        name: multilingualData.name,
        icon: multilingualData.icon,
        color: multilingualData.color,
      };
    }
    return {
      name: shop.name,
      icon: shop.icon,
      color: shop.color || colors.primary,
    };
  };

  const selectedShop = filteredShops.find(s => s.id === shopId);
  const selectedShopDisplay = selectedShop ? getShopDisplayData(selectedShop) : null;

  const typeOptions = [
    { value: 'expense', label: t("expense"), icon: TrendingDown, color: colors.error },
    { value: 'income', label: t("income"), icon: TrendingUp, color: colors.success },
  ];

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: Platform.select({
        web: 999999,
        default: 1000,
      }),
    },
    keyboardAvoidingView: {
      flex: 1,
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 24,
      margin: 20,
      maxHeight: "90%",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.3,
      shadowRadius: 25,
      elevation: 15,
      zIndex: Platform.select({
        web: 999999,
        default: 1000,
      }),
    },
    scrollContent: {
      padding: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
    },
    formGroup: {
      marginBottom: 24,
      position: 'relative',
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    typeSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    typeSelectorLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    typeIcon: {
      marginRight: 12,
    },
    shopSelector: {
      flexDirection: "row",
      alignItems: "center",
    },
    shopIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    inputText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    placeholder: {
      fontSize: 16,
      color: colors.darkGray,
    },
    dateInput: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    // Web-specific date input styles
    webDateContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    webDateInput: {
      flex: 1,
      padding: 18,
      fontSize: 16,
      color: colors.text,
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    webCalendarButton: {
      padding: 18,
      backgroundColor: colors.lightGray,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: "top",
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      marginTop: 32,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    saveButtonDisabled: {
      backgroundColor: colors.darkGray,
      shadowOpacity: 0,
      elevation: 0,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: "700",
    },
    // Type dropdown styles with enhanced z-index for web
    typeDropdown: {
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
        web: 9999999,
        default: 1000,
      }),
      marginTop: 8,
    },
    typeDropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    typeDropdownItemLast: {
      borderBottomWidth: 0,
    },
    selectedTypeDropdownItem: {
      backgroundColor: colors.primary + '10',
    },
    typeDropdownItemIcon: {
      marginRight: 12,
    },
    typeDropdownItemText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    selectedTypeDropdownItemText: {
      fontWeight: "600",
      color: colors.primary,
    },
    // Enhanced modal picker styles for iOS with higher z-index
    pickerModalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: Platform.select({
        web: 99999999,
        default: 10000,
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
        web: 99999999,
        default: 10000,
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
    datePicker: {
      marginBottom: 20,
    },
    pickerConfirmButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      marginTop: 16,
    },
    pickerConfirmButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
  });

  const isValidAmount = amount && !isNaN(parseFloat(amount.replace(',', '.')));
  const canSave = isValidAmount && (type === 'income' || shopId);

  // Calculate arrow rotation
  const arrowRotation = typeArrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ],
              }
            ]}
          >
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Text style={styles.title}>
                  {expense ? t("editExpense") : t("addExpense")}
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={20} color={colors.darkGray} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup} ref={typePickerRef}>
                <Text style={styles.label}>{t("type")}</Text>
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={handleTypePress}
                >
                  <View style={styles.typeSelector}>
                    <View style={styles.typeSelectorLeft}>
                      {typeOptions.find(opt => opt.value === type) && (
                        <View style={styles.typeIcon}>
                          {React.createElement(
                            typeOptions.find(opt => opt.value === type)!.icon,
                            { size: 20, color: typeOptions.find(opt => opt.value === type)!.color }
                          )}
                        </View>
                      )}
                      <Text style={styles.inputText}>
                        {typeOptions.find(opt => opt.value === type)?.label || t("selectType")}
                      </Text>
                    </View>
                    <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
                      <ChevronDown size={20} color={colors.darkGray} />
                    </Animated.View>
                  </View>
                </TouchableOpacity>

                {/* Type Dropdown */}
                {showTypePicker && (
                  <Animated.View 
                    style={[
                      styles.typeDropdown,
                      {
                        opacity: typeDropdownAnim,
                        transform: [
                          {
                            scale: typeDropdownAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.95, 1],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {typeOptions.map((option, index) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.typeDropdownItem,
                          index === typeOptions.length - 1 && styles.typeDropdownItemLast,
                          option.value === type && styles.selectedTypeDropdownItem
                        ]}
                        onPress={() => {
                          setType(option.value as 'income' | 'expense');
                          if (option.value === 'income') {
                            setShopId('');
                          }
                          setShowTypePicker(false);
                        }}
                      >
                        <View style={styles.typeDropdownItemIcon}>
                          {React.createElement(option.icon, { 
                            size: 20, 
                            color: option.value === type ? colors.primary : option.color 
                          })}
                        </View>
                        <Text 
                          style={[
                            styles.typeDropdownItemText,
                            option.value === type && styles.selectedTypeDropdownItemText
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
              </View>

              <View style={styles.formGroup} ref={currencyPickerRef}>
                <Text style={styles.label}>{t("amount")}</Text>
                <CurrencyAmountInput
                  amount={amount}
                  currency={selectedCurrency}
                  onAmountChange={setAmount}
                  onCurrencyChange={setSelectedCurrency}
                  placeholder={t("enterAmount")}
                  label=""
                  showDropdown={showCurrencyPicker}
                  onToggleDropdown={handleCurrencyToggle}
                />
              </View>

              {type === 'expense' && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>{t("shop")}</Text>
                  <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => {
                      setShowShopPicker(true);
                    }}
                  >
                    <View style={styles.shopSelector}>
                      {selectedShopDisplay && (
                        <View style={[
                          styles.shopIcon, 
                          { backgroundColor: (selectedShopDisplay.color || colors.primary) + '20' }
                        ]}>
                          <IconComponent 
                            name={selectedShopDisplay.icon} 
                            size={18} 
                            color={selectedShopDisplay.color || colors.primary} 
                          />
                        </View>
                      )}
                      <Text style={selectedShopDisplay ? styles.inputText : styles.placeholder}>
                        {selectedShopDisplay ? selectedShopDisplay.name : t("selectShop")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("date")}</Text>
                {Platform.OS === 'web' ? (
                  // Web-specific date input with better functionality
                  <View style={styles.webDateContainer}>
                    <TextInput
                      style={styles.webDateInput}
                      value={formatDateForInput(date)}
                      onChangeText={handleWebDateChange}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.darkGray}
                    />
                    <TouchableOpacity 
                      style={styles.webCalendarButton}
                      onPress={openWebDatePicker}
                    >
                      <Calendar size={20} color={colors.darkGray} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Mobile date input (existing functionality)
                  <TouchableOpacity 
                    style={[styles.input, styles.dateInput]} 
                    onPress={() => {
                      setShowDatePicker(true);
                    }}
                  >
                    <Text style={styles.inputText}>
                      {date.toLocaleDateString()}
                    </Text>
                    <Calendar size={20} color={colors.darkGray} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("note")} ({t("optional")})</Text>
                <TextInput
                  ref={noteInputRef}
                  style={[styles.input, styles.textArea]}
                  value={note}
                  onChangeText={setNote}
                  placeholder={t("note")}
                  placeholderTextColor={colors.darkGray}
                  multiline
                  onFocus={handleNoteInputFocus}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  !canSave && styles.saveButtonDisabled
                ]} 
                onPress={handleSave}
                disabled={!canSave}
              >
                <Text style={styles.saveButtonText}>{t("save")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>

        {/* Shop Search Modal */}
        {type === 'expense' && (
          <ShopSearchModal
            visible={showShopPicker}
            onClose={() => setShowShopPicker(false)}
            onSelectShop={handleShopSelect}
            selectedShopId={shopId}
          />
        )}

        {/* Enhanced Date Picker for iOS and Android only */}
        {showDatePicker && Platform.OS !== 'web' && (
          Platform.OS === "ios" ? (
            <Modal
              visible={showDatePicker}
              animationType="none"
              transparent={true}
              onRequestClose={handleDatePickerClose}
            >
              <Animated.View 
                style={[
                  styles.pickerModalContainer,
                  {
                    opacity: dateModalFadeAnim,
                  }
                ]}
              >
                <Animated.View 
                  style={[
                    styles.pickerModalContent,
                    {
                      transform: [{ translateY: dateModalSlideAnim }],
                    }
                  ]}
                >
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>{t("selectDate")}</Text>
                    <TouchableOpacity onPress={handleDatePickerClose}>
                      <X size={24} color={colors.darkGray} />
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                  />
                  <TouchableOpacity 
                    style={styles.pickerConfirmButton} 
                    onPress={handleDatePickerClose}
                  >
                    <Text style={styles.pickerConfirmButtonText}>{t("confirm")}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </Modal>
          ) : (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )
        )}
      </Animated.View>
    </Modal>
  );
}