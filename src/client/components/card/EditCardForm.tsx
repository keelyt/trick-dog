import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { UseMutationResult } from '@tanstack/react-query';

import useAddCard from '../../helpers/useAddCard';
import useGetCardTags from '../../helpers/useGetCardTags';
import useUpdateCard from '../../helpers/useUpdateCard';
import Checkbox from '../form/Checkbox';
import Fieldset from '../form/Fieldset';
import FormError from '../form/FormError';
import TextArea from '../form/TextArea';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import QueryError from '../ui/QueryError';

import styles from './EditCardForm.module.scss';

import type {
  AddCardParams,
  CardResponse,
  CardsFilterState,
  TagData,
  UpdateCardParams,
} from '../../../types';

interface FormValues {
  question: string;
  answer: string;
  tags?: string[];
}

interface EditCardFormProps {
  deckId: number;
  deckTags: TagData[];
  cardId?: number;
  initQuestion: string;
  initAnswer: string;
  filterState: CardsFilterState;
}

export default function EditCardForm({
  deckId,
  deckTags,
  cardId,
  initQuestion,
  initAnswer,
  filterState,
}: EditCardFormProps): JSX.Element {
  const navigate = useNavigate();
  const mutateCard = cardId !== undefined ? useUpdateCard(filterState) : useAddCard(filterState);
  const cardTagsQuery = cardId !== undefined ? useGetCardTags(deckId, cardId) : null;

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
        navigate(`/decks/${deckId}/cards`, { state: filterState });
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
    if (cardTagsQuery?.isError) unregister('tags');
  }, [cardTagsQuery?.isError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.form__inner}>
        <TextArea<FormValues>
          register={register}
          name={'question'}
          label='Front'
          errors={errors}
          validation={{ required: 'Front is required' }}
        />
        <TextArea<FormValues>
          register={register}
          name={'answer'}
          label='Back'
          errors={errors}
          validation={{ required: 'Back is required' }}
        />
        <Fieldset caption='Card Tags'>
          {cardTagsQuery?.isError && (
            <QueryError label='Unable to load tags' refetchFn={cardTagsQuery.refetch} />
          )}
          {cardTagsQuery?.isLoading && <LoadingSpinner />}
          {(!cardTagsQuery || cardTagsQuery.isSuccess) &&
            deckTags.map((tag) => (
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
            disabled={mutateCard.isLoading || !isValid || cardTagsQuery?.isLoading}
          >
            {mutateCard.isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button as='link' href={`/decks/${deckId}/cards`} state={{ ...filterState }}>
            Cancel
          </Button>
        </div>
      </div>
      {mutateCard.isError && (
        <FormError
          errorMessage={
            mutateCard.error instanceof Error
              ? mutateCard.error.message
              : 'An error occurred while submitting the form. Please try again.'
          }
        />
      )}
    </form>
  );
}
