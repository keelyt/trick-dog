import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, vi, expect } from 'vitest';

import DarkLightToggle from './DarkLightToggle';

let theme: 'light' | 'dark' = 'light';
const toggleTheme = vi.fn(() => (theme = theme === 'dark' ? 'light' : 'dark'));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme,
    toggleTheme,
  }),
}));

describe('DarkLightToggle', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    theme = 'light';
  });

  it('calls toggleTheme function when clicked', async () => {
    render(<DarkLightToggle />);

    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('toggles the theme when clicked', async () => {
    render(<DarkLightToggle />);

    // Initially set to light mode - expect theme to be 'light'.
    const button = screen.getByRole('button');
    expect(theme).toEqual('light');

    // Expect theme to be 'dark' after clicking button.
    await userEvent.click(button);
    expect(theme).toEqual('dark');

    // Expect theme to be 'light' after clicking button again.
    await userEvent.click(button);
    expect(theme).toEqual('light');
  });

  it('changes aria-label attribute based on current theme', async () => {
    const { rerender } = render(<DarkLightToggle />);

    // Initially set to light mode - expect button to have 'Activate dark mode' label.
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Activate dark mode');

    // Expect label to be 'Activate light mode' after clicking button.
    await userEvent.click(button);
    rerender(<DarkLightToggle />);
    expect(button).toHaveAttribute('aria-label', 'Activate light mode');

    // Expect label to be 'Activate dark mode' after clicking button again.
    await userEvent.click(button);
    rerender(<DarkLightToggle />);
    expect(button).toHaveAttribute('aria-label', 'Activate dark mode');
  });
});
