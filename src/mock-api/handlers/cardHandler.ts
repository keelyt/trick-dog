import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function cardHandler(server: AppServer) {
  server.get('/decks/:deckId/cards/:cardId', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found' });

    return card;
  });

  server.delete('/decks/:deckId/cards/:cardId', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found' });

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

    if (!attrs.question) return new Response(400, {}, { error: 'Front is required' });
    if (!attrs.answer) return new Response(400, {}, { error: 'Back is required' });

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found' });

    card.update({
      question: attrs.question,
      answer: attrs.answer,
      ...(attrs.tags && { tagIds: attrs.tags.map(String) }),
    });

    return card;
  });

  server.get('/decks/:deckId/cards', (schema: AppSchema, request) => {
    const { deckId } = request.params;
    const { before, tag, q, limit } = request.queryParams;

    if (!limit || isNaN(Number(limit)))
      return new Response(400, {}, { error: 'Page limit must be a number not exceeding 100' });

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

    if (!attrs.question) return new Response(400, {}, { error: 'Front is required' });
    if (!attrs.answer) return new Response(400, {}, { error: 'Back is required' });

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    const deck = schema.findBy('deck', { id: deckId });

    if (!deck) return new Response(404, {}, { error: 'Deck not found' });

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
}
