import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const slugifyUrl = (url, size = 7) => crypto.createHash('sha1').update(url).digest('base64url').slice(0, size);

export function assertValidUrl(url) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http and https URLs are supported.');
  return parsed.toString();
}

export async function loadStore(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return { links: {} };
    throw error;
  }
}

export async function saveStore(filePath, store) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf8');
}

export async function createLink(filePath, { url, alias }) {
  const cleanUrl = assertValidUrl(url);
  const store = await loadStore(filePath);
  const code = alias || slugifyUrl(cleanUrl);
  if (!/^[a-zA-Z0-9_-]{3,40}$/.test(code)) throw new Error('Alias must be 3-40 characters using letters, numbers, underscore, or dash.');
  if (store.links[code] && store.links[code].url !== cleanUrl) throw new Error('Alias already exists.');
  store.links[code] = store.links[code] || { code, url: cleanUrl, clicks: 0, createdAt: new Date().toISOString() };
  await saveStore(filePath, store);
  return store.links[code];
}

export async function resolveLink(filePath, code) {
  const store = await loadStore(filePath);
  const link = store.links[code];
  if (!link) return null;
  link.clicks = Number(link.clicks || 0) + 1;
  link.lastClickedAt = new Date().toISOString();
  await saveStore(filePath, store);
  return link;
}

export async function listLinks(filePath) {
  const store = await loadStore(filePath);
  return Object.values(store.links).sort((a, b) => a.code.localeCompare(b.code));
}

export const makeShortUrl = (base, code) => `${base.replace(/\/$/, '')}/${code}`;
