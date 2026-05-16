# Autobusy.cz – aktuální Render export

Tento balíček je připravený pro Render Web Service.

## Render nastavení

Build Command:
```bash
npm install && npm run build
```

Start Command:
```bash
npm start
```

Environment Variables:
```txt
NODE_VERSION=20
MAIL_TO=sikola@ck-kobra.cz
```

SMTP proměnné jsou volitelné. Bez SMTP se formuláře uloží do `data/submissions.json` a API vrátí úspěch, ale e-mail se neodešle.

## Struktura

```txt
src/App.jsx
src/main.jsx
src/index.css
server/server.js
package.json
index.html
```
