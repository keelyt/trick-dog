import styles from './TagSelect.module.scss';

import type { TagData } from '../../../types';
import type { ChangeEvent } from 'react';

interface TagSelectProps {
  tags: TagData[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  defaultSelected: boolean;
  defaultText: string;
}

export default function TagSelect({
  tags,
  onChange,
  defaultSelected,
  defaultText,
}: TagSelectProps): JSX.Element {
  return (
    <>
      <label htmlFor='tag' className={styles['visually-hidden']}>
        Filter by Tag
      </label>
      <select
        id='tag'
        name='tag'
        onChange={onChange}
        className={`${styles.select} ${defaultSelected ? styles['select--default'] : ''}`}
      >
        <option value=''>{defaultText}</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.tagName}
          </option>
        ))}
      </select>
    </>
  );
}
