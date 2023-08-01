import { render, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';

import PublicRoute from './PublicRoute';
import { AuthContext } from '../../contexts/AuthContext';

import type { AuthContextType } from '../../contexts/AuthContext';

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
    render(
      <AuthContext.Provider value={{ authed: true } as AuthContextType}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/');
    });
  });

  it('renders the child components when the user is not authenticated', async () => {
    render(
      <AuthContext.Provider value={{ authed: false } as AuthContextType}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/public');
    });
  });
});
