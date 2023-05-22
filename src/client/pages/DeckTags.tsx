import { useDeckContext } from '../layouts/EditDeckLayout';

import styles from './DeckTags.module.scss';

export default function DeckTags(): JSX.Element {
  const { deckId, deckTags } = useDeckContext();

  return (
    <div className={styles['tags-container']}>
      <h2 className={styles.heading}>Manage Deck Tags</h2>
    </div>
  );
}
