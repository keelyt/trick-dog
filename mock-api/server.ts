import path from 'path';

import jsonServer from 'json-server';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

import db from './db.json' assert { type: 'json' };
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Have all URLS prefixed with a /api
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
  })
);

server.use(jsonServer.bodyParser);

server.get('/decks/:deckId/cards', (req, res) => {
  const { deckId } = req.params;
  const { before } = req.query;

  const deckIdInt = parseInt(deckId);

  if (!deckId || isNaN(deckIdInt))
    res.status(400).jsonp({
      error: 'Invalid deck ID',
    });

  const cards = db.cards.filter(
    (card) =>
      card.deck_id === deckIdInt &&
      (typeof before === 'string'
        ? new Date(Date.parse(card.date_created.replace(/-/g, '/'))) <
          new Date(Date.parse(before.replace(/-/g, '/')))
        : true)
  );

  // For now we are only giving the ability to sort newest to oldest.
  cards.sort((a, b) => Date.parse(b.date_created) - Date.parse(a.date_created));

  // Send back first 10 cards
  res.status(200).jsonp(cards.slice(0, 4));
});

server.get('/decks/:deckId', (req, res) => {
  const { deckId } = req.params;

  const deckIdInt = parseInt(deckId);

  if (!deckId || isNaN(deckIdInt))
    res.status(400).jsonp({
      error: 'Invalid deck ID',
    });

  const deck = db.decks.find((deck) => deck.id === parseInt(deckId));

  const card_count = db.cards.reduce((sum, card) => sum + (card.deck_id === deckIdInt ? 1 : 0), 0);

  res.status(200).jsonp({ ...deck, card_count });
});

server.get('/decks', (req, res) => {
  const decks = db.decks.map((deck) => {
    const card_count = db.cards.reduce((sum, card) => sum + (card.deck_id === deck.id ? 1 : 0), 0);
    return { ...deck, card_count };
  });

  res.status(200).jsonp(decks);
});

// Use default router
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
