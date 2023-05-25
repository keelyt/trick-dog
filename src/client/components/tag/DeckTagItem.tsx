import { useRef } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';

import Button from '../ui/Button';

import styles from './DeckTagItem.module.scss';

import type { TagData } from '../../../types';
import type { MutableRefObject } from 'react';

interface DeckTagItemProps {
  tagId: number;
  deckId: number;
  tagName: string;
  setOpenModal: (modal: null | 'delete' | 'rename') => void;
  setTargetTag: (tag: TagData) => void;
  setModalSourceRef: (ref: MutableRefObject<HTMLButtonElement | null> | null) => void;
}

export default function DeckTagItem({
  tagId,
  deckId,
  tagName,
  setOpenModal,
  setTargetTag,
  setModalSourceRef,
}: DeckTagItemProps) {
  const btnDeleteRef = useRef<HTMLButtonElement>(null);
  const btnRenameRef = useRef<HTMLButtonElement>(null);

  return (
    <li className={styles.tag}>
      <span className={styles.tag__text}>{tagName}</span>
      <div className={styles.tag__buttons}>
        <Button
          ref={btnDeleteRef}
          as='button'
          type='button'
          size='md'
          rounded={false}
          ariaLabel='Delete tag'
          colorScheme='card'
          onClick={() => {
            setOpenModal('delete');
            setTargetTag({ id: tagId, deckId, tagName });
            setModalSourceRef(btnDeleteRef);
          }}
        >
          <BsTrash3 aria-hidden='true' focusable='false' />
        </Button>
        <Button
          ref={btnRenameRef}
          as='button'
          type='button'
          size='md'
          rounded={false}
          ariaLabel='Rename tag'
          colorScheme='card'
          onClick={() => {
            setOpenModal('rename');
            setTargetTag({ id: tagId, deckId, tagName });
            setModalSourceRef(btnRenameRef);
          }}
        >
          <CiEdit aria-hidden='true' focusable='false' />
        </Button>
      </div>
    </li>
  );
}
