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

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': type.startsWith('text/html') ? 'no-cache' : 'public, max-age=31536000, immutable',
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function appendJsonRecord(fileName, record) {
  await fs.mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, fileName);
  let current = [];
  try {
    current = JSON.parse(await fs.readFile(filePath, 'utf8'));
    if (!Array.isArray(current)) current = [];
  } catch {}
  const nextRecord = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...record,
  };
  current.unshift(nextRecord);
  await fs.writeFile(filePath, JSON.stringify(current, null, 2), 'utf8');
  return nextRecord;
}

async function handleApi(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, JSON.stringify({ ok: false, error: 'Method not allowed' }));
    const body = await readBody(req);

    if (req.url === '/api/leads') {
      const record = await appendJsonRecord('leads.json', body);
      return send(res, 200, JSON.stringify({ ok: true, record }));
    }

    if (req.url === '/api/newsletter') {
      const record = await appendJsonRecord('newsletter.json', body);
      return send(res, 200, JSON.stringify({ ok: true, record }));
    }

    return send(res, 404, JSON.stringify({ ok: false, error: 'Unknown API endpoint' }));
  } catch (error) {
    return send(res, 500, JSON.stringify({ ok: false, error: error.message || 'Server error' }));
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let requestPath = decodeURIComponent(url.pathname);

  if (requestPath === '/') requestPath = '/index.html';
  let filePath = path.normalize(path.join(distDir, requestPath));

  if (!filePath.startsWith(distDir)) {
    return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return send(res, 200, data, mimeTypes[ext] || 'application/octet-stream');
  } catch {
    try {
      const data = await fs.readFile(path.join(distDir, 'index.html'));
      return send(res, 200, data, 'text/html; charset=utf-8');
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
