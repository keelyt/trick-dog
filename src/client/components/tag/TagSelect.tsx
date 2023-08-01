import { MdOutlineExpandCircleDown } from 'react-icons/md';

import styles from './TagSelect.module.scss';

import type { TagData } from '../../../types';
import type { ChangeEvent } from 'react';

interface TagSelectProps {
  tags: TagData[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: number | '';
  defaultText: string;
  showLabel: boolean;
  rounded?: boolean;
  colorScheme?: 'main' | 'dropdown';
}

export default function TagSelect({
  tags,
  onChange,
  value,
  defaultText,
  showLabel,
  rounded = true,
  colorScheme = 'main',
}: TagSelectProps): JSX.Element {
  return (
    <div className={styles.container}>
      <label htmlFor='tag' className={showLabel ? styles.select__label : styles['visually-hidden']}>
        Filter by Tag
      </label>
      <div
        className={`${styles.select} ${rounded ? styles['select--rounded'] : ''} ${
          styles[`select--${colorScheme}`]
        }`}
      >
        <select
          id='tag'
          name='tag'
          value={value}
          onChange={onChange}
          className={`${styles.select__inner} ${value ? '' : styles['select__inner--default']}`}
        >
          <option value=''>{defaultText}</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.tagName}
            </option>
          ))}
        </select>
        <span className={styles.select__icon}>
          <MdOutlineExpandCircleDown aria-hidden='true' focusable='false' />
        </span>
      </div>
    </div>
  );
}
