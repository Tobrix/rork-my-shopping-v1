import React, { useState, useMemo } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  RefreshControl
} from "react-native";
import { Stack } from "expo-router";
import { useExpenseStore } from "@/store/expenseStore";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { SwipeableExpenseItem } from "@/components/SwipeableExpenseItem";
import { ExpenseFilter } from "@/components/ExpenseFilter";
import { Plus } from "lucide-react-native";
import { Expense } from "@/types/expense";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    deleteExpense 
  } = useExpenseStore();
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<string>("allTime");
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      
      switch (filterPeriod) {
        case "today":
          return expenseDate >= today;
        case "yesterday":
          return expenseDate >= yesterday && expenseDate < today;
        case "last7Days":
          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);
          return expenseDate >= last7Days;
        case "last30Days":
          const last30Days = new Date(today);
          last30Days.setDate(last30Days.getDate() - 30);
          return expenseDate >= last30Days;
        case "thisMonth":
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return expenseDate >= thisMonthStart;
        case "lastMonth":
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
        case "thisYear":
          const thisYearStart = new Date(now.getFullYear(), 0, 1);
          return expenseDate >= thisYearStart;
        case "customRange":
          if (customDateRange) {
            return expenseDate >= customDateRange.start && expenseDate <= customDateRange.end;
          }
          return true;
        default:
          return true;
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterPeriod, customDateRange]);

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    addExpense(expenseData);
    setShowExpenseForm(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleUpdateExpense = (expenseData: Omit<Expense, "id">) => {
    if (editingExpense) {
      updateExpense({ ...expenseData, id: editingExpense.id });
      setEditingExpense(undefined);
      setShowExpenseForm(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCustomDateRangeChange = (range: { start: Date; end: Date } | null) => {
    setCustomDateRange(range);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    summaryContainer: {
      padding: 16,
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    expensesList: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.darkGray,
      textAlign: "center",
      marginBottom: 24,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    emptyButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "600",
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />

      <View style={styles.content}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <ExpenseSummary 
            filteredExpenses={filteredExpenses}
          />
        </View>

        {/* Filter */}
        <View style={styles.filterContainer}>
          <ExpenseFilter
            selectedPeriod={filterPeriod}
            onPeriodChange={setFilterPeriod}
            customDateRange={customDateRange}
            onCustomDateRangeChange={handleCustomDateRangeChange}
          />
        </View>

        {/* Expenses List */}
        {filteredExpenses.length > 0 ? (
          <FlatList
            style={styles.expensesList}
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SwipeableExpenseItem
                expense={item}
                onEdit={() => handleEditExpense(item)}
                onDelete={() => handleDeleteExpense(item.id)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("noExpenses")}</Text>
            <Text style={styles.emptySubtext}>{t("addFirstExpense")}</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowExpenseForm(true)}
            >
              <Plus size={20} color={colors.white} />
              <Text style={styles.emptyButtonText}>{t("addExpense")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Floating Action Button - only show when there are expenses */}
      {filteredExpenses.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setShowExpenseForm(true)}
        >
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          visible={showExpenseForm}
          expense={editingExpense}
          onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
          onClose={() => {
            setShowExpenseForm(false);
            setEditingExpense(undefined);
          }}
        />
      )}
    </View>
  );
}