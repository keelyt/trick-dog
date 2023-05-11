import { HiOutlineSearch } from 'react-icons/hi';

import styles from './SearchForm.module.scss';

import type { ChangeEvent } from 'react';

interface SearchFormProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
  maxLength: number;
  label: string;
  placeholder: string;
  showLabel: boolean;
  rounded?: boolean;
  colorScheme?: 'main' | 'dropdown';
}

export default function SearchForm({
  onChange,
  onSubmit,
  maxLength = 50,
  label = '',
  placeholder = label,
  showLabel,
  rounded = true,
  colorScheme = 'main',
}: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      role='search'
      className={`${styles.form} ${rounded ? styles['form--rounded'] : ''}`}
    >
      <label
        htmlFor='search'
        className={showLabel ? styles.form__label : styles['visually-hidden']}
      >
        {label}
      </label>
      <div className={`${styles.form__inner} ${styles[`form__inner--${colorScheme}`]}`}>
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
        <button type='submit' aria-label='Search' className={styles.form__button}>
          <span className={styles['visually-hidden']}>Search</span>
          <HiOutlineSearch aria-hidden='true' focusable='false' />
        </button>
      </div>
    </form>
  );
}
