# 📘 Documentation Technique - Site Fain Avocats

Ce document explique le fonctionnement, l'architecture et la maintenance du site vitrine **Fain Avocats** (Version Luxe / Éditorial).

---

## 1. 🏗️ Architecture Technique

Le site est construit avec des technologies modernes, performantes et optimisées pour le SEO.

- **Framework :** [Next.js 14](https://nextjs.org/) (App Router)
- **Langage :** TypeScript
- **Style :** [Tailwind CSS](https://tailwindcss.com/)
- **Animations :** [Framer Motion](https://www.framer.com/motion/)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Polices :** Google Fonts (`Playfair Display` pour les titres, `Lato` pour le texte)

### Structure des Dossiers
```
/app
  layout.tsx       # Structure globale (HTML, Meta, Polices)
  page.tsx         # Page d'accueil (Assemblage des sections)
  globals.css      # Styles globaux & Reset
/components
  /sections        # Les blocs de la page (Hero, Contact, FAQ...)
  /ui              # Composants réutilisables (Boutons, Container...)
/public            # Images statiques (DSC01907.webp, robots.txt)
```

---

## 2. 🎨 Design System ("Luxe Éditorial")

Le design a été conçu pour inspirer confiance, élégance et sérénité.

- **Couleurs :**
  - **Fond :** `#F9F8F6` (Crème "Papier d'art", très doux)
  - **Texte :** `#1A1A1A` (Noir Encre, fort contraste)
  - **Accents :** Gris chaud pour les bordures.

- **Typographie :**
  - **Titres (H1, H2) :** *Playfair Display* (Serif). Évoque l'institution, le sérieux, le magazine.
  - **Corps (P) :** *Lato* (Sans-serif). Lisibilité optimale, moderne.

---

## 3. 🚀 Déploiement & Mise à Jour

Le site est hébergé sur **Netlify** et connecté au dépôt **GitHub**.

### Comment mettre à jour le site ?
1.  Modifiez le code sur votre ordinateur.
2.  Sauvegardez et faites un "Push" sur GitHub :
    ```bash
    git add .
    git commit -m "Description de la modification"
    git push origin main
    ```
3.  **Automatique :** Netlify détecte le changement et met à jour le site en ligne en ~1 minute.

---

## 4. 🛠️ Modifications Courantes (Guide Rapide)

Voici où aller pour changer les informations clés :

| Je veux modifier... | Fichier à ouvrir | Ligne approx. |
|---------------------|------------------|---------------|
| **Numéro de téléphone** | `components/sections/Hero.tsx` | Ligne 60+ |
| **Numéro (Contact)** | `components/sections/Contact.tsx` | Ligne 30+ |
| **Numéro (Menu)** | `components/sections/Navbar.tsx` | Fin du fichier |
| **Adresse** | `components/sections/Contact.tsx` | Ligne 20+ |
| **Textes FAQ** | `components/sections/FAQ.tsx` | Haut du fichier (Liste) |
| **Textes Expertises** | `components/sections/Features.tsx` | Haut du fichier (Liste) |
| **Photo Principale** | Remplacer `public/DSC01907.webp` | Garder le même nom |

---

## 5. 💻 Lancer le projet en local

Pour travailler sur le site depuis votre machine :

1.  **Installer les dépendances :**
    ```bash
    npm install
    ```
2.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
3.  Ouvrir `http://localhost:3000` dans votre navigateur.

---

## 6. 🔍 SEO (Référencement)

Le site est optimisé techniquement pour Google :
- **Métadonnées :** Titres et descriptions configurés dans `app/layout.tsx`.
- **Sitemap :** Généré automatiquement (`app/sitemap.ts`).
- **Robots.txt :** Présent dans `public/robots.txt`.
- **Performance :** Next.js garantit un chargement ultra-rapide.

---

*Document généré le 19 Janvier 2026 pour Fain Avocats.*
