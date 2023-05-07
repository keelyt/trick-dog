import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function cardHandler(server: AppServer) {
  server.delete('/decks/:deckId/cards/:cardId', (schema: AppSchema, request) => {
    const { cardId, deckId } = request.params;

    if (!deckId || isNaN(parseInt(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    if (!cardId || isNaN(parseInt(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID' });

    const card = schema.findBy('card', { id: cardId, deckId });

    if (!card) return new Response(404, {}, { error: 'Card not found' });

    card.destroy();
    return card;
  });

  server.get('/decks/:deckId/cards', (schema: AppSchema, request) => {
    const { deckId } = request.params;
    const { before, tag, q, limit } = request.queryParams;

    if (!limit || isNaN(parseInt(limit)))
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
      .slice(0, Math.min(parseInt(limit), 100)); // Limit to the provided limit (up to 100 cards per page).
  });
}
