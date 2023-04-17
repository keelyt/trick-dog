import { createContext, useState, useEffect } from 'react';

import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

/**
 * Creates a new React context for the theme.
 */
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: (): void => undefined,
});

/**
 * Provides the theme context to its child components.
 * @param children The child components to be wrapped by the provider.
 * @returns A React component that provides the theme context to its child components.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Use dark theme by default.
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Get the theme from local storage.
    const lsTheme = localStorage.getItem('ThemeContext:theme');
    // Set the theme to the local storage theme if it is light/dark.
    if (lsTheme === 'light' || lsTheme === 'dark') setTheme(lsTheme);
    // Otherwise, use light theme if user's OS is in light mode.
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
      setTheme('light');
  }, []);

  /**
   * Toggles the theme state and updates local storage.
   */
  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    localStorage.setItem('ThemeContext:theme', theme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
