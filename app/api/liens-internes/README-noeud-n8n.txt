Ce dossier expose l'index de maillage interne consomme par le workflow n8n
"SEO Auto-Publication via Airtable" (id YZHjy2JCnxCUcjDD).

Le noeud "Lister les URLs du site" doit appeler /api/liens-internes (JSON) et
non plus sitemap.xml. Le noeud "Preparer liens internes" doit etre remplace par
le code prepare le 21/08/2026 (voir 50 - Projets/maillage-interne-proposition.md
dans le coffre).

Ordre imperatif : deployer cette route AVANT de modifier n8n, sinon la
publication suivante echoue sur un 404.
