export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>
          Formulaire de Renseignements
        </h1>
        <p style={{ color: '#666' }}>Veuillez remplir les informations ci-dessous.</p>
      </div>

      {/* Cette méthode Iframe est infaillible car elle crée un cadre fixe */}
      <iframe 
        src="https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3"
        style={{ border: 'none', width: '100%', minHeight: '800px' }}
        title="Formulaire de Renseignements"
      ></iframe>

    </main>
  )
}
