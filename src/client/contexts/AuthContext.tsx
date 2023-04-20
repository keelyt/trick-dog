import { createContext, useContext, useState } from 'react';

import type { ReactNode } from 'react';

interface AuthContextType {
  authed: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create a new React context for auth using default values.
export const AuthContext = createContext<AuthContextType>({
  authed: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

/**
 * A hook to access the auth context.
 */
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

/**
 * Provides the auth context to its child components.
 * @param children The child components to be wrapped by the provider.
 * @returns A React component that provides the auth context to its child components.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);

  // Logs in the user.
  // This is currently a placeholder that will set authed to true and resolve immediately.
  // TODO: Replace with server-side authentication of session cookie.
  async function login(): Promise<void> {
    setAuthed(true);
    return Promise.resolve();
  }

  // Logs out the user.
  // This is currently a placeholder that will set authed to false and resolve immediately.
  // TODO: Remove session cookie.
  async function logout(): Promise<void> {
    setAuthed(false);
    return Promise.resolve();
  }

  return <AuthContext.Provider value={{ authed, login, logout }}>{children}</AuthContext.Provider>;
}
