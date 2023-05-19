import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { UseMutationResult } from '@tanstack/react-query';

import useAddCard from '../../helpers/useAddCard';
import useCardTagsData from '../../helpers/useCardTagsData';
import useDeckTagsData from '../../helpers/useDeckTagsData';
import useUpdateCard from '../../helpers/useUpdateCard';
import Checkbox from '../form/Checkbox';
import Fieldset from '../form/Fieldset';
import TextArea from '../form/TextArea';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import QueryError from '../ui/QueryError';

import styles from './EditCardForm.module.scss';

import type {
  AddCardParams,
  CardResponse,
  CardsFilterState,
  UpdateCardParams,
} from '../../../types';

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
  filterState: CardsFilterState;
}

export default function EditCardForm({
  deckId,
  cardId,
  initQuestion,
  initAnswer,
  filterState,
}: EditCardFormProps): JSX.Element {
  const navigate = useNavigate();
  const mutateCard = cardId !== undefined ? useUpdateCard(filterState) : useAddCard(filterState);
  const deckTagsQuery = useDeckTagsData(deckId);
  const cardTagsQuery = cardId !== undefined ? useCardTagsData(deckId, cardId) : null;

  const {
    register,
    handleSubmit,
    reset,
    unregister,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      question: initQuestion,
      answer: initAnswer,
      tags: [],
    },
  });

  const onSubmit = ({ question, answer, tags }: FormValues) => {
    const options = {
      onSuccess: () => {
        // Navigate back to the deck page, applying previous filter.
        navigate(`/decks/${deckId}`, { state: filterState });
      },
    };

    if (cardId !== undefined) {
      // Update the card.
      (mutateCard as UseMutationResult<CardResponse, unknown, UpdateCardParams>).mutate(
        { cardId, deckId, question, answer, ...(tags && { tags: tags.map(Number) }) },
        options
      );
    } else {
      // Add the new card.
      (mutateCard as UseMutationResult<CardResponse, unknown, AddCardParams>).mutate(
        { deckId, question, answer, ...(tags && { tags: tags.map(Number) }) },
        options
      );
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
      <Fieldset caption='Card Tags'>
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
          (!cardTagsQuery || cardTagsQuery.isSuccess) &&
          deckTagsQuery.data.map((tag) => (
            <Checkbox<FormValues>
              key={tag.id}
              register={register}
              name={'tags'}
              label={tag.tagName}
              value={tag.id}
              id={tag.id.toString()}
            />
          ))}
      </Fieldset>
      <div className={styles.form__buttons}>
        <Button
          as='button'
          type='submit'
          disabled={
            mutateCard.isLoading || !isValid || deckTagsQuery.isLoading || cardTagsQuery?.isLoading
          }
        >
          {mutateCard.isLoading ? 'Saving...' : 'Save'}
        </Button>
        <Button as='link' href={`/decks/${deckId}`} state={{ ...filterState }}>
          Cancel
        </Button>
        {mutateCard.isError && <p>Error submitting. Please try again.</p>}
      </div>
    </form>
  );
}
