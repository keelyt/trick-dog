import ValidationError from './ValidationError';

import styles from './TextInput.module.scss';

import type {
  UseFormRegister,
  FieldValues,
  RegisterOptions,
  FieldErrors,
  Path,
} from 'react-hook-form';

interface FormInputProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  validation?: RegisterOptions;
  errors: FieldErrors<TFormValues>;
  placeholder?: string;
}

export default function FormInput<TFormValues extends FieldValues>({
  register,
  name,
  label,
  validation = {},
  errors,
  placeholder = '',
}: FormInputProps<TFormValues>): JSX.Element {
  return (
    <div>
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
      {errors.name && errors.name.type === 'required' && (
        <ValidationError errorMessage='Required field' />
      )}
    </div>
  );
}
