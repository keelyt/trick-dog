import { useLocation, useParams } from 'react-router-dom';

import EditCardForm from '../components/card/EditCardForm';

import styles from './AddCard.module.scss';

import type { CardsFilterState } from '../../types';
import type { Location } from 'react-router-dom';

export default function AddCard(): JSX.Element {
  const params = useParams<'deckId'>();
  const location: Location = useLocation();

  const deckId = Number(params.deckId!);
  const tagId: number | null = location.state ? (location.state as CardsFilterState).tagId : null;
  const search: string = location.state ? (location.state as CardsFilterState).search : '';

  return (
    <div className={styles['add-container']}>
      <h1>Add Card</h1>
      <EditCardForm deckId={deckId} initQuestion='' initAnswer='' filterState={{ tagId, search }} />
    </div>
  );
}
