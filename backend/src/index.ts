import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient, Estado } from '@prisma/client'
import dotenv from 'dotenv'
import { crearOTSchema } from './schemas'
import { generarNumeroOT } from './utils'

dotenv.config()
const prisma = new PrismaClient()
const fastify = Fastify({ logger: true })

fastify.register(cors)

/* ---------- rutas ---------- */
fastify.get('/ping', async (_, reply) => ({ msg: 'pong' }))

fastify.get('/stats', async (_, reply) => {
  const total = await prisma.oT.count()
  return { totalOTs: total }
})

/* ---------- rutas TEMP para crear/listar clientes ---------- */
fastify.get('/clientes', async (_, reply) => {
    const list = await prisma.cliente.findMany()
    return list
  })
  
  fastify.post('/clientes', async (request, reply) => {
    const { nombre, rut, telefono } = request.body as any
    const cliente = await prisma.cliente.create({
      data: { nombre, rut, telefono },
    })
    return cliente
  })

/* crear OT */
fastify.post('/ot', async (request, reply) => {
  const body = crearOTSchema.parse(request.body)
  const numero = await generarNumeroOT()
  const fechaEntrega = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 días

  const ot = await prisma.oT.create({
    data: {
      numero,
      clienteId: body.clienteId,
      producto: body.producto,
      cantidad: body.cantidad,
      trabajo: body.trabajo,
      bultosRecibidos: body.bultosRecibidos,
      fechaEntregaPrometida: fechaEntrega,
    },
  })
  return ot
})

/* listar OT (filtro opcional) */
fastify.get('/ot', async (request, reply) => {
  const { estado } = request.query as { estado?: Estado }
  const where = estado ? { estado } : {}
  const list = await prisma.oT.findMany({
    where,
    include: { cliente: true },
    orderBy: { createdAt: 'desc' },
  })
  return list
})

/* arranque */
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Server ready at http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()