import path from 'path';

import jsonServer from 'json-server';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
