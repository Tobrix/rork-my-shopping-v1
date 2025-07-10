import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expense } from "@/types/expense";
import { Shop } from "@/types/shop";
import { Settings } from "@/types/settings";
import { getDefaultShopsForLanguage } from "@/mocks/languageShops";
import { getExchangeRates, convertAmount } from "@/utils/currencyConverter";
import { languageCurrencyMap } from "@/constants/currencies";

interface ExpenseState {
  expenses: Expense[];
  shops: Shop[];
  settings: Settings;
  isConverting: boolean;
  
  // Data actions
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addShop: (shop: Omit<Shop, "id">) => void;
  updateShop: (shop: Shop) => void;
  deleteShop: (id: string) => void;
  toggleShopFavorite: (id: string) => void;
  resetShopsToDefault: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
  convertCurrency: (newCurrency: string, isManual?: boolean) => Promise<void>;
  convertCurrencyFromTo: (fromCurrency: string, toCurrency: string, isManual?: boolean) => Promise<void>;
  initializeShopsForLanguage: (language: string) => void;
  initializeSystemTheme: () => void;
  getVisibleShops: () => Shop[];
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      // Data state
      expenses: [],
      shops: [],
      settings: {
        currency: "USD",
        language: "en",
        darkMode: "system",
        currencyMode: "auto-language",
        isManualCurrency: false,
      },
      isConverting: false,

