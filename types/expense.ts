export interface Expense {
  id: string;
  shopId: string;
  amount: number;
  date: string; // ISO string
  note?: string;
  type: 'income' | 'expense';
  userId?: string; // Link expense to user
  createdAt?: string;
  updatedAt?: string;
  // Store original shop data to preserve across language changes
  originalShopName?: string;
  originalShopIcon?: string;
  originalShopColor?: string;
  // Store original currency data
  originalCurrency?: string;
  originalAmount?: number;
}