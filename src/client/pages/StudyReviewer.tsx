import BackButton from '../components/ui/BackButton';

import styles from './StudyReviewer.module.scss';

export default function StudyReviewer({ selection }: { selection: string }) {
  return (
    <main className={styles.content}>
      <BackButton href='/study' label='ModifySelection' state={{ selection }} />
      <h1>Review your cards:</h1>
    </main>
  );
}
