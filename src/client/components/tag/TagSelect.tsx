import useDeckTagsData from '../../helpers/useDeckTagsData';

import styles from './TagSelect.module.scss';

import type { ChangeEvent } from 'react';

interface TagSelectProps {
  deckId: number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function TagSelect({ deckId, onChange }: TagSelectProps): JSX.Element | null {
  const tagsQuery = useDeckTagsData(deckId);

  if (!tagsQuery.data || tagsQuery.data.length === 0) return null;

  return (
    <>
      <label htmlFor='tag' className={styles['visually-hidden']}>
        Filter by Tag
      </label>
      <select id='tag' name='tag' onChange={onChange}>
        <option value=''>Select a tag to filter</option>
        {tagsQuery.data.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.tag_name}
          </option>
        ))}
      </select>
    </>
  );
}
