import JSZip from "jszip";

/* Moteur de remplissage des modèles Word écrits dans la syntaxe de Cognito :
 *
 *   {Champ}                       valeur du champ
 *   {if (Champ = "Oui")} … { end if }   bloc conditionnel, imbrications permises
 *   {else}                        branche alternative (facultative)
 *
 * Les conditions admettent =, !=, <>, >, <, >=, <=, and, or, not et les
 * parenthèses. Les comparaisons de texte ignorent la casse et les espaces aux
 * extrémités ; celles entre nombres sont numériques ("12" = 12).
 *
 * Les modèles restent ceux de Cognito, sans réécriture : Word coupe souvent une
 * balise en plusieurs morceaux (129 sur 1 386 dans DCM1AE), le moteur lit donc
 * le texte du document comme un flux continu, par-dessus ces coupures. Un
 * paragraphe que le remplissage a vidé est supprimé, comme le fait Cognito ; un
 * tableau dont tous les paragraphes disparaissent l'est aussi. */

export type Valeur = string | number | null | undefined | { valeur: string | number | null; texte: string };
export type Valeurs = Record<string, Valeur>;

export type Rapport = {
  champsInconnus: string[];
  conditionsIllisibles: string[];
  blocsNonFermes: number;
};

const PARTIES = /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/;

export async function remplir(modele: ArrayBuffer | Uint8Array | Buffer, valeurs: Valeurs) {
  const zip = await JSZip.loadAsync(modele);
  const rapport: Rapport = { champsInconnus: [], conditionsIllisibles: [], blocsNonFermes: 0 };
  const inconnus = new Set<string>();
  const illisibles = new Set<string>();
  for (const nom of Object.keys(zip.files)) {
    if (!PARTIES.test(nom)) continue;
    const xml = await zip.file(nom)!.async("string");
    const r = traiterPartie(xml, valeurs, inconnus, illisibles);
    rapport.blocsNonFermes += r.nonFermes;
    zip.file(nom, r.xml);
  }
  rapport.champsInconnus = Array.from(inconnus).sort();
  rapport.conditionsIllisibles = Array.from(illisibles).sort();
  const docx = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return { docx, rapport };
}

/* ---------- Valeurs ---------- */

function lire(valeurs: Valeurs, nom: string, inconnus: Set<string>) {
  if (!(nom in valeurs)) inconnus.add(nom);
  const v = valeurs[nom];
  if (v && typeof v === "object") return v;
  return { valeur: v ?? null, texte: v === null || v === undefined ? "" : String(v) };
}

/* ---------- Conditions ---------- */

type Jeton = { t: "id" | "txt" | "nb" | "op" | "(" | ")" | "and" | "or" | "not"; v: string };

function decouper(expr: string): Jeton[] | null {
  const j: Jeton[] = [];
  let i = 0;
  const s = expr.replace(/[“”]/g, '"');
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "(" || c === ")") { j.push({ t: c, v: c }); i++; continue; }
    if (c === '"') {
      const f = s.indexOf('"', i + 1);
      if (f < 0) return null;
      j.push({ t: "txt", v: s.slice(i + 1, f) });
      i = f + 1;
      continue;
    }
    const op = /^(<>|!=|>=|<=|=|>|<)/.exec(s.slice(i));
    if (op) { j.push({ t: "op", v: op[1] }); i += op[1].length; continue; }
    const nb = /^-?\d+(?:[.,]\d+)?/.exec(s.slice(i));
    if (nb) { j.push({ t: "nb", v: nb[0].replace(",", ".") }); i += nb[0].length; continue; }
    const id = /^[\p{L}_][\p{L}\p{N}_.]*/u.exec(s.slice(i));
    if (id) {
      const m = id[0].toLowerCase();
      j.push(m === "and" || m === "or" || m === "not" ? { t: m, v: m } : { t: "id", v: id[0] });
      i += id[0].length;
      continue;
    }
    return null;
  }
  return j;
}

const estNombre = (x: unknown) =>
  typeof x === "number" ? Number.isFinite(x) : typeof x === "string" && /^\s*-?\d+(?:[.,]\d+)?\s*$/.test(x);
const enNombre = (x: unknown) => (typeof x === "number" ? x : Number(String(x).trim().replace(",", ".")));
const enTexte = (x: unknown) => (x === null || x === undefined ? "" : String(x)).trim().toLowerCase();

