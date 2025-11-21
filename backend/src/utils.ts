import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function generarNumeroOT(): Promise<string> {
  const year = new Date().getFullYear()
  const last = await prisma.oT.findFirst({
    orderBy: { id: 'desc' },
    select: { numero: true },
  })
  let seq = 1
  if (last?.numero.startsWith(String(year))) {
    seq = parseInt(last.numero.split('-')[1], 10) + 1
  }
  return `${year}-${String(seq).padStart(4, '0')}`
}