import { openDB } from 'idb'

const DB_NAME = 'mi_imprenta_db'
const STORE_OT = 'ots'

export const initDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_OT)) {
        db.createObjectStore(STORE_OT, { keyPath: 'id', autoIncrement: true })
      }
    }
  })

export const guardarOTOffline = async (ot: any) => {
  const db = await initDB()
  return db.add(STORE_OT, ot)
}

export const obtenerOTsOffline = async () => {
  const db = await initDB()
  return db.getAll(STORE_OT)
}