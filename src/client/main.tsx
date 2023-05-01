import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { makeServer } from '../mock-api/server';

import './styles/GlobalStyles.scss';

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' });
}

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set default stale time to 5 minutes.
      staleTime: 1000 * 60 * 5,
    },
  },
});

const root: HTMLElement | null = document.getElementById('root');

if (root)
  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </StrictMode>
  );
