export const metadata = {
  title: 'Formulaire DCM | Fain Avocats',
}

export default function FormDcmPage() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>
      
      {/* Titre avec très peu de marge en dessous */}
      <div style={{ marginBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: '0' }}>
          Formulaire de Renseignements
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
          Veuillez remplir les informations ci-dessous pour votre dossier.
        </p>
      </div>

      {/* L'Iframe forcée, sans script extérieur pour éviter les carrés blancs */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <iframe 
          src="https://www.cognitoforms.com/f/7odepi9SUkCmb7Yrf3m2Cg/3"
          style={{ 
            border: 'none', 
            width: '100%', 
            minHeight: '1200px', // On met bien grand pour tout voir d'un coup
            marginTop: '0' 
          }}
          title="Formulaire de Renseignements"
        ></iframe>
      </div>

    </main>
  )
}
