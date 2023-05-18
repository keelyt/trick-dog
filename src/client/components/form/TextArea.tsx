import { useRef } from 'react';

import ValidationError from './ValidationError';
import useAutoExpandTextArea from '../../helpers/autoExpandTextArea';

import styles from './TextArea.module.scss';

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

export default function TextArea<TFormValues extends FieldValues>({
  register,
  name,
  label,
  validation = {},
  errors,
  placeholder = '',
}: FormInputProps<TFormValues>): JSX.Element {
  const { ref, ...rest } = register(name, validation);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutoExpandTextArea(textareaRef);

  return (
    <div>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <textarea
        {...rest}
        id={name}
        placeholder={placeholder}
        aria-invalid={errors[name] ? 'true' : 'false'}
        className={styles.input}
        ref={(e) => {
          ref(e);
          textareaRef.current = e;
        }}
      />
      {errors[name] && errors[name]?.type === 'required' && (
        <ValidationError errorMessage='Required field' />
      )}
    </div>
  );
}
