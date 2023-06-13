import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';

import PublicRoute from './PublicRoute';
import { AuthContext } from '../../contexts/AuthContext';

describe('PublicRoute', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(() => {
    router = createMemoryRouter(
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
  });

  it('redirects to home page when the user is authenticated', async () => {
    const authedAuthContext = {
      authed: true,
      userInfo: { email: 'email', picture: 'picture' },
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    render(
      <AuthContext.Provider value={authedAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/');
    });
  });

  it('renders the child components when the user is not authenticated', async () => {
    const unauthedAuthContext = {
      authed: false,
      userInfo: null,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    render(
      <AuthContext.Provider value={unauthedAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/public');
    });
  });
});
