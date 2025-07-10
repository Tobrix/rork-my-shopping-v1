export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛" },
  { code: "LAK", name: "Lao Kip", symbol: "₭" },
  { code: "MNT", name: "Mongolian Tugrik", symbol: "₮" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "лв" },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "лв" },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "SM" },
  { code: "TMT", name: "Turkmenistani Manat", symbol: "T" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L" },
  { code: "ALL", name: "Albanian Lek", symbol: "L" },
  { code: "MKD", name: "Macedonian Denar", symbol: "ден" },
  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", symbol: "KM" },
  { code: "ISK", name: "Icelandic Krona", symbol: "kr" },
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$" },
  { code: "TOP", name: "Tongan Pa'anga", symbol: "T$" },
  { code: "WST", name: "Samoan Tala", symbol: "WS$" },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "VT" },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$" },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K" },
  { code: "XPF", name: "CFP Franc", symbol: "₣" },
];

// Map languages to their typical currencies - comprehensive mapping for all languages
export const languageCurrencyMap: Record<string, string> = {
  en: "USD",    // English - US Dollar
  cs: "CZK",    // Czech - Czech Koruna
  sk: "EUR",    // Slovak - Euro
  de: "EUR",    // German - Euro
  fr: "EUR",    // French - Euro
  es: "EUR",    // Spanish - Euro
  it: "EUR",    // Italian - Euro
  pl: "PLN",    // Polish - Polish Zloty
  hu: "HUF",    // Hungarian - Hungarian Forint
  ro: "RON",    // Romanian - Romanian Leu
  bg: "BGN",    // Bulgarian - Bulgarian Lev
  hr: "HRK",    // Croatian - Croatian Kuna
  sr: "RSD",    // Serbian - Serbian Dinar
  sl: "EUR",    // Slovenian - Euro
  pt: "EUR",    // Portuguese - Euro
  nl: "EUR",    // Dutch - Euro
  da: "DKK",    // Danish - Danish Krone
  sv: "SEK",    // Swedish - Swedish Krona
  no: "NOK",    // Norwegian - Norwegian Krone
  fi: "EUR",    // Finnish - Euro
  is: "ISK",    // Icelandic - Icelandic Krona
  ru: "RUB",    // Russian - Russian Ruble
  uk: "UAH",    // Ukrainian - Ukrainian Hryvnia
  be: "BYN",    // Belarusian - Belarusian Ruble
  lt: "EUR",    // Lithuanian - Euro
  lv: "EUR",    // Latvian - Euro
  et: "EUR",    // Estonian - Euro
  ja: "JPY",    // Japanese - Japanese Yen
  ko: "KRW",    // Korean - South Korean Won
  zh: "CNY",    // Chinese - Chinese Yuan
  hi: "INR",    // Hindi - Indian Rupee
  th: "THB",    // Thai - Thai Baht
  vi: "VND",    // Vietnamese - Vietnamese Dong
  id: "IDR",    // Indonesian - Indonesian Rupiah
  ms: "MYR",    // Malay - Malaysian Ringgit
  tl: "PHP",    // Filipino - Philippine Peso
  ar: "SAR",    // Arabic - Saudi Riyal
  he: "ILS",    // Hebrew - Israeli Shekel
  tr: "TRY",    // Turkish - Turkish Lira
  fa: "IRR",    // Persian - Iranian Rial
  ur: "PKR",    // Urdu - Pakistani Rupee
  bn: "BDT",    // Bengali - Bangladeshi Taka
  ta: "INR",    // Tamil - Indian Rupee
  te: "INR",    // Telugu - Indian Rupee
  ml: "INR",    // Malayalam - Indian Rupee
  kn: "INR",    // Kannada - Indian Rupee
  gu: "INR",    // Gujarati - Indian Rupee
  pa: "INR",    // Punjabi - Indian Rupee
  mr: "INR",    // Marathi - Indian Rupee
  or: "INR",    // Odia - Indian Rupee
  as: "INR",    // Assamese - Indian Rupee
  ne: "NPR",    // Nepali - Nepalese Rupee
  si: "LKR",    // Sinhala - Sri Lankan Rupee
  my: "MMK",    // Burmese - Myanmar Kyat
  km: "KHR",    // Khmer - Cambodian Riel
  lo: "LAK",    // Lao - Lao Kip
  mn: "MNT",    // Mongolian - Mongolian Tugrik
  kk: "KZT",    // Kazakh - Kazakhstani Tenge
  ky: "KGS",    // Kyrgyz - Kyrgyzstani Som
  uz: "UZS",    // Uzbek - Uzbekistani Som
  tg: "TJS",    // Tajik - Tajikistani Somoni
  tk: "TMT",    // Turkmen - Turkmenistani Manat
  az: "AZN",    // Azerbaijani - Azerbaijani Manat
  ka: "GEL",    // Georgian - Georgian Lari
  hy: "AMD",    // Armenian - Armenian Dram
  sq: "ALL",    // Albanian - Albanian Lek
  mk: "MKD",    // Macedonian - Macedonian Denar
  bs: "BAM",    // Bosnian - Bosnia-Herzegovina Convertible Mark
  mt: "EUR",    // Maltese - Euro
  ga: "EUR",    // Irish - Euro
  cy: "GBP",    // Welsh - British Pound
  gd: "GBP",    // Scottish Gaelic - British Pound
  eu: "EUR",    // Basque - Euro
  ca: "EUR",    // Catalan - Euro
  gl: "EUR",    // Galician - Euro
  af: "ZAR",    // Afrikaans - South African Rand
  sw: "KES",    // Swahili - Kenyan Shilling
  am: "ETB",    // Amharic - Ethiopian Birr
  zu: "ZAR",    // Zulu - South African Rand
  xh: "ZAR",    // Xhosa - South African Rand
  st: "ZAR",    // Sesotho - South African Rand
  tn: "BWP",    // Tswana - Botswana Pula
  yo: "NGN",    // Yoruba - Nigerian Naira
  ig: "NGN",    // Igbo - Nigerian Naira
  ha: "NGN",    // Hausa - Nigerian Naira
};