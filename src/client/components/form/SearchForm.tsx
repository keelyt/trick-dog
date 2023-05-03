import { GrSearch } from 'react-icons/gr';

import styles from './SearchForm.module.scss';

import type { ChangeEvent } from 'react';

interface SearchFormProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
  maxLength: number;
  label: string;
  placeholder: string;
}

export default function SearchForm({
  onChange,
  onSubmit,
  maxLength = 50,
  label = '',
  placeholder = label,
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} role='search' className={styles.form}>
      <label htmlFor='search' className={styles['visually-hidden']}>
        {label}
      </label>
      <input
        type='search'
        name='search'
        id='search'
        placeholder={placeholder}
        enterKeyHint='search'
        maxLength={maxLength}
        autoComplete='off'
        autoCorrect='off'
        spellCheck='false'
        onChange={onChange}
        className={styles.form__input}
      />
      <button type='submit' aria-label='Search' className={styles.button}>
        <GrSearch aria-hidden='true' focusable='false' />
      </button>
    </form>
  );
}
