import React, { useEffect, useState } from 'react'
import { listarClientes, crearOT } from '../api/otApi'
import { guardarOTOffline } from '../db/indexedDB'

const trabajoOptions = ['BORDADO','ESTAMPADO','DTF','LASER_FIBRA','LASER_CORTE','SUBLIMACION']

export default function OTForm({ onNewOT }: { onNewOT: (ot: any) => void }) {
  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState({
    clienteId: 0,
    producto: '',
    cantidad: 0,
    trabajo: 'BORDADO',
    bultosRecibidos: 0
  })

  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch(() => setClientes([]))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, cantidad: Number(form.cantidad), bultosRecibidos: Number(form.bultosRecibidos) }

    if (!navigator.onLine) {
      const offOT = { ...payload, numero: 'OFF-' + Date.now(), fechaCreacion: new Date().toISOString() }
      await guardarOTOffline(offOT)
      onNewOT(offOT)
      alert('OT guardada localmente (off-line). Se sincronizará cuando haya red.')
      setForm({ clienteId: 0, producto: '', cantidad: 0, trabajo: 'BORDADO', bultosRecibidos: 0 })
      return
    }

    try {
      const newOT = await crearOT(payload)
      onNewOT(newOT)
      alert('OT creada en línea')
      setForm({ clienteId: 0, producto: '', cantidad: 0, trabajo: 'BORDADO', bultosRecibidos: 0 })
    } catch {
      const offOT = { ...payload, numero: 'OFF-' + Date.now(), fechaCreacion: new Date().toISOString() }
      await guardarOTOffline(offOT)
      onNewOT(offOT)
      alert('OT guardada localmente (off-line). Se sincronizará cuando haya red.')
      setForm({ clienteId: 0, producto: '', cantidad: 0, trabajo: 'BORDADO', bultosRecibidos: 0 })
    }
  }

  if (!clientes.length) return <p>Cargando clientes…</p>

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <select name="clienteId" value={form.clienteId} onChange={handleChange} required>
        <option value={0}>-- Cliente --</option>
        {clientes.map((c: any) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <input name="producto" placeholder="Producto" value={form.producto} onChange={handleChange} required />

      <input name="cantidad" type="number" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required />

      <select name="trabajo" value={form.trabajo} onChange={handleChange}>
        {trabajoOptions.map(t => <option key={t}>{t}</option>)}
      </select>

      <input name="bultosRecibidos" type="number" placeholder="Bultos recibidos" value={form.bultosRecibidos} onChange={handleChange} />

      <button type="submit">Crear OT</button>
    </form>
  )
}