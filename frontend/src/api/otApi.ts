import axios, { AxiosError } from 'axios'

const baseURL = 'https://mi-imprenta-ot.onrender.com'

const api = axios.create({ baseURL })

/* ----- OTs ----- */
export const listarOTs = (estado?: string) =>
  api.get('/api/ot', { params: estado ? { estado } : {} }).then(r => r.data)

export const crearOT = (data: any) =>
  api.post('/api/ot', data)
     .then(r => r.data)
     .catch((_: AxiosError) => {
       throw new Error('OFFLINE')
     })

/* ----- Clientes ----- */
export const listarClientes = () =>
  api.get('/api/clientes')
     .then(r => r.data)
     .catch(() => [])