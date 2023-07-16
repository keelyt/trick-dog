import { createContext, useContext, useEffect, useState } from 'react';

import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from '../helpers/fetchWithError';

import type { AuthStatusResponse, UserInfoData, UserInfoResponse } from '../../types';
import type { ReactNode } from 'react';

interface AuthContextType {
  authed: boolean | null;
  userInfo: UserInfoData | null;
  login: UseMutationResult<UserInfoResponse, unknown, string, unknown>;
  logout: UseMutationResult<unknown, unknown, void, unknown>;
  invalidate: () => void;
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
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchWithError<AuthStatusResponse>('/api/auth/status')
      .then((data) => {
        setAuthed(data.authed);
        if (data.authed)
          setUserInfo({
            email: data.userInfo.email,
            picture: data.userInfo.picture,
            name: data.userInfo.name,
          });
        return null;
      })
      .catch(() => {
        setAuthed(false);
        setUserInfo(null);
      });
  }, []);

  // Logs in the user.
  const login = useMutation({
    mutationFn: (credential: string) =>
      fetchWithError<UserInfoResponse>('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      }),
    cacheTime: 0,
    onSuccess: (data) => {
      setAuthed(true);
      setUserInfo({
        email: data.userInfo.email,
        picture: data.userInfo.picture,
        name: data.userInfo.name,
      });
    },
  });

  // Logs out the user.
  const logout = useMutation({
    mutationFn: () => fetchWithError('/api/auth/logout', { method: 'DELETE' }),
    cacheTime: 0,
    onSuccess: () => invalidate(),
  });

  function invalidate() {
    setAuthed(false);
    setUserInfo(null);
    queryClient.clear();
  }

  return (
    <AuthContext.Provider value={{ authed, userInfo, login, logout, invalidate }}>
      {children}
    </AuthContext.Provider>
  );
}
