import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Fain Avocats - Paris 16",
  description: "Mentions légales du site Fain Avocats, cabinet d'avocats en droit de la famille à Paris 16ème.",
};

export default function MentionsLegales() {
  return (
    <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <a href="/" className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block">
            ← Retour à l&apos;accueil
          </a>

          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-12">Mentions Légales</h1>

          <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">1. Éditeur du site</h2>
              <p>
                Le site <strong>www.fain-avocats.fr</strong> est édité par :<br/>
                <strong>Cabinet Fain Avocats</strong><br/>
                Profession libérale réglementée — Avocat inscrit au Barreau de Paris<br/>
                196 avenue victor hugo, 75116 paris<br/>
                Téléphone : +33 1 40 68 02 37<br/>
                Email : jf@fain-avocats.fr
              </p>
              <p>
                Directeur de la publication : <strong>Maître Joackim Fain</strong>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">2. Hébergement</h2>
              <p>
                Le site est hébergé par :<br/>
                <strong>Netlify, Inc.</strong><br/>
                512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis<br/>
                Site web : <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-[#362A24] underline">www.netlify.com</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">3. Activité réglementée</h2>
              <p>
                Maître Fain est avocat inscrit au <strong>Barreau de Paris</strong>. Il est soumis aux règles déontologiques de la profession d&apos;avocat, conformément à la loi n°71-1130 du 31 décembre 1971 et au décret n°2005-790 du 12 juillet 2005.
              </p>
              <p>
                Ordre des Avocats de Paris :<br/>
                11 Place Dauphine, 75001 Paris<br/>
                <a href="https://www.avocatparis.org" target="_blank" rel="noopener noreferrer" className="text-[#362A24] underline">www.avocatparis.org</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">4. Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble des contenus du site (textes, images, graphismes, logo, icônes) est la propriété exclusive de Fain Avocats ou de ses partenaires. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, est interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">5. Responsabilité</h2>
              <p>
                Les informations fournies sur ce site sont présentées à titre indicatif et général. Elles ne sauraient constituer un avis juridique ni engager la responsabilité du cabinet. Pour toute question juridique spécifique, nous vous invitons à prendre contact directement avec le cabinet.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">6. Liens hypertextes</h2>
              <p>
                Le site peut contenir des liens vers des sites tiers. Fain Avocats n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">7. Conception & développement</h2>
              <p>
                Site conçu et développé par :<br/>
                <strong>NL Project</strong><br/>
                Email : <a href="mailto:contact.nlproject@gmail.com" className="text-[#362A24] underline">contact.nlproject@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">8. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux de Paris seront seuls compétents.
              </p>
            </section>

          </div>
        </div>
      </Container>
    </main>
  );
}
