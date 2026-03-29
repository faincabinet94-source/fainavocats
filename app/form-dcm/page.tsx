import Script from 'next/script'

export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    // Ce conteneur global gère l'alignement et les marges principales
    <main className="max-w-4xl mx-auto py-10 px-4 min-h-screen bg-neutral-50">
      
      {/* Conteneur pour le texte du titre */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          Formulaire de Renseignements
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Veuillez remplir les informations ci-dessous pour votre dossier.
        </p>
      </div>
      
      {/* --- CORRECTION CRUCIALE ICI ---
          J'ai supprimé 'p-5' (le padding). Cognito en a besoin pour son calcul.
          J'ai ajouté 'min-h-[500px]' pour forcer une hauteur minimale et empêcher le formulaire de se ratatiner.
          'w-full' assure que le formulaire prend toute la largeur.
      */}
      <div className="bg-white p-0 rounded-lg shadow-sm border border-slate-100 min-h-[500px] w-full relative overflow-hidden">
        <Script 
          src="https://www.cognitoforms.com/f/seamless.js" 
          data-key="7odepi9SUkCmb7Yrf3m2Cg" 
          data-form="3"
          strategy="afterInteractive"
        />
      </div>
    </main>
  )
}
