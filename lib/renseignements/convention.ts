/* Convention d'honoraires signée sur le site, avant le paiement de la
   provision (décision de Me FAIN du 2026-10-13). Côté serveur seulement.

   Le texte vient de la table « Modèles » d'Airtable, servi par le workflow n8n
   « Convention - site » avec l'« Honoraire final » du devis (base Prospects) :
   il n'est pas recopié dans ce dépôt, public. Le site le remplit avec la
   saisie, l'affiche, le garde avec son empreinte SHA-256 et, à la signature,
   en produit le PDF signé : texte de la convention, mention de signature en
   pied de page, certificat de signature en dernière page.

   Modèles (vus de l'époux qui remplit le formulaire, client de Me FAIN) :
   - 2A, courrier d'usage : CH CU ;
   - 1A, honoraires partagés par moitié : CH DCM1A M ;
   - 1A, il prend tout à sa charge : CH DCM1A T ;
   - 1A, son conjoint prend tout à sa charge : CH DCM1A TC.
   Séparation de corps, assurance ou répartition non tranchée : pas de modèle,
   l'écran garde les seules cases (le cabinet adresse la convention ensuite).

   Signature électronique simple (art. 1367 C. civ.) : la preuve tient à
   l'empreinte du texte affiché, à la date, à l'adresse IP, au navigateur, au
   nom saisi et au paiement qui suit. Voir le coffre :
   50 - Projets/Espace client/espace-client-validation-conjoint.md */

import { createHash } from "crypto";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { clausesHonoraires, conseilDuConjoint, dateFr, destinataireUsage, type Donnees } from "@/lib/renseignements/modele";
import { grilles, type Tarifs } from "@/lib/tarifs";

export type CleModele = "CU" | "M" | "T" | "TC";

export const MODELES: Record<CleModele, string> = {
  CU: "rec8eHsxipuQqwxj2",
  M: "recKTvrlFnkUzKtbR",
  T: "reclvuOAdfFTOgmo2",
  TC: "rec0GdgfIBiSXt6X3",
};

/** Modèle à signer pour cette saisie, ou null (pas de convention en ligne). */
export function modeleConvention(d: Donnees): CleModele | null {
  if (destinataireUsage(d)) return "CU";
  if (d.procedure !== "Divorce" || conseilDuConjoint(d) === "exterieur") return null;
  if (d.repartition === "Partage par moitié") return "M";
  if (d.repartition === "Je les prendrai à ma charge") return "T";
  if (d.repartition === "Mon conjoint les prendra à charge") return "TC";
  return null;
}

/** La convention TC ne demande aucune provision au client. */
export const sansProvision = (cle: CleModele) => cle === "TC";

const deux = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[  ]/g, " ");

/** Honoraires TTC d'un avocat : moitié de l'« Honoraire final » du devis en 1A, ou à défaut de la grille. */
export function honoParAvocat(d: Donnees, honoraireFinal: number | null, tarifs: Tarifs): number {
  if (honoraireFinal && honoraireFinal > 0) return honoraireFinal / 2;
  const suffixe = (d.enfants.length ? "E" : "") + (d.immobilier.length ? "B" : "");
  return (grilles(tarifs).g1a[suffixe] ?? tarifs.DCM1A) / 2;
}

/** Remplit le modèle (mêmes variables que la formule « Doc final » de la table Docs). */
export function remplirConvention(modele: string, d: Donnees, hono: number): string {
  const c = d.client;
  const ht = Math.round((hono / 1.2) * 100) / 100;
  const v: Record<string, string> = {
    GENRE: c.civilite,
    PRENOM: c.prenoms,
    NOM: c.nom.trim().toUpperCase(),
    "DATE DE NAISSANCE": dateFr(c.dateNaissance) || c.dateNaissance,
    ADRESSE: c.adresse,
    CP: c.cp,
    VILLE: c.ville.trim().toUpperCase(),
    "PRENOM AVOCAT": "Joackim",
    "NOM AVOCAT": "FAIN",
    "PRENOM AVOCAT CONJOINT": "Jeanne",
    "NOM AVOCAT CONJOINT": "TRAN",
    "HONO TTC": deux(hono),
    "HONO HT": deux(ht),
    "HONO TVA": deux(Math.round((hono - ht) * 100) / 100),
    "HONO TOTAL TTC": deux(2 * hono),
  };
  const options = clausesHonoraires(d).trim();
  return modele
    .replace(/\r/g, "")
    .replace(/!!OPTIONS HONORAIRES!!/g, options ? `\n\n${options}` : "")
    .replace(/\(e\)/g, c.civilite === "Monsieur" ? "" : "e")
    .replace(/!!([^!]+)!!/g, (_, k: string) => (v[k] ?? "").trim() || "…");
}

