import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: (): void => undefined,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
