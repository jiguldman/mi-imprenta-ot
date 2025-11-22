import { useState } from 'react'
import OTList from './components/OTList'
import OTForm from './components/OTForm'
import { sincronizarOTs } from './api/sync'

function App() {
  const [newOT, setNewOT] = useState<any>()
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    await sincronizarOTs()
    setSyncing(false)
    window.location.reload()
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Mi Imprenta - Órdenes de Trabajo</h1>
      <OTForm onNewOT={setNewOT} />
      <button onClick={handleSync} disabled={syncing} style={{ marginTop: 8 }}>
        {syncing ? 'Sincronizando…' : 'Sincronizar OTs locales'}
      </button>
      <hr />
      <OTList newOT={newOT} />
    </div>
  )
}

export default App