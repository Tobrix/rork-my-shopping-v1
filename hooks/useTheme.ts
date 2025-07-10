import { useExpenseStore } from "@/store/expenseStore";
import { lightColors, darkColors, ColorScheme } from "@/constants/colors";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { useMemo } from "react";

export function useTheme() {
  const darkModeSetting = useExpenseStore((state) => state.settings.darkMode);
  const systemTheme = useSystemTheme();
  
  const isDarkMode = useMemo(() => {
    if (darkModeSetting === "system") {
      return systemTheme === "dark";
    }
    return darkModeSetting === "dark";
  }, [darkModeSetting, systemTheme]);

  const colors: ColorScheme = useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode]);

  return { colors, isDarkMode };
}