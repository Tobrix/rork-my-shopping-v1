export interface Settings {
  currency: string;
  language: string;
  darkMode: "system" | "light" | "dark";
  currencyMode: "manual" | "auto-language" | "auto-location";
  isManualCurrency: boolean; // Keep for backward compatibility
  userId?: string; // Link settings to user
  lastSyncAt?: string; // Track last sync time
}