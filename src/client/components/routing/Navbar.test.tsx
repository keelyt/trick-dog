import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, vi, expect } from 'vitest';

import Navbar from './Navbar';

let authed: boolean;
let router: ReturnType<typeof createMemoryRouter>;
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    authed,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  }),
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Navbar />,
        },
        {
          path: '/decks',
          element: <>Decks</>,
        },
        {
          path: '/study',
          element: <>Study</>,
        },
        {
          path: '/stats',
          element: <>Stats</>,
        },
        {
          path: '/profile',
          element: <>Profile</>,
        },
        {
          path: '/login',
          element: <>Login</>,
        },
      ],
      {
        initialEntries: ['/'],
      }
    );
  });

  it('shows home, decks, study, stats, and profile links and theme toggle button when user is logged in', () => {
    authed = true;
    render(<RouterProvider router={router} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Decks')).toBeInTheDocument();
    expect(screen.getByText('Study')).toBeInTheDocument();
    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /activate (dark|light) mode/i })).toBeInTheDocument();
  });

  it('does not show decks, study, stats, or profile links when user is not logged in', () => {
    authed = false;
    render(<RouterProvider router={router} />);
    expect(screen.queryByText('Decks')).not.toBeInTheDocument();
    expect(screen.queryByText('Study')).not.toBeInTheDocument();
    expect(screen.queryByText('Stats')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('navigates to "/" when the home link is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const link = screen.getByRole('link', { name: 'Home' });
    await userEvent.click(link);
    expect(router.state.location.pathname).toEqual('/');
  });

  it('navigates to "/decks" when the decks link is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const link = screen.getByRole('link', { name: 'Decks' });
    await userEvent.click(link);
    expect(router.state.location.pathname).toEqual('/decks');
  });

  it('navigates to "/study" when the study link is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const link = screen.getByRole('link', { name: 'Study' });
    await userEvent.click(link);
    expect(router.state.location.pathname).toEqual('/study');
  });

  it('navigates to "/stats" when the study link is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const link = screen.getByRole('link', { name: 'Stats' });
    await userEvent.click(link);
    expect(router.state.location.pathname).toEqual('/stats');
  });

  it('navigates to "/profile" when the profile link is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const link = screen.getByRole('link', { name: 'Profile' });
    await userEvent.click(link);
    expect(router.state.location.pathname).toEqual('/profile');
  });

  it('toggles aria-label when mobile menu toggle button is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const button = screen.getByRole('button', { name: /open navigation menu/i });
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
  });

  it('toggles aria-expanded when mobile menu toggle button is clicked', async () => {
    authed = true;
    render(<RouterProvider router={router} />);
    const button = screen.getByRole('button', {
      name: /(open|close) navigation menu/i,
      expanded: false,
    });
    await userEvent.click(button);
    expect(
      screen.getByRole('button', {
        name: /(open|close) navigation menu/i,
        expanded: true,
      })
    ).toBeInTheDocument();
  });
});
