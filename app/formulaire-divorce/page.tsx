'use client' // Indispensable pour utiliser les fonctions de recherche d'URL

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react' // Corrigé : ajout de useState ici

export default function FormDcmPage() {
  const searchParams = useSearchParams()
  
  // État pour stocker l'URL de l'iframe
  const [iframeUrl, setIframeUrl] = useState("https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3")

  useEffect(() => {
    // On récupère le paramètre 'entry' de l'URL du navigateur (ex: Airtable)
    const entryData = searchParams.get('entry')

    if (entryData) {
      // On met à jour l'URL avec le paramètre encodé
      setIframeUrl(`https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3?entry=${encodeURIComponent(entryData)}`)
    }
  }, [searchParams])

  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-6 md:px-12 min-h-screen bg-white text-slate-900">
      
      {/* Bouton de retour */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </div>

      <div className="w-full h-[800px] border-0 rounded-lg overflow-hidden shadow-sm">
        <iframe
          src={iframeUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Formulaire de divorce"
          allow="payment"
        ></iframe>
      </div>
      
    </main>
  )
}
