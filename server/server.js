import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const dataDir = path.join(rootDir, 'data');
const port = Number(process.env.PORT || 3000);

const defaultFiles = {
  'leads.json': [],
  'newsletter.json': [],
  'contacts.json': [],
  'listings.json': [],
  'content.json': {},
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, type = 'application/json; charset=utf-8', cacheControl) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': cacheControl || (type.startsWith('text/html') ? 'no-cache' : 'no-store'),
  });
  res.end(body);
}

function json(res, status, data) {
  return send(res, status, JSON.stringify(data), 'application/json; charset=utf-8', 'no-store');
}

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('Invalid JSON body');
    error.status = 400;
    throw error;
  }
}

async function readJson(fileName, fallback = defaultFiles[fileName] ?? null) {
  await ensureDataDir();
  const filePath = path.join(dataDir, fileName);
  try {
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    return data;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

async function writeJson(fileName, data) {
  await ensureDataDir();
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

async function appendJsonRecord(fileName, record) {
  const current = await readJson(fileName, []);
  const list = Array.isArray(current) ? current : [];
  const nextRecord = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    createdAtDisplay: new Date().toLocaleString('cs-CZ'),
    ...record,
  };
  const next = [nextRecord, ...list];
  await writeJson(fileName, next);
  return nextRecord;
}

async function handleApi(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/api/health') {
      return json(res, 200, { ok: true, service: 'autobusy-cz-render', time: new Date().toISOString() });
    }

    if (req.method === 'GET' && pathname === '/api/state') {
      const [leads, newsletter, contacts, listings, content] = await Promise.all([
        readJson('leads.json', []),
        readJson('newsletter.json', []),
        readJson('contacts.json', []),
        readJson('listings.json', []),
        readJson('content.json', {}),
      ]);
      return json(res, 200, { ok: true, leads, newsletter, contacts, listings, content });
    }

    if (req.method === 'POST' && pathname === '/api/leads') {
      const body = await readBody(req);
      const record = await appendJsonRecord('leads.json', body);
      return json(res, 200, { ok: true, record });
    }

    if (req.method === 'POST' && pathname === '/api/newsletter') {
      const body = await readBody(req);
      const record = await appendJsonRecord('newsletter.json', body);
      return json(res, 200, { ok: true, record });
    }

    if (req.method === 'PUT' && pathname === '/api/listings') {
      const body = await readBody(req);
      if (!Array.isArray(body)) return json(res, 400, { ok: false, error: 'Listings payload must be an array.' });
      await writeJson('listings.json', body);
      return json(res, 200, { ok: true, listings: body });
    }

    if (req.method === 'PUT' && pathname === '/api/content') {
      const body = await readBody(req);
      if (!body || typeof body !== 'object' || Array.isArray(body)) return json(res, 400, { ok: false, error: 'Content payload must be an object.' });
      await writeJson('content.json', body);
      return json(res, 200, { ok: true, content: body });
    }

    if (req.method === 'PUT' && pathname === '/api/contacts') {
      const body = await readBody(req);
      if (!Array.isArray(body)) return json(res, 400, { ok: false, error: 'Contacts payload must be an array.' });
      await writeJson('contacts.json', body);
      return json(res, 200, { ok: true, contacts: body });
    }

    return json(res, 404, { ok: false, error: 'Unknown API endpoint' });
  } catch (error) {
    return json(res, error.status || 500, { ok: false, error: error.message || 'Server error' });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let requestPath = decodeURIComponent(url.pathname);

  if (requestPath === '/') requestPath = '/index.html';
  let filePath = path.normalize(path.join(distDir, requestPath));

  if (!filePath.startsWith(distDir)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const isHtml = ext === '.html';
    return send(res, 200, data, mimeTypes[ext] || 'application/octet-stream', isHtml ? 'no-cache' : 'public, max-age=31536000, immutable');
  } catch {
    try {
      const data = await fs.readFile(path.join(distDir, 'index.html'));
      return send(res, 200, data, 'text/html; charset=utf-8', 'no-cache');
    } catch {
      return send(res, 500, 'Missing dist/index.html', 'text/plain; charset=utf-8');
    }
  }
}

createServer((req, res) => {
  if (req.url?.startsWith('/api/')) return handleApi(req, res);
  return serveStatic(req, res);
}).listen(port, '0.0.0.0', () => {
  console.log(`Autobusy.cz server running on port ${port}`);
});
