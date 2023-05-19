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
  return (
    <div className={`${styles.checkbox}`}>
      <input
        type='checkbox'
        id={id}
        value={value}
        {...register(name, validation)}
        className={styles.checkbox__input}
      />
      <label htmlFor={id} className={styles.checkbox__label}>
        {label}
      </label>
    </div>
  );
}
