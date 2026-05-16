import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const uploadDir = path.join(rootDir, "public", "uploads");
const dbPath = path.join(dataDir, "db.json");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bus2bus2";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-this-secret-in-production";
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const initialDb = {
  listings: [
    {
      id: uuidv4(),
      status: "published",
      title: "Mercedes-Benz Tourismo RHD",
      slug: "mercedes-benz-tourismo-rhd",
      subtitle: "Zájezdový autobus • Euro 6",
      price: "2 490 000 Kč",
      year: "2019",
      mileage: "245 000 km",
      seats: "49 míst",
      location: "Česká republika",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=82",
      description: "Ukázkový inzerát. V administraci jej můžete upravit nebo smazat.",
      equipment: "Klimatizace, WC, lednice, polohovatelná sedadla",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      status: "published",
      title: "Scania Touring HD",
      slug: "scania-touring-hd",
      subtitle: "Coach • automat",
      price: "2 190 000 Kč",
      year: "2018",
      mileage: "312 000 km",
      seats: "53 míst",
      location: "EU",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=82",
      description: "Ukázkový inzerát pro náhled webu.",
      equipment: "Klimatizace, USB, zavazadlový prostor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      status: "published",
      title: "MAN Lion's Coach",
      slug: "man-lions-coach",
      subtitle: "Zájezdový autobus • ověřeno",
      price: "1 890 000 Kč",
      year: "2016",
      mileage: "420 000 km",
      seats: "61 míst",
      location: "Česká republika",
      imageUrl: "https://images.unsplash.com/photo-1581262177000-8139a463e531?auto=format&fit=crop&w=1200&q=82",
      description: "Ukázkový inzerát pro náhled webu.",
      equipment: "Klimatizace, WC, tažné zařízení",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }
  ],
  leads: [],
  newsletter: []
};

function readDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), "utf-8");
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

function slugify(input) {
  return String(input || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || uuidv4();
}

function publicListing(item) {
  return {
    id: item.id,
    status: item.status,
    title: item.title,
    slug: item.slug,
    subtitle: item.subtitle,
    price: item.price,
    year: item.year,
    mileage: item.mileage,
    seats: item.seats,
    location: item.location,
    imageUrl: item.imageUrl,
    description: item.description,
    equipment: item.equipment,
    publishedAt: item.publishedAt,
    updatedAt: item.updatedAt
  };
}

function requireAuth(req, res, next) {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ error: "Nejste přihlášený administrátor." });
}

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? false : FRONTEND_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(session({
  name: "autobusy_admin_sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) return cb(new Error("Povoleny jsou pouze obrázky."));
    cb(null, true);
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/listings", (req, res) => {
  const db = readDb();
  const listings = db.listings
    .filter((item) => item.status === "published")
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt) - new Date(a.publishedAt || a.updatedAt))
    .map(publicListing);
  res.json({ listings });
});

app.get("/api/listings/:slug", (req, res) => {
  const db = readDb();
  const listing = db.listings.find((item) => item.slug === req.params.slug && item.status === "published");
  if (!listing) return res.status(404).json({ error: "Inzerát nebyl nalezen." });
  res.json({ listing: publicListing(listing) });
});

app.post("/api/leads", (req, res) => {
  const db = readDb();
  const body = req.body || {};
  if (body.website) return res.json({ ok: true });

  if (!body.gdprConsent) {
    return res.status(400).json({ error: "Chybí souhlas se zpracováním osobních údajů." });
  }

  const lead = {
    id: uuidv4(),
    type: body.leadType || "unknown",
    name: String(body.name || "").trim(),
    phone: String(body.phone || "").trim(),
    email: String(body.email || "").trim(),
    busInfo: String(body.busInfo || body.busType || "").trim(),
    message: String(body.message || "").trim(),
    source: body.source || "web",
    gdprConsent: true,
    gdprConsentVersion: body.gdprConsentVersion || null,
    gdprConsentAt: body.gdprConsentAt || new Date().toISOString(),
    userAgent: req.get("user-agent") || body.userAgent || "",
    ip: req.ip,
    status: "new",
    createdAt: new Date().toISOString()
  };

  db.leads.unshift(lead);
  writeDb(db);
  res.status(201).json({ ok: true, id: lead.id });
});

app.post("/api/newsletter/subscribe", (req, res) => {
  const db = readDb();
  const body = req.body || {};
  if (body.website) return res.json({ ok: true });

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Zadejte platný e-mail." });
  if (!body.marketingConsent) return res.status(400).json({ error: "Chybí souhlas s odběrem." });

  const existing = db.newsletter.find((item) => item.email === email);
  const confirmToken = crypto.randomBytes(24).toString("hex");
  const unsubscribeToken = existing?.unsubscribeToken || crypto.randomBytes(24).toString("hex");

  const record = {
    id: existing?.id || uuidv4(),
    email,
    status: "pending_double_opt_in",
    source: body.source || "web",
    purpose: body.purpose || "Upozornění na nové inzeráty autobusů",
    marketingConsent: true,
    consentVersion: body.consentVersion || null,
    consentText: body.consentText || "",
    consentAt: body.consentAt || new Date().toISOString(),
    confirmToken,
    unsubscribeToken,
    userAgent: req.get("user-agent") || body.userAgent || "",
    ip: req.ip,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existing) {
    Object.assign(existing, record);
  } else {
    db.newsletter.unshift(record);
  }

  writeDb(db);

  // TODO: napojit SMTP provider. Tento odkaz pošlete e-mailem pro double opt-in:
  console.log(`Newsletter confirmation for ${email}: /api/newsletter/confirm/${confirmToken}`);

  res.status(201).json({
    ok: true,
    status: "pending_double_opt_in",
    message: "Zkontrolujte e-mail a potvrďte odběr."
  });
});

