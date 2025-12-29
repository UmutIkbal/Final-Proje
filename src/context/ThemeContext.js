import { createContext, useContext, useMemo, useState } from 'react';
import { darkColors, lightColors } from '../theme/colors';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Tema durumu: acik mi karanlik mi.
  const [isDark, setIsDark] = useState(false);

  // Tema degistikce renkleri hesapla.
  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      colors,
      toggleTheme: () => setIsDark((prev) => !prev),
    }),
    [isDark, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    // Provider disinda kullanimi engellemek icin hata veriyoruz.
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
