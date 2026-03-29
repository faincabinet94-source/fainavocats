import Link from 'next/link'

export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    /* pt-24 : On laisse de la place pour le menu du site en haut
       px-6 : Marge sur les côtés pour mobile
       md:px-12 : Marge plus grande sur ordinateur
    */
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-6 md:px-12 min-h-screen bg-white text-slate-900">
      
      {/* Bouton de retour discret */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      {/* Le formulaire Cognito */}
      <div className="w-full border-t border-slate-100 pt-8">
        <iframe 
          src="https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3"
          style={{ 
            border: 'none', 
            width: '100%', 
            minHeight: '1600px', 
          }}
          title="Formulaire de Renseignements"
        ></iframe>
      </div>

    </main>
  )
}
