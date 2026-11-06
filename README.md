# tiny-url

Your own minimal URL shortener: a small HTTP service with persisted links.

## Run

```bash
PORT=3000 DATA_FILE=data/links.json node server.js
```

No frameworks, no DB — plain `node:http` and a JSON file are the whole stack.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness: `{ ok: true }` |
| GET | `/api/links` | list all stored links |
| POST | `/api/links` | create one; returns its short URL |

Short URLs resolve with a redirect inside the helper (`resolveLink`) — provided by the
library (`index.js`): `createLink`, `listLinks`, `makeShortUrl`, `resolveLink`.

## Storage model

- `DATA_FILE` (default `data/links.json`) is a JSON file — safe enough for personal use;
  swap in a real DB if you need durability guarantees.
- `PORT` (default `3000`).

## Status

Experimental/starter repo — classic "tool generated from a tutorials prompt" origin.
