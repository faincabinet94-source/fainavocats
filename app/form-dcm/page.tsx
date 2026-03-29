export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    /* - pt-20 : Ajoute un grand espace en haut pour que le titre ne soit plus coupé par le menu.
      - px-6 md:px-12 : Ajoute de l'espace sur les côtés pour ne pas coller aux bords.
      - max-w-6xl : Permet au formulaire d'être assez large pour les colonnes (Civilite, Nom, Prenom).
    */
    <main className="max-w-6xl mx-auto pt-20 pb-12 px-6 md:px-12 min-h-screen bg-white">
      
      <div className="w-full">
        <iframe 
          src="https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3"
          style={{ 
            border: 'none', 
            width: '100%', 
            minHeight: '1500px', // On augmente encore un peu pour éviter les barres de défilement internes
          }}
          title="Formulaire de Renseignements"
        ></iframe>
      </div>

    </main>
  )
}