app.get("/api/newsletter/confirm/:token", (req, res) => {
  const db = readDb();
  const item = db.newsletter.find((record) => record.confirmToken === req.params.token);
  if (!item) return res.status(404).send("Odkaz není platný nebo již expiroval.");

  item.status = "active";
  item.confirmedAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  item.confirmToken = null;
  writeDb(db);

  res.send("Odběr upozornění na nové inzeráty byl potvrzen.");
});

app.get("/api/newsletter/unsubscribe/:token", (req, res) => {
  const db = readDb();
  const item = db.newsletter.find((record) => record.unsubscribeToken === req.params.token);
  if (!item) return res.status(404).send("Odkaz není platný.");

  item.status = "unsubscribed";
  item.unsubscribedAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  writeDb(db);

  res.send("Odběr byl odhlášen.");
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.username = username;
    return res.json({ ok: true, username });
  }
  return res.status(401).json({ error: "Neplatné přihlašovací údaje." });
});

app.post("/api/admin/logout", requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("autobusy_admin_sid");
    res.json({ ok: true });
  });
});

app.get("/api/admin/session", (req, res) => {
  res.json({ isAdmin: Boolean(req.session?.isAdmin), username: req.session?.username || null });
});

app.get("/api/admin/listings", requireAuth, (req, res) => {
  const db = readDb();
  const listings = [...db.listings].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ listings });
});

app.post("/api/admin/listings", requireAuth, (req, res) => {
  const db = readDb();
  const body = req.body || {};
  const title = String(body.title || "").trim();
  if (!title) return res.status(400).json({ error: "Název inzerátu je povinný." });

  const listing = {
    id: uuidv4(),
    status: body.status === "draft" ? "draft" : "published",
    title,
    slug: slugify(body.slug || title),
    subtitle: String(body.subtitle || "").trim(),
    price: String(body.price || "").trim(),
    year: String(body.year || "").trim(),
    mileage: String(body.mileage || "").trim(),
    seats: String(body.seats || "").trim(),
    location: String(body.location || "").trim(),
    imageUrl: String(body.imageUrl || "").trim(),
    description: String(body.description || "").trim(),
    equipment: String(body.equipment || "").trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: body.status === "draft" ? null : new Date().toISOString()
  };

  db.listings.unshift(listing);
  writeDb(db);
  res.status(201).json({ listing });
});

app.put("/api/admin/listings/:id", requireAuth, (req, res) => {
  const db = readDb();
  const listing = db.listings.find((item) => item.id === req.params.id);
  if (!listing) return res.status(404).json({ error: "Inzerát nebyl nalezen." });

  const body = req.body || {};
  const wasDraft = listing.status !== "published";

  Object.assign(listing, {
    status: body.status === "draft" ? "draft" : "published",
    title: String(body.title || listing.title || "").trim(),
    slug: slugify(body.slug || body.title || listing.title),
    subtitle: String(body.subtitle || "").trim(),
    price: String(body.price || "").trim(),
    year: String(body.year || "").trim(),
    mileage: String(body.mileage || "").trim(),
    seats: String(body.seats || "").trim(),
    location: String(body.location || "").trim(),
    imageUrl: String(body.imageUrl || "").trim(),
    description: String(body.description || "").trim(),
    equipment: String(body.equipment || "").trim(),
    updatedAt: new Date().toISOString()
  });

  if (listing.status === "published" && (wasDraft || !listing.publishedAt)) {
    listing.publishedAt = new Date().toISOString();
    // TODO: zde napojit e-mailovou rozesílku aktivním odběratelům newsletteru.
  }

  writeDb(db);
  res.json({ listing });
});

app.delete("/api/admin/listings/:id", requireAuth, (req, res) => {
  const db = readDb();
  const before = db.listings.length;
  db.listings = db.listings.filter((item) => item.id !== req.params.id);
  if (db.listings.length === before) return res.status(404).json({ error: "Inzerát nebyl nalezen." });
  writeDb(db);
  res.json({ ok: true });
});

app.post("/api/admin/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Soubor nebyl nahrán." });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.get("/api/admin/leads", requireAuth, (req, res) => {
  const db = readDb();
  res.json({ leads: db.leads });
});

app.get("/api/admin/newsletter", requireAuth, (req, res) => {
  const db = readDb();
  res.json({ subscribers: db.newsletter });
});

if (process.env.NODE_ENV === "production") {
  const dist = path.join(rootDir, "dist");
  app.use(express.static(dist));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "API endpoint nenalezen." });
    res.sendFile(path.join(dist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Autobusy.cz API běží na http://localhost:${PORT}`);
  console.log(`Admin login: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
});
