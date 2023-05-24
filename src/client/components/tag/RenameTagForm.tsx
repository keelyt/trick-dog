import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useRenameTag from '../../helpers/useRenameTag';
import FormError from '../form/FormError';
import TextInput from '../form/TextInput';
import Button from '../ui/Button';

import styles from '../../styles/modalForm.module.scss';

import type { SubmitHandler } from 'react-hook-form';

interface FormValues {
  tagName: string;
}

interface RenameTagFormProps {
  deckId: number;
  tagId: number;
  initTagName: string;
  resetFn: () => void;
}

export default function RenameTagForm({ deckId, tagId, initTagName, resetFn }: RenameTagFormProps) {
  const renameTag = useRenameTag();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      tagName: initTagName,
    },
  });

  // Reset the form when the component unmounts.
  useEffect(() => {
    return () => reset();
  }, []);

  const handleRenameSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    // Rename the current tag.
    renameTag.mutate({ deckId, tagId, tagName: data.tagName }, { onSuccess: resetFn });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleRenameSubmit)}>
      <h1 className={styles.form__heading}>Rename Tag</h1>
      <TextInput<FormValues>
        register={register}
        name='tagName'
        label='Tag Name'
        errors={errors}
        validation={{ required: true, maxLength: 50 }}
      />
      <div className={styles.form__buttons}>
        <Button as='button' type='button' onClick={resetFn} rounded={true}>
          Cancel
        </Button>
        <Button
          as='button'
          type='submit'
          aria-disabled={renameTag.isLoading}
          disabled={renameTag.isLoading || !isValid}
          rounded={true}
        >
          {renameTag.isLoading ? 'Renaming...' : 'Rename'}
        </Button>
      </div>
      {renameTag.isError && <FormError errorMessage={renameTag.error.message} />}
    </form>
  );
}
