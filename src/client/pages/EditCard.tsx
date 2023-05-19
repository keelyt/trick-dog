import { BsTrash3 } from 'react-icons/bs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import EditCardForm from '../components/card/EditCardForm';
import Button from '../components/ui/Button';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import QueryError from '../components/ui/QueryError';
import useCardData from '../helpers/useCardData';
import useDeleteCard from '../helpers/useDeleteCard';

import styles from './EditCard.module.scss';

import type { CardsFilterState } from '../../types';
import type { Location } from 'react-router-dom';

export default function EditCard(): JSX.Element {
  const params = useParams<'deckId' | 'cardId'>();
  const navigate = useNavigate();
  const location: Location = useLocation();

  const deckId = Number(params.deckId!);
  const cardId = Number(params.cardId!);
  const tagId: number | null = location.state ? (location.state as CardsFilterState).tagId : null;
  const search: string = location.state ? (location.state as CardsFilterState).search : '';

  const cardQuery = useCardData(deckId, cardId);
  const deleteCard = useDeleteCard();

  return (
    <main className={styles.container}>
      <div className={styles.top}>
        <h1>Edit Card</h1>
        <Button
          as='button'
          type='button'
          onClick={() =>
            deleteCard.mutate(
              { deckId, cardId, tagId, search },
              {
                onSuccess: () => {
                  // Navigate back to the deck page, applying previous filter.
                  navigate(`/decks/${deckId}`, { state: { tagId, search } });
                },
              }
            )
          }
          disabled={deleteCard.isLoading}
          size='md'
          rounded={true}
        >
          <BsTrash3 aria-hidden='true' focusable='false' />
          Delete Card
        </Button>
      </div>
      {cardQuery.isError && (
        <QueryError
          label={
            cardQuery.error instanceof Error
              ? cardQuery.error.message
              : 'Error retrieving information from server.'
          }
          refetchFn={() => cardQuery.refetch()}
        />
      )}
      {cardQuery.isLoading && <LoadingIndicator />}
      {cardQuery.isSuccess && (
        <EditCardForm
          deckId={deckId}
          cardId={cardId}
          initQuestion={cardQuery.data.question}
          initAnswer={cardQuery.data.answer}
          filterState={{ tagId, search }}
        />
      )}
    </main>
  );
}
