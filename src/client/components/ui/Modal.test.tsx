import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, vi, expect } from 'vitest';

import Modal from './Modal';

describe('Modal', () => {
  it('renders child content', () => {
    render(
      <Modal onClose={() => undefined}>
        <div data-testid='content'>Content</div>
      </Modal>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('calls the onClose function when the Escape key is pressed', async () => {
    const handleClose = vi.fn();
    render(
      <Modal onClose={handleClose}>
        <></>
      </Modal>
    );
    await userEvent.type(document.body, '{esc}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls the onClose function when a click occurs outside of the modal content', async () => {
    const handleClose = vi.fn();
    render(
      <Modal onClose={handleClose}>
        <></>
      </Modal>
    );
    await userEvent.click(document.body);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call the onClose function when a click occurs inside of the modal content', async () => {
    const handleClose = vi.fn();
    render(
      <Modal onClose={handleClose}>
        <div data-testid='content'>Content</div>
      </Modal>
    );
    await userEvent.click(screen.getByTestId('content'));
    expect(handleClose).not.toHaveBeenCalled();
  });
});
