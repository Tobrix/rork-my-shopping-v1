interface ExchangeRates {
  [key: string]: number;
}

const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export async function getExchangeRates(baseCurrency: string): Promise<ExchangeRates> {
  try {
    const response = await fetch(`${EXCHANGE_API_URL}${baseCurrency}`);
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Fallback rates (approximate)
    return {
      USD: baseCurrency === 'USD' ? 1 : 1.0,
      EUR: baseCurrency === 'EUR' ? 1 : 0.85,
      GBP: baseCurrency === 'GBP' ? 1 : 0.75,
      CZK: baseCurrency === 'CZK' ? 1 : 23.0,
      PLN: baseCurrency === 'PLN' ? 1 : 4.0,
      HUF: baseCurrency === 'HUF' ? 1 : 350.0,
      CHF: baseCurrency === 'CHF' ? 1 : 0.9,
      CAD: baseCurrency === 'CAD' ? 1 : 1.25,
      AUD: baseCurrency === 'AUD' ? 1 : 1.4,
      JPY: baseCurrency === 'JPY' ? 1 : 110.0,
      KRW: baseCurrency === 'KRW' ? 1 : 1200.0,
      CNY: baseCurrency === 'CNY' ? 1 : 6.5,
      RUB: baseCurrency === 'RUB' ? 1 : 75.0,
      SEK: baseCurrency === 'SEK' ? 1 : 8.5,
      NOK: baseCurrency === 'NOK' ? 1 : 8.8,
      DKK: baseCurrency === 'DKK' ? 1 : 6.3,
      BRL: baseCurrency === 'BRL' ? 1 : 5.2,
      MXN: baseCurrency === 'MXN' ? 1 : 20.0,
      INR: baseCurrency === 'INR' ? 1 : 74.0,
      SGD: baseCurrency === 'SGD' ? 1 : 1.35,
      HKD: baseCurrency === 'HKD' ? 1 : 7.8,
      NZD: baseCurrency === 'NZD' ? 1 : 1.45,
      ZAR: baseCurrency === 'ZAR' ? 1 : 15.0,
      TRY: baseCurrency === 'TRY' ? 1 : 8.5,
      AED: baseCurrency === 'AED' ? 1 : 3.67,
      SAR: baseCurrency === 'SAR' ? 1 : 3.75,
      THB: baseCurrency === 'THB' ? 1 : 33.0,
      MYR: baseCurrency === 'MYR' ? 1 : 4.2,
      PHP: baseCurrency === 'PHP' ? 1 : 50.0,
      IDR: baseCurrency === 'IDR' ? 1 : 14000.0,
      VND: baseCurrency === 'VND' ? 1 : 23000.0,
      ILS: baseCurrency === 'ILS' ? 1 : 3.2,
      EGP: baseCurrency === 'EGP' ? 1 : 15.7,
      MAD: baseCurrency === 'MAD' ? 1 : 9.0,
      NGN: baseCurrency === 'NGN' ? 1 : 410.0,
      KES: baseCurrency === 'KES' ? 1 : 110.0,
      GHS: baseCurrency === 'GHS' ? 1 : 6.0,
      UAH: baseCurrency === 'UAH' ? 1 : 27.0,
      RON: baseCurrency === 'RON' ? 1 : 4.2,
      BGN: baseCurrency === 'BGN' ? 1 : 1.66,
      HRK: baseCurrency === 'HRK' ? 1 : 6.4,
      RSD: baseCurrency === 'RSD' ? 1 : 100.0,
      ISK: baseCurrency === 'ISK' ? 1 : 125.0,
      CLP: baseCurrency === 'CLP' ? 1 : 800.0,
      ARS: baseCurrency === 'ARS' ? 1 : 100.0,
      COP: baseCurrency === 'COP' ? 1 : 3800.0,
      PEN: baseCurrency === 'PEN' ? 1 : 3.6,
      UYU: baseCurrency === 'UYU' ? 1 : 43.0,
    };
  }
}

export function convertAmount(amount: number, fromCurrency: string, toCurrency: string, rates: ExchangeRates): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency first, then to target currency
  const baseAmount = amount / (rates[fromCurrency] || 1);
  const convertedAmount = baseAmount * (rates[toCurrency] || 1);
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}