      // Data actions
      addExpense: (expense) => {
        const newExpense = { 
          ...expense, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
      },

      updateExpense: (expense) => {
        const updatedExpense = {
          ...expense,
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === expense.id ? updatedExpense : e
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      addShop: (shop) => {
        const state = get();
        const newShop = { 
          ...shop, 
          id: Date.now().toString(),
          language: state.settings.language,
          isCustom: true,
          isOriginal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          shops: [...state.shops, newShop],
        }));
      },

      updateShop: (shop) => {
        set((state) => {
          const updatedShop = {
            ...shop,
            updatedAt: new Date().toISOString()
          };

          // Update the shop
          const updatedShops = state.shops.map((s) => {
            if (s.id === shop.id) {
              return { 
                ...updatedShop,
                id: s.id,
                language: s.language,
                isOriginal: s.isOriginal,
                isCustom: s.isCustom || !s.isOriginal,
                createdAt: s.createdAt
              };
            }
            return s;
          });

          // Update all expenses that reference this shop
          const updatedExpenses = state.expenses.map((expense) => {
            if (expense.shopId === shop.id) {
              return {
                ...expense,
                // Update original shop data to reflect the new shop information
                originalShopName: shop.name,
                originalShopIcon: shop.icon,
                originalShopColor: shop.color,
                updatedAt: new Date().toISOString()
              };
            }
            return expense;
          });

          return {
            shops: updatedShops,
            expenses: updatedExpenses,
          };
        });
      },

      deleteShop: (id) => {
        set((state) => ({
          shops: state.shops.filter((s) => s.id !== id),
        }));
      },

      toggleShopFavorite: (id) => {
        set((state) => ({
          shops: state.shops.map((s) => 
            s.id === id ? { 
              ...s, 
              isFavorite: !s.isFavorite, 
              updatedAt: new Date().toISOString() 
            } : s
          ),
        }));
      },

      // Fixed resetShopsToDefault to only reset original shops, not custom ones
      resetShopsToDefault: () =>
        set((state) => {
          const defaultShops = getDefaultShopsForLanguage(state.settings.language);
          const customShops = state.shops.filter(shop => shop.isCustom === true);
          
          return {
            shops: [
              ...customShops, // Keep custom shops
              ...defaultShops.map(shop => ({ 
                ...shop,
                updatedAt: new Date().toISOString()
              })) // Reset only default shops
            ],
          };
        }),

      updateSettings: async (newSettings) => {
        const state = get();
        const updatedSettings = { 
          ...state.settings, 
          ...newSettings
        };
        let updatedShops = state.shops;
        
        // Handle currency mode changes
        if (newSettings.currencyMode && newSettings.currencyMode !== state.settings.currencyMode) {
          if (newSettings.currencyMode === "auto-language") {
            // Switch to language-based currency
            const defaultCurrency = languageCurrencyMap[state.settings.language] || "USD";
            if (state.settings.currency !== defaultCurrency) {
              updatedSettings.currency = defaultCurrency;
              updatedSettings.isManualCurrency = false;
              
              // Convert existing expenses to new currency
              if (state.expenses.length > 0) {
                // First update settings, then convert
                set((state) => ({
                  settings: updatedSettings,
                  shops: updatedShops,
                }));
                
                // Then convert currency
                await get().convertCurrency(defaultCurrency, false);
                return;
              }
            }
          } else if (newSettings.currencyMode === "manual") {
            updatedSettings.isManualCurrency = true;
          }
        }
        
        // Language change logic - auto-switch currency only if in auto-language mode
        if (newSettings.language && newSettings.language !== state.settings.language) {
          const currentLanguage = newSettings.language;
          
          // Only auto-switch currency if in auto-language mode
          if (updatedSettings.currencyMode === "auto-language") {
            const defaultCurrency = languageCurrencyMap[currentLanguage] || "USD";
            if (state.settings.currency !== defaultCurrency) {
              const oldCurrency = state.settings.currency;
              updatedSettings.currency = defaultCurrency;
              updatedSettings.isManualCurrency = false;
              
              // Convert existing expenses to new currency
              if (state.expenses.length > 0) {
                // First update settings and shops
                set((state) => ({
                  settings: updatedSettings,
                  shops: updatedShops,
                }));
                
                // Then convert currency from old to new
                await get().convertCurrencyFromTo(oldCurrency, defaultCurrency, false);
                
                // After currency conversion, ensure shops for new language are initialized
                get().initializeShopsForLanguage(currentLanguage);
                return;
              }
            }
          }
          
          // Ensure all default shops for new language are present
          const defaultShops = getDefaultShopsForLanguage(currentLanguage);
          const existingShopNames = new Set(
            state.shops
              .filter(shop => shop.language === currentLanguage && shop.isOriginal === true)
              .map(shop => shop.name)
          );
          
          // Add missing default shops
          const missingShops = defaultShops.filter(shop => !existingShopNames.has(shop.name));
          
          if (missingShops.length > 0) {
            updatedShops = [
              ...state.shops,
              ...missingShops
            ];
          }
        }
        
        // Currency change logic - if currency is manually changed, update currency mode
        if (newSettings.currency && newSettings.currency !== state.settings.currency) {
          if (updatedSettings.currencyMode !== "manual") {
            updatedSettings.currencyMode = "manual";
          }
          updatedSettings.isManualCurrency = true;
        }
        
        set((state) => ({
          settings: updatedSettings,
          shops: updatedShops,
        }));
      },

      convertCurrency: async (newCurrency: string, isManual: boolean = true) => {
        const state = get();
        const currentCurrency = state.settings.currency;
        
        if (currentCurrency === newCurrency) {
          set((state) => ({
            settings: { 
              ...state.settings, 
              currency: newCurrency,
              isManualCurrency: isManual,
              currencyMode: isManual ? "manual" : state.settings.currencyMode
            },
          }));
          return;
        }

        if (state.expenses.length === 0) {
          set((state) => ({
            settings: { 
              ...state.settings, 
              currency: newCurrency,
              isManualCurrency: isManual,
              currencyMode: isManual ? "manual" : state.settings.currencyMode
            },
          }));
          return;
        }

        set({ isConverting: true });

        try {
          const rates = await getExchangeRates(currentCurrency);
          
          const convertedExpenses = state.expenses.map(expense => {
            // If expense has original currency info, convert from original currency
            if (expense.originalCurrency && expense.originalAmount) {
              const convertedAmount = convertAmount(expense.originalAmount, expense.originalCurrency, newCurrency, rates);
              return {
                ...expense,
                amount: convertedAmount,
                updatedAt: new Date().toISOString()
              };
            } else {
              // Fallback to converting current amount
              return {
                ...expense,
                amount: convertAmount(expense.amount, currentCurrency, newCurrency, rates),
                updatedAt: new Date().toISOString()
              };
            }
          });

          set((state) => ({
            expenses: convertedExpenses,
            settings: { 
              ...state.settings, 
              currency: newCurrency,
              isManualCurrency: isManual,
              currencyMode: isManual ? "manual" : state.settings.currencyMode
            },
            isConverting: false,
          }));
        } catch (error) {
          console.error('Currency conversion failed:', error);
          set({ isConverting: false });
        }
      },

      // New method to convert from specific currency to another
      convertCurrencyFromTo: async (fromCurrency: string, toCurrency: string, isManual: boolean = true) => {
        const state = get();
        
        if (fromCurrency === toCurrency) {
          set((state) => ({
            settings: { 
              ...state.settings, 
              currency: toCurrency,
              isManualCurrency: isManual,
              currencyMode: isManual ? "manual" : state.settings.currencyMode
            },
          }));
          return;
        }

        if (state.expenses.length === 0) {
          set((state) => ({
            settings: { 
              ...state.settings, 
              currency: toCurrency,
              isManualCurrency: isManual,
              currencyMode: isManual ? "manual" : state.settings.currencyMode
            },
          }));
          return;
        }

        set({ isConverting: true });

        try {
          const rates = await getExchangeRates(fromCurrency);
          
          const convertedExpenses = state.expenses.map(expense => {
            // If expense has original currency info, convert from original currency
            if (expense.originalCurrency && expense.originalAmount) {
              const convertedAmount = convertAmount(expense.originalAmount, expense.originalCurrency, toCurrency, rates);
              return {
                ...expense,
                amount: convertedAmount,
                updatedAt: new Date().toISOString()
              };
            } else {
              // Convert from the specified fromCurrency
              return {
                ...expense,
                amount: convertAmount(expense.amount, fromCurrency, toCurrency, rates),
                updatedAt: new Date().toISOString()
              };
            }
          });

          set((state) => ({
            expenses: convertedExpenses,
            settings: { 
              ...state.settings, 
              currency: toCurrency,
              isManualCurrency: isManual,
              currencyMode: isManual ? "manual" : state.settings.currencyMode
            },
            isConverting: false,
          }));
        } catch (error) {
          console.error('Currency conversion failed:', error);
          set({ isConverting: false });
        }
      },

      initializeShopsForLanguage: (language: string) => {
        set((state) => {
          // Get all default shops for the language
          const defaultShops = getDefaultShopsForLanguage(language);
          const existingShopNames = new Set(
            state.shops
              .filter(shop => shop.language === language && shop.isOriginal === true)
              .map(shop => shop.name)
          );
          
          // Add missing default shops
          const missingShops = defaultShops.filter(shop => !existingShopNames.has(shop.name));
          
          if (missingShops.length > 0) {
            return {
              shops: [
                ...state.shops,
                ...missingShops
              ],
            };
          }
          
          return state;
        });
      },

      initializeSystemTheme: () => {
        set((state) => {
          if (state.settings.darkMode === "system") {
            return state;
          }
          return state;
        });
      },

      getVisibleShops: () => {
        const state = get();
        const currentLanguage = state.settings.language || 'en';
        
        return state.shops.filter(shop => {
          // Always show custom shops
          if (shop.isCustom === true) {
            return true;
          }
          
          // For system shops, only show if language matches exactly
          if (shop.language === currentLanguage && shop.isOriginal === true) {
            return true;
          }
          
          // Don't show shops from other languages
          return false;
        });
      },
    }),
    {
      name: "expense-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        expenses: state.expenses,
        shops: state.shops,
        settings: state.settings
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.settings && state.initializeShopsForLanguage) {
          state.initializeShopsForLanguage(state.settings.language);
          state.initializeSystemTheme();
        }
      },
    }
  )
);