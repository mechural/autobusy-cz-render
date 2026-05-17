# Autobusy.cz

One-page web pro zprostředkování prodeje a nákupu autobusů (React + Vite + Tailwind) s lehkým Node.js backendem pro formuláře.

## Spuštění lokálně

```bash
npm install
npm run dev        # vývojový server na http://localhost:5173
```

Vývojový server proxuje `/api/*` na `http://localhost:3000` – pokud chcete formuláře testovat, ve druhém terminálu spusťte:

```bash
npm start          # backend na http://localhost:3000
```

## Produkční build

```bash
npm run build      # vytvoří dist/
npm start          # spustí Node server, který servíruje dist/ + API
```

## Render nastavení

- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NODE_VERSION=20`
  - `MAIL_TO=sikola@ck-kobra.cz`
  - SMTP (volitelné, viz `.env.example`)

## API

| Endpoint | Metoda | Účel |
|---|---|---|
| `GET /api/health` | – | Health check + info, jestli je SMTP nakonfigurován |
| `POST /api/leads` | JSON | Poptávka prodej/nákup autobusu |
| `POST /api/newsletter` | JSON | Přihlášení k newsletteru |

Všechny POST endpointy:

- ukládají záznam do `data/leads.json` / `data/newsletter.json`,
- pokud je nakonfigurován SMTP, posílají kopii na `MAIL_TO`,
- mají rate-limit **10 požadavků za minutu na IP**,
- mají limit těla **32 kB**,
- mají honeypot pole `_hp` proti botům.

## Důležité bezpečnostní poznámky

⚠️ **Admin heslo `bus2bus2` je v klientském JS bundlu** – kdokoliv si ho přečte v devtools. Pro ostrý provoz nahraďte autentizací proti backendu. Tento prototyp slouží jen pro demonstraci.

⚠️ **Data v `data/*.json`** se na Renderu při redeployi smažou, pokud nepoužíváte persistent disk. Pro skutečné použití propojte na databázi nebo Render Disk.

## Struktura projektu

```
.
├── index.html              # vstupní HTML pro Vite
├── vite.config.js          # konfigurace Vite + proxy na /api
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── public/                 # statické soubory kopírované do dist/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.jsx
│   ├── index.css
│   └── App.jsx             # celá aplikace (zatím jeden soubor)
├── server/
│   └── server.js           # Node http server + API
├── scripts/
│   └── verify-build.js     # sanity check po buildu
├── data/                   # uložené formuláře (gitignorovat)
└── dist/                   # build output (gitignorovat)
```

## Co bylo opraveno proti původní verzi

### Kritické bugy

- ❌→✅ `Footer` odkazoval na neexistující proměnnou `legalLabels` → ReferenceError při kliknutí v patičce.
- ❌→✅ Chyběl `vite.config.js`, takže projekt nešel buildovat.
- ❌→✅ Prázdné `dependencies` v `package.json`.
- ❌→✅ Path traversal v `server.js` (`startsWith` bez separátoru).
- ❌→✅ Slibovaný SMTP byl v dokumentaci, ale v kódu chyběl.

### Bezpečnost

- Rate-limit 10/min na IP pro API.
- Limit těla 32 kB.
- Honeypot pole proti botům.
- Bezpečnostní hlavičky (`X-Content-Type-Options`, `Referrer-Policy`).
- Graceful shutdown na `SIGTERM`/`SIGINT`.

### A11y a SEO

- Dynamický atribut `<html lang>` podle zvoleného jazyka.
- `role="dialog"` + `aria-modal` na modálních oknech.
- Lokalizované aria-labely karuselu (`prevListings`/`nextListings`).
- `:focus-visible` styly pro klávesnici.
- Respekt k `prefers-reduced-motion`.
- Favicon, Open Graph, Twitter Card, hreflang, sitemap.xml, robots.txt.
- `<noscript>` fallback s kontakty.
- Inter font skutečně načtený (předtím jen v Tailwind configu, ale nikdy nelinkován).

### Drobnosti

- `© {rok}` se počítá dynamicky místo natvrdo „© 2026".
- Zmatené tlačítko v patičce („Kontakt" uvnitř „Právní informace") nahrazeno smysluplným „Provozovatel".
- Odstraněna mrtvá funkce `openLegalModal`.
- Bezpečná zóna na iOS pro mobilní lištu (notch, home indicator).
