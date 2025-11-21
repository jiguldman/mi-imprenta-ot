import { z } from 'zod'

export const crearOTSchema = z.object({
  clienteId: z.number().int().positive(),
  producto: z.string().min(1),
  cantidad: z.number().int().positive(),
  trabajo: z.enum([
    'BORDADO',
    'ESTAMPADO',
    'DTF',
    'LASER_FIBRA',
    'LASER_CORTE',
    'SUBLIMACION',
  ]),
  bultosRecibidos: z.number().int().optional(),
})