function comparer(a: unknown, op: string, b: unknown): boolean {
  if (estNombre(a) && estNombre(b)) {
    const x = enNombre(a);
    const y = enNombre(b);
    switch (op) {
      case "=": return x === y;
      case "!=": case "<>": return x !== y;
      case ">": return x > y;
      case "<": return x < y;
      case ">=": return x >= y;
      case "<=": return x <= y;
    }
  }
  const x = enTexte(a);
  const y = enTexte(b);
  if (op === "=") return x === y;
  if (op === "!=" || op === "<>") return x !== y;
  /* Un ordre entre un nombre et une valeur vide ou textuelle est faux : un
     champ non renseigné n'est ni supérieur ni inférieur à 0. */
  return false;
}

function evaluer(expr: string, valeurs: Valeurs, inconnus: Set<string>): boolean | null {
  const j = decouper(expr);
  if (!j || !j.length) return null;
  let p = 0;
  const terme = (): unknown => {
    const x = j[p++];
    if (!x) throw 0;
    if (x.t === "txt") return x.v;
    if (x.t === "nb") return Number(x.v);
    if (x.t === "id") return lire(valeurs, x.v, inconnus).valeur;
    if (x.t === "(") {
      /* « (Champ) = "Oui" » : parenthèses autour d'un seul terme. */
      const debut = p;
      const v = ou();
      if (j[p]?.t !== ")") throw 0;
      p++;
      return j[debut]?.t === "id" && p === debut + 2 ? lire(valeurs, j[debut].v, inconnus).valeur : v;
    }
    throw 0;
  };
  const comparaison = (): unknown => {
    if (j[p]?.t === "not") { p++; return !vrai(comparaison()); }
    const a = terme();
    if (j[p]?.t === "op") {
      const op = j[p++].v;
      return comparer(a, op, terme());
    }
    return a;
  };
  const et = (): unknown => {
    let v = comparaison();
    while (j[p]?.t === "and") { p++; const w = comparaison(); v = vrai(v) && vrai(w); }
    return v;
  };
  const ou = (): unknown => {
    let v = et();
    while (j[p]?.t === "or") { p++; const w = et(); v = vrai(v) || vrai(w); }
    return v;
  };
  try {
    const v = ou();
    if (p !== j.length) return null;
    return vrai(v);
  } catch {
    return null;
  }
}

function vrai(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const t = enTexte(v);
  return t !== "" && t !== "non" && t !== "false" && t !== "0";
}

/* ---------- Document ---------- */

const desechapper = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Noeud = { debut: number; fin: number; ouverture: string; texte: string; nouveau: string; touche: boolean };

