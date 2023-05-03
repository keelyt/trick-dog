import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function cardHandler(server: AppServer) {
  server.get('/decks/:id/cards', (schema: AppSchema, request) => {
    const { id } = request.params;
    const { before, tag, q, limit } = request.queryParams;

    if (!limit || isNaN(parseInt(limit)))
      return new Response(400, {}, { error: 'Page limit must be a number not exceeding 100' });

    return schema
      .where(
        'card',
        (card) =>
          card.deckId === id &&
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
