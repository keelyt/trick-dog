import styles from './TagSelect.module.scss';

import type { TagData } from '../../../types';
import type { ChangeEvent } from 'react';

interface TagSelectProps {
  tags: TagData[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function TagSelect({ tags, onChange }: TagSelectProps): JSX.Element | null {
  return (
    <>
      <label htmlFor='tag' className={styles['visually-hidden']}>
        Filter by Tag
      </label>
      <select id='tag' name='tag' onChange={onChange}>
        <option value=''>Select a tag to filter</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.tag_name}
          </option>
        ))}
      </select>
    </>
  );
}
