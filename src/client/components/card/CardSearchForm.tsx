import type { ChangeEvent } from 'react';

interface CardSearchFormProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
}

export default function CardSearchForm({ onChange, onSubmit }: CardSearchFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor='search'>Search by Text</label>
      <input
        type='search'
        name='search'
        id='search'
        placeholder='Search by Text'
        onChange={onChange}
      />
    </form>
  );
}
