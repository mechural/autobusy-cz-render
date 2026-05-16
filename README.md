# Autobusy.cz – finální full-stack verze

Obsahuje:
- moderní onepage frontend v Reactu,
- administraci pro správu inzerátů,
- backend API v Expressu,
- ukládání dat do `data/db.json`,
- nahrávání obrázků inzerátů,
- poptávkové formuláře,
- odběr upozornění na nové inzeráty,
- double opt-in endpoint pro newsletter,
- odhlašovací endpoint,
- GDPR/marketing consent logiku,
- WhatsApp CTA.

## Přihlášení do administrace

URL:
- lokálně: `http://localhost:5173/admin`
- po buildu: `/admin`

Přihlašovací údaje:
- jméno: `admin`
- heslo: `bus2bus2`

Doporučení pro produkci: heslo a session secret změnit v `.env`.

## Instalace

```bash
cp .env.example .env
npm install
npm run dev
```

Poté otevřít:
- Web: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- API: `http://localhost:4000/api/health`

## Produkční build

```bash
npm run build
npm start
```

V produkčním režimu Express server servíruje i React build.

## Správa inzerátů

V administraci lze:
- vytvořit nový inzerát,
- upravit inzerát,
- publikovat / uložit jako koncept,
- smazat inzerát,
- vložit URL obrázku,
- nebo nahrát obrázek z počítače.

Publikované inzeráty se zobrazují na hlavní stránce.

## Newsletter / upozornění na nové inzeráty

Formulář ukládá:
- e-mail,
- verzi souhlasu,
- text souhlasu,
- čas souhlasu,
- zdroj formuláře,
- user-agent,
- IP z backendu,
- stav `pending_double_opt_in`.

Endpoint pro potvrzení:
`/api/newsletter/confirm/:token`

Endpoint pro odhlášení:
`/api/newsletter/unsubscribe/:token`

Backend zatím neposílá e-maily automaticky. V `server/server.js` jsou označená místa `TODO`, kde je vhodné napojit SMTP / Mailgun / SendGrid / Ecomail / SmartEmailing.

## Právní poznámky k odběru

U odběru obchodních sdělení doporučuji:
- samostatný checkbox, nezaškrtnutý předem,
- jasný účel: upozornění na nové inzeráty autobusů,
- double opt-in potvrzení,
- odhlašovací odkaz v každém e-mailu,
- uložení verze souhlasu, času, zdroje a odhlašovacího tokenu,
- finální text zásad ochrany osobních údajů nechat zkontrolovat právníkem.

## Důležité pro nasazení

V `.env` změnit minimálně:

```env
SESSION_SECRET=dlouhy-nahodny-retezec
ADMIN_PASSWORD=bezpecne-heslo
```

Výchozí heslo `bus2bus2` je ponecháno podle zadání, ale pro produkční web jej změňte.
