import { createContext, useContext, useEffect, useState } from 'react';

import fetchWithError from '../helpers/fetchWithError';

import type { AuthStatusResponse, UserInfoData, UserInfoResponse } from '../../types';
import type { ReactNode } from 'react';

interface AuthContextType {
  authed: boolean;
  userInfo: UserInfoData | null;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create a new React context for auth.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * A hook to access the auth context.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('AuthContext must be used within an AuthProvider');
  return context;
}

/**
 * Provides the auth context to its child components.
 * @param children The child components to be wrapped by the provider.
 * @returns A React component that provides the auth context to its child components.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);

  useEffect(() => {
    fetchWithError<AuthStatusResponse>('/api/auth/status')
      .then((data) => {
        setAuthed(data.authed);
        if (data.authed)
          setUserInfo({ email: data.userInfo.email, picture: data.userInfo.picture });
        return null;
      })
      .catch((error) => {
        setAuthed(false);
        setUserInfo(null);
      });
  }, []);

  // Logs in the user.
  // Note: Errors thrown in this function are handled by the component that call it.
  async function login(credential: string): Promise<void> {
    const data = await fetchWithError<UserInfoResponse>('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });
    setAuthed(true);
    setUserInfo({ email: data.userInfo.email, picture: data.userInfo.picture });
  }

  // Logs out the user.
  // This is currently a placeholder that will set authed to false and resolve immediately.
  // TODO: Remove session cookie.
  async function logout(): Promise<void> {
    setAuthed(false);
    return Promise.resolve();
  }

  return (
    <AuthContext.Provider value={{ authed, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
