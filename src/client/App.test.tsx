import { screen, render } from '@testing-library/react';
import { describe, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('Renders Trick Dog heading', () => {
    // Arrange
    render(<App />);
    // Act
    // Expect
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Trick Dog');
  });
});
