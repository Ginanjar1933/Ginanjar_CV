import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../constants/theme';

export const THEME_STORAGE_KEY = 'theme-preference';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true); // dark-first

  // Baca preferensi tersimpan saat aplikasi dibuka
  useEffect(() => {
    let aktif = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (aktif && (saved === 'dark' || saved === 'light')) {
          setIsDark(saved === 'dark');
        }
      })
      .catch(() => {}); // gagal membaca: pakai default
    return () => {
      aktif = false;
    };
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light').catch(
      () => {}
    );
  };

  const value = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  return ctx;
}