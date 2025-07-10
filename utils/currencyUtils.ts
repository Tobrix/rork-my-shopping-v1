import { currencies } from "@/constants/currencies";

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
  
  // Special handling for Czech currency - show "Kč" instead of "CZK"
  if (currencyCode === "CZK") {
    return `${amount.toFixed(2).replace('.', ',')} Kč`;
  }
  
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  try {
    return formatter.format(amount);
  } catch (error) {
    // Fallback if Intl is not supported
    return `${amount.toFixed(2)} ${currency.symbol}`;
  }
}