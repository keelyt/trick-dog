import { ReactComponent as Coder } from '../assets/programmer.svg';

import styles from './Stats.module.scss';

export default function Stats() {
  return (
    <main className={styles.content}>
      <h1 className={styles.heading}>Coming Soon</h1>
      <p className={styles.text}>We&apos;re working on something awesome!</p>
      <Coder className={styles.image} />
    </main>
  );
}
