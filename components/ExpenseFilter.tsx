import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Platform, TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Calendar, X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface ExpenseFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  customDateRange: { start: Date; end: Date } | null;
  onCustomDateRangeChange: (range: { start: Date; end: Date } | null) => void;
}

export function ExpenseFilter({ 
  selectedPeriod, 
  onPeriodChange, 
  customDateRange, 
  onCustomDateRangeChange 
}: ExpenseFilterProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const filters: { key: string; label: string }[] = [
    { key: 'allTime', label: t("allTime") },
    { key: 'today', label: t("today") },
    { key: 'yesterday', label: t("yesterday") },
    { key: 'last7Days', label: t("last7Days") },
    { key: 'last30Days', label: t("last30Days") },
    { key: 'thisMonth', label: t("thisMonth") },
    { key: 'lastMonth', label: t("lastMonth") },
    { key: 'thisYear', label: t("thisYear") },
    { key: 'customRange', label: t("customRange") },
  ];

  const handleCustomFilterPress = () => {
    if (customDateRange) {
      setTempStartDate(customDateRange.start);
      setTempEndDate(customDateRange.end);
    } else {
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      setTempStartDate(monthAgo);
      setTempEndDate(now);
    }
    setShowCustomDateModal(true);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setTempStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setTempEndDate(selectedDate);
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

  const formatDateForDisplay = (date: Date) => {
    try {
      if (!date || isNaN(date.getTime())) {
        return new Date().toLocaleDateString();
      }
      return date.toLocaleDateString();
    } catch (error) {
      return new Date().toLocaleDateString();
    }
  };

  const handleWebDateChange = (dateString: string, isStartDate: boolean) => {
    if (!dateString) return;
    
    try {
      const date = new Date(dateString + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        if (isStartDate) {
          setTempStartDate(date);
        } else {
          setTempEndDate(date);
        }
      }
    } catch (error) {
      console.warn('Invalid date:', dateString);
    }
  };

  const openWebDatePicker = (isStartDate: boolean) => {
    if (Platform.OS !== 'web') return;
    
    try {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = formatDateForInput(isStartDate ? tempStartDate : tempEndDate);
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      input.style.opacity = '0';
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.value) {
          handleWebDateChange(target.value, isStartDate);
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

  const handleCustomDateConfirm = () => {
    if (tempStartDate && tempEndDate && !isNaN(tempStartDate.getTime()) && !isNaN(tempEndDate.getTime())) {
      onCustomDateRangeChange({
        start: tempStartDate,
        end: tempEndDate
      });
      onPeriodChange('customRange');
    }
    setShowCustomDateModal(false);
  };

  const handleFilterPress = (period: string) => {
    if (period === 'customRange') {
      handleCustomFilterPress();
    } else {
      onPeriodChange(period);
      onCustomDateRangeChange(null);
    }
  };

  const getCustomFilterLabel = () => {
    if (customDateRange) {
      try {
        const startDate = customDateRange.start;
        const endDate = customDateRange.end;
        if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        }
      } catch (error) {
        console.warn('Error formatting custom date range:', error);
      }
    }
    return t("customRange");
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.darkGray,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    scrollContainer: {
      paddingHorizontal: 4,
    },
    filterContainer: {
      flexDirection: "row",
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.lightGray,
      marginRight: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    selectedFilterButton: {
      backgroundColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    selectedFilterText: {
      color: colors.white,
      fontWeight: "600",
    },
    customFilterText: {
      fontSize: 12,
      maxWidth: 120,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 20,
      zIndex: Platform.select({
        web: 99999999999,
        default: 100000,
      }),
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      width: "100%",
      maxWidth: 400,
      maxHeight: "80%",
      zIndex: Platform.select({
        web: 99999999999,
        default: 100000,
      }),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    datePickersContainer: {
      marginBottom: 20,
    },
    datePickerSection: {
      marginBottom: 20,
    },
    datePickerLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 10,
    },
    datePickerWrapper: {
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 10,
    },
    webDateContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    webDateInput: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    webCalendarButton: {
      padding: 12,
      backgroundColor: colors.lightGray,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    nativeDateButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    nativeDateButtonText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    dateColumn: {
      flex: 1,
      marginHorizontal: 8,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginLeft: 12,
    },
    cancelButton: {
      backgroundColor: colors.lightGray,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: "600",
    },
    confirmButtonText: {
      color: colors.white,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("filterBy")}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedPeriod === filter.key && styles.selectedFilterButton
              ]}
              onPress={() => handleFilterPress(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === filter.key && styles.selectedFilterText,
                  filter.key === 'customRange' && customDateRange && styles.customFilterText
                ]}
                numberOfLines={1}
              >
                {filter.key === 'customRange' ? getCustomFilterLabel() : filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Custom Date Range Modal */}
      <Modal
        visible={showCustomDateModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCustomDateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("customRange")}</Text>
              <TouchableOpacity onPress={() => setShowCustomDateModal(false)}>
                <X size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.datePickersContainer}>
              {Platform.OS === 'web' ? (
                // Web implementation with better date inputs and calendar buttons
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.datePickerLabel}>{t("from")}</Text>
                    <View style={styles.webDateContainer}>
                      <TextInput
                        style={styles.webDateInput}
                        value={formatDateForInput(tempStartDate)}
                        onChangeText={(text) => handleWebDateChange(text, true)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.darkGray}
                      />
                      <TouchableOpacity 
                        style={styles.webCalendarButton}
                        onPress={() => openWebDatePicker(true)}
                      >
                        <Calendar size={20} color={colors.darkGray} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.dateColumn}>
                    <Text style={styles.datePickerLabel}>{t("to")}</Text>
                    <View style={styles.webDateContainer}>
                      <TextInput
                        style={styles.webDateInput}
                        value={formatDateForInput(tempEndDate)}
                        onChangeText={(text) => handleWebDateChange(text, false)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.darkGray}
                      />
                      <TouchableOpacity 
                        style={styles.webCalendarButton}
                        onPress={() => openWebDatePicker(false)}
                      >
                        <Calendar size={20} color={colors.darkGray} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : Platform.OS === 'ios' ? (
                // iOS implementation with inline DateTimePicker
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.datePickerLabel}>{t("from")}</Text>
                    <View style={styles.datePickerWrapper}>
                      <DateTimePicker
                        value={tempStartDate}
                        mode="date"
                        display="compact"
                        onChange={handleStartDateChange}
                        maximumDate={tempEndDate}
                      />
                    </View>
                  </View>
                  <View style={styles.dateColumn}>
                    <Text style={styles.datePickerLabel}>{t("to")}</Text>
                    <View style={styles.datePickerWrapper}>
                      <DateTimePicker
                        value={tempEndDate}
                        mode="date"
                        display="compact"
                        onChange={handleEndDateChange}
                        minimumDate={tempStartDate}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                // Android implementation with button-triggered DateTimePicker
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.datePickerLabel}>{t("from")}</Text>
                    <TouchableOpacity
                      style={styles.nativeDateButton}
                      onPress={() => setShowStartDatePicker(true)}
                    >
                      <Text style={styles.nativeDateButtonText}>
                        {formatDateForDisplay(tempStartDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dateColumn}>
                    <Text style={styles.datePickerLabel}>{t("to")}</Text>
                    <TouchableOpacity
                      style={styles.nativeDateButton}
                      onPress={() => setShowEndDatePicker(true)}
                    >
                      <Text style={styles.nativeDateButtonText}>
                        {formatDateForDisplay(tempEndDate)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setShowCustomDateModal(false)}
              >
                <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]} 
                onPress={handleCustomDateConfirm}
              >
                <Text style={styles.confirmButtonText}>{t("confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Android DateTimePickers - rendered outside main modal to avoid overlay issues */}
      {Platform.OS === 'android' && showStartDatePicker && (
        <DateTimePicker
          value={tempStartDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          maximumDate={tempEndDate}
        />
      )}

      {Platform.OS === 'android' && showEndDatePicker && (
        <DateTimePicker
          value={tempEndDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={tempStartDate}
        />
      )}
    </View>
  );
}