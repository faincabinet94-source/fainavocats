import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modification État Civil | Changement Prénom Nom - Avocat Paris - Fain Avocats",
  description:
    "Avocat spécialisé en modification de l'état civil à Paris : changement de prénom, changement de nom de famille, francisation du nom. Cabinet Fain Avocats, Paris 16ème.",
  keywords: [
    "changement prénom avocat paris",
    "changement nom famille avocat",
    "modification état civil",
    "francisation nom avocat",
    "changement prénom procédure",
    "avocat état civil paris",
  ],
};

export default function EtatCivilPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F4F2EC] min-h-screen pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-gray-500 mb-8">
              <a href="/" className="hover:text-[#362A24] transition-colors">
                Accueil
              </a>
              <span className="mx-2">&gt;</span>
              <Link
                href="/droit-de-la-famille"
                className="hover:text-[#362A24] transition-colors"
              >
                Droit de la Famille
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-[#362A24]">Modification de l&apos;état civil</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight">
              Modification de l&apos;état civil
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              La modification de l&apos;état civil recouvre plusieurs procédures
              permettant de changer son prénom, son nom de famille ou de
              procéder à la francisation de son identité. Ces démarches
              nécessitent l&apos;assistance d&apos;un avocat pour constituer un
              dossier solide et maximiser les chances de succès.
            </p>

            <div className="space-y-8 mb-16">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  Le changement de prénom
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depuis la loi du 18 novembre 2016, la procédure de changement
                  de prénom a été simplifiée. La demande se fait désormais
                  directement auprès de l&apos;officier d&apos;état civil de la
                  mairie du lieu de résidence ou du lieu de naissance.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Le demandeur doit justifier d&apos;un intérêt légitime au
                  changement de prénom. En cas de refus de l&apos;officier
                  d&apos;état civil, il est possible de saisir le Juge aux
                  Affaires Familiales. L&apos;assistance d&apos;un avocat est
                  alors indispensable.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  Le changement de nom de famille
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Le changement de nom de famille est une procédure
                  administrative qui passe par le Ministère de la Justice. Le
                  demandeur doit justifier d&apos;un motif légitime&nbsp;: nom
                  ridicule ou portant préjudice, nom difficile à porter, volonté
                  de porter le nom de l&apos;autre parent, etc.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  La procédure comprend la publication au Journal Officiel et un
                  délai de deux mois pendant lequel des tiers peuvent former
                  opposition. Un avocat vous accompagne dans la constitution du
                  dossier et la rédaction de la requête.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  Francisation du nom en cas d&apos;acquisition de la nationalité
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  La francisation du nom de famille ou du prénom peut être
                  demandée lors d&apos;une procédure pour obtenir la nationalité
                  française. Cette demande peut être formulée en même temps que
                  la demande de naturalisation ou dans un délai d&apos;un an
                  suivant l&apos;acquisition de la nationalité.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  La francisation peut consister en la traduction du nom, sa
                  modification pour le rendre plus conforme à l&apos;usage
                  français, ou encore l&apos;adoption d&apos;un nouveau prénom
                  français.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg">
                <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
                  La rectification d&apos;acte d&apos;état civil
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  En cas d&apos;erreur matérielle dans un acte de naissance, de
                  mariage ou de décès (erreur d&apos;orthographe, date erronée,
                  etc.), il est possible de demander la rectification de
                  l&apos;acte. Les erreurs simples peuvent être corrigées par le
                  procureur de la République, tandis que les erreurs plus
                  importantes nécessitent une requête devant le tribunal.
                </p>
              </div>
            </div>

            <div className="bg-[#362A24] text-white p-10 rounded-lg text-center">
              <h2 className="font-serif text-3xl mb-4">
                Besoin d&apos;accompagnement&nbsp;?
              </h2>
              <p className="text-white/70 mb-8">
                Un avocat spécialisé vous guide dans vos démarches de
                modification de l&apos;état civil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+33140680237"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#362A24] px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300"
                >
                  +33 1 40 68 02 37
                </a>
                <Link
                  href="/consultations"
                  className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white hover:text-[#362A24] transition-all duration-300"
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
