import Script from 'next/script'

export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    // Ce conteneur global gère l'alignement et les marges
    <main className="max-w-4xl mx-auto pt-6 pb-12 px-4 min-h-screen bg-neutral-50">
      
      {/* Conteneur pour le texte du titre */}
      <div className="mb-4">
        {/* Titre principal : texte plus compact, aligné à gauche */}
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          Formulaire de Renseignements
        </h1>
        {/* Un petit sous-titre pour expliquer l'action */}
        <p className="text-sm text-slate-600 mt-1">
          Veuillez remplir les informations ci-dessous pour votre dossier.
        </p>
      </div>
      
      {/* Conteneur pour le formulaire Cognito : fond blanc, petite ombre et bordure discrète */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
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
