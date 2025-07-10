import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useExpenseStore } from "@/store/expenseStore";
import { Expense } from "@/types/expense";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { IconComponent } from "@/components/IconComponent";
import { Edit, Trash2, TrendingUp, TrendingDown, Star } from "lucide-react-native";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/currencyUtils";

interface SwipeableExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function SwipeableExpenseItem({ expense, onEdit, onDelete }: SwipeableExpenseItemProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const getVisibleShops = useExpenseStore((state) => state.getVisibleShops);
  const currency = useExpenseStore((state) => state.settings.currency);
  
  const shops = getVisibleShops();
  const shop = shops.find((s) => s.id === expense.shopId);
  const isIncome = expense.type === 'income';

  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;
  const deleteScale = useRef(new Animated.Value(0.8)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        
        // Only show delete background when swiping left (negative values)
        if (translationX < 0) {
          const progress = Math.min(Math.abs(translationX) / 100, 1);
          deleteOpacity.setValue(progress);
          deleteScale.setValue(0.8 + (0.2 * progress));
        } else {
          deleteOpacity.setValue(0);
          deleteScale.setValue(0.8);
        }
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;

      // Only allow right-to-left swipe (negative values)
      if (translationX >= 0) {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }),
          Animated.timing(deleteOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(deleteScale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: false,
          })
        ]).start();
        return;
      }

      // If swiped more than threshold, complete the deletion
      if (translationX < -120) {
        // Animate all the way to the left edge
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -400,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(deleteOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          })
        ]).start(() => {
          onDelete(expense.id);
        });
        return;
      }

      // Otherwise, animate back to original position
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(deleteOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(deleteScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: false,
        })
      ]).start();
    }
  };

  const handleEdit = () => {
    onEdit(expense);
  };

  // Get shop display data with multilingual support
  const getShopDisplayData = (shop: any) => {
    if (!shop) return null;
    
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

  // Use original shop data if available, otherwise use current shop data
  const shopDisplayData = expense.originalShopName ? {
    name: expense.originalShopName,
    icon: expense.originalShopIcon || "ShoppingCart",
    color: expense.originalShopColor || colors.primary,
  } : getShopDisplayData(shop);

  const iconColor = shopDisplayData?.color || colors.primary;

  // Check if we should show original currency - only when different from current system currency
  const showOriginalCurrency = expense.originalCurrency && 
                               expense.originalAmount && 
                               expense.originalCurrency !== currency;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
    },
    deleteBackground: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: colors.error,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 30,
      borderRadius: 12,
    },
    itemContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: isIncome ? colors.success : colors.error,
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isIncome ? colors.success + '20' : iconColor + '20',
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    rightContent: {
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    shopContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    shop: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    favoriteIcon: {
      marginLeft: 4,
    },
    typeIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    typeText: {
      fontSize: 12,
      fontWeight: "600",
      marginLeft: 4,
    },
    incomeType: {
      color: colors.success,
    },
    expenseType: {
      color: colors.error,
    },
    date: {
      fontSize: 14,
      color: colors.darkGray,
      marginBottom: 4,
    },
    note: {
      fontSize: 14,
      color: colors.darkGray,
      fontStyle: "italic",
    },
    amountContainer: {
      alignItems: "flex-end",
      marginBottom: 8,
    },
    amount: {
      fontSize: 18,
      fontWeight: "700",
    },
    incomeAmount: {
      color: colors.success,
    },
    expenseAmount: {
      color: colors.error,
    },
    originalAmount: {
      fontSize: 12,
      color: colors.darkGray,
      marginTop: 2,
      fontStyle: "italic",
    },
    actions: {
      flexDirection: "row",
    },
    actionButton: {
      marginLeft: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.deleteBackground,
          {
            opacity: deleteOpacity,
          }
        ]}
      >
        <Animated.View
          style={{
            transform: [{ scale: deleteScale }]
          }}
        >
          <Trash2 size={24} color={colors.white} />
        </Animated.View>
      </Animated.View>
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View
          style={[
            styles.itemContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              {isIncome ? (
                <TrendingUp size={20} color={colors.success} />
              ) : (
                <IconComponent 
                  name={shopDisplayData?.icon || "ShoppingCart"} 
                  size={20} 
                  color={iconColor} 
                />
              )}
            </View>
            <View style={styles.content}>
              <View style={styles.shopContainer}>
                <Text style={styles.shop}>
                  {isIncome ? t("income") : (shopDisplayData?.name || t("shop"))}
                </Text>
                {shop?.isFavorite && !isIncome && (
                  <Star size={14} color="#FFD700" fill="#FFD700" style={styles.favoriteIcon} />
                )}
              </View>
              <View style={styles.typeIndicator}>
                {isIncome ? (
                  <TrendingUp size={12} color={colors.success} />
                ) : (
                  <TrendingDown size={12} color={colors.error} />
                )}
                <Text style={[styles.typeText, isIncome ? styles.incomeType : styles.expenseType]}>
                  {isIncome ? t("income") : t("expense")}
                </Text>
              </View>
              <Text style={styles.date}>{formatDate(expense.date)}</Text>
              {expense.note && <Text style={styles.note}>{expense.note}</Text>}
            </View>
          </View>
          <View style={styles.rightContent}>
            <View style={styles.amountContainer}>
              <Text style={[styles.amount, isIncome ? styles.incomeAmount : styles.expenseAmount]}>
                {isIncome ? '+' : '-'}{formatCurrency(expense.amount, currency)}
              </Text>
              {showOriginalCurrency && (
                <Text style={styles.originalAmount}>
                  {t("originally")} {isIncome ? '+' : '-'}{formatCurrency(expense.originalAmount!, expense.originalCurrency!)}
                </Text>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                <Edit size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}