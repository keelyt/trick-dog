import { forwardRef } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

import styles from './SearchForm.module.scss';

import type { ChangeEvent, ForwardedRef } from 'react';

interface SearchFormProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
  value: string;
  maxLength: number;
  label: string;
  placeholder: string;
  showLabel: boolean;
  rounded?: boolean;
  colorScheme?: 'main' | 'dropdown';
}

const SearchForm = forwardRef(
  (
    {
      onChange,
      onSubmit,
      value,
      maxLength = 50,
      label = '',
      placeholder = label,
      showLabel,
      rounded = true,
      colorScheme = 'main',
    }: SearchFormProps,
    inputRef?: ForwardedRef<HTMLInputElement>
  ) => {
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
            value={value}
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
            ref={inputRef}
          />
          <button type='submit' aria-label='Search' className={styles.form__button}>
            <span className={styles['visually-hidden']}>Search</span>
            <HiOutlineSearch aria-hidden='true' focusable='false' />
          </button>
        </div>
      </form>
    );
  }
);

SearchForm.displayName = 'SearchForm';
export default SearchForm;
