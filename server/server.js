import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const submissionsPath = path.join(dataDir, "submissions.json");
const app = express();
const PORT = process.env.PORT || 10000;

fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(submissionsPath)) fs.writeFileSync(submissionsPath, "[]", "utf8");

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(root, "dist")));

function saveSubmission(type, payload) {
  const current = JSON.parse(fs.readFileSync(submissionsPath, "utf8") || "[]");
  const record = { id: Date.now(), type, ...payload, receivedAt: new Date().toISOString() };
  current.unshift(record);
  fs.writeFileSync(submissionsPath, JSON.stringify(current, null, 2), "utf8");
  return record;
}

async function sendMail(subject, payload) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return { skipped: true };
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const text = Object.entries(payload).map(([key, value]) => `${key}: ${value}`).join("\n");
  await transporter.sendMail({ from: SMTP_USER, to: MAIL_TO || "sikola@ck-kobra.cz", subject, text });
  return { sent: true };
}

app.post("/api/leads", async (req, res) => {
  const record = saveSubmission("lead", req.body);
  try { await sendMail(`Autobusy.cz – ${req.body.type || "nová poptávka"}`, record); } catch (error) { console.error(error); }
  res.json({ ok: true, record });
});

app.post("/api/newsletter", async (req, res) => {
  const record = saveSubmission("newsletter", req.body);
  try { await sendMail("Autobusy.cz – nový odběr newsletteru", record); } catch (error) { console.error(error); }
  res.json({ ok: true, record });
});

app.get("/api/submissions", (_req, res) => {
  res.json(JSON.parse(fs.readFileSync(submissionsPath, "utf8") || "[]"));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(root, "dist", "index.html"));
});

app.listen(PORT, () => console.log(`Autobusy.cz běží na portu ${PORT}`));
