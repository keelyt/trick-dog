import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useDeckContext } from './EditDeck';
import FormError from '../components/form/FormError';
import TextInput from '../components/form/TextInput';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import Modal from '../components/ui/Modal';
import useDeleteDeck from '../helpers/useDeleteDeck';
import useRenameDeck from '../helpers/useRenameDeck';

import styles from './DeckSettings.module.scss';

import type { SubmitHandler } from 'react-hook-form';

interface FormValues {
  deckName: string;
}

export default function DeckSettings(): JSX.Element {
  const { deckId, deckName } = useDeckContext();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const renameDeck = useRenameDeck();
  const deleteDeck = useDeleteDeck();

  const navigate = useNavigate();

  const btnDeleteRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      deckName,
    },
  });

  // Handler function for form submission
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) =>
    renameDeck.mutate(
      { deckId, deckName: data.deckName },
      // Update the default value to the new deck name.
      { onSuccess: () => reset({ deckName: data.deckName }) }
    );

  const handleDeleteDialogCancel = () => {
    setDeleteModalIsOpen(false);
    btnDeleteRef.current?.focus();
  };

  const handleDeleteDialogOk = () => {
    // Delete the current deck.
    deleteDeck.mutate(deckId, {
      onSuccess: () => {
        // Navigate back to the decks page.
        navigate('/decks');
      },
    });
  };

  return (
    <div className={styles['settings-container']}>
      {deleteModalIsOpen && (
        <Modal onClose={handleDeleteDialogCancel}>
          <DeleteDialog
            onOk={handleDeleteDialogOk}
            onCancel={handleDeleteDialogCancel}
            title='Are you sure?'
            text='Are you sure you want to delete this deck? This cannot be undone.'
            okLabel={deleteDeck.isLoading ? 'Deleting...' : 'Delete'}
            okDisabled={deleteDeck.isLoading}
            {...(deleteDeck.isError && {
              error:
                deleteDeck.error instanceof Error
                  ? deleteDeck.error.message
                  : 'An error occurred. Please try again.',
            })}
          />
        </Modal>
      )}
      <div className={styles.content}>
        {/* <h2 className={styles.heading}>Deck Settings</h2> */}
        <div className={styles.settings}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.settings__rename}>
            <div className={styles.form}>
              <TextInput
                register={register}
                name='deckName'
                label='Deck Name'
                errors={errors}
                validation={{ required: 'Deck name is required', maxLength: 100 }}
              />
              <Button
                as='button'
                type='submit'
                size='lg'
                rounded={false}
                disabled={renameDeck.isLoading || !isValid}
              >
                {renameDeck.isLoading ? 'Renaming...' : 'Rename'}
              </Button>
            </div>
            {renameDeck.isError && (
              <FormError
                errorMessage={
                  renameDeck.error instanceof Error
                    ? renameDeck.error.message
                    : 'An error occurred while submitting the form. Please try again.'
                }
              />
            )}
          </form>
          <div className={styles.settings__delete}>
            <div>
              <strong className={styles.settings__label}>Delete This Deck</strong>
              <p className={styles.settings__text}>Warning: This cannot be undone.</p>
            </div>
            <Button
              ref={btnDeleteRef}
              as='button'
              type='button'
              onClick={() => setDeleteModalIsOpen(true)}
              size='lg'
              rounded={false}
            >
              Delete Deck
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
