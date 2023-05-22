import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import TextInput from '../components/form/TextInput';
import DeckTagItem from '../components/tag/DeckTagItem';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import Modal from '../components/ui/Modal';
import useDeleteTag from '../helpers/useDeleteTag';
import useRenameTag from '../helpers/useRenameTag';
import { useDeckContext } from '../layouts/EditDeckLayout';

import styles from './DeckTags.module.scss';

import type { TagData } from '../../types';
import type { MutableRefObject } from 'react';
import type { SubmitHandler } from 'react-hook-form';

interface FormValues {
  tagName: string;
}

export default function DeckTags(): JSX.Element {
  const { deckId, deckTags } = useDeckContext();

  const [targetTag, setTargetTag] = useState<TagData | null>(null);
  const [modalSourceRef, setModalSourceRef] =
    useState<MutableRefObject<HTMLButtonElement | null> | null>(null);
  const [openModal, setOpenModal] = useState<null | 'delete' | 'rename'>(null);

  const deleteTag = useDeleteTag();
  const renameTag = useRenameTag();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onBlur',
  });

  useEffect(() => reset({ tagName: targetTag?.tagName }), [targetTag]);

  const resetState = () => {
    modalSourceRef?.current?.focus();
    setOpenModal(null);
    setModalSourceRef(null);
    setTargetTag(null);
  };

  const handleDeleteDialogOk = () => {
    // Close the dialog and return if the targetTag is null (this shouldn't happen).
    if (targetTag === null) return resetState();
    // Delete the current tag.
    deleteTag.mutate({ deckId, tagId: targetTag.id }, { onSuccess: () => resetState() });
  };

  const handleRenameSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    // Close the dialog and return if the targetTag is null (this shouldn't happen).
    if (targetTag === null) return resetState();
    // Rename the current tag.
    renameTag.mutate(
      { deckId, tagId: targetTag.id, tagName: data.tagName },
      { onSuccess: resetState }
    );
  };

  return (
    <div className={styles['tags-container']}>
      <h2 className={styles.heading}>Manage Deck Tags</h2>
      {openModal && (
        <Modal onClose={resetState}>
          {openModal === 'delete' && (
            <DeleteDialog
              onOk={handleDeleteDialogOk}
              onCancel={resetState}
              title='Are you sure?'
              text={`Are you sure you want to delete this tag?\nThis will remove it from all cards in this deck.`}
              okLabel={deleteTag.isLoading ? 'Deleting...' : 'Delete'}
              okDisabled={deleteTag.isLoading}
            />
          )}
          {openModal === 'rename' && (
            <form className={styles.form} onSubmit={handleSubmit(handleRenameSubmit)}>
              <h1 className={styles.form__heading}>Rename Tag</h1>
              <TextInput<FormValues>
                register={register}
                name={'tagName'}
                label='Tag Name'
                errors={errors}
                validation={{ required: true, maxLength: 100 }}
              />
              <div className={styles.form__buttons}>
                <Button as='button' type='button' onClick={resetState} rounded={true}>
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
              {renameTag.isError && <span>{`${renameTag.error.message}.`}</span>}
            </form>
          )}
        </Modal>
      )}
      <ul>
        {deckTags.map((tag) => (
          <DeckTagItem
            key={tag.id}
            tagId={tag.id}
            deckId={tag.deckId}
            tagName={tag.tagName}
            setOpenModal={setOpenModal}
            setTargetTag={setTargetTag}
            setModalSourceRef={setModalSourceRef}
          />
        ))}
      </ul>
    </div>
  );
}
