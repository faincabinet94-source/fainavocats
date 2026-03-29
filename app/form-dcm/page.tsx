'use client' // Obligatoire pour lire les paramètres d'URL en direct

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function FormDcmPage() {
  const searchParams = useSearchParams()
  
  // On récupère les données de pré-remplissage dans l'URL (le paramètre "entry")
  const entryData = searchParams.get('entry') || ''
  
  // On construit l'URL de l'iframe en y ajoutant les données de pré-remplissage
  const baseUrl = "https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3"
  const finalUrl = entryData ? `${baseUrl}?entry=${encodeURIComponent(entryData)}` : baseUrl

  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-6 md:px-12 min-h-screen bg-white text-slate-900">
      
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      <div className="w-full border-t border-slate-100 pt-8">
        <iframe 
          src={finalUrl}
          style={{ border: 'none', width: '100%', minHeight: '1600px' }}
          title="Formulaire de Renseignements"
        ></iframe>
      </div>
    </main>
  )
}
