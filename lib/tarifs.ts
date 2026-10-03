/* Grille tarifaire du cabinet. Source unique : table « Tarifs » de la base
   Prospects (Airtable), servie par le workflow n8n « Tarifs - lecture »
   (GET /webhook/tarifs). Les valeurs ci-dessous ne servent que de secours si
   n8n ne répond pas ; les modifier ici ne change rien en temps normal.
   Séparation de corps : mêmes tarifs que le divorce par consentement mutuel. */

export type Tarifs = Record<string, number>;

export const TARIFS_DEFAUT: Tarifs = {
  DCM1A: 650,
  SUP_ENFANTS: 250,
  SUP_IMMO: 350,
  SUP_PC: 250,
  SUP_CABINET: 120,
  DCM2A: 1200,
  DCM2AE: 1500,
  DCM2AB: 1800,
  DCM2AEB: 2400,
  DC: 2000,
  DCE: 3000,
  DCB: 3000,
  DCEB: 4000,
  RC1A: 1800,
  RC1AE: 2000,
  RC1AB: 2200,
  RC1AEB: 2400,
  DEPOT_NOTAIRE: 49.44,
  CERTIF_66: 240,
  CERTIF_39: 240,
  PROVISION_DEPART: 250,
  CONSULTATION: 120,
  TAUX_HORAIRE: 200,
  TAUX_NEGOCIATIONS: 220,
};

/** Garde les seuls montants numériques, par-dessus les valeurs de secours. */
/** Montant en euros, à la française (« 349,72 € », « 650 € »). */
export const euros = (n: number) =>
  n.toLocaleString("fr-FR", Number.isInteger(n) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

export function completer(brut: unknown): Tarifs {
  const t: Tarifs = { ...TARIFS_DEFAUT };
  if (brut && typeof brut === "object")
    for (const [k, v] of Object.entries(brut as Record<string, unknown>))
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) t[k] = v;
  return t;
}

type Grille = Record<string, number>;

/** Grilles du simulateur et du devis, par suffixe (E enfants, B bien immobilier). */
export function grilles(t: Tarifs) {
  const s = t.DCM1A;
  const g1a: Grille = { "": s, E: s + t.SUP_ENFANTS, B: s + t.SUP_IMMO, EB: s + t.SUP_ENFANTS + t.SUP_IMMO };
  const g2a: Grille = { "": t.DCM2A, E: t.DCM2AE, B: t.DCM2AB, EB: t.DCM2AEB };
  const gdc: Grille = { "": t.DC, E: t.DCE, B: t.DCB, EB: t.DCEB };
  const grc: Grille = { "": t.RC1A, E: t.RC1AE, B: t.RC1AB, EB: t.RC1AEB };
  return {
    g1a,
    g2a,
    gdc,
    grc,
    depot: t.DEPOT_NOTAIRE,
    certif66: t.CERTIF_66,
    supCabinet: t.SUP_CABINET,
    supPresta: t.SUP_PC,
  };
}
