import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useCardTagsData from '../../helpers/useCardTagsData';
import useDeckTagsData from '../../helpers/useDeckTagsData';
import TextArea from '../form/TextArea';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import QueryError from '../ui/QueryError';

import type { CardsFilterState } from '../../../types';

interface FormValues {
  question: string;
  answer: string;
  tags?: string[];
}

interface EditCardFormProps {
  deckId: number;
  cardId?: number;
  initQuestion: string;
  initAnswer: string;
  onSubmit: ({ question, answer, tags }: FormValues) => void;
  filterState: CardsFilterState;
}

export default function EditCardForm({
  deckId,
  cardId,
  initQuestion,
  initAnswer,
  onSubmit,
  filterState,
}: EditCardFormProps): JSX.Element {
  const deckTagsQuery = useDeckTagsData(deckId);
  const cardTagsQuery = cardId !== undefined ? useCardTagsData(deckId, cardId) : null;

  const {
    register,
    handleSubmit,
    reset,
    unregister,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      question: initQuestion,
      answer: initAnswer,
      tags: [],
    },
  });

  // Update the tags default value once the query finishes.
  // Send entire defaultValues, but keep dirty values.
  useEffect(
    () =>
      reset(
        {
          question: initQuestion,
          answer: initAnswer,
          tags: cardTagsQuery?.data?.map(String) ?? [],
        },
        { keepDirtyValues: true }
      ),
    [cardTagsQuery?.data]
  );

  // Unregister the tags if there are query errors.
  useEffect(() => {
    if (cardTagsQuery?.isError || deckTagsQuery.isError) unregister('tags');
  }, [cardTagsQuery?.isError, deckTagsQuery.isError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea<FormValues>
        register={register}
        name={'question'}
        label='Front'
        errors={errors}
        validation={{ required: true }}
      />
      <TextArea<FormValues>
        register={register}
        name={'answer'}
        label='Back'
        errors={errors}
        validation={{ required: true }}
      />
      <fieldset>
        <legend>Card Tags</legend>
        {(deckTagsQuery.isError || cardTagsQuery?.isError) && (
          <QueryError
            label='Unable to load tags'
            refetchFn={() => {
              if (deckTagsQuery.isError) deckTagsQuery.refetch;
              if (cardTagsQuery?.isError) cardTagsQuery.refetch;
            }}
          />
        )}
        {(deckTagsQuery.isLoading || cardTagsQuery?.isLoading) && <LoadingSpinner />}
        {deckTagsQuery.isSuccess &&
          cardTagsQuery?.isSuccess &&
          deckTagsQuery.data.map((tag) => (
            <div key={tag.id}>
              <input type='checkbox' id={tag.tagName} value={tag.id} {...register('tags')} />
              <label htmlFor={tag.tagName}>{tag.tagName}</label>
            </div>
          ))}
      </fieldset>
      <Button as='link' href={`/decks/${deckId}`} state={{ ...filterState }}>
        Cancel
      </Button>
      <Button as='button' type='submit'>
        Save
      </Button>
    </form>
  );
}
