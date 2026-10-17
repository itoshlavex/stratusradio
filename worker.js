/* Stratus Radio on Cloudflare.
   The app itself is plain files, served by Cloudflare without running any code.
   This Worker only answers /api/now?u=<stream address>: it opens the station's
   stream for a moment, reads the song or programme name the station sends inside
   it (Icecast/Shoutcast "ICY" metadata, which browsers can't read), and returns it
   as JSON. Answers are cached for 20 seconds, so a station is checked at most that
   often however many people are listening. Only stream addresses listed in
   stations.js are accepted. */

const CACHE_SECONDS = 20;
const LIST_SECONDS = 600; // re-read stations.js this often
const TIMEOUT_MS = 8000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/now') return nowPlaying(request, url, env, ctx);
    return env.ASSETS.fetch(request);
  }
};

async function nowPlaying(request, url, env, ctx) {
  const stream = url.searchParams.get('u') || '';
  const allowed = await streamList(request, env);
  if (!allowed.has(stream)) return json({ error: 'unknown stream' }, 404, 300);

  const cache = caches.default;
  const key = new Request('https://stratus-now.invalid/' + encodeURIComponent(stream));
  const hit = await cache.match(key);
  if (hit) return hit;

  const raw = await readStreamTitle(stream);
  const res = json({ title: tidy(raw) }, 200, CACHE_SECONDS);
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

let streams = null;
let streamsAt = 0;
async function streamList(request, env) {
  if (streams && Date.now() - streamsAt < LIST_SECONDS * 1000) return streams;
  const res = await env.ASSETS.fetch(new Request(new URL('/stations.js', request.url)));
  const text = await res.text();
  const set = new Set();
  for (const block of text.matchAll(/stream:\s*\[([\s\S]*?)\]/g)) {
    for (const m of block[1].matchAll(/'(https:\/\/[^']+)'/g)) set.add(m[1]);
  }
  streams = set;
  streamsAt = Date.now();
  return set;
}

// Reads up to the first two metadata blocks of an ICY stream and returns StreamTitle.
async function readStreamTitle(stream) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let reader = null;
  try {
    const res = await fetch(stream, {
      headers: { 'Icy-MetaData': '1', 'User-Agent': 'StratusRadio/1.0 (+https://stratusradio.ololiohill.io)' },
      signal: ctrl.signal
    });
    const metaint = parseInt(res.headers.get('icy-metaint') || '', 10);
    if (!res.ok || !res.body || !(metaint > 0) || metaint > 200000) {
      if (res.body) res.body.cancel().catch(() => {});
      return '';
    }
    reader = res.body.getReader();
    const chunks = [];
    let have = 0;
    let pos = metaint; // byte offset of the next metadata length byte
    for (let block = 0; block < 2;) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
      have += value.length;
      while (block < 2 && have > pos) {
        const buf = join(chunks, have);
        const len = buf[pos] * 16;
        if (len === 0) { block++; pos += 1 + metaint; continue; }
        if (have < pos + 1 + len) break;
        const meta = new TextDecoder('utf-8').decode(buf.subarray(pos + 1, pos + 1 + len));
        // Usually StreamTitle='...'; but some servers leave off the closing ";".
        const m = /StreamTitle='(.*?)'(?:;|\s*$)/s.exec(meta.replace(/\0+$/, ''));
        return m ? m[1] : '';
      }
      if (have > 2 * metaint + 8192) break;
    }
    return '';
  } catch (e) {
    return '';
  } finally {
    clearTimeout(timer);
    if (reader) reader.cancel().catch(() => {});
  }
}

function join(chunks, total) {
  if (chunks.length === 1) return chunks[0];
  const out = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  chunks.length = 0;
  chunks.push(out);
  return out;
}

// Clean up what stations send: entities, internal codes, empty " - ", doubled titles.
function tidy(t) {
  if (!t) return '';
  if (/^Asset (Spot|Stop)\b/i.test(t)) return ''; // ad and break markers (Southern Cross Austereo)
  t = t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\b[A-Z0-9]{2,}-\d{4}-\d{2}-\d{2}\b/g, '').replace(/\b[A-Z0-9]+_\d+\b/g, '');
  t = t.replace(/^[\s\-–|:]+|[\s\-–|:]+$/g, '');
  const parts = t.split(' - ');
  if (parts.length >= 2 && parts.length % 2 === 0) {
    const half = parts.length / 2;
    const a = parts.slice(0, half).join(' - '), b = parts.slice(half).join(' - ');
    if (a.toLowerCase() === b.toLowerCase()) t = a;
  }
  if (!/[a-z]/i.test(t)) return '';
  return t.slice(0, 140);
}

function json(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=' + maxAge
    }
  });
}
