import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "submissions.json");
const distDir = path.join(rootDir, "dist");
const PORT = process.env.PORT || 10000;

fs.mkdirSync(dataDir, { recursive: true });

function readDb() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ leads: [], newsletter: [] }, null, 2), "utf8");
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function makeTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function notify(subject, payload) {
  const transporter = makeTransporter();
  if (!transporter) return { sent: false, reason: "SMTP není nastavené" };
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO || "sikola@ck-kobra.cz",
    subject,
    text: Object.entries(payload).map(([key, value]) => `${key}: ${value}`).join("\n"),
  });
  return { sent: true };
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/leads", async (req, res) => {
  const payload = { ...req.body, receivedAt: new Date().toISOString() };
  const db = readDb();
  db.leads.unshift(payload);
  writeDb(db);
  let mail = { sent: false };
  try { mail = await notify(`Autobusy.cz – ${payload.type || "nová poptávka"}`, payload); } catch (error) { mail = { sent: false, error: error.message }; }
  res.status(201).json({ ok: true, mail });
});

app.post("/api/newsletter", async (req, res) => {
  const payload = { ...req.body, receivedAt: new Date().toISOString() };
  const db = readDb();
  db.newsletter.unshift(payload);
  writeDb(db);
  let mail = { sent: false };
  try { mail = await notify("Autobusy.cz – nový odběr nabídek", payload); } catch (error) { mail = { sent: false, error: error.message }; }
  res.status(201).json({ ok: true, mail });
});

app.get("/api/admin/submissions", (_req, res) => res.json(readDb()));

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "API endpoint nenalezen." });
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => console.log(`Autobusy.cz běží na portu ${PORT}`));
