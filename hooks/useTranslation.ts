import { useExpenseStore } from "@/store/expenseStore";
import { translations } from "@/constants/translations";
import { useMemo } from "react";

type SupportedLanguage = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  const language = useExpenseStore((state) => state.settings.language);
  
  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      try {
        const supportedLanguage = language as SupportedLanguage;
        const currentTranslations = translations[supportedLanguage] || translations.en;
        return currentTranslations[key] || translations.en[key] || key;
      } catch (error) {
        console.warn('Translation error:', error);
        return key;
      }
    };
  }, [language]);

  return { t, language: language as SupportedLanguage };
}