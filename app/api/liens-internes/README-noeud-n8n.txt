Cette route expose l'index de maillage interne consomme par le workflow n8n
"SEO Auto-Publication via Airtable (photo manuelle)", id YZHjy2JCnxCUcjDD.

QUI L'APPELLE
Le noeud "Preparer liens internes" du workflow. Il construit a partir de cette
reponse la liste des pages fournie au modele dans le prompt de "Claude SEO".

Le noeud "Lister les URLs du site", qui lit le sitemap, reste en place : il
alimente le repli decrit ci-dessous.

PAS D'ORDRE DE DEPLOIEMENT A RESPECTER
L'appel est enveloppe dans un try cote n8n. Si cette route est absente, si le
site ne repond pas, ou si l'environnement n8n n'expose pas httpRequest, le
noeud retombe sur le sitemap et le pipeline continue de fonctionner comme
avant l'existence de cette route. Le champ sourceListePages de la sortie du
noeud indique laquelle des deux voies a servi : "api" ou "sitemap (repli...)".

CE QUI SE PERIME
Les fiches, les articles et les sept rubriques de competence sont lus dans
content/ et dans lib/expertises.ts : ils suivent le site tout seuls.

Seule la liste RUBRIQUES_HORS_EXPERTISES de route.ts est tenue a la main. Une
page de fond ajoutee au site et oubliee ici ne recevra jamais de lien interne
du pipeline. C'est le seul point d'entretien de ce fichier.

DEONTOLOGIE
La route n'expose que des donnees deja publiques : chemins, titres et
descriptions meta. Rien qui ne figure deja sur les pages elles-memes.
