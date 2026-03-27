import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Fain Avocats - Paris 16",
  description: "Politique de confidentialité et protection des données personnelles du cabinet Fain Avocats à Paris 16ème.",
};

export default function Confidentialite() {
  return (
    <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <a href="/" className="text-sm text-gray-500 hover:text-[#362A24] transition-colors mb-8 inline-block">
            ← Retour à l&apos;accueil
          </a>

          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-12">Politique de Confidentialité</h1>

          <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données personnelles est :<br/>
                <strong>Cabinet Fain Avocats</strong><br/>
                196 avenue victor hugo, 75116 paris<br/>
                Email : jf@fain-avocats.fr<br/>
                Téléphone : +33 1 40 68 02 37
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">2. Données collectées</h2>
              <p>
                Le site <strong>www.fain-avocats.fr</strong> ne collecte aucune donnée personnelle via un formulaire de contact. Les seules interactions possibles sont :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Appels téléphoniques</strong> : lorsque vous cliquez sur le numéro de téléphone, votre appareil lance un appel. Le cabinet ne collecte aucune donnée supplémentaire via le site.</li>
                <li><strong>Emails</strong> : si vous envoyez un email à jf@fain-avocats.fr, les données que vous communiquez (nom, email, contenu du message) sont traitées dans le cadre strict de votre demande.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">3. Finalités du traitement</h2>
              <p>
                Les données personnelles éventuellement collectées sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Répondre à vos demandes de renseignements juridiques</li>
                <li>Assurer le suivi de la relation client</li>
                <li>Respecter les obligations légales et déontologiques de la profession d&apos;avocat</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">4. Secret professionnel</h2>
              <p>
                En tant qu&apos;avocats, nous sommes soumis au <strong>secret professionnel</strong> (article 66-5 de la loi du 31 décembre 1971). Toutes les informations que vous nous communiquez sont couvertes par ce secret et ne peuvent être divulguées à des tiers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">5. Cookies</h2>
              <p>
                Le site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de suivi n&apos;est utilisé. Aucun outil d&apos;analyse tiers (Google Analytics, etc.) n&apos;est installé sur ce site.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">6. Durée de conservation</h2>
              <p>
                Les données personnelles sont conservées pour la durée strictement nécessaire à la finalité du traitement, et au maximum pour la durée prévue par les obligations légales et déontologiques applicables à la profession d&apos;avocat.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">7. Vos droits</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d&apos;accès</strong> : obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
                <li><strong>Droit de rectification</strong> : demander la correction de données inexactes</li>
                <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
                <li><strong>Droit à la limitation</strong> : demander la limitation du traitement</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous par email à <a href="mailto:jf@fain-avocats.fr" className="text-[#362A24] underline">jf@fain-avocats.fr</a> ou par courrier au 196 avenue victor hugo, 75116 paris.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">8. Réclamation</h2>
              <p>
                Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :
              </p>
              <p>
                CNIL — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br/>
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#362A24] underline">www.cnil.fr</a>
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-500 italic">
                Dernière mise à jour : mars 2026
              </p>
            </section>

          </div>
        </div>
      </Container>
    </main>
  );
}
