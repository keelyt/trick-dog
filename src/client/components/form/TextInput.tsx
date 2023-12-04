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
  showErrors?: boolean;
}

export default function TextInput<TFormValues extends FieldValues>({
  register,
  name,
  label,
  validation = {},
  errors,
  placeholder = '',
  showErrors = true,
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
          {...(placeholder && { placeholder: placeholder })}
          aria-invalid={errors[name] ? 'true' : 'false'}
          className={styles.input}
        />
      </div>
      <div className={showErrors ? '' : styles['visually-hidden']}>
        {errors[name] && errors[name]?.type === 'required' && (
          <ValidationError errorMessage={errors[name]?.message?.toString() || 'Required field'} />
        )}
        {errors[name] && errors[name]?.type === 'maxLength' && (
          <ValidationError
            errorMessage={`Max length
              ${
                validation.maxLength
                  ? `of ${
                      typeof validation.maxLength === 'number'
                        ? validation.maxLength
                        : validation.maxLength.value
                    }`
                  : ''
              } exceeded`}
          />
        )}
      </div>
    </div>
  );
}
