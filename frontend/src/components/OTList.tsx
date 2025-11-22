import { useEffect, useState } from 'react'
import { listarOTs } from '../api/otApi'
import { obtenerOTsOffline } from '../db/indexedDB'

export default function OTList({ newOT }: { newOT?: any }) {
  const [ots, setOts] = useState<any[]>([])

  useEffect(() => {
    cargar()
  }, [])

  useEffect(() => {
    if (newOT) setOts(prev => [newOT, ...prev])
  }, [newOT])

  async function cargar() {
    try {
      const onLine = navigator.onLine
      const data = onLine ? await listarOTs() : await obtenerOTsOffline()
      setOts(data)
    } catch {
      setOts([])
    }
  }

  if (!ots.length) return <p>Sin OTs</p>

  return (
    <table border={1} cellPadding={6}>
      <thead>
        <tr>
          <th>Número</th><th>Cliente</th><th>Producto</th>
          <th>Cantidad</th><th>Trabajo</th><th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {ots.map((ot: any) => (
          <tr key={ot.id}>
            <td>{ot.numero}</td>
            <td>{ot.cliente?.nombre ?? 'Local'}</td>
            <td>{ot.producto}</td>
            <td>{ot.cantidad}</td>
            <td>{ot.trabajo}</td>
            <td>{ot.estado ?? 'LOCAL'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}