import { useState } from 'react';

import DeckTagItem from '../components/tag/DeckTagItem';
import RenameTagForm from '../components/tag/RenameTagForm';
import DeleteDialog from '../components/ui/DeleteDialog';
import Modal from '../components/ui/Modal';
import useDeleteTag from '../helpers/useDeleteTag';
import { useDeckContext } from '../layouts/EditDeckLayout';

import styles from './DeckTags.module.scss';

import type { TagData } from '../../types';
import type { MutableRefObject } from 'react';

export default function DeckTags(): JSX.Element {
  const { deckId, deckTags } = useDeckContext();

  const [targetTag, setTargetTag] = useState<TagData | null>(null);
  const [modalSourceRef, setModalSourceRef] =
    useState<MutableRefObject<HTMLButtonElement | null> | null>(null);
  const [openModal, setOpenModal] = useState<null | 'delete' | 'rename'>(null);

  const deleteTag = useDeleteTag();

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
      <h2 className={styles.heading}>Manage Deck Tags</h2>
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