function traiterPartie(xml: string, valeurs: Valeurs, inconnus: Set<string>, illisibles: Set<string>) {
  const noeuds: Noeud[] = [];
  for (const m of xml.matchAll(/<w:t(\s[^>]*)?>([^<]*)<\/w:t>/g)) {
    noeuds.push({
      debut: m.index!,
      fin: m.index! + m[0].length,
      ouverture: m[1] || "",
      texte: desechapper(m[2]),
      nouveau: "",
      touche: false,
    });
  }

  /* Flux continu du texte, et pour chaque caractère le nœud d'origine. */
  let flux = "";
  const origine: number[] = [];
  const decalage: number[] = [];
  noeuds.forEach((n, k) => {
    decalage.push(flux.length);
    flux += n.texte;
    for (let i = 0; i < n.texte.length; i++) origine.push(k);
  });

  const pile: { actif: boolean; parent: boolean; pris: boolean }[] = [];
  const actif = () => pile.every((b) => b.actif);
  /* Caractères situés dans un bloc écarté, balises comprises : un paragraphe
     sans texte (espacement, saut de page) pris entre deux de ces caractères
     appartient au bloc et disparaît avec lui. */
  const ecarte = new Uint8Array(flux.length);
  const marquer = (de: number, a: number) => ecarte.fill(1, de, a);
  const garder = (de: number, a: number) => {
    const on = actif();
    if (!on) marquer(de, a);
    for (let i = de; i < a; i++) {
      if (on) noeuds[origine[i]].nouveau += flux[i];
      else noeuds[origine[i]].touche = true;
    }
  };
  const retirer = (de: number, a: number, insertion = "") => {
    for (let i = de; i < a; i++) noeuds[origine[i]].touche = true;
    if (insertion) noeuds[origine[de]].nouveau += insertion;
  };

  let pos = 0;
  for (const m of flux.matchAll(/\{([^{}]*)\}/g)) {
    const de = m.index!;
    const a = de + m[0].length;
    const corps = m[1];
    const si = /^\s*if\s*\(([\s\S]*)\)\s*$/i.exec(corps);
    const finSi = /^\s*end\s*if\s*$/i.test(corps);
    const sinon = /^\s*else\s*$/i.test(corps);
    const champ = /^\s*[\p{L}_][\p{L}\p{N}_]*\s*$/u.test(corps);
    if (!si && !finSi && !sinon && !champ) continue; // accolades ordinaires : laissées telles quelles
    garder(pos, de);
    pos = a;
    if (si) {
      const parent = actif();
      /* Dans un bloc déjà écarté, la condition n'est pas évaluée : le rapport ne
         signale ainsi que les champs manquants là où ils comptent. */
      let r = parent ? evaluer(si[1], valeurs, inconnus) : false;
      if (r === null) {
        illisibles.add(si[1].trim());
        r = false;
      }
      pile.push({ actif: r, parent, pris: r });
      if (!parent || !r) marquer(de, a);
      retirer(de, a);
    } else if (sinon) {
      const b = pile[pile.length - 1];
      if (b) { b.actif = !b.pris; b.pris = true; }
      if (!actif()) marquer(de, a);
      retirer(de, a);
    } else if (finSi) {
      if (!actif()) marquer(de, a);
      pile.pop();
      retirer(de, a);
    } else {
      if (!actif()) marquer(de, a);
      retirer(de, a, actif() ? lire(valeurs, corps.trim(), inconnus).texte : "");
    }
  }
  garder(pos, flux.length);
  const nonFermes = pile.length;

  /* Paragraphes vidés par le remplissage : supprimés, sauf s'ils portent une
     image ou la mise en page de la section. */
  type Para = { debut: number; fin: number; retire: boolean; noeuds: number[] };
  const paras: Para[] = [];
  let k = 0;
  for (const m of xml.matchAll(/<w:p[\s>][\s\S]*?<\/w:p>/g)) {
    const debut = m.index!;
    const fin = debut + m[0].length;
    const ids: number[] = [];
    while (k < noeuds.length && noeuds[k].debut < debut) k++;
    let q = k;
    while (q < noeuds.length && noeuds[q].fin <= fin) ids.push(q++);
    const touche = ids.some((i) => noeuds[i].touche);
    const vide = ids.every((i) => !noeuds[i].nouveau.trim());
    const protege = /<w:sectPr|<w:drawing|<w:pict|<w:object/.test(m[0]);
    let retire = touche && vide && !protege;
    if (!ids.length && !protege) {
      const o = k < noeuds.length ? decalage[k] : flux.length;
      retire = o > 0 && o < flux.length && ecarte[o - 1] === 1 && ecarte[o] === 1;
    }
    paras.push({ debut, fin, retire, noeuds: ids });
  }

  /* Une cellule de tableau doit garder au moins un paragraphe ; un tableau dont
     tout le texte a disparu est retiré en entier. */
  const suppressions: [number, number][] = [];
  for (const m of xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)) {
    const debut = m.index!;
    const fin = debut + m[0].length;
    const dedans = paras.filter((p) => p.debut >= debut && p.fin <= fin);
    const avecTexte = dedans.filter((p) => p.noeuds.some((i) => noeuds[i].texte.trim()));
    if (avecTexte.length && avecTexte.every((p) => p.retire)) {
      suppressions.push([debut, fin]);
      continue;
    }
    for (const c of m[0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>|<w:tc\s[\s\S]*?<\/w:tc>/g)) {
      const cd = debut + c.index!;
      const cf = cd + c[0].length;
      const ps = paras.filter((p) => p.debut >= cd && p.fin <= cf);
      if (ps.length && ps.every((p) => p.retire)) ps[ps.length - 1].retire = false;
    }
  }
  for (const p of paras) if (p.retire) suppressions.push([p.debut, p.fin]);
  suppressions.sort((a, b) => a[0] - b[0]);

  /* Recopie du XML : zones supprimées sautées (un paragraphe d'un tableau
     supprimé chevauche la zone du tableau), textes remplacés. */
  let sortie = "";
  let curseur = 0;
  let s = 0;
  const avancer = (jusqua: number) => {
    while (s < suppressions.length && suppressions[s][0] <= jusqua) {
      const [d, f] = suppressions[s++];
      if (d >= curseur) {
        sortie += xml.slice(curseur, d);
        curseur = f;
      } else if (f > curseur) {
        curseur = f;
      }
    }
  };
  for (const n of noeuds) {
    avancer(n.debut);
    if (n.debut < curseur) continue; // nœud dans une zone supprimée
    sortie += xml.slice(curseur, n.debut);
    const attrs = /xml:space=/.test(n.ouverture) ? n.ouverture : `${n.ouverture} xml:space="preserve"`;
    sortie += `<w:t${attrs}>${echapper(n.nouveau)}</w:t>`;
    curseur = n.fin;
  }
  avancer(xml.length);
  sortie += xml.slice(curseur);
  return { xml: sortie, nonFermes };
}
