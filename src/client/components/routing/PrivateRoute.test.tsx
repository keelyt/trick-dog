import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';

import PrivateRoute from './PrivateRoute';
import { AuthContext } from '../../contexts/AuthContext';

describe('PrivateRoute', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(() => {
    router = createMemoryRouter(
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
  });

  it('renders the child components when the user is authenticated', async () => {
    const authedAuthContext = {
      authed: true,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    render(
      <AuthContext.Provider value={authedAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/private');
    });
  });

  it('redirects to login page when the user is not authenticated', async () => {
    const unauthedAuthContext = {
      authed: false,
      login: () => Promise.resolve(),
      logout: () => Promise.resolve(),
    };

    render(
      <AuthContext.Provider value={unauthedAuthContext}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/login');
    });
  });
});
