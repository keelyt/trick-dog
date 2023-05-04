import styles from './LoadingIndicator.module.scss';

export default function LoadingIndicator() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
