import { Response } from 'miragejs';

import type { AppSchema, AppServer, Card } from '../types';

export default function cardHandler(server: AppServer) {
  server.get('/decks/:deckId/cards/:cardId', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID.' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID.' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found.' });

    return card;
  });

  server.delete('/decks/:deckId/cards/:cardId', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID.' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID.' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found.' });

    card.destroy();
    return card;
  });

  server.patch('/decks/:deckId/cards/:cardId', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    const attrs = JSON.parse(request.requestBody) as {
      question: string;
      answer: string;
      tags?: number[];
    };

    if (!attrs.question) return new Response(400, {}, { error: 'Front is required.' });
    if (!attrs.answer) return new Response(400, {}, { error: 'Back is required.' });

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID.' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID.' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found.' });

    card.update({
      question: attrs.question,
      answer: attrs.answer,
      ...(attrs.tags && { tagIds: attrs.tags.map(String) }),
    });

    return card;
  });

  server.patch('/decks/:deckId/cards/:cardId/difficulty', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    const { difficulty } = JSON.parse(request.requestBody) as {
      difficulty: 'Easy' | 'Medium' | 'Hard';
    };

    const difficulties = { Easy: 1, Medium: 0.5, Hard: 0 };

    if (!(difficulty in difficulties)) return new Response(400, {}, { error: 'Invalid request.' });

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID.' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID.' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found.' });

    const difficultyRating = difficulties[difficulty];
    const reviewed = new Date().toString();
    const dueWeight = card.dateLastReviewed
      ? Math.min(
          2,
          (Date.parse(reviewed) - Date.parse(card.dateLastReviewed)) /
            (1000 * 60 * 60 * 24) /
            card.daysBetweenReview
        )
      : 0;
    const newDifficulty = Math.min(
      Math.max(
        card.difficulty +
          (difficultyRating < 0.6 ? 1 : dueWeight) * (1 / 17) * (8 - 9 * difficultyRating),
        0
      ),
      1
    );

    card.update({
      dateLastReviewed: reviewed,
      difficulty: newDifficulty,
      daysBetweenReview:
        card.daysBetweenReview *
        (difficultyRating < 0.6
          ? Math.min(1, 1 / (1 + 3 * newDifficulty))
          : 1 + (2 - 1.7 * newDifficulty) * dueWeight * (Math.random() * (1.05 - 0.95) + 0.95)),
      // attemptCount and correctCount not currently being used.
      attemptCount: card.attemptCount + 1,
      correctCount: difficultyRating < 0.6 ? card.correctCount : card.correctCount + 1,
    });

    return card;
  });

  server.get('/decks/:deckId/cards', (schema: AppSchema, request) => {
    const { deckId } = request.params;
    const { before, tag, q, limit } = request.queryParams;

    if (!limit || isNaN(Number(limit)))
      return new Response(400, {}, { error: 'Page limit must be a number not exceeding 100.' });

    return schema
      .where(
        'card',
        (card) =>
          card.deckId === deckId &&
          (!before || Date.parse(card.dateCreated) < Date.parse(before)) &&
          (!tag || card.tagIds.includes(tag)) &&
          (!q ||
            card.question.toLowerCase().includes(q.toLowerCase()) ||
            card.answer.toLowerCase().includes(q.toLowerCase()))
      )
      .sort((a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated)) // Sort by date descending.
      .slice(0, Math.min(Number(limit), 100)); // Limit to the provided limit (up to 100 cards per page).
  });

  server.post('/decks/:deckId/cards/', (schema: AppSchema, request) => {
    const { deckId } = request.params;

    const attrs = JSON.parse(request.requestBody) as {
      question: string;
      answer: string;
      tags?: number[];
    };

    if (!attrs.question) return new Response(400, {}, { error: 'Front is required.' });
    if (!attrs.answer) return new Response(400, {}, { error: 'Back is required.' });

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID.' });

    const deck = schema.findBy('deck', { id: deckId });

    if (!deck) return new Response(404, {}, { error: 'Deck not found.' });

    const card = schema.create('card', {
      deckId: deckId,
      question: attrs.question,
      answer: attrs.answer,
      ...(attrs.tags && { tagIds: attrs.tags.map(String) }),
      attemptCount: 0,
      correctCount: 0,
      dateCreated: new Date().toString(),
    });

    return card;
  });

  server.get('/study', (schema: AppSchema, request) => {
    const { sel } = request.queryParams;

    if (!sel) return new Response(400, {}, { error: 'Invalid selection.' });

    const decksWithoutTags: string[] = [];
    const decksWithTags: string[] = [];
    const tags: string[] = [];

    sel.split(',').forEach((selection) => {
      const [deckId, tagId] = selection.split('-');
      if (deckId && !tagId) decksWithoutTags.push(deckId);
      if (deckId && tagId) {
        decksWithTags.push(deckId);
        tags.push(tagId);
      }
    });

    const dueWeight = (card: Card) => {
      return card.dateLastReviewed
        ? Math.min(
            2,
            (Date.now() - Date.parse(card.dateLastReviewed)) /
              (1000 * 60 * 60 * 24) /
              card.daysBetweenReview
          )
        : 2;
    };

    return schema
      .where(
        'card',
        (card) =>
          decksWithoutTags.includes(card.deckId) ||
          (decksWithTags.includes(card.deckId) && card.tagIds.some((tagId) => tags.includes(tagId)))
      )
      .sort((a, b) => dueWeight(b) - dueWeight(a))
      .slice(0, 15); // Limit to batches of 15 cards.
  });
}
