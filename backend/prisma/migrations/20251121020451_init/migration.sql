-- CreateEnum
CREATE TYPE "Trabajo" AS ENUM ('BORDADO', 'ESTAMPADO', 'DTF', 'LASER_FIBRA', 'LASER_CORTE', 'SUBLIMACION');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('RECEPCION', 'BORDADO', 'ESTAMPADO', 'DTF', 'LASER_FIBRA', 'LASER_CORTE', 'SUBLIMACION', 'LIMPIEZA_EMPAQUE', 'DESPACHO', 'FACTURACION');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('OPERARIO', 'SUPERVISOR', 'ADMIN');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'OPERARIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OT" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "producto" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "trabajo" "Trabajo" NOT NULL,
    "bultosRecibidos" INTEGER,
    "fotoRecepcion1" TEXT,
    "fotoRecepcion2" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'RECEPCION',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntregaPrometida" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CambioOT" (
    "id" SERIAL NOT NULL,
    "otId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estado" "Estado" NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CambioOT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComentarioOT" (
    "id" SERIAL NOT NULL,
    "otId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComentarioOT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_rut_key" ON "Cliente"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "OT_numero_key" ON "OT"("numero");

-- AddForeignKey
ALTER TABLE "OT" ADD CONSTRAINT "OT_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CambioOT" ADD CONSTRAINT "CambioOT_otId_fkey" FOREIGN KEY ("otId") REFERENCES "OT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CambioOT" ADD CONSTRAINT "CambioOT_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioOT" ADD CONSTRAINT "ComentarioOT_otId_fkey" FOREIGN KEY ("otId") REFERENCES "OT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioOT" ADD CONSTRAINT "ComentarioOT_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
