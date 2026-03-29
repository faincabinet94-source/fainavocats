import Script from 'next/script'

export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Formulaire de Renseignements
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
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
