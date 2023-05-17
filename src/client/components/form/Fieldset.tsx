import styles from './Fieldset.module.scss';

import type { ReactNode } from 'react';

export default function Fieldset({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{caption}</legend>
      {children}
    </fieldset>
  );
}
