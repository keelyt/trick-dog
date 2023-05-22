import ValidationError from './ValidationError';

import styles from './TextInput.module.scss';

import type {
  UseFormRegister,
  FieldValues,
  RegisterOptions,
  FieldErrors,
  Path,
} from 'react-hook-form';

interface TextInputProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  validation?: RegisterOptions;
  errors: FieldErrors<TFormValues>;
  placeholder?: string;
}

export default function TextInput<TFormValues extends FieldValues>({
  register,
  name,
  label,
  validation = {},
  errors,
  placeholder = '',
}: TextInputProps<TFormValues>): JSX.Element {
  return (
    <div className={styles['input-container']}>
      <div className={styles.field}>
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
        <input
          {...register(name, validation)}
          id={name}
          placeholder={placeholder}
          aria-invalid={errors[name] ? 'true' : 'false'}
          className={styles.input}
        />
      </div>
      {errors[name] && errors[name]?.type === 'required' && (
        <ValidationError errorMessage='Required field' />
      )}
      {errors[name] && errors[name]?.type === 'maxLength' && (
        <ValidationError errorMessage='Max length exceeded' />
      )}
    </div>
  );
}
