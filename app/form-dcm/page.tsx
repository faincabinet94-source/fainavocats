'use client' // Indispensable pour utiliser les fonctions de recherche d'URL

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function FormDcmPage() {
  const searchParams = useSearchParams()
  const [iframeUrl, setIframeUrl] = useState("https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3")

  useEffect(() => {
    // On récupère le paramètre 'entry' de l'URL du navigateur (ex: Airtable)
    const entryData = searchParams.get('entry')
    
    if (entryData) {
      // On l'ajoute à l'URL de l'iframe comme on le faisait dans le script précédent
      // Note : on utilise '?' ou '&' selon la structure de l'URL
      setIframeUrl(`https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3?entry=${encodeURIComponent(entryData)}`)
    }
  }, [searchParams])

  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-6 md:px-12 min-h-screen bg-white text-slate-900">
      
      {/* Bouton de retour */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      {/* L'Iframe avec la logique de pré-remplissage récupérée */}
      <div className="w-full border-t border-slate-100 pt-8">
        <iframe 
          src={iframeUrl}
          style={{ 
            position: 'relative',
            width: '100%', 
            minWidth: '100%',
            border: 'none', 
            minHeight: '1600px' 
          }}
          frameBorder="0"
          scrolling="yes"
          title="Formulaire de Renseignements"
        ></iframe>
      </div>
    </main>
  )
}
