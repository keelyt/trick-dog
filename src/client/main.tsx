import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

import './styles/GlobalStyles.scss';

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
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
