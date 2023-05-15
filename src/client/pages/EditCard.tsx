import { useLocation, useNavigate, useParams } from 'react-router-dom';

import EditCardForm from '../components/card/EditCardForm';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import QueryError from '../components/ui/QueryError';
import useCardData from '../helpers/useCardData';
import useUpdateCard from '../helpers/useUpdateCard';

import type { CardsFilterState } from '../../types';
import type { Location } from 'react-router-dom';

export default function EditCard(): JSX.Element {
  const params = useParams<'deckId' | 'cardId'>();
  const location: Location = useLocation();

  const navigate = useNavigate();

  const deckId: number = parseInt(params.deckId!);
  const cardId: number = parseInt(params.cardId!);
  const tagId: number | null = location.state ? (location.state as CardsFilterState).tagId : null;
  const search: string = location.state ? (location.state as CardsFilterState).search : '';

  const cardQuery = useCardData(deckId, cardId);
  const updateCard = useUpdateCard(tagId, search);

  const handleSubmit = ({
    question,
    answer,
    tags,
  }: {
    question: string;
    answer: string;
    tags?: string[];
  }) => {
    // Update the card.
    updateCard.mutate(
      { cardId, deckId, question, answer, ...(tags && { tags: tags.map(Number) }) },
      {
        onSuccess: () => {
          // Navigate back to the deck page, applying previous filter.
          navigate(`/decks/${deckId}`, { state: { tagId, search } });
        },
      }
    );
  };

  return (
    <main>
      <h1>Edit Card</h1>
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
          onSubmit={handleSubmit}
          filterState={{ tagId, search }}
        />
      )}
    </main>
  );
}
