import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(rootDir, "data");
const port = Number(process.env.PORT || 3000);

// --- konfigurace z env -----------------------------------------------------
const MAIL_TO = process.env.MAIL_TO || "";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || MAIL_TO;

// --- limity ----------------------------------------------------------------
const MAX_BODY_BYTES = 32 * 1024; // 32 kB – formuláře jsou malé
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10; // max 10 odeslání za minutu z jedné IP

// --- jednoduchý in-memory rate limiter -------------------------------------
const rateBuckets = new Map();
function rateLimitOk(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count <= RATE_LIMIT_MAX;
}

// --- volitelný nodemailer (načte se jen pokud je SMTP nakonfigurován) ------
let mailer = null;
async function getMailer() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO) return null;
  if (mailer) return mailer;
  try {
    const nodemailer = (await import("nodemailer")).default;
    mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return mailer;
  } catch (err) {
    console.error("[mail] nodemailer není dostupný:", err.message);
    return null;
  }
}

async function sendMail({ subject, record }) {
  const transporter = await getMailer();
  if (!transporter) return { sent: false, reason: "smtp_not_configured" };
  const lines = Object.entries(record).map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: MAIL_TO,
      replyTo: record.email || undefined,
      subject,
      text: lines,
    });
    return { sent: true };
  } catch (err) {
    console.error("[mail] odeslání selhalo:", err.message);
    return { sent: false, reason: err.message };
  }
}

// --- MIME mapování ---------------------------------------------------------
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function getCacheControl(type, urlPath) {
  if (type.startsWith("text/html")) return "no-cache";
  // Vite produkuje hashované soubory v /assets – ty můžeme cachovat dlouho.
  if (urlPath.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  return "public, max-age=3600";
}

function send(res, status, body, type = "application/json; charset=utf-8", urlPath = "") {
  const headers = {
    "Content-Type": type,
    "Cache-Control": getCacheControl(type, urlPath),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
  res.writeHead(status, headers);
  res.end(body);
}

function jsonResponse(res, status, payload) {
  send(res, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

// --- čtení těla s limitem velikosti ----------------------------------------
async function readJsonBody(req) {
  let total = 0;
  const chunks = [];
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      const err = new Error("Payload too large");
      err.statusCode = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const err = new Error("Invalid JSON");
    err.statusCode = 400;
    throw err;
  }
}

// --- ukládání záznamů ------------------------------------------------------
async function appendJsonRecord(fileName, record) {
  await fs.mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, fileName);
  let current = [];
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) current = parsed;
  } catch {
    /* soubor neexistuje nebo je rozbitý – začneme čerstvě */
  }
  const nextRecord = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...record,
  };
  current.unshift(nextRecord);
  await fs.writeFile(filePath, JSON.stringify(current, null, 2), "utf8");
  return nextRecord;
}

// --- jednoduchá sanitace vstupu --------------------------------------------
function sanitizeRecord(input) {
  const result = {};
  for (const [key, value] of Object.entries(input || {})) {
    if (typeof value === "string") {
      result[key] = value.slice(0, 2000); // tvrdý strop na pole
    } else if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else if (value === null) {
      result[key] = null;
    }
    // ostatní (objekty, pole) ignorujeme
  }
  return result;
}

function isLikelyBot(record) {
  // honeypot – pokud někdo vyplní pole "_hp", je to robot
  if (record._hp) return true;
  return false;
}

// --- API -------------------------------------------------------------------
async function handleApi(req, res) {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      return jsonResponse(res, 200, { ok: true, smtp: Boolean(SMTP_HOST && SMTP_USER) });
    }

    if (req.method !== "POST") {
      return jsonResponse(res, 405, { ok: false, error: "Method not allowed" });
    }

    const ip = clientIp(req);
    if (!rateLimitOk(ip)) {
      return jsonResponse(res, 429, { ok: false, error: "Příliš mnoho požadavků, zkuste to za chvíli." });
    }

    const body = sanitizeRecord(await readJsonBody(req));

    if (isLikelyBot(body)) {
      // tváříme se OK, ale nic neukládáme
      return jsonResponse(res, 200, { ok: true, record: { id: Date.now() } });
    }

    if (req.url === "/api/leads") {
      const record = await appendJsonRecord("leads.json", body);
      const mail = await sendMail({
        subject: `Autobusy.cz – ${record.type || "nová poptávka"}`,
        record,
      });
      return jsonResponse(res, 200, { ok: true, record, mail });
    }

    if (req.url === "/api/newsletter") {
      const record = await appendJsonRecord("newsletter.json", body);
      const mail = await sendMail({
        subject: "Autobusy.cz – nový odběr newsletteru",
        record,
      });
      return jsonResponse(res, 200, { ok: true, record, mail });
    }

    return jsonResponse(res, 404, { ok: false, error: "Unknown API endpoint" });
  } catch (error) {
    const status = error.statusCode || 500;
    return jsonResponse(res, status, { ok: false, error: error.message || "Server error" });
  }
}

// --- statika ---------------------------------------------------------------
async function serveStatic(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let requestPath = decodeURIComponent(url.pathname);

    if (requestPath === "/") requestPath = "/index.html";
    let filePath = path.normalize(path.join(distDir, requestPath));

    // Oprava path traversalu – distDir musí být striktním prefixem
    // (`distDir + sep`), jinak by `/dist_evil/index.html` prošlo.
    const safePrefix = distDir.endsWith(path.sep) ? distDir : distDir + path.sep;
    if (filePath !== distDir && !filePath.startsWith(safePrefix)) {
      return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      return send(res, 200, data, mimeTypes[ext] || "application/octet-stream", url.pathname);
    } catch {
      // SPA fallback – vrátíme index.html, ať klientský router rozhodne.
      try {
        const data = await fs.readFile(path.join(distDir, "index.html"));
        return send(res, 200, data, "text/html; charset=utf-8", "/");
      } catch {
        return send(res, 500, "Missing dist/index.html – spusťte `npm run build`.", "text/plain; charset=utf-8");
      }
    }
  } catch (err) {
    return send(res, 500, "Server error", "text/plain; charset=utf-8");
  }
}

// --- spuštění + graceful shutdown ------------------------------------------
const server = createServer((req, res) => {
  if (req.url?.startsWith("/api/")) return handleApi(req, res);
  return serveStatic(req, res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Autobusy.cz server běží na portu ${port}`);
  if (!SMTP_HOST) {
    console.log("[mail] SMTP není nakonfigurován – odeslané formuláře se ukládají jen do data/*.json");
  } else if (!MAIL_TO) {
    console.log("[mail] Chybí MAIL_TO – formuláře se ukládají, ale e-maily se neodesílají");
  } else {
    console.log(`[mail] SMTP připraven – e-maily se odesílají na ${MAIL_TO}`);
  }
});

function shutdown(signal) {
  console.log(`\nPřijato ${signal}, ukončuji…`);
  server.close(() => process.exit(0));
  // pojistka, kdyby spojení viselo
  setTimeout(() => process.exit(1), 8000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => console.error("[unhandledRejection]", reason));
