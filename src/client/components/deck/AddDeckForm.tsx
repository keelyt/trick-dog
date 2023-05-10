import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import useAddDeck from '../../helpers/useAddDeck';
import TextInput from '../form/TextInput';
import Button from '../ui/Button';

import styles from './AddDeckForm.module.scss';

import type { SubmitHandler } from 'react-hook-form';

interface FormValues {
  name: string;
}

export default function AddDeckForm({ onCancel }: { onCancel: () => void }) {
  const navigate = useNavigate();
  const addDeck = useAddDeck();

  // Reset the form when the component unmounts.
  useEffect(() => {
    return () => reset();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // Handler function for form submission
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) =>
    addDeck.mutate(data.name, {
      onSuccess: (data) => {
        // Reset the form.
        reset();
        // Navigate to the new deck page.
        navigate(`/decks/${data.deck.id}`);
      },
    });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.form__heading}>Create Deck</h1>
      <TextInput<FormValues>
        register={register}
        name={'name'}
        label='Deck Name'
        errors={errors}
        validation={{ required: true }}
      />
      <div className={styles.buttons}>
        <Button as='button' type='button' onClick={onCancel} rounded={true}>
          Cancel
        </Button>
        <Button
          as='button'
          type='submit'
          aria-disabled={addDeck.isLoading}
          disabled={addDeck.isLoading}
          rounded={true}
        >
          {addDeck.isLoading ? 'Creating Deck...' : 'Create Deck'}
        </Button>
      </div>
    </form>
  );
}
