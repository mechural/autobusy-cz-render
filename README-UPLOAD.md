# Autobusy.cz – soubory pro GitHub / Render

Tento ZIP je připravený pro přímé vložení do kořenové složky GitHub repozitáře.

Postup:
1. Otevři složku repozitáře přes GitHub Desktop → Repository → Show in Explorer.
2. Smaž vše kromě skryté složky `.git`.
3. Rozbal tento ZIP.
4. Zkopíruj veškerý obsah ZIPu přímo do složky repozitáře.
5. V GitHub Desktopu dej Commit to main a Push origin.
6. Na Renderu spusť Manual Deploy → Clear build cache & deploy.

Render nastavení:
Build Command: npm install && npm run build
Start Command: npm start
Environment Variables:
NODE_VERSION=20
MAIL_TO=sikola@ck-kobra.cz
