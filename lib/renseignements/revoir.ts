/* Désaccord sur l'accord du conjoint : le mail de l'époux porte
 * /formulaire-renseignements?revoir=<fiche>.<jeton>&points=<intitulé>|<intitulé>.
 * Même jeton de correction ; formulaire en version client. Les intitulés sont
 * ceux du portail (client/portail/lib/avis/points.ts) : on en déduit l'étape
 * à revoir. */
const ETAPE_DU_POINT: [RegExp, number][] = [
  [/consentement mutuel/, 0],
  [/logement familial|relogement/, 4],
  [/résidence de|pension de/, 5],
  [/^le (bien|véhicule|crédit)/, 6],
  [/prestation compensatoire|devoir de secours/, 7],
  [/nom de famille/, 8],
  [/honoraires/, 9],
];

export function lirePoints(p: string | null): { intitule: string; etape: number | null }[] {
  return (p ?? "")
    .split("|")
    .map((x) => x.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 20)
    .map((intitule) => ({ intitule, etape: ETAPE_DU_POINT.find(([r]) => r.test(intitule))?.[1] ?? null }));
}
