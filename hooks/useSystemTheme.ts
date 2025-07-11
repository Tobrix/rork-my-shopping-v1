import { useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  return systemTheme;
}