import { useEffect, useRef, useState } from 'react';
import { SlArrowDown } from 'react-icons/sl';

import styles from './DeckStudyCheckbox.module.scss';

import type { TagData } from '../../../types';
import type { StudyFormValues } from '../../pages/StudySelection';
import type { Path, UseFormRegister } from 'react-hook-form';

interface DeckStudyCheckboxProps {
  register: UseFormRegister<StudyFormValues>;
  name: Path<StudyFormValues>;
  deckId: number;
  deckName: string;
  tags: TagData[];
}

export default function DeckStudyCheckbox({
  register,
  name,
  deckId,
  deckName,
  tags,
}: DeckStudyCheckboxProps): JSX.Element {
  const { onChange, ref, ...rest } = register(name, { required: true });

  const [tagCount, setTagCount] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);

  const deckRef = useRef<HTMLInputElement | null>(null);

  // Uncheck the deck checkbox and make indeterminate if any of its tags are checked
  useEffect(() => {
    if (deckRef.current) deckRef.current.indeterminate = tagCount > 0;
    if (deckRef.current && tagCount > 0) deckRef.current.checked = false;
  }, [tagCount]);

  return (
    <li className={styles.deck}>
      <input
        {...rest}
        type='checkbox'
        name={name}
        id={deckId.toString()}
        value={deckId}
        onChange={onChange}
        ref={(e) => {
          ref(e);
          deckRef.current = e;
        }}
        className={`${styles.input} ${styles['input--deck']}`}
      />
      <label htmlFor={deckId.toString()} className={`${styles.label} ${styles['label--deck']}`}>
        {deckName}
      </label>
      <button
        type='button'
        onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
        className={styles.toggle}
      >
        <SlArrowDown
          aria-hidden='true'
          focusable='false'
          className={`${styles.toggle__icon} ${expanded ? styles['toggle__icon--expanded'] : ''}`}
        />
      </button>
      {tags.length > 0 && (
        <div
          className={`${styles['tags-list']} ${
            styles[`tags-list--${expanded ? 'expanded' : 'collapsed'}`]
          }`}
        >
          <span>Narrow selection by tag:</span>
          <ul>
            {tags.map((tag) => (
              <li key={`${deckId}-${tag.id}`} className={styles.tag}>
                <input
                  {...register(name, { required: true })}
                  type='checkbox'
                  name={name}
                  id={`${deckId}-${tag.id}`}
                  value={`${deckId}-${tag.id}`}
                  onChange={(e) => {
                    if (e.target.checked) setTagCount((tagCount) => tagCount + 1);
                    else setTagCount((tagCount) => tagCount - 1);
                    void onChange(e);
                  }}
                  className={`${styles.input} ${styles['input--tag']}`}
                />
                <label
                  htmlFor={`${deckId}-${tag.id}`}
                  className={`${styles.label} ${styles['label--tag']}`}
                >
                  {tag.tagName}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
