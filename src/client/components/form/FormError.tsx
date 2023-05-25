import styles from './FormError.module.scss';

export default function FormError({ errorMessage }: { errorMessage: string }) {
  return (
    <div className={styles.error} role='alert'>
      {errorMessage}
    </div>
  );
}
