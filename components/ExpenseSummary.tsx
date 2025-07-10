import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useExpenseStore } from "@/store/expenseStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency } from "@/utils/currencyUtils";
import { Expense } from "@/types/expense";

interface ExpenseSummaryProps {
  filteredExpenses?: Expense[];
}

export function ExpenseSummary({ filteredExpenses }: ExpenseSummaryProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const allExpenses = useExpenseStore((state) => state.expenses);
  const currency = useExpenseStore((state) => state.settings.currency);
  
  // Use filtered expenses if provided, otherwise use all expenses
  const expenses = filteredExpenses || allExpenses;
  
  const totals = useMemo(() => {
    const totalIncome = expenses
      .filter(e => e.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalExpenses = expenses
      .filter(e => e.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    };
  }, [expenses]);

  if (expenses.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    lastRow: {
      marginBottom: 0,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    amount: {
      fontSize: 16,
      fontWeight: "700",
    },
    incomeAmount: {
      color: colors.success,
    },
    expenseAmount: {
      color: colors.error,
    },
    balanceAmount: {
      fontSize: 18,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{t("totalIncome")}</Text>
        <Text style={[styles.amount, styles.incomeAmount]}>
          +{formatCurrency(totals.totalIncome, currency)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t("totalExpenses")}</Text>
        <Text style={[styles.amount, styles.expenseAmount]}>
          -{formatCurrency(totals.totalExpenses, currency)}
        </Text>
      </View>
      <View style={[styles.row, styles.lastRow]}>
        <Text style={styles.label}>{t("balance")}</Text>
        <Text style={[
          styles.amount, 
          styles.balanceAmount,
          { color: totals.balance >= 0 ? colors.success : colors.error }
        ]}>
          {totals.balance >= 0 ? '+' : ''}{formatCurrency(totals.balance, currency)}
        </Text>
      </View>
    </View>
  );
}