import crypto from 'node:crypto';

export const slugifyUrl = (url, size = 7) => crypto.createHash('sha1').update(url).digest('base64url').slice(0, size);
export const makeShortUrl = (url, base = 'https://sho.rt') => `${base}/${slugifyUrl(url)}`;

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(makeShortUrl('https://example.com/hello'));
}
