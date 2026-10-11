import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getFicheBySlug } from "@/lib/fiches";
import { getRubrique } from "@/lib/rubriques";

// Encadré « Votre convention, point par point » de /divorce-sans-juge
// (décision du 11 octobre 2026). Les treize guides restent rangés dans la
// rubrique de leur sujet ; cette page les présente ensemble, dans l'ordre où
// la question se pose. Un guide pas encore publié n'apparaît pas : l'encadré se
// remplit seul au fil des publications, et ne s'affiche pas s'il est vide.
export const GUIDES_CONVENTION = [
  "apres-signature-convention-divorce-etapes",
  "divorce-sans-juge-audition-enfant",
  "date-effets-divorce-entre-epoux",
  "domicile-conjugal-solidarite-epoux-divorce",
  "residence-alternee-divorce-organisation",
  "frais-exceptionnels-enfants-divorce",
  "modifier-convention-divorce-enfants",
  "donations-avantages-matrimoniaux-divorce",
  "divorce-bien-immobilier-etat-liquidatif-notaire",
  "credit-commun-apres-divorce-banque",
  "bien-oublie-partage-apres-divorce",
  "nom-usage-apres-divorce",
  "impots-annee-divorce-solidarite-fiscale",
];

export function ConventionPointParPoint() {
  const guides = GUIDES_CONVENTION.map((slug) => getFicheBySlug(slug)).filter(
    (f): f is NonNullable<typeof f> => Boolean(f)
  );
  if (guides.length === 0) return null;

  return (
    <section className="bg-[#F4F2EC] py-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl text-[#1A1A1A] mb-4 text-center">
            Votre convention, point par point
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Les questions que la convention de divorce doit régler, une par une.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {guides.map((f) => (
              <Link
                key={f.slug}
                href={`/fiches/${f.slug}`}
                className="group bg-white p-5 rounded-lg hover:shadow-lg transition-all"
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  {getRubrique(f.category).label}
                </span>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-1 group-hover:text-[#362A24] transition-colors">
                  {f.title} &rarr;
                </h3>
                <p className="text-gray-500 text-sm">{f.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
