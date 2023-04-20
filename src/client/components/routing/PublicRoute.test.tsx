import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import PublicRoute from './PublicRoute';
import { AuthContext } from '../../contexts/AuthContext';

describe('PublicRoute', () => {
  it('redirects to home page when authenticated', async () => {
    const mockAuthContext = {
      authed: true,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    const router = createRouter();

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/');
    });
  });

  it('renders the child components when not authenticated', async () => {
    const mockAuthContext = {
      authed: false,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    const router = createRouter();

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(
      () => {
        expect(router.state.location.pathname).toEqual('/public');
      },
      { timeout: 5000 }
    );
  });
});

function createRouter() {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <>Navigated from Start</>,
      },
      {
        path: '/public',
        element: (
          <PublicRoute>
            <>Starting Path</>
          </PublicRoute>
        ),
      },
    ],
    {
      initialEntries: ['/public'],
    }
  );
}
