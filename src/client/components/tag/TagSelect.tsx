import styles from './TagSelect.module.scss';

import type { TagData } from '../../../types';
import type { ChangeEvent } from 'react';

interface TagSelectProps {
  tags: TagData[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  defaultSelected: boolean;
  defaultText: string;
  showLabel: boolean;
  rounded: boolean;
}

export default function TagSelect({
  tags,
  onChange,
  defaultSelected,
  defaultText,
  showLabel,
  rounded,
}: TagSelectProps): JSX.Element {
  return (
    <div className={styles.dropdown}>
      <label
        htmlFor='tag'
        className={showLabel ? styles.dropdown__label : styles['visually-hidden']}
      >
        Filter by Tag
      </label>
      <select
        id='tag'
        name='tag'
        onChange={onChange}
        className={`${styles.select} ${defaultSelected ? styles['select--default'] : ''} ${
          rounded ? styles['select--rounded'] : ''
        }`}
      >
        <option value=''>{defaultText}</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.tagName}
          </option>
        ))}
      </select>
    </div>
  );
}
