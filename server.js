#!/usr/bin/env node
import http from 'node:http';
import { createLink, listLinks, makeShortUrl, resolveLink } from './index.js';

const PORT = Number(process.env.PORT || 3000);
const DATA_FILE = process.env.DATA_FILE || 'data/links.json';

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...headers });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer(async (req, res) => {
  try {
    const baseUrl = `http://${req.headers.host}`;
    const url = new URL(req.url, baseUrl);

    if (url.pathname === '/health') return send(res, 200, { ok: true });

    if (url.pathname === '/api/links' && req.method === 'GET') {
      return send(res, 200, { links: await listLinks(DATA_FILE) });
    }

    if (url.pathname === '/api/links' && req.method === 'POST') {
      const body = await readJson(req);
      const link = await createLink(DATA_FILE, body);
      return send(res, 201, { ...link, shortUrl: makeShortUrl(baseUrl, link.code) });
    }

    if (req.method === 'GET' && url.pathname.length > 1) {
      const code = decodeURIComponent(url.pathname.slice(1));
      const link = await resolveLink(DATA_FILE, code);
      if (!link) return send(res, 404, { error: 'Short link not found' });
      res.writeHead(302, { location: link.url });
      return res.end();
    }

    return send(res, 404, { error: 'Not found' });
  } catch (error) {
    return send(res, 400, { error: error.message || String(error) });
  }
});

server.listen(PORT, () => console.log(`tiny-url running on http://localhost:${PORT}`));
