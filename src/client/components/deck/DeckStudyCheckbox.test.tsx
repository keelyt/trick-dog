import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, it, expect } from 'vitest';

import DeckStudyCheckbox from './DeckStudyCheckbox';

import type { StudyFormValues } from '../../pages/StudySelection';

const name = 'selection';
const deckId = 0;
const deckName = 'TestDeck';
const tags = [
  { id: 1, deckId: 0, tagName: 'TestTag1' },
  { id: 2, deckId: 0, tagName: 'TestTag2' },
];

const Test = () => {
  const { register } = useForm<StudyFormValues>();

  return (
    <DeckStudyCheckbox
      register={register}
      name={name}
      deckId={deckId}
      deckName={deckName}
      tags={tags}
    />
  );
};

describe('DeckStudyCheckbox', () => {
  it('checking the deck checkbox unchecks nested checkboxes', async () => {
    render(<Test />);

    const deckCheckbox = screen.getByRole('checkbox', { name: deckName });
    const tagCheckboxes = screen.getAllByRole('checkbox', { name: /TestTag\d/ });

    await userEvent.click(deckCheckbox);
    await userEvent.click(tagCheckboxes[0]);
    await userEvent.click(tagCheckboxes[1]);
    await userEvent.click(deckCheckbox);

    expect(deckCheckbox).toBeChecked();
    expect(tagCheckboxes[0]).not.toBeChecked();
    expect(tagCheckboxes[1]).not.toBeChecked();
  });

  it('makes the deck checkbox indeterminate when nested checkboxes are checked', async () => {
    render(<Test />);

    const deckCheckbox: HTMLInputElement = screen.getByRole('checkbox', { name: deckName });
    const tagCheckboxes: HTMLInputElement[] = screen.getAllByRole('checkbox', {
      name: /TestTag\d/,
    });

    await userEvent.click(deckCheckbox);
    await userEvent.click(tagCheckboxes[0]);
    await userEvent.click(tagCheckboxes[1]);
    expect(deckCheckbox).not.toBeChecked();
    expect(deckCheckbox.indeterminate).toBe(true);
  });

  it('removes the indeterminate state from the deck checkbox when all nested checkboxes are unchecked', async () => {
    render(<Test />);

    const deckCheckbox: HTMLInputElement = screen.getByRole('checkbox', { name: deckName });
    const tagCheckboxes: HTMLInputElement[] = screen.getAllByRole('checkbox', {
      name: /TestTag\d/,
    });

    await userEvent.click(deckCheckbox);
    // Check the nested checkboxes.
    await userEvent.click(tagCheckboxes[0]);
    await userEvent.click(tagCheckboxes[1]);
    // Check the deck checkbox, which will uncheck nested checkboxes.
    await userEvent.click(deckCheckbox);
    expect(deckCheckbox.indeterminate).toBe(false);
    // Check the nested checkboxes.
    await userEvent.click(tagCheckboxes[0]);
    await userEvent.click(tagCheckboxes[1]);
    // Uncheck the nested checkboxes.
    await userEvent.click(tagCheckboxes[0]);
    await userEvent.click(tagCheckboxes[1]);
    expect(deckCheckbox.indeterminate).toBe(false);
  });
});