export const empreinte = (donnees: string | Uint8Array) => createHash("sha256").update(donnees).digest("hex");

/* ---------- PDF ---------- */

// Polices standard des PDF : WinAnsi seulement ; le reste est remplacé.
const EN_PLUS = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
const winAnsi = (s: string) =>
  s
    .normalize("NFC")
    .replace(/[  \t]/g, " ")
    .replace(/[^ -~¡-ÿ]/g, (x) => (EN_PLUS.includes(x) ? x : "?"));

type Morceau = { t: string; gras: boolean };
/** Un mot peut changer de graisse en son milieu (« **DUPONT**, née ») : suite de morceaux. */
type Mot = Morceau[];

/** Mots d'une ligne, avec le gras **…** ; l'italique _…_ est rendu en romain. */
function mots(ligne: string, grasLigne = false): Mot[] {
  const res: Mot[] = [];
  let gras = grasLigne;
  let mot: Mot = [];
  let courant = "";
  const pousser = () => {
    if (courant) mot.push({ t: courant, gras });
    courant = "";
  };
  const t = winAnsi(ligne).replace(/(^|[\s(])_([^_]+)_/g, "$1$2");
  for (let i = 0; i < t.length; i++) {
    if (t.startsWith("**", i)) {
      pousser();
      gras = !gras;
      i++;
    } else if (/\s/.test(t[i])) {
      pousser();
      if (mot.length) res.push(mot);
      mot = [];
    } else courant += t[i];
  }
  pousser();
  if (mot.length) res.push(mot);
  return res;
}

type Page = { page: PDFPage; y: number };

const A4: [number, number] = [595.28, 841.89];
const MARGE = 60;
const LARGEUR = A4[0] - 2 * MARGE;

async function polices(pdf: PDFDocument) {
  return { normal: await pdf.embedFont(StandardFonts.Helvetica), gras: await pdf.embedFont(StandardFonts.HelveticaBold) };
}

function nouvellePage(pdf: PDFDocument, police: PDFFont): Page {
  const page = pdf.addPage(A4);
  page.drawText("FAIN AVOCATS | 196 avenue Victor Hugo, 75116 PARIS | +33 1 40 68 02 37 | contact@fain-avocats.fr", {
    x: MARGE,
    y: A4[1] - 36,
    size: 7.5,
    font: police,
    color: rgb(0.45, 0.45, 0.45),
  });
  return { page, y: A4[1] - MARGE - 10 };
}

/** Écrit un paragraphe mot à mot, avec retour à la ligne et saut de page. */
function paragraphe(
  pdf: PDFDocument,
  p: { courante: Page },
  f: { normal: PDFFont; gras: PDFFont },
  liste: Mot[],
  taille: number,
  retrait = 0,
  puce = false,
) {
  const interligne = taille * 1.45;
  let x = MARGE + retrait;
  const espace = (fo: PDFFont) => fo.widthOfTextAtSize(" ", taille);
  const saut = () => {
    p.courante.y -= interligne;
    if (p.courante.y < MARGE + 20) p.courante = nouvellePage(pdf, f.normal);
    x = MARGE + retrait;
  };
  if (puce) p.courante.page.drawText("-", { x: MARGE + retrait - 10, y: p.courante.y, size: taille, font: f.normal });
  for (const m of liste) {
    const w = m.reduce((n, r) => n + (r.gras ? f.gras : f.normal).widthOfTextAtSize(r.t, taille), 0);
    if (x > MARGE + retrait && x + w > MARGE + LARGEUR) saut();
    for (const r of m) {
      const fo = r.gras ? f.gras : f.normal;
      p.courante.page.drawText(r.t, { x, y: p.courante.y, size: taille, font: fo, color: rgb(0.1, 0.1, 0.1) });
      x += fo.widthOfTextAtSize(r.t, taille);
    }
    x += espace(f.normal);
  }
  saut();
}

export type Preuve = {
  intitule: string;
  reference: string;
  signataire: string;
  saisie: string;
  courriel: string;
  quand: Date;
  ip: string;
  navigateur: string;
  empreinteTexte: string;
  cases: string[];
};

const heureParis = (d: Date) => d.toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "long", timeStyle: "medium" });

