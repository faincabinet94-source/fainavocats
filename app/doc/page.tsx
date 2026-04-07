'use client' 

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'

function FormDocContent() {
  const searchParams = useSearchParams()
  // L'URL de base de votre formulaire Airtable
  const [iframeUrl, setIframeUrl] = useState("https://airtable.com/embed/appJjobIPOejhe1rx/pagtCHUdZFsUHuSvM/form")

  useEffect(() => {
    // Si vous avez des paramètres dans l'URL (ex: prefill_Nom=...), on les ajoute à l'iframe
    const queryString = searchParams.toString()
    if (queryString) {
      setIframeUrl(`https://airtable.com/embed/appJjobIPOejhe1rx/pagtCHUdZFsUHuSvM/form?${queryString}`)
    }
  }, [searchParams])

  return (
    <div className="w-full border-t border-slate-100 pt-8">
      <iframe 
        src={iframeUrl}
        className="airtable-embed"
        frameBorder="0"
        width="100%" 
        height="1200" 
        style={{ 
          background: 'transparent', 
          border: '1px solid #ccc',
          minHeight: '1200px'
        }}
        title="Dépôt de documents"
      ></iframe>
    </div>
  )
}

export default function DocPage() {
  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-6 md:px-12 min-h-screen bg-white">
      
      {/* Bouton de retour à l'accueil */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-10 text-slate-500">Chargement du formulaire Airtable...</div>}>
        <FormDocContent />
      </Suspense>

    </main>
  )
}
