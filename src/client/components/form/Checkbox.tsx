import { useState } from 'react';

import styles from './Checkbox.module.scss';

import type { UseFormRegister, FieldValues, RegisterOptions, Path } from 'react-hook-form';

interface FormInputProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  value: number | string;
  id: string;
  validation?: RegisterOptions;
}

export default function Checkbox<TFormValues extends FieldValues>({
  register,
  name,
  label,
  value,
  id,
  validation = {},
}: FormInputProps<TFormValues>): JSX.Element {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className={`${styles.checkbox} ${checked ? styles['checkbox--checked'] : ''}`}>
      <input
        type='checkbox'
        id={id}
        value={value}
        {...register(name, validation)}
        onChange={(event) => setChecked(event.target.checked)}
        className={styles.checkbox__input}
      />
      <label htmlFor={id} className={styles.checkbox__label}>
        {label}
      </label>
    </div>
  );
}
