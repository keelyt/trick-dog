import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormError from '../components/form/FormError';
import TextInput from '../components/form/TextInput';
import DeckTagItem from '../components/tag/DeckTagItem';
import RenameTagForm from '../components/tag/RenameTagForm';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import Modal from '../components/ui/Modal';
import useAddTag from '../helpers/useAddTag';
import useDeleteTag from '../helpers/useDeleteTag';
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
  const [showErrors, setShowErrors] = useState<boolean>(true);

  const deleteTag = useDeleteTag();
  const addTag = useAddTag();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: 'onChange' });

  // Handler function for form submission
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) =>
    addTag.mutate(
      { deckId, tagName: data.tagName },
      {
        onSuccess: () => {
          reset();
          setFocus('tagName');
        },
      }
    );

  // Hide errors when input is cleared.
  useEffect(() => {
    addTag.reset();
    if (errors.tagName?.type === 'required') setShowErrors(false);
    else setShowErrors(true);
  }, [errors.tagName]);

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

  return (
    <div className={styles['tags-container']}>
      {/* <h2 className={styles.heading}>Manage Deck Tags</h2> */}
      {openModal && targetTag && (
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
            <RenameTagForm
              deckId={deckId}
              tagId={targetTag.id}
              initTagName={targetTag.tagName}
              resetFn={resetState}
            />
          )}
        </Modal>
      )}
      <div className={styles.form__container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextInput
            register={register}
            name='tagName'
            label='New Tag'
            errors={errors}
            validation={{ required: true, maxLength: 50 }}
            showErrors={showErrors}
          />
          <Button
            as='button'
            type='submit'
            size='lg'
            rounded={false}
            disabled={addTag.isLoading || !isValid}
          >
            {addTag.isLoading ? 'Adding...' : 'Add Tag'}
          </Button>
        </form>
        {addTag.isError && <FormError errorMessage={addTag.error.message} />}
      </div>
      <ul className={styles.list}>
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