/** PDF de la convention signée : texte, mention en pied de page, certificat. */
export async function pdfSigne(texte: string, p: Preuve): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const f = await polices(pdf);
  const etat = { courante: nouvellePage(pdf, f.normal) };

  for (const bloc of texte.split(/\n{2,}/)) {
    for (const ligne of bloc.split("\n").filter((l) => l.trim())) {
      const puce = /^\s*\\?-\s+/.test(ligne);
      const brute = ligne.replace(/^\s*\\?-\s+/, "");
      const titre = /^\*\*[^*]+\*\*$/.test(brute.trim());
      paragraphe(pdf, etat, f, mots(brute), titre && /^\*\*CONVENTION/.test(brute) ? 14 : 10, puce ? 14 : 0, puce);
    }
    etat.courante.y -= 6;
  }

  // Certificat de signature, sur une page à part.
  const cert = { courante: nouvellePage(pdf, f.normal) };
  const ecrire = (t: string, taille = 10, gras = false) => paragraphe(pdf, cert, f, mots(t, gras), taille);
  ecrire("Certificat de signature électronique", 15, true);
  cert.courante.y -= 6;
  ecrire(`Document : ${p.intitule}`, 10, true);
  ecrire(`Référence : ${p.reference}`);
  ecrire(`Signataire : ${p.signataire}`, 10, true);
  ecrire(`Nom saisi par le signataire : ${p.saisie}`);
  ecrire(`Adresse électronique déclarée : ${p.courriel}`);
  ecrire(`Date et heure : ${heureParis(p.quand)} (heure de Paris), soit ${p.quand.toISOString()} (UTC)`);
  ecrire(`Adresse IP : ${p.ip || "non transmise"}`);
  ecrire(`Navigateur : ${p.navigateur || "non transmis"}`);
  cert.courante.y -= 6;
  ecrire("Déclarations cochées par le signataire :", 10, true);
  for (const c of p.cases) ecrire(`[x] ${c}`);
  cert.courante.y -= 6;
  ecrire("Intégrité", 10, true);
  ecrire(`Empreinte SHA-256 du texte de la convention présenté au signataire, tel qu'il figure aux pages précédentes : ${p.empreinteTexte}`);
  ecrire(
    "La convention a été affichée en entier au signataire sur le site fain-avocats.fr, à la fin du formulaire de renseignements, avant toute signature et avant le règlement de la provision. Signature électronique simple au sens de l'article 1367 du Code civil.",
    9,
  );

  const pages = pdf.getPages();
  const mention = winAnsi(`Signé électroniquement par ${p.signataire} le ${heureParis(p.quand)} (heure de Paris). Empreinte : ${p.empreinteTexte.slice(0, 16)}`);
  pages.forEach((page, i) => {
    const t = `${mention} - page ${i + 1}/${pages.length}`;
    const taille = Math.min(6.5, (6.5 * LARGEUR) / f.normal.widthOfTextAtSize(t, 6.5));
    page.drawText(t, { x: MARGE, y: 24, size: taille, font: f.normal, color: rgb(0.4, 0.4, 0.4) });
  });
  pdf.setTitle(winAnsi(`${p.intitule} - exemplaire signé`));
  pdf.setProducer("fain-avocats.fr");
  pdf.setModificationDate(p.quand);
  return pdf.save();
}

export const INTITULES: Record<CleModele, string> = {
  CU: "Convention d'honoraires - courrier d'usage",
  M: "Convention d'honoraires",
  T: "Convention d'honoraires",
  TC: "Convention d'honoraires",
};
