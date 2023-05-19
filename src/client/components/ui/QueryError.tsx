import Button from './Button';

import styles from './QueryError.module.scss';

export default function QueryError({
  label,
  refetchFn,
}: {
  label: string;
  refetchFn?: () => void;
}): JSX.Element {
  return (
    <div className={styles.error}>
      <p className={styles.error__label}>{label}</p>
      {refetchFn && (
        <Button as='button' type='button' onClick={refetchFn} size='md'>
          Retry
        </Button>
      )}
    </div>
  );
}
