# Autobusy.cz – aktuální Render export

## Render nastavení

- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment Variables:
  - `NODE_VERSION=20`
  - `MAIL_TO=sikola@ck-kobra.cz`

Formuláře fungují přes `/api/leads` a `/api/newsletter`. Bez SMTP se ukládají do `data/submissions.json`; po doplnění SMTP se odešlou i e-mailem.
