import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import PrivateRoute from './PrivateRoute';
import { AuthContext } from '../../contexts/AuthContext';

const router = createMemoryRouter(
  [
    {
      path: '/login',
      element: <>Navigated from Start</>,
    },
    {
      path: '/private',
      element: (
        <PrivateRoute>
          <>Starting Path</>
        </PrivateRoute>
      ),
    },
  ],
  {
    initialEntries: ['/private'],
  }
);

describe('PrivateRoute', () => {
  it('renders the child components when authenticated', async () => {
    const mockAuthContext = {
      authed: true,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/private');
    });
  });

  it('redirects to login page when not authenticated', async () => {
    const mockAuthContext = {
      authed: false,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/login');
    });
  });
});