# tiny-url

**tiny-url** is a small URL shortener service built with plain Node.js. It stores links in a local JSON file, generates short codes, redirects visitors, and exposes a tiny HTTP API.

## Features

- Shorten URLs through HTTP API
- Redirect by short code
- Optional custom alias
- Click counting
- Local JSON storage
- Health endpoint
- Zero runtime dependencies

## Run

```bash
npm install
npm start
```

Default server: `http://localhost:3000`

## API

Create a short link:

```bash
curl -X POST http://localhost:3000/api/links \
  -H "content-type: application/json" \
  -d '{"url":"https://example.com","alias":"demo"}'
```

Open:

```bash
curl -i http://localhost:3000/demo
```

List links:

```bash
curl http://localhost:3000/api/links
```

Health check:

```bash
curl http://localhost:3000/health
```

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `DATA_FILE` | `data/links.json` | JSON storage path |

## Development

```bash
npm test
```
