import { obtenerOTsOffline } from '../db/indexedDB'
import { crearOT } from './otApi'
import { openDB } from 'idb'

export async function sincronizarOTs() {
  const locals = await obtenerOTsOffline()
  for (const off of locals) {
    const payload = {
      clienteId: Number(off.clienteId),
      producto: off.producto,
      cantidad: off.cantidad,
      trabajo: off.trabajo,
      bultosRecibidos: off.bultosRecibidos
    }
    await crearOT(payload)
  }
  const db = await openDB('mi_imprenta_db')
  await db.clear('ots')
}