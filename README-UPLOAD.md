# Autobusy.cz – Render varianta A

ZIP obsahuje předbuilděný web ve složce `dist` a jednoduchý Node backend ukládající data do JSON souborů ve složce `data`.

## Render nastavení

Build Command:
`npm ci --include=dev --no-audit --no-fund && npm run build`

Start Command:
`npm start`

Environment:
`NODE_VERSION=20`

## Poznámka

Varianta A je vhodná pro test/demo. Na Render Free je filesystem dočasný, takže data uložená do JSON se mohou ztratit při restartu, uspání služby nebo redeployi. Pro ostrý provoz je potřeba databáze nebo persistent disk.
