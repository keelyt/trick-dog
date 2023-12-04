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
  const nestedCheckboxesRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Set the initial tag count
  useEffect(() => {
    setTagCount(nestedCheckboxesRefs.current.filter((checkboxRef) => checkboxRef?.checked).length);
  }, []);

  // Uncheck the deck checkbox and make indeterminate if any of its tags are checked
  useEffect(() => {
    if (deckRef.current) deckRef.current.indeterminate = tagCount > 0;
    if (deckRef.current && tagCount > 0) deckRef.current.checked = false;
  }, [tagCount]);

  return (
    <li>
      <div
        className={`${styles.checkbox} ${styles['checkbox--deck']} ${
          expanded ? styles['checkbox--expanded'] : ''
        }`}
      >
        <input
          {...rest}
          type='checkbox'
          name={name}
          id={deckId.toString()}
          value={deckId}
          onChange={async (e) => {
            if (e.target.checked) {
              setTagCount(0);
              // Uncheck the nested checkboxes
              nestedCheckboxesRefs.current.forEach((checkboxRef) => {
                if (checkboxRef) checkboxRef.checked = false;
              });
            }
            await onChange(e);
          }}
          ref={(e) => {
            ref(e);
            deckRef.current = e;
          }}
          className={styles.input}
        />
        <label htmlFor={deckId.toString()} className={`${styles.label} ${styles['label--deck']}`}>
          {deckName}
        </label>
        {tags.length > 0 && (
          <button
            type='button'
            title={expanded ? 'Hide tag filters' : 'Show tag filters'}
            aria-expanded={expanded}
            aria-controls={`tl-${deckId}`}
            aria-label={
              expanded ? 'Hide tag filters for this deck' : 'Show tag filters for this deck'
            }
            onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
            className={styles.toggle}
          >
            <SlArrowDown
              aria-hidden='true'
              focusable='false'
              className={`${styles.toggle__icon} ${
                expanded ? styles['toggle__icon--expanded'] : ''
              }`}
            />
          </button>
        )}
      </div>
      {tags.length > 0 && (
        <div
          id={`tl-${deckId}`}
          className={`${styles.tags} ${expanded ? '' : styles['tags--collapsed']}`}
        >
          <span className={styles.tags__heading}>Narrow by tag:</span>
          <ul className={styles.tags__list}>
            {tags.map((tag, i) => (
              <li
                key={`${deckId}-${tag.id}`}
                className={`${styles.checkbox} ${styles['checkbox--tag']}`}
              >
                <input
                  {...rest}
                  type='checkbox'
                  name={name}
                  id={`${deckId}-${tag.id}`}
                  value={`${deckId}-${tag.id}`}
                  onChange={async (e) => {
                    if (e.target.checked) setTagCount((tagCount) => tagCount + 1);
                    else setTagCount((tagCount) => tagCount - 1);
                    await onChange(e);
                  }}
                  ref={(e) => {
                    ref(e);
                    nestedCheckboxesRefs.current[i] = e;
                  }}
                  className={styles.input}
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
