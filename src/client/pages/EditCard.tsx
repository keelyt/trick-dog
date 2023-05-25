import { BsTrash3 } from 'react-icons/bs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import EditCardForm from '../components/card/EditCardForm';
import Button from '../components/ui/Button';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import QueryError from '../components/ui/QueryError';
import useCardData from '../helpers/useCardData';
import useDeleteCard from '../helpers/useDeleteCard';
import { useDeckContext } from '../layouts/EditDeckLayout';

import styles from './EditCard.module.scss';

import type { CardsFilterState } from '../../types';
import type { Location } from 'react-router-dom';

export default function EditCard(): JSX.Element {
  const { deckId, deckTags } = useDeckContext();
  const params = useParams<'cardId'>();
  const navigate = useNavigate();
  const location: Location = useLocation();

  const cardId = Number(params.cardId!);
  const tagId: number | null = location.state ? (location.state as CardsFilterState).tagId : null;
  const search: string = location.state ? (location.state as CardsFilterState).search : '';

  const cardQuery = useCardData(deckId, cardId);
  const deleteCard = useDeleteCard();

  return (
    <div className={styles['edit-container']}>
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
                  navigate(`/decks/${deckId}/cards`, { state: { tagId, search } });
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
          deckTags={deckTags}
          cardId={cardId}
          initQuestion={cardQuery.data.question}
          initAnswer={cardQuery.data.answer}
          filterState={{ tagId, search }}
        />
      )}
    </div>
  );
}
