import type { AppSchema, AppServer } from '../types';

export default function cardHandler(server: AppServer) {
  server.get('/decks/:id/cards', (schema: AppSchema, request) => {
    const { id } = request.params;
    const { before, tag, q } = request.queryParams;

    return schema.where(
      'card',
      (card) =>
        card.deckId === id &&
        (!before || Date.parse(card.dateCreated) < Date.parse(before)) &&
        (!tag || card.tagIds.includes(tag)) &&
        (!q ||
          card.question.toLowerCase().includes(q.toLowerCase()) ||
          card.answer.toLowerCase().includes(q.toLowerCase()))
    );
  });
}
