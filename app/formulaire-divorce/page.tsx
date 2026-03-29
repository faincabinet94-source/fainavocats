'use client' 

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'

function FormContent() {
  const searchParams = useSearchParams()
  const [iframeUrl, setIframeUrl] = useState("https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3")

  useEffect(() => {
    const entryData = searchParams.get('entry')
    if (entryData) {
      setIframeUrl(`https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3?entry=${encodeURIComponent(entryData)}`)
    }
  }, [searchParams])

  return (
    <div className="w-full border-t border-slate-100 pt-8">
      <iframe 
        src={iframeUrl}
        style={{ position: 'relative', width: '100%', minWidth: '100%', border: 'none', minHeight: '1600px' }}
        frameBorder="0"
        scrolling="yes"
        title="Formulaire de Divorce"
      ></iframe>
    </div>
  )
}

export default function FormDivorcePage() {
  return (
    <main className="max-w-6xl mx-auto pt-24 pb-12 px-6 md:px-12 min-h-screen bg-white">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-10 text-slate-500">Chargement du formulaire...</div>}>
        <FormContent />
      </Suspense>
    </main>
  )
}
