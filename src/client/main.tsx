import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

import './index.css';

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
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
