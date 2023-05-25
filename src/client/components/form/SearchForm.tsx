import { HiOutlineSearch } from 'react-icons/hi';

import styles from './SearchForm.module.scss';

import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SearchFormProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  onSubmit: () => Promise<void>;
  label: string;
  placeholder?: string;
  showLabel?: boolean;
  rounded?: boolean;
  colorScheme?: 'main' | 'dropdown';
  setFocused?: (isFocused: boolean) => void;
}

/**
 * SearchForm component.
 * @template FormValues The type of the react-hook-form form values.
 * @param props The component props.
 * @param props.register The register function from react-hook-form.
 * @param props.name The name of the form field.
 * @param props.onSubmit The submit handler function.
 * @param props.label The label for the search input.
 * @param [props.placeholder] The placeholder text for the search input. Defaults to the label.
 * @param [props.showLabel] Determines whether to show the label or hide it. Defaults to true.
 * @param [props.rounded] Determines whether the search input should be rounded. Defaults to true.
 * @param [props.colorScheme] The color scheme for the search form. Optional.
 * @param [props.setFocused] Function to be called when search input focus state changes. Optional.
 * @returns The SearchForm component.
 */
export default function SearchForm<TFormValues extends FieldValues>({
  register,
  name,
  onSubmit,
  label,
  placeholder = label,
  showLabel = true,
  rounded = true,
  colorScheme = 'main',
  setFocused,
}: SearchFormProps<TFormValues>): JSX.Element {
  const { onChange, onBlur, ...rest } = register(name);

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
          {...rest}
          type='search'
          id='search'
          placeholder={placeholder}
          enterKeyHint='search'
          autoComplete='off'
          autoCorrect='off'
          spellCheck='false'
          onChange={async (e) => {
            await onChange(e);
            if (e.target.value === '') await onSubmit();
          }}
          onFocus={() => {
            if (setFocused) setFocused(true);
          }}
          onBlur={async (e) => {
            await onBlur(e);
            if (setFocused) setFocused(false);
          }}
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
